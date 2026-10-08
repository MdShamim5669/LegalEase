"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Scale,
  LayoutDashboard,
  Calendar,
  Settings,
  Users,
  ShieldCheck,
  Star,
  Clock,
  LogOut,
  FolderLock,
  Layers,
  FileText,
  UserCheck,
  Menu,
  X,
} from "lucide-react";

function DashboardLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Rahim Ahmed");

  // Default active role view for demo navigation (swappable)
  const [activeRole, setActiveRole] = useState<"CLIENT" | "LAWYER" | "ADMIN">("CLIENT");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login?redirect=" + encodeURIComponent(pathname));
        return;
      }
      setIsCheckingAuth(false);

      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) {
            if (parsed.role === "LAWYER") setActiveRole("LAWYER");
            else if (parsed.role === "ADMIN" || parsed.role === "SUPER_ADMIN") setActiveRole("ADMIN");
            else setActiveRole("CLIENT");
          }
        } catch {}
      }
    }
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  const clientLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Consultations", href: "/dashboard/consultations", icon: Calendar },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const lawyerLinks = [
    { label: "Consultation Queue", href: "/dashboard", icon: LayoutDashboard },
    { label: "Availability Slots", href: "/dashboard/lawyer/availability", icon: Clock },
    { label: "Client Consultations", href: "/dashboard/consultations", icon: Calendar },
    { label: "My Reviews", href: "/dashboard/lawyer/reviews", icon: Star },
    { label: "Profile & Chamber", href: "/dashboard/settings", icon: Settings },
  ];

  const adminLinks = [
    { label: "Platform Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Lawyer Verifications", href: "/dashboard/admin/lawyers", icon: ShieldCheck },
    { label: "Practice Areas", href: "/dashboard/admin/practice-areas", icon: Layers },
    { label: "Platform Schedules", href: "/dashboard/admin/schedules", icon: Clock },
    { label: "Review Moderation", href: "/dashboard/admin/reviews", icon: Star },
    { label: "User Management", href: "/dashboard/admin/users", icon: Users },
    { label: "Admin Officers", href: "/dashboard/admin/admins", icon: UserCheck },
    { label: "Audit Logs", href: "/dashboard/admin/audit-log", icon: FolderLock },
  ];

  const navLinks =
    activeRole === "CLIENT" ? clientLinks : activeRole === "LAWYER" ? lawyerLinks : adminLinks;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-slate-500">
        <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200">
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Scale className="w-5 h-5 text-sky-400" />
          </div>
          <Link href="/" className="font-bold text-slate-900 text-lg">
            Legal<span className="text-sky-600">Ease</span>
          </Link>
        </div>

        {/* Role Switcher (Preview Helper for PRD testing) */}
        <div className="p-4 border-b border-slate-100">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Portal View
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            {(["CLIENT", "LAWYER", "ADMIN"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`py-1 text-[10px] font-bold rounded-lg transition ${
                  activeRole === role
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {role === "CLIENT" ? "Client" : role === "LAWYER" ? "Lawyer" : "Admin"}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-sky-400 text-xs font-bold flex items-center justify-center">
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 max-w-[120px] truncate">{userName}</div>
              <div className="text-[10px] text-slate-500 font-medium">{activeRole}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-xs font-semibold text-slate-500">
              LegalEase Dashboard <span className="text-slate-300">/</span>{" "}
              <span className="text-slate-900 capitalize">{pathname.split("/").pop() || "Overview"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              Public Site
            </Link>
            <Link
              href="/lawyers"
              className="text-xs font-semibold bg-slate-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
            >
              Find Lawyers
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-500 font-medium">
          Loading dashboard...
        </div>
      }
    >
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}
