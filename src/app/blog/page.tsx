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
  title: "The Complete Guide to Releasing a Single in 2026",
  excerpt:
    "Everything you need to know about planning, distributing, and promoting your next single — from pre-save campaigns to playlist pitching and beyond.",
  date: "Mar 20, 2026",
  readTime: "8 min read",
  category: "Strategy",
  href: "#",
};

const articles = [
  {
    title: "How AI is Changing Music Marketing for Independent Artists",
    excerpt:
      "Discover how artificial intelligence tools are leveling the playing field for indie musicians in promotion, analytics, and fan engagement.",
    date: "Mar 15, 2026",
    readTime: "6 min read",
    category: "AI & Tech",
    gradient: "from-violet-500 to-purple-600",
    href: "#",
  },
  {
    title: "5 Playlist Pitching Mistakes That Kill Your Chances",
    excerpt:
      "Avoid these common errors when submitting your tracks to editorial and independent playlist curators.",
    date: "Mar 8, 2026",
    readTime: "5 min read",
    category: "Playlists",
    gradient: "from-emerald-500 to-teal-600",
    href: "#",
  },
  {
    title: "Building a Superfan Community: From 0 to 1,000 True Fans",
    excerpt:
      "A practical roadmap for cultivating dedicated supporters who will champion your music and sustain your career.",
    date: "Feb 28, 2026",
    readTime: "7 min read",
    category: "Fan Growth",
    gradient: "from-orange-500 to-red-500",
    href: "#",
  },
  {
    title: "Understanding Music Royalties: A Simple Guide",
    excerpt:
      "Break down the complex world of mechanical, performance, and sync royalties into clear, actionable knowledge.",
    date: "Feb 20, 2026",
    readTime: "6 min read",
    category: "Business",
    gradient: "from-blue-500 to-cyan-600",
    href: "#",
  },
  {
    title: "Social Media Content Calendar: What to Post and When",
    excerpt:
      "Plan your social media strategy with this week-by-week content framework designed for musicians.",
    date: "Feb 12, 2026",
    readTime: "5 min read",
    category: "Marketing",
    gradient: "from-pink-500 to-rose-600",
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
            TrueFans Manager{" "}
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
