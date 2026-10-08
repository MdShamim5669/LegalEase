import React from "react";
import Link from "next/link";
import { Scale, ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/MdShamim5669",
      handle: "@MdShamim5669",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      ),
      hoverClass: "hover:text-white hover:border-slate-600 hover:bg-slate-850",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/MDSAMIMxq",
      handle: "@MDSAMIMxq",
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverClass: "hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/10",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/md-samim5669/",
      handle: "md-samim5669",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      hoverClass: "hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/sh4mim.py/",
      handle: "@sh4mim.py",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      hoverClass: "hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10",
    },
  ];

  return (
    <footer className="mt-auto bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Notice */}
          <div className="space-y-3.5">
            <Link href="/" className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              Legal<span className="text-amber-400">Ease</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md font-mono">
                BD
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering Bangladesh with transparent, accessible, and verified online legal consultations.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bangladeshi Bar Council Compliant</span>
            </div>
          </div>

          {/* Col 2: Legal Consultations */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Legal Consultations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/lawyers" className="hover:text-white transition">
                  Find Advocates
                </Link>
              </li>
              <li>
                <Link href="/practice-areas" className="hover:text-white transition">
                  Practice Areas Directory
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  How Consultation Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Client & Lawyer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform & Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Platform & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About LegalEase
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition">
                  Statutory Disclaimer (BR-20)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy & Confidentiality
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Help & Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Links (Line-by-Line) */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Connect With Us
            </h4>
            <ul className="space-y-2.5">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-2.5 text-xs text-slate-300 transition py-1 px-2 -ml-2 rounded-lg border border-transparent ${social.hoverClass}`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-current">
                      {social.icon}
                    </span>
                    <span className="font-medium">{social.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 LegalEase Bangladesh. Crafted with precision for Bangladesh legal citizens.
          </div>

          <div className="text-slate-400 text-[11px]">
            Notice: Preliminary advice only; not formal court representation.
          </div>
        </div>
      </div>
    </footer>
  );
}
