import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const IS_MOCK = !ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.includes("your-key-here");

const client = IS_MOCK
  ? (null as unknown as Anthropic)
  : new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PitchStatus = "draft" | "sent" | "opened" | "accepted" | "declined" | "no_response";

export type Curator = {
  id: string;
  name: string;
  email: string;
  playlistName: string;
  platform: "spotify" | "apple_music" | "youtube_music" | "tidal" | "deezer";
  genres: string[];
  followerCount: number;
  acceptanceRate: number;
  avgResponseDays: number;
  lastActive: string;
  bio: string;
};

export type PlaylistPitch = {
  id: string;
  userId: string;
  curatorId: string;
  curatorName: string;
  playlistName: string;
  trackTitle: string;
  genre: string;
  message: string;
  status: PitchStatus;
  sentAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AutoMatch = {
  curator: Curator;
  matchScore: number;
  matchReasons: string[];
};

export type PitchAnalytics = {
  totalPitches: number;
  sentCount: number;
  acceptedCount: number;
  declinedCount: number;
  noResponseCount: number;
  openedCount: number;
  successRate: number;
  responseRate: number;
  avgResponseDays: number;
  bestGenres: { genre: string; successRate: number; count: number }[];
  monthlyData: { month: string; sent: number; accepted: number }[];
  totalPlacements: number;
};

// ---------------------------------------------------------------------------
// Mock Curators (20+)
// ---------------------------------------------------------------------------

const MOCK_CURATORS: Curator[] = [
  { id: "cur_01", name: "Alex Rivera", email: "alex@playlisthub.com", playlistName: "Indie Gems", platform: "spotify", genres: ["indie", "alternative", "indie-pop"], followerCount: 45200, acceptanceRate: 18, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Curating the best undiscovered indie tracks since 2019." },
  { id: "cur_02", name: "Samira Patel", email: "samira@beatdrop.co", playlistName: "Lo-Fi Study Beats", platform: "spotify", genres: ["lo-fi", "chillhop", "ambient"], followerCount: 128000, acceptanceRate: 8, avgResponseDays: 5, lastActive: "2026-03-27", bio: "The go-to playlist for focus and study sessions." },
  { id: "cur_03", name: "Marcus Johnson", email: "marcus@soulselections.com", playlistName: "Soul Selections", platform: "spotify", genres: ["r&b", "soul", "neo-soul"], followerCount: 67800, acceptanceRate: 15, avgResponseDays: 4, lastActive: "2026-03-29", bio: "Smooth R&B and neo-soul curated with love." },
  { id: "cur_04", name: "Yuki Tanaka", email: "yuki@tokyobeats.jp", playlistName: "Tokyo Night Drive", platform: "spotify", genres: ["electronic", "synthwave", "city-pop"], followerCount: 89300, acceptanceRate: 12, avgResponseDays: 7, lastActive: "2026-03-25", bio: "Late night electronic vibes from Tokyo and beyond." },
  { id: "cur_05", name: "Elena Kowalski", email: "elena@freshfinds.pl", playlistName: "Fresh Finds Friday", platform: "spotify", genres: ["pop", "indie-pop", "electro-pop"], followerCount: 156000, acceptanceRate: 6, avgResponseDays: 10, lastActive: "2026-03-28", bio: "Discovering tomorrow's pop stars today. Updated every Friday." },
  { id: "cur_06", name: "DeShawn Williams", email: "deshawn@hiphopunderground.com", playlistName: "Underground Heat", platform: "spotify", genres: ["hip-hop", "rap", "trap"], followerCount: 234000, acceptanceRate: 5, avgResponseDays: 14, lastActive: "2026-03-26", bio: "Raw, unfiltered hip-hop from the underground scene." },
  { id: "cur_07", name: "Isabelle Moreau", email: "isabelle@acousticmornings.fr", playlistName: "Acoustic Mornings", platform: "apple_music", genres: ["acoustic", "folk", "singer-songwriter"], followerCount: 31400, acceptanceRate: 22, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Gentle acoustic tracks to start your day." },
  { id: "cur_08", name: "Omar Hassan", email: "omar@worldsounds.me", playlistName: "World Sounds", platform: "spotify", genres: ["world", "afrobeats", "latin"], followerCount: 52100, acceptanceRate: 20, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Music without borders. Global beats and rhythms." },
  { id: "cur_09", name: "Liam Chen", email: "liam@rockvault.com", playlistName: "Rock Vault", platform: "spotify", genres: ["rock", "alternative", "punk"], followerCount: 98700, acceptanceRate: 10, avgResponseDays: 6, lastActive: "2026-03-27", bio: "New rock discoveries and timeless classics." },
  { id: "cur_10", name: "Ava Schmidt", email: "ava@dancefloorready.de", playlistName: "Dancefloor Ready", platform: "spotify", genres: ["house", "techno", "dance"], followerCount: 175000, acceptanceRate: 7, avgResponseDays: 8, lastActive: "2026-03-26", bio: "Club-ready tracks tested on real dancefloors." },
  { id: "cur_11", name: "Raj Kapoor", email: "raj@bollywoodbeats.in", playlistName: "Modern Bollywood", platform: "youtube_music", genres: ["bollywood", "indian-pop", "fusion"], followerCount: 320000, acceptanceRate: 4, avgResponseDays: 12, lastActive: "2026-03-25", bio: "Contemporary Bollywood and Indian fusion music." },
  { id: "cur_12", name: "Sofia Andersson", email: "sofia@nordicvibes.se", playlistName: "Nordic Vibes", platform: "spotify", genres: ["indie", "dream-pop", "shoegaze"], followerCount: 28900, acceptanceRate: 25, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Ethereal sounds from Scandinavia and beyond." },
  { id: "cur_13", name: "Tyler Brooks", email: "tyler@countryroads.co", playlistName: "New Country", platform: "apple_music", genres: ["country", "americana", "folk"], followerCount: 41200, acceptanceRate: 19, avgResponseDays: 4, lastActive: "2026-03-28", bio: "Fresh country and Americana artists you need to hear." },
  { id: "cur_14", name: "Mei Lin", email: "mei@jazzlounge.hk", playlistName: "Jazz Lounge", platform: "tidal", genres: ["jazz", "smooth-jazz", "nu-jazz"], followerCount: 19800, acceptanceRate: 30, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Contemporary and classic jazz for discerning ears." },
  { id: "cur_15", name: "Carlos Mendez", email: "carlos@reggaetonfire.mx", playlistName: "Reggaeton Fire", platform: "spotify", genres: ["reggaeton", "latin-trap", "latin"], followerCount: 287000, acceptanceRate: 3, avgResponseDays: 15, lastActive: "2026-03-24", bio: "The hottest reggaeton and Latin trap tracks." },
  { id: "cur_16", name: "Grace Okafor", email: "grace@afrovibes.ng", playlistName: "Afro Vibes", platform: "spotify", genres: ["afrobeats", "afro-pop", "dancehall"], followerCount: 143000, acceptanceRate: 9, avgResponseDays: 5, lastActive: "2026-03-27", bio: "Afrobeats, Afro-pop, and dancehall bangers." },
  { id: "cur_17", name: "Noah Fischer", email: "noah@metalcore.de", playlistName: "Metal Underground", platform: "spotify", genres: ["metal", "metalcore", "hardcore"], followerCount: 56300, acceptanceRate: 16, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Heavy music from the underground. No compromises." },
  { id: "cur_18", name: "Chloe Martin", email: "chloe@sleepytime.co.uk", playlistName: "Sleep & Chill", platform: "spotify", genres: ["ambient", "sleep", "meditation"], followerCount: 210000, acceptanceRate: 11, avgResponseDays: 7, lastActive: "2026-03-26", bio: "Calming ambient music for sleep and relaxation." },
  { id: "cur_19", name: "Jake Morrison", email: "jake@edmcentral.com", playlistName: "EDM Central", platform: "spotify", genres: ["edm", "dubstep", "drum-and-bass"], followerCount: 167000, acceptanceRate: 8, avgResponseDays: 9, lastActive: "2026-03-25", bio: "High-energy EDM for festivals and beyond." },
  { id: "cur_20", name: "Priya Sharma", email: "priya@classicalfusion.in", playlistName: "Classical Fusion", platform: "apple_music", genres: ["classical", "neo-classical", "cinematic"], followerCount: 24500, acceptanceRate: 28, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Where classical meets modern. Beautiful compositions." },
  { id: "cur_21", name: "Ben Taylor", email: "ben@workoutmix.com", playlistName: "Workout Power Mix", platform: "spotify", genres: ["pop", "hip-hop", "edm", "rock"], followerCount: 390000, acceptanceRate: 4, avgResponseDays: 14, lastActive: "2026-03-23", bio: "High-energy tracks to power your workouts." },
  { id: "cur_22", name: "Luna Park", email: "luna@kpoprisingstars.kr", playlistName: "K-Pop Rising Stars", platform: "youtube_music", genres: ["k-pop", "pop", "dance"], followerCount: 510000, acceptanceRate: 2, avgResponseDays: 20, lastActive: "2026-03-22", bio: "Emerging K-Pop artists and hidden gems." },
  { id: "cur_23", name: "Felix Rousseau", email: "felix@electronica.fr", playlistName: "Electronica Lab", platform: "deezer", genres: ["electronic", "experimental", "idm"], followerCount: 18200, acceptanceRate: 32, avgResponseDays: 1, lastActive: "2026-03-29", bio: "Experimental electronic music and sound art." },
  // Electronic
  { id: "cur_24", name: "Sven Eriksson", email: "sven@midnightsynths.se", playlistName: "Midnight Synths", platform: "spotify", genres: ["electronic", "synthwave", "darkwave"], followerCount: 62400, acceptanceRate: 14, avgResponseDays: 4, lastActive: "2026-03-28", bio: "Dark electronic sounds for the late hours." },
  { id: "cur_25", name: "Mira Okonkwo", email: "mira@futurebass.io", playlistName: "Future Bass Collective", platform: "spotify", genres: ["electronic", "future-bass", "edm"], followerCount: 95000, acceptanceRate: 9, avgResponseDays: 6, lastActive: "2026-03-27", bio: "Pushing electronic music forward, one drop at a time." },
  // Hip-Hop
  { id: "cur_26", name: "Jamal Washington", email: "jamal@boomboxdiaries.com", playlistName: "Boombox Diaries", platform: "spotify", genres: ["hip-hop", "boom-bap", "conscious-rap"], followerCount: 78500, acceptanceRate: 11, avgResponseDays: 5, lastActive: "2026-03-29", bio: "Real hip-hop. Lyrical depth over everything." },
  { id: "cur_27", name: "Destiny Cole", email: "destiny@trapqueens.co", playlistName: "Trap Queens", platform: "spotify", genres: ["hip-hop", "trap", "rap"], followerCount: 145000, acceptanceRate: 6, avgResponseDays: 10, lastActive: "2026-03-26", bio: "Celebrating women in trap and hip-hop." },
  // R&B
  { id: "cur_28", name: "Andre Mitchell", email: "andre@silkysounds.com", playlistName: "Silky Sounds", platform: "spotify", genres: ["r&b", "neo-soul", "contemporary-rnb"], followerCount: 53200, acceptanceRate: 17, avgResponseDays: 3, lastActive: "2026-03-29", bio: "Smooth R&B for every mood. Updated weekly." },
  { id: "cur_29", name: "Aaliyah Foster", email: "aaliyah@latenight-rnb.com", playlistName: "Late Night R&B", platform: "apple_music", genres: ["r&b", "slow-jams", "soul"], followerCount: 112000, acceptanceRate: 8, avgResponseDays: 7, lastActive: "2026-03-27", bio: "The soundtrack to your late nights." },
  // Country
  { id: "cur_30", name: "Hank Dawson", email: "hank@dustyroads.co", playlistName: "Dusty Roads", platform: "spotify", genres: ["country", "outlaw-country", "americana"], followerCount: 34800, acceptanceRate: 21, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Outlaw country and Americana for the open road." },
  { id: "cur_31", name: "Savannah Reed", email: "savannah@nashvillerising.com", playlistName: "Nashville Rising", platform: "apple_music", genres: ["country", "country-pop", "folk"], followerCount: 88700, acceptanceRate: 12, avgResponseDays: 5, lastActive: "2026-03-27", bio: "New voices from Nashville and beyond." },
  // Jazz
  { id: "cur_32", name: "Theo Baptiste", email: "theo@bluenotemodern.com", playlistName: "Blue Note Modern", platform: "tidal", genres: ["jazz", "modern-jazz", "fusion"], followerCount: 22100, acceptanceRate: 26, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Modern jazz for modern ears. Vinyl optional." },
  { id: "cur_33", name: "Hiroko Sato", email: "hiroko@jazzcafe.jp", playlistName: "Jazz Cafe Tokyo", platform: "spotify", genres: ["jazz", "bossa-nova", "jazz-fusion"], followerCount: 41500, acceptanceRate: 19, avgResponseDays: 4, lastActive: "2026-03-28", bio: "Jazz discoveries from Tokyo's listening bars." },
  // Classical
  { id: "cur_34", name: "Eleanor Whitfield", email: "eleanor@moderncomposers.uk", playlistName: "Modern Composers", platform: "apple_music", genres: ["classical", "neo-classical", "contemporary-classical"], followerCount: 19300, acceptanceRate: 29, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Contemporary classical compositions and film scores." },
  { id: "cur_35", name: "Dmitri Volkov", email: "dmitri@pianoworks.ru", playlistName: "Piano Works", platform: "spotify", genres: ["classical", "piano", "minimalist"], followerCount: 67800, acceptanceRate: 15, avgResponseDays: 5, lastActive: "2026-03-26", bio: "Solo piano from classical to contemporary." },
  // Latin
  { id: "cur_36", name: "Isabella Vargas", email: "isabella@ritmolatino.mx", playlistName: "Ritmo Latino", platform: "spotify", genres: ["latin", "salsa", "cumbia"], followerCount: 198000, acceptanceRate: 7, avgResponseDays: 8, lastActive: "2026-03-25", bio: "The pulse of Latin America. Salsa, cumbia, and more." },
  { id: "cur_37", name: "Diego Fuentes", email: "diego@nuevaola.co", playlistName: "Nueva Ola", platform: "spotify", genres: ["latin", "latin-alternative", "latin-indie"], followerCount: 45600, acceptanceRate: 18, avgResponseDays: 3, lastActive: "2026-03-28", bio: "The new wave of Latin alternative music." },
  // K-Pop
  { id: "cur_38", name: "Jisoo Kim", email: "jisoo@kpopunderground.kr", playlistName: "K-Pop Underground", platform: "youtube_music", genres: ["k-pop", "k-indie", "k-r&b"], followerCount: 320000, acceptanceRate: 3, avgResponseDays: 15, lastActive: "2026-03-24", bio: "Beyond the mainstream: K-indie and K-R&B gems." },
  { id: "cur_39", name: "Minho Park", email: "minho@seoulbeats.kr", playlistName: "Seoul Beats", platform: "spotify", genres: ["k-pop", "k-hip-hop", "dance"], followerCount: 485000, acceptanceRate: 2, avgResponseDays: 18, lastActive: "2026-03-23", bio: "The best of Korean music, curated daily." },
  // Metal
  { id: "cur_40", name: "Bjorn Halvorsen", email: "bjorn@northernmetal.no", playlistName: "Northern Metal", platform: "spotify", genres: ["metal", "black-metal", "death-metal"], followerCount: 38900, acceptanceRate: 20, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Extreme metal from the frozen north." },
  { id: "cur_41", name: "Sarah Blackwood", email: "sarah@progressivemetal.uk", playlistName: "Progressive Metal Essentials", platform: "spotify", genres: ["metal", "progressive-metal", "djent"], followerCount: 72100, acceptanceRate: 13, avgResponseDays: 5, lastActive: "2026-03-27", bio: "Technical, progressive, and boundary-pushing metal." },
  // Punk
  { id: "cur_42", name: "Zack Ramos", email: "zack@punknotdead.com", playlistName: "Punk Not Dead", platform: "spotify", genres: ["punk", "pop-punk", "hardcore"], followerCount: 51400, acceptanceRate: 16, avgResponseDays: 3, lastActive: "2026-03-29", bio: "DIY punk and hardcore from the underground." },
  { id: "cur_43", name: "Riot Girl Collective", email: "collective@riotgirl.net", playlistName: "Riot Girl Radio", platform: "spotify", genres: ["punk", "riot-grrrl", "post-punk"], followerCount: 28600, acceptanceRate: 23, avgResponseDays: 2, lastActive: "2026-03-28", bio: "Feminist punk, post-punk, and riot grrrl." },
  // Folk
  { id: "cur_44", name: "Fiona McAllister", email: "fiona@hearthfolk.co.uk", playlistName: "Hearth & Folk", platform: "spotify", genres: ["folk", "celtic", "traditional"], followerCount: 35200, acceptanceRate: 24, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Traditional and contemporary folk from the British Isles." },
  { id: "cur_45", name: "Owen Ashworth", email: "owen@campfireacoustic.com", playlistName: "Campfire Acoustic", platform: "spotify", genres: ["folk", "acoustic", "singer-songwriter"], followerCount: 82400, acceptanceRate: 14, avgResponseDays: 4, lastActive: "2026-03-27", bio: "Acoustic music that tells stories." },
  // Blues
  { id: "cur_46", name: "Robert 'Bobby' King", email: "bobby@deltablues.com", playlistName: "Delta Blues Revival", platform: "spotify", genres: ["blues", "delta-blues", "electric-blues"], followerCount: 27800, acceptanceRate: 27, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Keeping the blues alive, from delta to electric." },
  { id: "cur_47", name: "Lucille Harper", email: "lucille@modernblues.co", playlistName: "Modern Blues", platform: "tidal", genres: ["blues", "blues-rock", "soul-blues"], followerCount: 18500, acceptanceRate: 30, avgResponseDays: 1, lastActive: "2026-03-29", bio: "Contemporary blues artists you need to know." },
  // Reggae
  { id: "cur_48", name: "Kingston Roots", email: "admin@kingstonroots.jm", playlistName: "Kingston Roots", platform: "spotify", genres: ["reggae", "roots-reggae", "dub"], followerCount: 64200, acceptanceRate: 15, avgResponseDays: 4, lastActive: "2026-03-28", bio: "Roots reggae and dub from Jamaica and beyond." },
  // Dancehall
  { id: "cur_49", name: "Empress Nyah", email: "nyah@dancehallfire.com", playlistName: "Dancehall Fire", platform: "spotify", genres: ["dancehall", "reggae", "soca"], followerCount: 142000, acceptanceRate: 8, avgResponseDays: 6, lastActive: "2026-03-27", bio: "The hottest dancehall and Caribbean sounds." },
  // Afrobeats
  { id: "cur_50", name: "Kofi Mensah", email: "kofi@afrowave.gh", playlistName: "Afro Wave", platform: "spotify", genres: ["afrobeats", "amapiano", "afro-fusion"], followerCount: 210000, acceptanceRate: 6, avgResponseDays: 8, lastActive: "2026-03-26", bio: "Afrobeats, Amapiano, and the sounds of Africa." },
  { id: "cur_51", name: "Amara Diallo", email: "amara@lagostonights.ng", playlistName: "Lagos to Nights", platform: "spotify", genres: ["afrobeats", "afro-pop", "highlife"], followerCount: 167000, acceptanceRate: 7, avgResponseDays: 7, lastActive: "2026-03-27", bio: "From Lagos streets to global stages." },
  { id: "cur_52", name: "Chidera Nwosu", email: "chidera@africangroove.com", playlistName: "African Groove", platform: "apple_music", genres: ["afrobeats", "afro-house", "gqom"], followerCount: 89400, acceptanceRate: 11, avgResponseDays: 5, lastActive: "2026-03-28", bio: "The diverse sounds of the African continent." },
  { id: "cur_53", name: "Kwame Asante", email: "kwame@goldcoastbeats.com", playlistName: "Gold Coast Beats", platform: "spotify", genres: ["afrobeats", "hiplife", "azonto"], followerCount: 534, acceptanceRate: 45, avgResponseDays: 1, lastActive: "2026-03-29", bio: "Emerging Ghanaian music curator. Small but mighty." },
];

// ---------------------------------------------------------------------------
// Mock Pitches
// ---------------------------------------------------------------------------

const MOCK_PITCHES: PlaylistPitch[] = [
  { id: "pitch_01", userId: "mock", curatorId: "cur_01", curatorName: "Alex Rivera", playlistName: "Indie Gems", trackTitle: "Midnight Echoes", genre: "indie", message: "Hi Alex, I'd love to submit my latest single 'Midnight Echoes' for Indie Gems...", status: "accepted", sentAt: "2026-03-15T10:00:00Z", respondedAt: "2026-03-18T14:30:00Z", createdAt: "2026-03-14T09:00:00Z", updatedAt: "2026-03-18T14:30:00Z" },
  { id: "pitch_02", userId: "mock", curatorId: "cur_05", curatorName: "Elena Kowalski", playlistName: "Fresh Finds Friday", trackTitle: "Neon Dreams", genre: "electro-pop", message: "Hey Elena, 'Neon Dreams' is a synth-driven electro-pop track...", status: "sent", sentAt: "2026-03-25T08:00:00Z", respondedAt: null, createdAt: "2026-03-24T16:00:00Z", updatedAt: "2026-03-25T08:00:00Z" },
  { id: "pitch_03", userId: "mock", curatorId: "cur_03", curatorName: "Marcus Johnson", playlistName: "Soul Selections", trackTitle: "Golden Hour", genre: "neo-soul", message: "Marcus, I think 'Golden Hour' would be a perfect fit for Soul Selections...", status: "opened", sentAt: "2026-03-20T12:00:00Z", respondedAt: null, createdAt: "2026-03-19T14:00:00Z", updatedAt: "2026-03-22T09:00:00Z" },
  { id: "pitch_04", userId: "mock", curatorId: "cur_09", curatorName: "Liam Chen", playlistName: "Rock Vault", trackTitle: "Broken Frequencies", genre: "alternative", message: "Hi Liam, 'Broken Frequencies' blends alternative rock with electronic elements...", status: "declined", sentAt: "2026-03-10T09:00:00Z", respondedAt: "2026-03-16T11:00:00Z", createdAt: "2026-03-09T15:00:00Z", updatedAt: "2026-03-16T11:00:00Z" },
  { id: "pitch_05", userId: "mock", curatorId: "cur_12", curatorName: "Sofia Andersson", playlistName: "Nordic Vibes", trackTitle: "Midnight Echoes", genre: "dream-pop", message: "Sofia, 'Midnight Echoes' has that dreamy, ethereal quality...", status: "draft", sentAt: null, respondedAt: null, createdAt: "2026-03-28T10:00:00Z", updatedAt: "2026-03-28T10:00:00Z" },
  { id: "pitch_06", userId: "mock", curatorId: "cur_10", curatorName: "Ava Schmidt", playlistName: "Dancefloor Ready", trackTitle: "Pulse", genre: "house", message: "Hey Ava, 'Pulse' is a deep house track with...", status: "no_response", sentAt: "2026-03-01T07:00:00Z", respondedAt: null, createdAt: "2026-02-28T18:00:00Z", updatedAt: "2026-03-15T00:00:00Z" },
  { id: "pitch_07", userId: "mock", curatorId: "cur_02", curatorName: "Samira Patel", playlistName: "Lo-Fi Study Beats", trackTitle: "Rainy Afternoon", genre: "lo-fi", message: "Samira, 'Rainy Afternoon' is a lo-fi beat with vinyl crackle and mellow keys...", status: "accepted", sentAt: "2026-03-05T11:00:00Z", respondedAt: "2026-03-10T08:00:00Z", createdAt: "2026-03-04T20:00:00Z", updatedAt: "2026-03-10T08:00:00Z" },
  { id: "pitch_08", userId: "mock", curatorId: "cur_07", curatorName: "Isabelle Moreau", playlistName: "Acoustic Mornings", trackTitle: "Sunlit Path", genre: "acoustic", message: "Isabelle, 'Sunlit Path' is an acoustic track recorded live in one take...", status: "sent", sentAt: "2026-03-27T06:00:00Z", respondedAt: null, createdAt: "2026-03-26T22:00:00Z", updatedAt: "2026-03-27T06:00:00Z" },
];

// ---------------------------------------------------------------------------
// getCurators
// ---------------------------------------------------------------------------

export async function getCurators(filters?: {
  genre?: string;
  platform?: string;
  search?: string;
}): Promise<Curator[]> {
  let curators = [...MOCK_CURATORS];

  if (filters?.genre) {
    const g = filters.genre.toLowerCase();
    curators = curators.filter((c) =>
      c.genres.some((genre) => genre.toLowerCase().includes(g))
    );
  }
  if (filters?.platform) {
    curators = curators.filter((c) => c.platform === filters.platform);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    curators = curators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.playlistName.toLowerCase().includes(q) ||
        c.genres.some((g) => g.toLowerCase().includes(q))
    );
  }

  return curators;
}

// ---------------------------------------------------------------------------
// createPitch
// ---------------------------------------------------------------------------

export async function createPitch(
  userId: string,
  data: {
    curatorId: string;
    trackTitle: string;
    genre: string;
    message: string;
    status?: PitchStatus;
  }
): Promise<PlaylistPitch> {
  const curator = MOCK_CURATORS.find((c) => c.id === data.curatorId);
  const now = new Date().toISOString();

  const pitch: PlaylistPitch = {
    id: `pitch_${Date.now()}`,
    userId,
    curatorId: data.curatorId,
    curatorName: curator?.name || "Unknown Curator",
    playlistName: curator?.playlistName || "Unknown Playlist",
    trackTitle: data.trackTitle,
    genre: data.genre,
    message: data.message,
    status: data.status || "draft",
    sentAt: data.status === "sent" ? now : null,
    respondedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  return pitch;
}

// ---------------------------------------------------------------------------
// generatePitchMessage
// ---------------------------------------------------------------------------

export async function generatePitchMessage(
  trackTitle: string,
  genre: string,
  artistName: string,
  playlistName: string,
  curatorName: string
): Promise<string> {
  if (IS_MOCK) {
    return getMockPitchMessage(trackTitle, genre, artistName, playlistName, curatorName);
  }

  const systemPrompt = `You are an expert music PR specialist at TrueFans MANAGER. You write compelling, personalized playlist pitch emails for independent artists. Your emails are:
- Warm, professional, and concise (150-250 words)
- Personalized to the curator and playlist
- Include specific details about why the track fits
- Have a clear, non-pushy call to action
- Never feel templated or mass-produced

Write ONLY the email body text. Do not include subject line or greetings like "Subject:".`;

  const userMessage = `Write a playlist pitch email:
- Artist: ${artistName}
- Track: "${trackTitle}"
- Genre: ${genre}
- Playlist: "${playlistName}"
- Curator: ${curatorName}

Make it feel genuine and specific to this playlist.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = response.content[0];
    return block.type === "text" ? block.text : getMockPitchMessage(trackTitle, genre, artistName, playlistName, curatorName);
  } catch (error) {
    console.error("[playlist-pitch-service] AI error:", error);
    return getMockPitchMessage(trackTitle, genre, artistName, playlistName, curatorName);
  }
}

function getMockPitchMessage(
  trackTitle: string,
  genre: string,
  artistName: string,
  playlistName: string,
  curatorName: string
): string {
  return `Hi ${curatorName},

I hope this message finds you well. I've been following "${playlistName}" for a while now, and I really admire the way you curate tracks that balance discovery with quality.

I'd love to submit my latest release, "${trackTitle}" for your consideration. It's a ${genre} track that blends [atmospheric production with introspective lyrics / driving rhythms with melodic hooks]. I think it would sit well alongside the current vibe of your playlist.

A few quick highlights:
- Currently at 15K+ streams and growing organically
- Featured on 3 independent blogs this month
- Produced by [Producer Name] who has worked with [Similar Artists]

Here's the private streaming link: [link]

I'd be grateful if you gave it a listen. No pressure at all -- I genuinely appreciate the time you put into discovering new music.

Thanks so much,
${artistName}

[Mock response -- configure ANTHROPIC_API_KEY for AI-generated pitches]`;
}

// ---------------------------------------------------------------------------
// getPitches
// ---------------------------------------------------------------------------

export async function getPitches(
  userId: string,
  filters?: { status?: PitchStatus; page?: number; limit?: number }
): Promise<{ pitches: PlaylistPitch[]; total: number }> {
  let pitches = MOCK_PITCHES.map((p) => ({ ...p, userId }));

  if (filters?.status) {
    pitches = pitches.filter((p) => p.status === filters.status);
  }

  const total = pitches.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const start = (page - 1) * limit;
  pitches = pitches.slice(start, start + limit);

  return { pitches, total };
}

// ---------------------------------------------------------------------------
// updatePitchStatus
// ---------------------------------------------------------------------------

export async function updatePitchStatus(
  pitchId: string,
  status: PitchStatus
): Promise<PlaylistPitch | null> {
  const pitch = MOCK_PITCHES.find((p) => p.id === pitchId);
  if (!pitch) return null;

  const now = new Date().toISOString();
  return {
    ...pitch,
    status,
    sentAt: status === "sent" && !pitch.sentAt ? now : pitch.sentAt,
    respondedAt: ["accepted", "declined"].includes(status) ? now : pitch.respondedAt,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// getAutoMatches
// ---------------------------------------------------------------------------

export async function getAutoMatches(
  userId: string,
  releaseId?: string
): Promise<AutoMatch[]> {
  // In production, this would analyze the user's tracks against curator preferences
  // For now, return AI-scored mock matches
  const mockRelease = {
    title: releaseId ? "Selected Release" : "Midnight Echoes",
    genre: "indie",
    mood: "atmospheric",
    bpm: 120,
    energy: 0.6,
  };

  if (!IS_MOCK && client) {
    try {
      const systemPrompt = `You are a playlist matching AI at TrueFans MANAGER. Given a track profile and a list of curators, score how well the track matches each playlist on a 0-100 scale and provide reasons.

Return ONLY valid JSON array:
[{ "curatorId": "id", "matchScore": 85, "matchReasons": ["reason1", "reason2"] }]

Only include curators with a matchScore >= 50. Sort by matchScore descending.`;

      const curatorsInfo = MOCK_CURATORS.map((c) => ({
        id: c.id,
        name: c.name,
        playlist: c.playlistName,
        genres: c.genres,
      }));

      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Match this track:\n${JSON.stringify(mockRelease)}\n\nTo these curators:\n${JSON.stringify(curatorsInfo)}`,
          },
        ],
      });

      const block = response.content[0];
      if (block.type === "text") {
        const matches: { curatorId: string; matchScore: number; matchReasons: string[] }[] = JSON.parse(block.text);
        return matches
          .map((m) => {
            const curator = MOCK_CURATORS.find((c) => c.id === m.curatorId);
            if (!curator) return null;
            return { curator, matchScore: m.matchScore, matchReasons: m.matchReasons };
          })
          .filter((m): m is AutoMatch => m !== null);
      }
    } catch (error) {
      console.error("[playlist-pitch-service] Auto-match AI error:", error);
    }
  }

  // Mock auto-match results
  return [
    { curator: MOCK_CURATORS[0], matchScore: 94, matchReasons: ["Genre alignment: indie", "Playlist energy level matches track", "Curator has history of accepting similar artists"] },
    { curator: MOCK_CURATORS[11], matchScore: 88, matchReasons: ["Dream-pop aesthetic fits Nordic Vibes", "Track BPM matches playlist average", "High acceptance rate for new artists"] },
    { curator: MOCK_CURATORS[6], matchScore: 82, matchReasons: ["Acoustic elements align with playlist", "Singer-songwriter approach fits curation style", "Active curator with fast response time"] },
    { curator: MOCK_CURATORS[4], matchScore: 76, matchReasons: ["Pop crossover potential", "Track production quality matches playlist standard", "Friday release timing advantage"] },
    { curator: MOCK_CURATORS[8], matchScore: 71, matchReasons: ["Alternative rock elements present", "Guitar-driven sections fit Rock Vault", "Growing listener base in target demographic"] },
    { curator: MOCK_CURATORS[1], matchScore: 65, matchReasons: ["Ambient intro section fits lo-fi aesthetic", "Mellow mood alignment", "Study-friendly tempo"] },
    { curator: MOCK_CURATORS[17], matchScore: 58, matchReasons: ["Atmospheric production qualities", "Calm energy profile matches", "Late-night listening vibe"] },
  ];
}

// ---------------------------------------------------------------------------
// getPitchAnalytics
// ---------------------------------------------------------------------------

export async function getPitchAnalytics(userId: string): Promise<PitchAnalytics> {
  // In production, aggregate from DB. For now, return mock analytics.
  return {
    totalPitches: 47,
    sentCount: 42,
    acceptedCount: 8,
    declinedCount: 12,
    noResponseCount: 15,
    openedCount: 7,
    successRate: 19,
    responseRate: 47.6,
    avgResponseDays: 5.2,
    bestGenres: [
      { genre: "indie", successRate: 28, count: 14 },
      { genre: "lo-fi", successRate: 25, count: 8 },
      { genre: "neo-soul", successRate: 22, count: 9 },
      { genre: "electronic", successRate: 15, count: 6 },
      { genre: "pop", successRate: 10, count: 10 },
    ],
    monthlyData: [
      { month: "Oct 2025", sent: 5, accepted: 1 },
      { month: "Nov 2025", sent: 7, accepted: 1 },
      { month: "Dec 2025", sent: 6, accepted: 2 },
      { month: "Jan 2026", sent: 8, accepted: 1 },
      { month: "Feb 2026", sent: 9, accepted: 2 },
      { month: "Mar 2026", sent: 7, accepted: 1 },
    ],
    totalPlacements: 8,
  };
}

// ---------------------------------------------------------------------------
// bulkGeneratePitches
// ---------------------------------------------------------------------------

export async function bulkGeneratePitches(
  userId: string,
  releaseId: string,
  curatorIds: string[]
): Promise<PlaylistPitch[]> {
  const artistName = "Your Artist Name"; // In production, fetch from user profile
  const trackTitle = "Midnight Echoes"; // In production, fetch from release
  const genre = "indie";

  const pitches: PlaylistPitch[] = [];

  for (const curatorId of curatorIds) {
    const curator = MOCK_CURATORS.find((c) => c.id === curatorId);
    if (!curator) continue;

    const message = await generatePitchMessage(
      trackTitle,
      genre,
      artistName,
      curator.playlistName,
      curator.name
    );

    const pitch = await createPitch(userId, {
      curatorId,
      trackTitle,
      genre,
      message,
      status: "draft",
    });

    pitches.push(pitch);
  }

  return pitches;
}
