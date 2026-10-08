"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface IAuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "CLIENT" | "LAWYER" | "ADMIN" | "SUPER_ADMIN";
}

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IAuthUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (token) {
        setIsAuthenticated(true);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {}
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    setIsAuthenticated(false);
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:bg-slate-800 transition">
            <Scale className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              Legal<span className="text-sky-600">Ease</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                BD
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Talk to a verified lawyer, from anywhere
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/lawyers" className="hover:text-sky-600 transition">
            Find Advocates
          </Link>
          <Link href="/practice-areas" className="hover:text-sky-600 transition">
            Practice Areas
          </Link>
          <Link href="/how-it-works" className="hover:text-sky-600 transition">
            How It Works
          </Link>
          <Link href="/about" className="hover:text-sky-600 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-sky-600 transition">
            Contact
          </Link>
        </div>

        {/* Action Buttons: Public vs Authenticated */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-bold px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
                Go to Dashboard
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-sky-400 text-xs font-bold flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user?.name || "Member"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">
                    {user?.role || "CLIENT"}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/lawyers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            Find Advocates
          </Link>
          <Link
            href="/practice-areas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            Practice Areas
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-sky-600"
          >
            Contact
          </Link>

          {/* Conditional Authenticated Section in Mobile */}
          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 py-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-sky-400 text-xs font-bold flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{user?.name || "Member"}</div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">{user?.role || "CLIENT"}</div>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-sky-600 hover:text-sky-700"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-xs font-semibold text-rose-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
