"use client";

import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  variant?: "default" | "success" | "create";
}

const variantStyles = {
  default: {
    iconWrapper: "bg-zinc-800/80",
    iconColor: "text-zinc-500",
    buttonBg: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  success: {
    iconWrapper: "bg-green-500/10",
    iconColor: "text-green-400",
    buttonBg: "bg-green-600 hover:bg-green-700 text-white",
  },
  create: {
    iconWrapper: "bg-purple-500/10",
    iconColor: "text-purple-400",
    buttonBg: "bg-purple-600 hover:bg-purple-700 text-white",
  },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  variant = "default",
}: EmptyStateProps) {
  const styles = variantStyles[variant];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className={`p-5 rounded-2xl ${styles.iconWrapper} mb-6`}>
        <Icon className={`w-10 h-10 ${styles.iconColor} opacity-60`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6">{description}</p>
      <Link
        href={actionHref}
        className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${styles.buttonBg}`}
      >
        {variant === "create" && <Plus className="w-4 h-4" />}
        {actionLabel}
      </Link>
    </div>
  );
}
