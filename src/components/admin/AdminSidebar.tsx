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
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Artists", href: "/admin/artists", icon: Music2 },
  { label: "Analytics", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gray-950 text-white flex flex-col z-40">
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

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

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
