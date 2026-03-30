import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const personaTemplates = [
  { name: "Festival Fanatic", ageRange: "20-30", gender: "Non-binary", interests: ["Music festivals", "Travel", "Sustainability", "Street food"], platforms: ["Instagram", "Spotify", "Bandcamp"], listeningHabits: "Plans life around festival season. Discovers artists through lineups. Values live performance over studio recordings.", location: "Midwest US / UK", spending: "Very High — festival tickets, travel, limited edition merch" },
  { name: "Bedroom Producer", ageRange: "18-26", gender: "Male", interests: ["Music production", "Analog synths", "YouTube tutorials", "Anime"], platforms: ["YouTube", "SoundCloud", "Discord", "Spotify"], listeningHabits: "Listens analytically — studies production techniques. Active in music Discord communities. Engages deeply with process content.", location: "Global — online-first community", spending: "Low on merch, high on music tools and samples" },
  { name: "Casual Listener Lisa", ageRange: "28-40", gender: "Female", interests: ["Cooking", "Yoga", "Book clubs", "Weekend brunches"], platforms: ["Apple Music", "Instagram", "Pinterest"], listeningHabits: "Listens to curated playlists during routines. Rarely seeks new artists actively but loyal when she finds one she likes.", location: "Suburban US", spending: "Medium — will buy concert tickets for artists she loves" },
  { name: "Vinyl Collector Dan", ageRange: "30-45", gender: "Male", interests: ["Record collecting", "Audio equipment", "Music history", "Craft whiskey"], platforms: ["Bandcamp", "Instagram", "Reddit", "Discogs"], listeningHabits: "Values physical media and album artwork. Discovers through record store recommendations and music blogs. Full album listener.", location: "Urban centers — NYC, London, Tokyo", spending: "Very High — vinyl, box sets, special editions" },
];

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pick a random persona template
    const template = personaTemplates[Math.floor(Math.random() * personaTemplates.length)];
    const persona = {
      id: `ap-${Date.now()}`,
      ...template,
    };

    return NextResponse.json({ persona }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate persona";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
