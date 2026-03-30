"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Rocket,
  Disc3,
  BarChart3,
  CreditCard,
  Mail,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const quickLinks = [
  {
    title: "Getting Started",
    description: "Set up your profile and connect platforms",
    icon: Rocket,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Release Tools",
    description: "Plan, distribute, and promote your music",
    icon: Disc3,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Analytics & AI",
    description: "Understand your data and get AI insights",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Billing & Account",
    description: "Manage your subscription and payments",
    icon: CreditCard,
    gradient: "from-orange-500 to-red-500",
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    title: "Getting Started",
    items: [
      {
        question: "How do I set up my artist profile?",
        answer:
          "When you first sign up, our onboarding wizard walks you through the entire setup process. You'll enter your artist name, bio, and genre, then connect your streaming accounts and social media profiles. You can always update your profile later from Settings > Artist Profile.",
      },
      {
        question: "How do I connect my streaming platforms?",
        answer:
          "Head to Settings > Connected Accounts. Click \"Connect\" next to Spotify to link via Spotify for Artists, and click \"Connect\" next to Apple Music to link via Apple Music for Artists. Once connected, your streaming data will sync automatically within a few hours.",
      },
      {
        question: "What's included in the free plan?",
        answer:
          "The Starter plan includes: basic release planning tools, streaming analytics dashboard with 30-day history, up to 2 active release campaigns, access to the AI Manager with limited monthly queries, link-in-bio page, and basic social media scheduling for up to 5 posts per week.",
      },
      {
        question: "How do I invite collaborators to my workspace?",
        answer:
          "Go to Settings > Team and click \"Invite Member.\" Enter their email address and select a role (Manager, Collaborator, or Viewer). They will receive an email invitation with a link to join your workspace. You can manage permissions and revoke access at any time from the same page.",
      },
      {
        question: "Can I manage multiple artist profiles?",
        answer:
          "Yes, Pro and Enterprise plans support multiple artist profiles under one account. Go to the profile switcher in the top-left corner of the dashboard to add a new artist profile. Each profile has its own analytics, releases, and connected accounts, but shares your billing and team settings.",
      },
      {
        question: "What file formats are supported for uploads?",
        answer:
          "For audio files, we support MP3, WAV, FLAC, AAC, and OGG (up to 50MB). For images (cover art, banners), we support PNG, JPG, and WebP (up to 5MB). For video content used in social scheduling, we support MP4 and MOV (up to 100MB on Pro plans).",
      },
    ],
  },
  {
    title: "Features & Tools",
    items: [
      {
        question: "How do I create a release plan?",
        answer:
          "Go to Dashboard > Releases and click \"New Release.\" Step 1: Enter your track or album details (title, artwork, genre). Step 2: Set your release date. Step 3: The platform auto-generates a pre-release timeline with tasks like pre-save setup, playlist pitching deadlines, and social media prompts. Step 4: Customize the plan and activate it.",
      },
      {
        question: "Can I schedule social media posts?",
        answer:
          "Yes! The Social Scheduler lets you plan and schedule posts across your connected social media accounts. Create posts with images, video, or text, pick a date and time, and the platform will publish them automatically. You can also use AI-suggested captions and optimal posting times.",
      },
      {
        question: "How does the Sound Analysis feature work?",
        answer:
          "Upload any audio file (MP3, WAV, or FLAC) to the Sound Analysis tool. Our AI analyzes the track and identifies BPM, musical key, mood, energy level, and genre characteristics. It then suggests similar successful tracks, recommended playlists to pitch to, and optimal release timing based on the sonic profile.",
      },
      {
        question: "How do I use the Banner Creator?",
        answer:
          "Navigate to Dashboard > Banner Creator. Select a platform size (Instagram Post, Story, YouTube Thumbnail, etc.), choose a template, and enter your text content. The live preview updates in real time. Click Save to keep it in your library or Download to export it as an image file.",
      },
      {
        question: "What is the Playlist Pitch tool?",
        answer:
          "The Playlist Pitch tool helps you submit your music to playlist curators. Browse our database of 50+ curators across all genres, view their acceptance rates and response times, and use AI to generate personalized pitch messages. You can also use Auto-Match to find curators whose playlists best fit your sound.",
      },
      {
        question: "How does the Fan CRM work?",
        answer:
          "The Fan CRM collects and organizes data about your listeners and followers across platforms. It tracks engagement levels, purchase history, and interaction patterns to help you segment fans into groups (superfans, casual listeners, new followers). Use these segments to send targeted emails, offer exclusive content, or prioritize meet-and-greet invites.",
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        question: "How does the AI Manager work?",
        answer:
          "The AI Manager analyzes your streaming data, release history, and audience demographics to provide contextual, personalized advice. Ask it anything — from the best day to release your next single, to how to grow your fanbase in a specific city. It learns from your activity over time to give increasingly relevant recommendations.",
      },
      {
        question: "What can I ask the AI Manager?",
        answer:
          "You can ask about release strategy (\"When should I drop my next single?\"), marketing advice (\"How do I grow on TikTok?\"), playlist pitching (\"Generate a pitch for this curator\"), analytics interpretation (\"Why did my streams drop this week?\"), and general career guidance (\"Should I sign this licensing deal?\"). The AI has context from your connected accounts.",
      },
      {
        question: "How does AI Autopilot mode work?",
        answer:
          "AI Autopilot runs daily background scans of your artist profile, streaming metrics, and social engagement. When it detects opportunities (trending sounds, playlist openings, engagement spikes) or issues (stream drops, missed deadlines), it sends you notifications with recommended actions. On Pro plans, it can also auto-schedule social posts and draft pitch emails.",
      },
      {
        question: "Is my data safe when using AI features?",
        answer:
          "Yes. Your music, analytics, and personal information are never used to train AI models. All AI analysis happens in real time using your data as context, and nothing is stored beyond the session. We use Anthropic's Claude API, which has strict data privacy policies. You can disable AI features entirely from Settings > Privacy.",
      },
      {
        question: "Can AI generate content for social media?",
        answer:
          "Yes. The AI can generate captions, hashtag sets, and content calendars tailored to your genre, brand voice, and audience. Go to Social Scheduler > Create Post and click \"AI Generate\" to get suggestions. You can edit AI-generated content before scheduling, and the AI improves its suggestions based on which posts perform best.",
      },
      {
        question: "Does the AI analyze my audio files?",
        answer:
          "Yes. When you upload a track to Sound Analysis, the AI examines the audio waveform to determine BPM, key, energy, mood, and production characteristics. It then provides mixing suggestions, playlist readiness scores, and identifies similar commercially successful tracks to help you position your release.",
      },
    ],
  },
  {
    title: "Billing & Plans",
    items: [
      {
        question: "How do I get Pro for free with TrueFans CONNECT?",
        answer:
          "If you're a TrueFans CONNECT member, you can unlock TrueFans MANAGER Pro at no extra cost. Go to Settings > Billing and click \"Link TrueFans CONNECT.\" You'll be redirected to truefansconnect.com to authorize the connection. Once linked, your account is automatically upgraded to Pro with all premium features included.",
      },
      {
        question: "How do I upgrade my plan?",
        answer:
          "Go to Settings > Billing and click \"Upgrade Plan.\" You'll see a comparison of available plans with pricing. Select your preferred plan, enter your payment details, and your account will be upgraded instantly. You'll only be charged the prorated difference for the remainder of your current billing cycle.",
      },
      {
        question: "Can I cancel anytime?",
        answer:
          "Yes, absolutely. There are no long-term contracts or cancellation fees. You can cancel your subscription at any time from Settings > Billing > Cancel Plan. You'll continue to have access to your paid features until the end of your current billing period, after which your account will revert to the free Starter plan.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For Enterprise plans, we also support invoicing and bank transfers. All payments are processed securely through Stripe.",
      },
      {
        question: "Do you offer student or nonprofit discounts?",
        answer:
          "Yes! Students with a valid .edu email address receive 50% off any paid plan. Registered nonprofits and music education organizations can apply for our Community Program, which provides Pro features at no cost. Contact support@truefansmanager.com with proof of eligibility to apply.",
      },
      {
        question: "What happens to my data if I downgrade?",
        answer:
          "When you downgrade from a paid plan, your data is preserved but some features become read-only. You will retain access to all your analytics history, but active campaigns beyond the Starter limit will be paused. Saved banners, pitches, and release plans remain accessible. You can upgrade again at any time to reactivate everything.",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        question: "Which streaming platforms can I connect?",
        answer:
          "TrueFans MANAGER supports Spotify for Artists, Apple Music for Artists, YouTube Music, Amazon Music, Tidal, and Deezer. Each platform requires OAuth authorization. Once connected, we pull streaming data, listener demographics, and playlist placement information automatically.",
      },
      {
        question: "Which social media platforms are supported?",
        answer:
          "You can connect Instagram (Business or Creator accounts), TikTok, Twitter/X, Facebook Pages, and YouTube channels. Social scheduling, analytics tracking, and AI content generation work across all connected platforms. We also support cross-posting, where one post is adapted and published to multiple platforms simultaneously.",
      },
      {
        question: "Can I connect my distributor (DistroKid, TuneCore, etc.)?",
        answer:
          "Currently, we support direct integration with DistroKid and TuneCore for automatic release tracking and royalty data import. For other distributors (CD Baby, Amuse, LANDR), you can manually import release data via CSV upload. We are actively building integrations with additional distributors.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      {
        question: "My streaming data is not updating. What should I do?",
        answer:
          "First, check Settings > Connected Accounts to make sure your streaming platform connection is active (look for a green status indicator). If the token has expired, click \"Reconnect\" to re-authorize. Data syncs happen every few hours, so recent releases may take up to 24 hours to appear. If the issue persists, contact support.",
      },
      {
        question: "My social media posts failed to publish. Why?",
        answer:
          "Common reasons include: expired platform tokens (reconnect from Settings), content that violates platform guidelines (check for flagged text or media), or posting to a personal account instead of a Business/Creator account. Check the post status in Social Scheduler for specific error messages. You can retry failed posts with one click.",
      },
      {
        question: "The AI Manager is giving generic responses. How do I improve it?",
        answer:
          "The AI Manager performs best when it has access to your data. Make sure you have connected your streaming platforms and social accounts, filled out your artist profile completely (genres, goals, target audience), and have at least one release in the system. The more context the AI has, the more specific and actionable its advice becomes.",
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const matchesSearch = (item: FaqItem) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center pt-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-[var(--primary)]" />
            <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
              Support
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help{" "}
            <span className="text-[var(--primary)]">
              Center
            </span>
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Find answers, learn features, and get the most out of TrueFans
            MANAGER.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <div
                key={link.title}
                className="group rounded-xl bg-white border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4`}
                >
                  <link.icon className="w-6 h-6 text-gray-800" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500">{link.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-10">
            {faqCategories.map((category) => {
              const visibleItems = category.items.filter(matchesSearch);
              if (visibleItems.length === 0) return null;

              return (
                <div key={category.title}>
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
                    {category.title}
                  </h3>
                  <div className="space-y-3">
                    {visibleItems.map((item, idx) => {
                      const key = `${category.title}-${idx}`;
                      const isOpen = !!openItems[key];

                      return (
                        <div
                          key={key}
                          className="rounded-xl bg-white border border-gray-100 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium pr-4">
                              {item.question}
                            </span>
                            <ChevronDown
                              className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-500/10 border border-gray-800 p-8 md:p-12 text-center">
            <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Can&apos;t find what you&apos;re looking for? Reach out to our
              support team or chat with the AI Manager for instant guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:contact@truefansmanager.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@truefansmanager.com
              </a>
              <Link
                href="/dashboard/ai-manager"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-gray-800 font-medium transition-opacity"
              >
                <MessageSquare className="w-4 h-4" />
                Chat with AI Manager
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
