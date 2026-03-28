"use client";

import React, { useState, useEffect, useMemo } from "react";

// ── Confetti ────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#f43f5e", // rose
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#a855f7", // purple
  "#f97316", // orange
  "#06b6d4", // cyan
  "#ec4899", // pink
];

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

interface Particle {
  id: number;
  color: string;
  left: number;
  delay: number;
  size: number;
  rotation: number;
  isCircle: boolean;
}

export function Confetti({ active, duration = 3000 }: ConfettiProps) {
  const [visible, setVisible] = useState(false);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: 6 + Math.random() * 6,
      rotation: Math.floor(Math.random() * 360),
      isCircle: Math.random() > 0.5,
    }));
  }, [active]); // regenerate when active changes

  useEffect(() => {
    if (active) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [active, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0px);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) rotate(180deg) translateX(15px);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(360deg) translateX(-10px);
            opacity: 0.9;
          }
          75% {
            transform: translateY(75vh) rotate(540deg) translateX(12px);
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(720deg) translateX(-8px);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: -20,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${1.8 + Math.random() * 1.2}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

// ── SuccessCheck ────────────────────────────────────────────────────────────

interface SuccessCheckProps {
  active: boolean;
  message?: string;
}

export function SuccessCheck({ active, message }: SuccessCheckProps) {
  const [visible, setVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setShowMessage(false);

      const msgTimer = setTimeout(() => setShowMessage(true), 500);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setShowMessage(false);
      }, 2000);

      return () => {
        clearTimeout(msgTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setVisible(false);
      setShowMessage(false);
    }
  }, [active]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <style>{`
        @keyframes success-circle-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes success-check-draw {
          0% {
            stroke-dashoffset: 50;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes success-message-in {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Circle + Checkmark */}
        <div
          className="flex items-center justify-center w-24 h-24 rounded-full bg-green-500 shadow-lg shadow-green-500/30"
          style={{
            animation: "success-circle-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: 50,
                strokeDashoffset: 50,
                animation: "success-check-draw 0.4s ease-out 0.4s forwards",
              }}
            />
          </svg>
        </div>

        {/* Message */}
        {message && showMessage && (
          <p
            className="text-lg font-semibold text-white drop-shadow-md"
            style={{
              animation: "success-message-in 0.3s ease-out forwards",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
