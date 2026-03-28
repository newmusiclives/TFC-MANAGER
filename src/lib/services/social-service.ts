import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Platform Posting Functions
// ---------------------------------------------------------------------------

export async function postToInstagram(
  accessToken: string,
  content: string,
  mediaUrl?: string
) {
  if (!accessToken) {
    return { success: true, mock: true, postId: `mock_ig_${Date.now()}` };
  }

  try {
    // Step 1: Create media container
    const containerRes = await fetch(
      "https://graph.facebook.com/v19.0/me/media",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: content,
          image_url: mediaUrl,
          access_token: accessToken,
        }),
      }
    );

    const container = await containerRes.json();
    if (!container.id) {
      throw new Error(container.error?.message || "Failed to create container");
    }

    // Step 2: Publish the container
    const publishRes = await fetch(
      "https://graph.facebook.com/v19.0/me/media_publish",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: accessToken,
        }),
      }
    );

    const published = await publishRes.json();
    return { success: true, postId: published.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Instagram posting failed";
    return { success: false, error: message };
  }
}

export async function postToTikTok(
  accessToken: string,
  content: string,
  videoUrl?: string
) {
  if (!accessToken) {
    return { success: true, mock: true, postId: `mock_tt_${Date.now()}` };
  }

  try {
    // Initialize video upload
    const initRes = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_info: {
            title: content.slice(0, 150),
            privacy_level: "PUBLIC_TO_EVERYONE",
          },
          source_info: {
            source: "PULL_FROM_URL",
            video_url: videoUrl,
          },
        }),
      }
    );

    const initData = await initRes.json();
    if (initData.error?.code) {
      throw new Error(initData.error.message || "TikTok upload failed");
    }

    return { success: true, postId: initData.data?.publish_id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "TikTok posting failed";
    return { success: false, error: message };
  }
}

export async function postToTwitter(
  accessToken: string,
  content: string,
  mediaUrl?: string
) {
  if (!accessToken) {
    return { success: true, mock: true, postId: `mock_tw_${Date.now()}` };
  }

  try {
    let mediaId: string | undefined;

    // Upload media if provided
    if (mediaUrl) {
      const mediaRes = await fetch(
        "https://upload.twitter.com/1.1/media/upload.json",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ media_data: mediaUrl }),
        }
      );
      const mediaData = await mediaRes.json();
      mediaId = mediaData.media_id_string;
    }

    // Create tweet
    const tweetRes = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: content,
        ...(mediaId && { media: { media_ids: [mediaId] } }),
      }),
    });

    const tweet = await tweetRes.json();
    if (tweet.errors) {
      throw new Error(tweet.errors[0]?.message || "Twitter posting failed");
    }

    return { success: true, postId: tweet.data?.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Twitter posting failed";
    return { success: false, error: message };
  }
}

export async function postToFacebook(
  accessToken: string,
  content: string,
  mediaUrl?: string
) {
  if (!accessToken) {
    return { success: true, mock: true, postId: `mock_fb_${Date.now()}` };
  }

  try {
    const endpoint = mediaUrl
      ? "https://graph.facebook.com/v19.0/me/photos"
      : "https://graph.facebook.com/v19.0/me/feed";

    const body = mediaUrl
      ? { url: mediaUrl, caption: content, access_token: accessToken }
      : { message: content, access_token: accessToken };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message || "Facebook posting failed");
    }

    return { success: true, postId: data.id || data.post_id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Facebook posting failed";
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Scheduling
// ---------------------------------------------------------------------------

interface SchedulePostInput {
  platforms: string[];
  content: string;
  mediaUrl?: string;
  scheduledAt: string;
}

export async function schedulePost(userId: string, post: SchedulePostInput) {
  const scheduledPost = await prisma.scheduledPost.create({
    data: {
      userId,
      platforms: post.platforms,
      content: post.content,
      mediaUrl: post.mediaUrl || null,
      scheduledAt: new Date(post.scheduledAt),
      status: "SCHEDULED",
    },
  });

  return scheduledPost;
}

// ---------------------------------------------------------------------------
// Process Scheduled Posts (cron / background job)
// ---------------------------------------------------------------------------

const platformPosters: Record<
  string,
  (token: string, content: string, media?: string) => Promise<{ success: boolean; postId?: string; error?: string; mock?: boolean }>
> = {
  instagram: postToInstagram,
  tiktok: postToTikTok,
  twitter: postToTwitter,
  facebook: postToFacebook,
};

export async function processScheduledPosts() {
  const now = new Date();

  const duePosts = await prisma.scheduledPost.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: now },
    },
    include: {
      user: {
        include: {
          connectedAccounts: true,
        },
      },
    },
  });

  const results: Array<{ postId: string; status: string; errors: string[] }> =
    [];

  for (const post of duePosts) {
    // Mark as posting
    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: { status: "POSTING" },
    });

    const platforms = post.platforms as string[];
    const externalIds: Record<string, string> = {};
    const errors: string[] = [];

    for (const platform of platforms) {
      const account = post.user.connectedAccounts.find(
        (a) => a.platform === platform
      );
      const token = account?.accessToken || "";
      const poster = platformPosters[platform];

      if (!poster) {
        errors.push(`Unknown platform: ${platform}`);
        continue;
      }

      const result = await poster(token, post.content, post.mediaUrl || undefined);

      if (result.success && result.postId) {
        externalIds[platform] = result.postId;
      } else if (!result.success) {
        errors.push(`${platform}: ${result.error}`);
      }
    }

    const allFailed = errors.length === platforms.length;

    await prisma.scheduledPost.update({
      where: { id: post.id },
      data: {
        status: allFailed ? "FAILED" : "POSTED",
        postedAt: allFailed ? null : now,
        externalIds: Object.keys(externalIds).length > 0 ? externalIds : undefined,
      },
    });

    results.push({
      postId: post.id,
      status: allFailed ? "FAILED" : "POSTED",
      errors,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getPostAnalytics(
  platform: string,
  postId: string,
  accessToken: string
) {
  if (!accessToken) {
    return {
      mock: true,
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 30),
      views: Math.floor(Math.random() * 5000),
    };
  }

  try {
    switch (platform) {
      case "instagram": {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${postId}/insights?metric=impressions,reach,likes,comments&access_token=${accessToken}`
        );
        const data = await res.json();
        return { success: true, data: data.data };
      }
      case "facebook": {
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${postId}?fields=likes.summary(true),comments.summary(true),shares&access_token=${accessToken}`
        );
        const data = await res.json();
        return {
          success: true,
          likes: data.likes?.summary?.total_count || 0,
          comments: data.comments?.summary?.total_count || 0,
          shares: data.shares?.count || 0,
        };
      }
      case "twitter": {
        const res = await fetch(
          `https://api.twitter.com/2/tweets/${postId}?tweet.fields=public_metrics`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json();
        return { success: true, ...data.data?.public_metrics };
      }
      case "tiktok": {
        const res = await fetch(
          `https://open.tiktokapis.com/v2/video/query/?fields=like_count,comment_count,share_count,view_count`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filters: { video_ids: [postId] },
            }),
          }
        );
        const data = await res.json();
        const video = data.data?.videos?.[0];
        return {
          success: true,
          likes: video?.like_count || 0,
          comments: video?.comment_count || 0,
          shares: video?.share_count || 0,
          views: video?.view_count || 0,
        };
      }
      default:
        return { success: false, error: `Unsupported platform: ${platform}` };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch analytics";
    return { success: false, error: message };
  }
}
