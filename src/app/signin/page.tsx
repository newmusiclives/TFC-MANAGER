"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { apiPost } from "@/lib/api-client";

export default function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [artistName, setArtistName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const res = await apiPost<{ token?: string }>("/api/users/register", {
          email,
          password,
          name: artistName,
        });
        if (res.token) {
          document.cookie = `token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
        window.location.href = "/onboarding";
        return;
      } else {
        // Sign in flow
        const res = await apiPost<{ token?: string }>("/api/users/login", {
          email,
          password,
        });
        if (res.token) {
          document.cookie = `token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
        window.location.href = "/dashboard";
        return;
      }
    } catch (err: unknown) {
      // API failed - fall back to demo behavior so site works without a database
      const apiErr = err as { status?: number; message?: string };
      if (apiErr.status === 401 || apiErr.status === 403 || apiErr.status === 400) {
        // Real auth error from a working API - show the message
        setError(apiErr.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // API not available (network error, DB down, etc.) - fall back to hardcoded demo behavior
      if (
        email === "demo@truefansmanager.com" &&
        password === "demo123"
      ) {
        window.location.href = "/dashboard";
        return;
      }
      if (isSignUp) {
        window.location.href = "/onboarding";
        return;
      }
      if (email && password) {
        window.location.href = "/dashboard";
        return;
      }
      setError("Please enter your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@truefansmanager.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 text-white flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          <span className="font-bold text-xl tracking-tight">
            TrueFans<span className="text-[var(--primary)]"> Manager</span>
          </span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Your AI-powered
            <br />
            <span className="text-[var(--primary)]">artist manager</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-md">
            Join thousands of independent artists using professional management
            tools to grow their career.
          </p>

          {/* Demo credentials on left panel */}
          <div className="mt-8 bg-gray-900 rounded-xl p-5 border border-gray-800 max-w-sm">
            <h3 className="text-sm font-bold text-white mb-3">Demo Access</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <div>
                  <div className="text-xs text-gray-400">Artist Demo</div>
                  <div className="text-sm font-medium">demo@truefansmanager.com</div>
                  <div className="text-xs text-gray-500">Password: demo123</div>
                </div>
                <span className="text-xs bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded-full font-bold">
                  USER
                </span>
              </div>
              <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                <div>
                  <div className="text-xs text-gray-400">Admin Panel</div>
                  <div className="text-sm font-medium">admin@truefansmanager.com</div>
                  <div className="text-xs text-gray-500">Password: admin123</div>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold">
                  ADMIN
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} TrueFans MANAGER
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                TrueFans<span className="text-[var(--primary)]"> Manager</span>
              </span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-gray-500 mb-6">
            {isSignUp
              ? "Start your journey to music success"
              : "Sign in to access your dashboard"}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">
                  Artist / Band name
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Your artist name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-colors"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Quick demo fill button */}
            {!isSignUp && (
              <button
                type="button"
                onClick={fillDemo}
                className="w-full mb-4 text-sm text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 font-medium py-2.5 rounded-xl transition-colors border border-[var(--primary)]/20"
              >
                Fill demo credentials (demo@truefansmanager.com)
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-3.5 rounded-xl text-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          {/* TrueFans CONNECT */}
          <a
            href="https://truefansconnect.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl py-3.5 text-sm font-semibold transition-all mb-3"
          >
            <span className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center text-xs font-bold">
              TF
            </span>
            Sign in with TrueFans CONNECT
          </a>
          <p className="text-center text-xs text-gray-400 mb-4">
            TrueFans CONNECT members get <strong className="text-gray-600">Pro plan free</strong>
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-sm font-medium transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up for free"}
              </button>
            </p>

            {/* Admin login link */}
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Shield size={14} />
              Admin login
            </Link>
          </div>

          {/* Mobile demo credentials */}
          <div className="lg:hidden mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-sm font-bold mb-2">Demo Credentials</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Artist:</strong> demo@truefansmanager.com / demo123
              </p>
              <p>
                <strong>Admin:</strong> admin@truefansmanager.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
