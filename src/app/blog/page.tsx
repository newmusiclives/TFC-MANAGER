"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Calendar,
  Tag,
  BookOpen,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const categories = [
  "All",
  "Strategy",
  "AI & Tech",
  "Playlists",
  "Fan Growth",
  "Business",
  "Marketing",
];

const featuredArticle = {
  title: "How to Get on Spotify Editorial Playlists in 2026",
  excerpt:
    "Spotify editorial playlists remain one of the most powerful growth drivers for independent artists. We break down the submission process, what editorial curators actually look for, optimal timing, and the metadata strategies that increase your chances of landing a placement.",
  date: "Mar 25, 2026",
  readTime: "10 min read",
  category: "Playlists",
  author: "Jordan Ellis",
  href: "#",
};

const articles = [
  {
    title: "The Complete Guide to Music Sync Licensing",
    excerpt:
      "Sync licensing is one of the most lucrative revenue streams for independent artists. Learn how to get your music placed in TV shows, films, ads, and video games — from building a sync-ready catalog to pitching music supervisors.",
    date: "Mar 22, 2026",
    readTime: "12 min read",
    category: "Business",
    author: "Mia Torres",
    gradient: "from-blue-500 to-cyan-600",
    href: "#",
  },
  {
    title: "Building a Fan CRM: Why Every Artist Needs One",
    excerpt:
      "Your email list and fan database are assets no algorithm can take away. Discover how to build, segment, and engage a fan CRM that turns casual listeners into superfans who buy merch, attend shows, and fund your next project.",
    date: "Mar 18, 2026",
    readTime: "8 min read",
    category: "Fan Growth",
    author: "Alex Rivera",
    gradient: "from-orange-500 to-red-500",
    href: "#",
  },
  {
    title: "AI in Music: How Independent Artists Are Using AI Managers",
    excerpt:
      "From automated playlist pitching to AI-generated release strategies, independent artists are using artificial intelligence to compete with major-label resources. We explore real workflows and the tools reshaping the indie music landscape.",
    date: "Mar 14, 2026",
    readTime: "9 min read",
    category: "AI & Tech",
    author: "Priya Sharma",
    gradient: "from-violet-500 to-purple-600",
    href: "#",
  },
  {
    title: "Revenue Splits Explained: A Guide for Collaborators",
    excerpt:
      "Collaborations are essential to growth, but unclear revenue splits cause more disputes than any other issue in music. This guide covers how to structure fair splits, what contracts to use, and tools that automate the process.",
    date: "Mar 10, 2026",
    readTime: "7 min read",
    category: "Business",
    author: "Marcus Hall",
    gradient: "from-emerald-500 to-teal-600",
    href: "#",
  },
  {
    title: "The Art of the Release Rollout: A 6-Week Plan",
    excerpt:
      "A single release is not just the day your track goes live — it is a 6-week campaign. We lay out a week-by-week plan covering teasers, pre-saves, influencer seeding, launch day tactics, and post-release momentum strategies.",
    date: "Mar 6, 2026",
    readTime: "11 min read",
    category: "Strategy",
    author: "Jordan Ellis",
    gradient: "from-pink-500 to-rose-600",
    href: "#",
  },
  {
    title: "Understanding Your Streaming Royalties",
    excerpt:
      "How much does Spotify actually pay per stream in 2026? What about Apple Music, Tidal, and YouTube Music? We break down per-stream rates, how royalties are calculated, and strategies to maximize your streaming income as an independent artist.",
    date: "Feb 28, 2026",
    readTime: "8 min read",
    category: "Business",
    author: "Mia Torres",
    gradient: "from-amber-500 to-orange-600",
    href: "#",
  },
  {
    title: "Social Media Strategy for Musicians: Platform-by-Platform Guide",
    excerpt:
      "Each social platform has different algorithms, audiences, and content formats. This guide covers what works on Instagram, TikTok, YouTube Shorts, and Twitter/X in 2026, with specific posting schedules and content ideas for musicians.",
    date: "Feb 22, 2026",
    readTime: "10 min read",
    category: "Marketing",
    author: "Alex Rivera",
    gradient: "from-sky-500 to-blue-600",
    href: "#",
  },
  {
    title: "How to Pitch Your Music to Playlist Curators",
    excerpt:
      "Beyond Spotify editorial, thousands of independent curators control playlists with millions of followers. Learn how to find the right curators, write pitches that get responses, and build lasting relationships that lead to repeat placements.",
    date: "Feb 15, 2026",
    readTime: "7 min read",
    category: "Playlists",
    author: "Priya Sharma",
    gradient: "from-green-500 to-emerald-600",
    href: "#",
  },
  {
    title: "Music Contract Red Flags: What to Watch For",
    excerpt:
      "Before you sign anything, learn to spot the clauses that could cost you your masters, your publishing, or years of creative freedom. A music attorney breaks down the 10 most common contract traps facing independent artists in 2026.",
    date: "Feb 8, 2026",
    readTime: "9 min read",
    category: "Business",
    author: "Marcus Hall",
    gradient: "from-red-500 to-rose-600",
    href: "#",
  },
  {
    title: "Fan Funding vs. Traditional Labels: Pros and Cons",
    excerpt:
      "With platforms like Patreon, Kickstarter, and direct fan subscriptions, artists have more funding options than ever. We compare fan-funded models to traditional label deals, examining creative control, revenue splits, and long-term career impact.",
    date: "Feb 1, 2026",
    readTime: "8 min read",
    category: "Fan Growth",
    author: "Jordan Ellis",
    gradient: "from-indigo-500 to-violet-600",
    href: "#",
  },
  {
    title: "The Independent Artist's Guide to Touring in 2026",
    excerpt:
      "Touring without a booking agent or label support is challenging but entirely possible. This guide covers routing strategies, venue outreach, budgeting for DIY tours, merch optimization, and how to use data analytics to pick the right cities.",
    date: "Jan 24, 2026",
    readTime: "11 min read",
    category: "Strategy",
    author: "Mia Torres",
    gradient: "from-teal-500 to-cyan-600",
    href: "#",
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const showFeatured =
    activeCategory === "All" || activeCategory === featuredArticle.category;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center pt-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-[var(--primary)]" />
            <span className="text-[var(--primary)] font-semibold text-sm uppercase tracking-wider">
              Blog
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TrueFans MANAGER{" "}
            <span className="text-[var(--primary)]">
              Blog
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Tips, strategies, and insights for independent artists
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {showFeatured && (
        <section className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <Link href={featuredArticle.href} className="block group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-[1px]">
                <div className="rounded-2xl bg-white p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-emerald-500/5 to-teal-500/5" />
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full border border-[var(--primary)]/20">
                        Featured
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-[var(--primary)] transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {featuredArticle.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredArticle.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredArticle.readTime}
                      </span>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-3 transition-all">
                      Read more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length === 0 && !showFeatured ? (
            <div className="text-center py-16 text-gray-500">
              <Tag className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-lg">No articles in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, idx) => (
                <Link
                  key={idx}
                  href={article.href}
                  className="group block rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  {/* Gradient Top Strip */}
                  <div
                    className={`h-2 bg-gradient-to-r ${article.gradient}`}
                  />
                  <div className="p-6">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-600">
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--primary)] font-semibold group-hover:gap-2.5 transition-all">
                      Read more <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
