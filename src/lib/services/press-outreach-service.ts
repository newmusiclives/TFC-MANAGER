// Press Outreach Service — generates press kits and pitch emails
// Uses Claude AI when ANTHROPIC_API_KEY is available, falls back to templates

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ArtistData {
  name: string;
  artistName?: string;
  bio?: string;
  genre?: string;
  monthlyListeners?: number;
  totalStreams?: number;
  achievements?: string[];
  socialFollowers?: Record<string, number>;
  upcomingReleases?: string[];
  quotes?: string[];
}

export interface PressKit {
  bio: string;
  oneSheet: string;
  stats: { label: string; value: string }[];
  achievements: string[];
  quotes: string[];
  photoDescriptions: string[];
}

export interface PitchEmail {
  subject: string;
  body: string;
}

// ---------------------------------------------------------------------------
// Generate Press Kit
// ---------------------------------------------------------------------------

export async function generatePressKit(artist: ArtistData): Promise<PressKit> {
  if (ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [
            {
              role: "user",
              content: `Generate a professional press kit for the following artist. Return JSON with keys: bio (150 words), oneSheet (50 word elevator pitch), stats (array of {label, value}), achievements (array of strings), quotes (array of press quotes), photoDescriptions (array of suggested promo photo descriptions).

Artist: ${artist.artistName || artist.name}
Genre: ${artist.genre || "Indie"}
Monthly Listeners: ${artist.monthlyListeners || 50000}
Total Streams: ${artist.totalStreams || 2000000}
Achievements: ${(artist.achievements || []).join(", ") || "Spotify Editorial Playlist, Opening act for major festival"}

Return ONLY valid JSON.`,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || "";
        const json = JSON.parse(text);
        return json as PressKit;
      }
    } catch {
      // Fall through to mock
    }
  }

  // Mock fallback
  const name = artist.artistName || artist.name || "Artist";
  return {
    bio: `${name} is a rising ${artist.genre || "indie"} artist whose sound blends atmospheric production with deeply personal songwriting. With over ${(artist.monthlyListeners || 50000).toLocaleString()} monthly listeners on Spotify, ${name} has quickly built a devoted following through a combination of captivating live shows and critically acclaimed releases. Their latest work explores themes of connection, nostalgia, and self-discovery, earning praise from major publications and playlist curators alike. Based on the DIY ethos of building direct fan relationships, ${name} represents a new generation of independent artists who are redefining what success looks like in the modern music industry.`,
    oneSheet: `${name} blends ${artist.genre || "indie"} songwriting with atmospheric production, crafting music that resonates with a growing global audience of dedicated fans.`,
    stats: [
      { label: "Monthly Listeners", value: (artist.monthlyListeners || 50000).toLocaleString() },
      { label: "Total Streams", value: (artist.totalStreams || 2000000).toLocaleString() },
      { label: "Social Following", value: "85K+" },
      { label: "Shows Played", value: "120+" },
      { label: "Countries Reached", value: "45" },
    ],
    achievements: artist.achievements || [
      "Featured on Spotify's 'Indie Rising' Editorial Playlist",
      "Pitchfork Best New Track",
      "Opening act at Primavera Sound 2025",
      "Sold out 12-date headline tour",
      "#1 on Hype Machine for 2 weeks",
    ],
    quotes: artist.quotes || [
      `"One of the most exciting new voices in ${artist.genre || "indie"} music." — Pitchfork`,
      `"${name} crafts songs that feel both intimate and expansive." — NME`,
      `"A must-watch artist for 2026." — The FADER`,
    ],
    photoDescriptions: [
      "Live performance shot — stage lighting, crowd visible",
      "Studio portrait — moody lighting, artistic composition",
      "Outdoor lifestyle shot — natural setting, golden hour",
      "Behind-the-scenes — recording studio candid",
    ],
  };
}

// ---------------------------------------------------------------------------
// Generate Pitch Email
// ---------------------------------------------------------------------------

export async function generatePitchEmail(
  artist: ArtistData,
  journalist: { name: string; outlet: string; genres: string[] },
  topic: string
): Promise<PitchEmail> {
  if (ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [
            {
              role: "user",
              content: `Write a professional but warm press pitch email. Return JSON with keys: subject, body.

Artist: ${artist.artistName || artist.name}
Genre: ${artist.genre || "Indie"}
Journalist: ${journalist.name} at ${journalist.outlet}
Topic: ${topic}
Monthly Listeners: ${artist.monthlyListeners || 50000}

Keep it concise (under 200 words for body). Return ONLY valid JSON.`,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.content?.[0]?.text || "";
        const json = JSON.parse(text);
        return json as PitchEmail;
      }
    } catch {
      // Fall through to mock
    }
  }

  const name = artist.artistName || artist.name || "Artist";
  return {
    subject: `${topic} — ${name}`,
    body: `Hi ${journalist.name},

I hope this finds you well! I'm reaching out about ${name}, a ${artist.genre || "indie"} artist with ${(artist.monthlyListeners || 50000).toLocaleString()} monthly Spotify listeners who I think would be a great fit for ${journalist.outlet}.

${topic}

${name} has been building momentum with critical praise from Pitchfork and NME, recent editorial playlist placements, and a sold-out headline tour. Their sound blends atmospheric production with deeply personal songwriting that resonates with a growing global audience.

I'd love to send over more details, music, or arrange an interview. Happy to work with whatever format suits you best.

Thank you for your time!

Best,
${name} Team`,
  };
}
