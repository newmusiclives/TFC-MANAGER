// ---------------------------------------------------------------------------
// Banner Generation Service
// ---------------------------------------------------------------------------

export interface BannerConfig {
  template: string;
  title: string;
  subtitle?: string;
  platform: string;
  colorScheme: string;
  artistName: string;
}

export function getBannerDimensions(
  platform: string
): { width: number; height: number } {
  const dims: Record<string, { width: number; height: number }> = {
    instagram_post: { width: 1080, height: 1080 },
    instagram_story: { width: 1080, height: 1920 },
    tiktok: { width: 1080, height: 1920 },
    youtube_thumbnail: { width: 1280, height: 720 },
    twitter_header: { width: 1500, height: 500 },
    spotify_canvas: { width: 720, height: 1280 },
    facebook_cover: { width: 820, height: 312 },
    // Aliases using dashes (matching the page component IDs)
    "instagram-post": { width: 1080, height: 1080 },
    "instagram-story": { width: 1080, height: 1920 },
    "youtube-thumb": { width: 1280, height: 720 },
    "twitter-header": { width: 1500, height: 500 },
    "spotify-canvas": { width: 720, height: 1280 },
    "facebook-cover": { width: 820, height: 312 },
  };
  return dims[platform] || { width: 1080, height: 1080 };
}

const COLOR_SCHEMES: Record<string, { bg: string; text: string; accent: string }> = {
  "Neon Glow": {
    bg: "linear-gradient(135deg, #9333ea, #ec4899)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.15)",
  },
  "Dark Minimal": {
    bg: "linear-gradient(135deg, #111827, #1f2937)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.08)",
  },
  "Sunset Vibes": {
    bg: "linear-gradient(135deg, #f97316, #dc2626)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.12)",
  },
  "Ocean Wave": {
    bg: "linear-gradient(135deg, #06b6d4, #2563eb)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.12)",
  },
  "Forest Green": {
    bg: "linear-gradient(135deg, #16a34a, #059669)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.10)",
  },
  "Golden Hour": {
    bg: "linear-gradient(135deg, #fbbf24, #f97316)",
    text: "#ffffff",
    accent: "rgba(255,255,255,0.15)",
  },
};

export function generateBannerHTML(config: BannerConfig): string {
  const dims = getBannerDimensions(config.platform);
  const scheme = COLOR_SCHEMES[config.colorScheme] || COLOR_SCHEMES["Neon Glow"];

  const titleFontSize = Math.max(24, Math.round(dims.width * 0.05));
  const subtitleFontSize = Math.max(14, Math.round(dims.width * 0.025));
  const artistFontSize = Math.max(12, Math.round(dims.width * 0.02));

  return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${dims.width}px;
    height: ${dims.height}px;
    background: ${scheme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
    position: relative;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.2);
  }
  .content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px;
  }
  .icon-box {
    width: 80px;
    height: 80px;
    background: ${scheme.accent};
    backdrop-filter: blur(8px);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
  }
  .icon-box svg {
    width: 40px;
    height: 40px;
    fill: none;
    stroke: rgba(255,255,255,0.8);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .title {
    font-size: ${titleFontSize}px;
    font-weight: 800;
    color: ${scheme.text};
    margin-bottom: 8px;
    letter-spacing: -0.02em;
  }
  .subtitle {
    font-size: ${subtitleFontSize}px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 20px;
  }
  .artist {
    font-size: ${artistFontSize}px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
</style>
</head>
<body>
  <div class="overlay"></div>
  <div class="content">
    <div class="icon-box">
      <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    </div>
    <div class="title">${escapeHTML(config.title)}</div>
    ${config.subtitle ? `<div class="subtitle">${escapeHTML(config.subtitle)}</div>` : ""}
    <div class="artist">${escapeHTML(config.artistName)}</div>
  </div>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
