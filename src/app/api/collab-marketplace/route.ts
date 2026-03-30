import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockProfiles = [
  { id: "cp-1", name: "Jordan Hayes", role: "Producer", skills: ["Beat Making", "Mixing", "Mastering"], genres: ["Hip-Hop", "R&B", "Pop"], rate: 150, rating: 4.9, reviews: 47, availability: "Available", avatar: null, bio: "Grammy-nominated producer with 10+ years of experience.", portfolio: ["https://soundcloud.com/jordanhayes"] },
  { id: "cp-2", name: "Mia Chen", role: "Vocalist", skills: ["Lead Vocals", "Harmonies", "Songwriting"], genres: ["Pop", "Indie", "Electronic"], rate: 100, rating: 4.8, reviews: 32, availability: "Available", avatar: null, bio: "Versatile vocalist featured on Spotify Editorial playlists.", portfolio: [] },
  { id: "cp-3", name: "Dex Williams", role: "Mixing Engineer", skills: ["Mixing", "Mastering", "Sound Design"], genres: ["All Genres"], rate: 200, rating: 5.0, reviews: 89, availability: "Busy", avatar: null, bio: "Mixing engineer for major label and indie artists.", portfolio: [] },
  { id: "cp-4", name: "Luna Park", role: "Guitarist", skills: ["Electric Guitar", "Acoustic Guitar", "Session Work"], genres: ["Rock", "Indie", "Folk"], rate: 80, rating: 4.7, reviews: 23, availability: "Available", avatar: null, bio: "Session guitarist with touring experience across 20+ countries.", portfolio: [] },
  { id: "cp-5", name: "Rico Fernandez", role: "Videographer", skills: ["Music Videos", "Live Recording", "Editing"], genres: ["All Genres"], rate: 250, rating: 4.6, reviews: 15, availability: "Available", avatar: null, bio: "Director and videographer specializing in music content.", portfolio: [] },
  { id: "cp-6", name: "Ava Sterling", role: "Songwriter", skills: ["Toplining", "Lyrics", "Melody"], genres: ["Pop", "Country", "R&B"], rate: 120, rating: 4.9, reviews: 56, availability: "Limited", avatar: null, bio: "Published songwriter with cuts on Billboard Hot 100.", portfolio: [] },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const genre = searchParams.get("genre");

    let profiles = [...mockProfiles];
    if (role) profiles = profiles.filter((p) => p.role.toLowerCase() === role.toLowerCase());
    if (genre) profiles = profiles.filter((p) => p.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase())));

    return NextResponse.json({ profiles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch profiles";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const newProfile = {
      id: `cp-${Date.now()}`,
      name: body.name || user.name,
      role: body.role,
      skills: body.skills || [],
      genres: body.genres || [],
      rate: body.rate || 0,
      rating: 0,
      reviews: 0,
      availability: body.availability || "Available",
      avatar: null,
      bio: body.bio || "",
      portfolio: body.portfolio || [],
    };

    return NextResponse.json({ profile: newProfile }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
