import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                TrueFans<span className="text-[var(--primary)]"> Manager</span>
              </span>
            </Link>
            <p className="text-sm max-w-sm leading-relaxed">
              The No.1 AI-powered Artist Manager. Helping independent artists
              succeed with professional tools and strategies.
            </p>
            <div className="mt-4">
              <a
                href="https://truefansconnect.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                <span className="w-5 h-5 bg-amber-500/20 rounded flex items-center justify-center text-[10px] font-bold">
                  TF
                </span>
                TrueFans CONNECT
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contact@truefansmanager.com"
                  className="hover:text-white transition-colors"
                >
                  contact@truefansmanager.com
                </a>
              </li>
              <li className="flex items-center gap-4 pt-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
                <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Discord
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} TrueFans MANAGER. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-sm hover:text-white transition-colors">
              Help
            </Link>
            <Link href="/blog" className="text-sm hover:text-white transition-colors">
              Blog
            </Link>
            <Link
              href="/signin"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
