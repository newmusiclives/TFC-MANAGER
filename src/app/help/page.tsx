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
    ],
  },
  {
    title: "Using the Platform",
    items: [
      {
        question: "How does the AI Manager work?",
        answer:
          "The AI Manager analyzes your streaming data, release history, and audience demographics to provide contextual, personalized advice. Ask it anything — from the best day to release your next single, to how to grow your fanbase in a specific city. It learns from your activity over time to give increasingly relevant recommendations.",
      },
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
    ],
  },
  {
    title: "Billing & Account",
    items: [
      {
        question: "How do I get Pro for free with TrueFans CONNECT?",
        answer:
          "If you're a TrueFans CONNECT member, you can unlock TrueFans Manager Pro at no extra cost. Go to Settings > Billing and click \"Link TrueFans CONNECT.\" You'll be redirected to truefansconnect.com to authorize the connection. Once linked, your account is automatically upgraded to Pro with all premium features included.",
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
            Manager.
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
