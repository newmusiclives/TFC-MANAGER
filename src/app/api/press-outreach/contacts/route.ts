import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockContacts = [
  { id: "mc-1", name: "Emma Sweeney", outlet: "Pitchfork", role: "Senior Writer", genres: ["Indie", "Alternative", "Electronic"], email: "emma.s@pitchfork.com", twitter: "@emmasweeney", followers: 45000, lastPitched: "2026-02-15" },
  { id: "mc-2", name: "Marcus Hall", outlet: "NME", role: "Music Editor", genres: ["Rock", "Indie", "Pop"], email: "marcus.h@nme.com", twitter: "@marcushall", followers: 32000, lastPitched: "2026-03-01" },
  { id: "mc-3", name: "Kira Yamamoto", outlet: "The FADER", role: "Staff Writer", genres: ["Hip-Hop", "R&B", "Pop"], email: "kira.y@thefader.com", twitter: "@kirayamamoto", followers: 28000, lastPitched: "2026-03-10" },
  { id: "mc-4", name: "Tom Breihan", outlet: "Stereogum", role: "Senior Editor", genres: ["Indie", "Rock", "Electronic"], email: "tom.b@stereogum.com", twitter: "@tombreihan", followers: 67000, lastPitched: "2026-03-20" },
  { id: "mc-5", name: "Sarah Chen", outlet: "DIY Magazine", role: "Features Editor", genres: ["Indie", "Folk", "Alternative"], email: "sarah.c@diymagazine.com", twitter: "@sarahchendiy", followers: 15000, lastPitched: null },
  { id: "mc-6", name: "Devon Blake", outlet: "Consequence of Sound", role: "Music Writer", genres: ["Rock", "Metal", "Punk"], email: "devon.b@cos.com", twitter: "@devonblake", followers: 22000, lastPitched: null },
  { id: "mc-7", name: "Nina Patel", outlet: "Complex", role: "Music Editor", genres: ["Hip-Hop", "R&B", "Pop"], email: "nina.p@complex.com", twitter: "@ninapatel", followers: 54000, lastPitched: null },
  { id: "mc-8", name: "Jake Morrison", outlet: "Indie Shuffle (Blog)", role: "Founder", genres: ["Indie", "Electronic", "Folk"], email: "jake@indieshuffle.com", twitter: "@indieshuffle", followers: 89000, lastPitched: null },
  { id: "mc-9", name: "Priya Sharma", outlet: "Song Exploder (Podcast)", role: "Host/Producer", genres: ["All Genres"], email: "priya@songexploder.net", twitter: "@songexploder", followers: 120000, lastPitched: null },
  { id: "mc-10", name: "Chris Deville", outlet: "Stereogum", role: "Staff Writer", genres: ["Indie", "Pop", "Country"], email: "chris.d@stereogum.com", twitter: "@chrisdeville", followers: 18000, lastPitched: null },
  { id: "mc-11", name: "Alphonse Pierre", outlet: "Pitchfork", role: "Staff Writer", genres: ["Hip-Hop", "R&B", "Pop"], email: "alphonse.p@pitchfork.com", twitter: "@alphonsepierre", followers: 38000, lastPitched: null },
  { id: "mc-12", name: "Jordan Bassett", outlet: "NME", role: "Features Writer", genres: ["Rock", "Indie", "Electronic"], email: "jordan.b@nme.com", twitter: "@jordanbassett", followers: 21000, lastPitched: null },
  { id: "mc-13", name: "Rawiya Kameir", outlet: "The FADER", role: "Senior Editor", genres: ["Hip-Hop", "Afrobeats", "R&B"], email: "rawiya.k@thefader.com", twitter: "@rawiyakameir", followers: 35000, lastPitched: null },
  { id: "mc-14", name: "Jessica McKinney", outlet: "Complex", role: "Music Writer", genres: ["Hip-Hop", "Pop", "Latin"], email: "jessica.m@complex.com", twitter: "@jessmckinney", followers: 19000, lastPitched: null },
  { id: "mc-15", name: "Rob Sheffield", outlet: "Rolling Stone", role: "Senior Writer", genres: ["Rock", "Pop", "Country"], email: "rob.s@rollingstone.com", twitter: "@robsheff", followers: 145000, lastPitched: null },
  { id: "mc-16", name: "Brittany Spanos", outlet: "Rolling Stone", role: "Staff Writer", genres: ["Pop", "R&B", "Latin"], email: "brittany.s@rollingstone.com", twitter: "@britspanos", followers: 52000, lastPitched: null },
  { id: "mc-17", name: "James Rettig", outlet: "Stereogum", role: "News Editor", genres: ["Indie", "Alternative", "Electronic"], email: "james.r@stereogum.com", twitter: "@jamesrettig", followers: 16000, lastPitched: null },
  { id: "mc-18", name: "Mary Siroky", outlet: "Consequence of Sound", role: "Senior Writer", genres: ["Indie", "Rock", "Folk"], email: "mary.s@cos.com", twitter: "@marysiroky", followers: 12000, lastPitched: null },
  { id: "mc-19", name: "Tara Joshi", outlet: "The FADER", role: "Contributing Writer", genres: ["Electronic", "Pop", "Experimental"], email: "tara.j@thefader.com", twitter: "@tarajoshi", followers: 14000, lastPitched: null },
  { id: "mc-20", name: "Jeff Ihaza", outlet: "Rolling Stone", role: "Music Writer", genres: ["Hip-Hop", "R&B", "Jazz"], email: "jeff.i@rollingstone.com", twitter: "@jeffihaza", followers: 25000, lastPitched: null },
  { id: "mc-21", name: "Alex Robert Ross", outlet: "Hypebeast", role: "Music Editor", genres: ["Hip-Hop", "Electronic", "Streetwear Culture"], email: "alex.r@hypebeast.com", twitter: "@alexrobertross", followers: 31000, lastPitched: null },
  { id: "mc-22", name: "Robin Murray", outlet: "CLASH", role: "Editor", genres: ["Indie", "Electronic", "Pop"], email: "robin.m@clashmusic.com", twitter: "@robinmurray", followers: 22000, lastPitched: null },
  { id: "mc-23", name: "Ella Kemp", outlet: "DIY Magazine", role: "Staff Writer", genres: ["Indie", "Pop", "Alternative"], email: "ella.k@diymagazine.com", twitter: "@ellakemp", followers: 9000, lastPitched: null },
  { id: "mc-24", name: "David Zammitt", outlet: "Line of Best Fit", role: "Senior Editor", genres: ["Indie", "Folk", "Electronic"], email: "david.z@thelineofbestfit.com", twitter: "@davidzammitt", followers: 17000, lastPitched: null },
  { id: "mc-25", name: "Georgie Wright", outlet: "Dazed", role: "Music Writer", genres: ["Electronic", "Experimental", "Pop"], email: "georgie.w@dazeddigital.com", twitter: "@georgiewright", followers: 26000, lastPitched: null },
  { id: "mc-26", name: "Megan Buerger", outlet: "i-D", role: "Music Contributor", genres: ["Pop", "R&B", "Fashion/Music"], email: "megan.b@i-d.vice.com", twitter: "@meganbuerger", followers: 15000, lastPitched: null },
  { id: "mc-27", name: "Alex Sherwin", outlet: "Dummy", role: "Editor-in-Chief", genres: ["Electronic", "Club", "Experimental"], email: "alex.s@dummymag.com", twitter: "@alexsherwin", followers: 11000, lastPitched: null },
  { id: "mc-28", name: "John Doran", outlet: "The Quietus", role: "Co-Founder/Editor", genres: ["Experimental", "Noise", "Post-Punk", "Metal"], email: "john.d@thequietus.com", twitter: "@johndoran_", followers: 42000, lastPitched: null },
  { id: "mc-29", name: "Hrishikesh Hirway", outlet: "Song Exploder (Podcast)", role: "Creator/Host", genres: ["All Genres"], email: "hrishi@songexploder.net", twitter: "@hlogjam", followers: 95000, lastPitched: null },
  { id: "mc-30", name: "Rick Rubin", outlet: "Broken Record (Podcast)", role: "Co-Host", genres: ["All Genres"], email: "submissions@brokenrecordpodcast.com", twitter: "@braborecord", followers: 280000, lastPitched: null },
  { id: "mc-31", name: "Cole Cuchna", outlet: "Dissect (Podcast)", role: "Creator/Host", genres: ["Hip-Hop", "R&B", "Pop"], email: "cole@dissectpodcast.com", twitter: "@dissectpodcast", followers: 78000, lastPitched: null },
  { id: "mc-32", name: "Nate Sloan", outlet: "Switched On Pop (Podcast)", role: "Co-Host", genres: ["Pop", "R&B", "Analysis"], email: "nate@switchedonpop.com", twitter: "@switchedonpop", followers: 56000, lastPitched: null },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const genre = searchParams.get("genre")?.toLowerCase();

    let contacts = [...mockContacts];
    if (search) {
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.outlet.toLowerCase().includes(search) ||
          c.role.toLowerCase().includes(search)
      );
    }
    if (genre) {
      contacts = contacts.filter((c) => c.genres.some((g) => g.toLowerCase().includes(genre)));
    }

    return NextResponse.json({ contacts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch contacts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
