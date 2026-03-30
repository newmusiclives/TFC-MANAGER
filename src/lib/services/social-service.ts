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
// Optimal Post Times
// ---------------------------------------------------------------------------

export function getOptimalPostTime(
  platform: string,
  timezone: string = "America/New_York"
): { start: string; end: string; day: string; note: string } {
  const times: Record<
    string,
    { start: string; end: string; day: string; note: string }
  > = {
    instagram: {
      start: "11:00 AM",
      end: "1:00 PM",
      day: "Tuesday-Thursday",
      note: "Lunchtime posts see 2-3x higher engagement. Reels perform best at 9 AM and 12 PM.",
    },
    tiktok: {
      start: "7:00 PM",
      end: "9:00 PM",
      day: "Tuesday, Thursday, Friday",
      note: "Evening posts catch peak scroll time. Trending sounds perform best posted 6-10 PM.",
    },
    twitter: {
      start: "9:00 AM",
      end: "12:00 PM",
      day: "Monday-Wednesday",
      note: "Morning tweets get more retweets. Threads perform best mid-morning on weekdays.",
    },
    facebook: {
      start: "1:00 PM",
      end: "4:00 PM",
      day: "Wednesday-Friday",
      note: "Early afternoon sees peak Facebook activity. Video posts get 6x more engagement.",
    },
    youtube: {
      start: "2:00 PM",
      end: "4:00 PM",
      day: "Thursday-Saturday",
      note: "Upload 2-3 hours before peak viewing. Weekend mornings also work well for music content.",
    },
  };

  const result = times[platform.toLowerCase()] || {
    start: "10:00 AM",
    end: "2:00 PM",
    day: "Weekdays",
    note: "General best practice for social media posting.",
  };

  return { ...result, note: `${result.note} (${timezone})` };
}

// ---------------------------------------------------------------------------
// Hashtag Generation
// ---------------------------------------------------------------------------

export function generateHashtags(
  genre: string,
  mood: string
): string[] {
  const genreHashtags: Record<string, string[]> = {
    pop: ["#pop", "#popmusic", "#newpop", "#popsong", "#popartist", "#electropop", "#indipop"],
    "indie": ["#indie", "#indiemusic", "#indieartist", "#indierock", "#indiepop", "#indiefolk", "#independentmusic"],
    "hip-hop": ["#hiphop", "#hiphopmusic", "#rap", "#rapper", "#bars", "#trap", "#undergroundhiphop"],
    "r&b": ["#rnb", "#rnbmusic", "#rnbsinger", "#rnbsoul", "#newrnb", "#contemporaryrnb"],
    electronic: ["#electronic", "#electronicmusic", "#edm", "#synth", "#techno", "#house", "#producer"],
    rock: ["#rock", "#rockmusic", "#newrock", "#alternativerock", "#indierock", "#rockband"],
    folk: ["#folk", "#folkmusic", "#acoustic", "#folkartist", "#singersongwriter", "#americana"],
    jazz: ["#jazz", "#jazzmusic", "#smoothjazz", "#jazzartist", "#nujazz", "#contemporaryjazz"],
    country: ["#country", "#countrymusic", "#newcountry", "#countryartist", "#americana", "#countrysinger"],
    latin: ["#latin", "#latinmusic", "#reggaeton", "#latinpop", "#musicalatina", "#urbano"],
    metal: ["#metal", "#metalmusic", "#heavymetal", "#metalcore", "#metalband", "#metalhead"],
    classical: ["#classical", "#classicalmusic", "#orchestra", "#composer", "#neoclassical", "#piano"],
  };

  const moodHashtags: Record<string, string[]> = {
    happy: ["#goodvibes", "#feelgood", "#upbeat", "#positive", "#sunshine"],
    sad: ["#emotional", "#melancholy", "#sadmusic", "#feels", "#heartbreak"],
    energetic: ["#energy", "#hype", "#bangers", "#turnedup", "#workout"],
    chill: ["#chill", "#chillvibes", "#lofi", "#relaxing", "#mellow"],
    dark: ["#dark", "#moody", "#atmospheric", "#cinematic", "#intense"],
    romantic: ["#love", "#lovesong", "#romantic", "#romance", "#soulmate"],
    nostalgic: ["#nostalgic", "#throwback", "#vibes", "#memories", "#bittersweet"],
  };

  const baseHashtags = ["#newmusic", "#music", "#artist", "#songwriter", "#nowplaying", "#musicislife"];
  const genreTags = genreHashtags[genre.toLowerCase()] || ["#music", "#newrelease"];
  const moodTags = moodHashtags[mood.toLowerCase()] || ["#vibes"];

  return [...new Set([...baseHashtags, ...genreTags, ...moodTags])];
}

// ---------------------------------------------------------------------------
// Engagement Benchmarks
// ---------------------------------------------------------------------------

export function getEngagementBenchmarks(
  platform: string
): {
  avgEngagementRate: number;
  avgLikes: number;
  avgComments: number;
  avgShares: number;
  avgViews: number;
  note: string;
} {
  const benchmarks: Record<
    string,
    {
      avgEngagementRate: number;
      avgLikes: number;
      avgComments: number;
      avgShares: number;
      avgViews: number;
      note: string;
    }
  > = {
    instagram: {
      avgEngagementRate: 3.5,
      avgLikes: 150,
      avgComments: 12,
      avgShares: 8,
      avgViews: 2000,
      note: "Music accounts avg 3-5% engagement. Reels get 2x the reach of static posts.",
    },
    tiktok: {
      avgEngagementRate: 5.7,
      avgLikes: 320,
      avgComments: 25,
      avgShares: 40,
      avgViews: 8000,
      note: "TikTok has the highest organic reach. Videos under 30s perform best for music.",
    },
    twitter: {
      avgEngagementRate: 1.8,
      avgLikes: 45,
      avgComments: 8,
      avgShares: 15,
      avgViews: 1200,
      note: "Thread posts outperform single tweets by 3x. Use audio snippets for engagement.",
    },
    facebook: {
      avgEngagementRate: 2.1,
      avgLikes: 80,
      avgComments: 10,
      avgShares: 12,
      avgViews: 1500,
      note: "Video content dominates Facebook. Live performances get highest engagement.",
    },
    youtube: {
      avgEngagementRate: 4.2,
      avgLikes: 200,
      avgComments: 30,
      avgShares: 20,
      avgViews: 5000,
      note: "Shorts are growing fast. Music videos avg 4-6% engagement for indie artists.",
    },
  };

  return (
    benchmarks[platform.toLowerCase()] || {
      avgEngagementRate: 3.0,
      avgLikes: 100,
      avgComments: 15,
      avgShares: 10,
      avgViews: 2000,
      note: "Average benchmarks across all platforms.",
    }
  );
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
