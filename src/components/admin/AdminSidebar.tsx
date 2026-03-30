"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Music2,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  ChevronDown,
  Activity,
  UserCog,
} from "lucide-react";
import { useState, useEffect } from "react";

type NavSection = {
  title: string;
  icon: React.ElementType;
  items: { label: string; href: string; icon: React.ElementType }[];
};

const navSections: NavSection[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Activity Log", href: "/admin/activity", icon: Activity },
    ],
  },
  {
    title: "User Management",
    icon: UserCog,
    items: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "Artists", href: "/admin/artists", icon: Music2 },
    ],
  },
  {
    title: "System",
    icon: Settings,
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function sectionHasActiveItem(section: NavSection, pathname: string) {
  return section.items.some((item) => pathname === item.href);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Auto-expand section with active item
  useEffect(() => {
    const activeSection = navSections.find((s) => sectionHasActiveItem(s, pathname));
    if (activeSection && !openSections[activeSection.title]) {
      setOpenSections((prev) => ({ ...prev, [activeSection.title]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-950 text-white flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Shield size={16} />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight">TrueFans MANAGER</span>
          <span className="block text-xs text-red-400 font-semibold uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {navSections.map((section) => {
          const isOpen = openSections[section.title] ?? false;
          const hasActive = sectionHasActiveItem(section, pathname);
          const SectionIcon = section.icon;

          return (
            <div key={section.title} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleSection(section.title)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  hasActive
                    ? "text-red-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                }`}
              >
                <SectionIcon size={18} className="shrink-0" />
                <span className="flex-1 text-left">{section.title}</span>
                {hasActive && !isOpen && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-gray-600 transition-transform duration-200 ${
                    isOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Items */}
              {isOpen && (
                <div className="space-y-px ml-3 pl-3 border-l border-gray-800/60">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-red-600 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        <item.icon size={17} className="shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
