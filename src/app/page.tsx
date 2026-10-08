"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Scale,
  ShieldCheck,
  Calendar,
  CalendarCheck,
  MessageSquare,
  Award,
  Search,
  ExternalLink,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Video,
  Building2,
  ArrowRight,
  RefreshCw,
  Star,
  MapPin,
  HelpCircle,
  Briefcase,
  Lock,
  FileText,
  Check,
  ChevronRight,
  Shield,
  Zap,
  UserCheck,
  Users,
  CreditCard,
  BadgeCheck,
  Gavel,
  Landmark,
  FileCheck2,
  Headphones,
} from "lucide-react";
import { apiClient, SERVER_BASE_URL } from "@/lib/api-client";
import { formatBDT, getLawyerPhoto } from "@/lib/utils";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPracticeAreaId, setSelectedPracticeAreaId] = useState<string>("ALL");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [activeHowItWorksTab, setActiveHowItWorksTab] = useState<"client" | "lawyer">("client");

  // 1. Live Backend Health Status Check
  const {
    data: healthData,
    isLoading: isHealthLoading,
    isError: isHealthError,
    refetch: refetchHealth,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => apiClient<{ status: string; uptime: number; timestamp: string }>("/health"),
    refetchInterval: 30000,
  });

  // 2. Dynamic Practice Areas from Backend API
  const { data: practiceAreasRes } = useQuery({
    queryKey: ["practice-areas"],
    queryFn: () => apiClient<any[]>("/practice-areas"),
  });
  const practiceAreas = practiceAreasRes?.data || [];

  // 3. Featured / Top Lawyers from Backend API
  const {
    data: lawyersResponse,
    isLoading: isLawyersLoading,
  } = useQuery({
    queryKey: ["homepage-lawyers", selectedPracticeAreaId],
    queryFn: () => {
      if (selectedPracticeAreaId && selectedPracticeAreaId !== "ALL") {
        return apiClient<any[]>(`/lawyers?practiceAreaId=${selectedPracticeAreaId}&limit=6`);
      }
      return apiClient<any[]>("/lawyers/top");
    },
  });

  const lawyers = lawyersResponse?.data || [];

  // 4. Total Verified Lawyers in Directory
  const { data: totalLawyersRes } = useQuery({
    queryKey: ["total-lawyers-count"],
    queryFn: () => apiClient<any[]>("/lawyers?limit=1"),
  });
  const totalDirectoryCount = totalLawyersRes?.meta?.total || 30;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("searchTerm", searchQuery.trim());
    if (selectedPracticeAreaId && selectedPracticeAreaId !== "ALL") {
      params.set("practiceAreaId", selectedPracticeAreaId);
    }
    if (selectedDivision) params.set("city", selectedDivision);

    const qs = params.toString();
    router.push(qs ? `/lawyers?${qs}` : "/lawyers");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. TOP ANNOUNCEMENT & SERVER STATUS BAR */}
      <header className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Live Backend
            </span>
            <span className="hidden md:inline text-slate-400">
              API Host: <code className="text-slate-200 font-mono">{SERVER_BASE_URL}</code>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Server:{" "}
                {isHealthLoading ? (
                  <span className="text-amber-400">Pinging...</span>
                ) : isHealthError ? (
                  <span className="text-rose-400">Offline / Error</span>
                ) : (
                  <span className="text-emerald-400 font-medium">Operational</span>
                )}
              </span>
              <button
                onClick={() => refetchHealth()}
                title="Refresh Status"
                className="hover:text-white p-0.5 rounded transition"
              >
                <RefreshCw className="w-3 h-3 text-slate-400 hover:text-white" />
              </button>
            </div>
            <a
              href={`${SERVER_BASE_URL}/api/v1/health`}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              Health Check <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. MAIN NAVBAR */}
      <Navbar />

      {/* 3. ULTRA-PREMIUM CINEMATIC HERO SECTION (PRD Wireframe 2.3) */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center pt-16 pb-20 border-b border-slate-800">
        {/* Background Image with Dark Vignette & Atmospheric Lighting */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transform duration-1000 ease-out"
          style={{ backgroundImage: "url('/images/hero-legal-bg.jpg')" }}
        />
        {/* Deep layered gradients for luxury contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600/15 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-500/5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bangladesh Bar Council Verified Legal Consultation Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Talk to a Verified Lawyer, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-200 to-amber-200">
                from Anywhere in Bangladesh.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Confidential video, audio, and chamber appointments with certified advocates. Transparent BDT pricing, instant scheduling, and post-consultation written advice notes.
            </p>

            {/* Advanced Multi-Parameter Search Console */}
            <div className="pt-4 max-w-4xl mx-auto w-full">
              <form
                onSubmit={handleSearchSubmit}
                className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 rounded-2xl shadow-2xl shadow-black/50 flex flex-col md:flex-row items-center gap-2 divide-y md:divide-y-0 md:divide-x divide-white/15 text-left"
              >
                {/* Search Term Input */}
                <div className="flex items-center gap-3 px-3 py-2 w-full md:w-2/5">
                  <Search className="w-5 h-5 text-sky-400 shrink-0" />
                  <div className="w-full">
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Legal Matter / Lawyer</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. Land partition, Divorce, Trademark..."
                      className="w-full bg-transparent text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Practice Area Selector */}
                <div className="flex items-center gap-3 px-3 py-2 w-full md:w-2/5">
                  <Briefcase className="w-5 h-5 text-teal-400 shrink-0" />
                  <div className="w-full">
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Practice Domain</label>
                    <select
                      value={selectedPracticeAreaId}
                      onChange={(e) => setSelectedPracticeAreaId(e.target.value)}
                      className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      <option value="ALL">All Legal Specializations</option>
                      {practiceAreas.map((pa: any) => (
                        <option key={pa.id} value={pa.id}>
                          {pa.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Region / City Selector */}
                <div className="flex items-center gap-3 px-3 py-2 w-full md:w-1/5">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="w-full">
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">Chamber Region</label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
                    >
                      <option value="">Any District</option>
                      <option value="Dhaka">Dhaka (Supreme Court)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="w-full md:w-auto p-1">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 group cursor-pointer shrink-0"
                  >
                    <span>Find Counsel</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              </form>
            </div>

            {/* Popular Domain Filter Pills */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">Popular Domains:</span>
              {practiceAreas.slice(0, 6).map((pa: any) => (
                <Link
                  key={pa.id}
                  href={`/lawyers?practiceAreaId=${pa.id}`}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-medium text-slate-200 hover:text-white transition backdrop-blur-md"
                >
                  {pa.title}
                </Link>
              ))}
            </div>

            {/* Trust Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto border-t border-white/15 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Bar Council Verified</div>
                  <div className="text-[11px] text-slate-400">Enrolled High Court & Bar</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">30-Min Real Slots</div>
                  <div className="text-[11px] text-slate-400">Instant Asia/Dhaka booking</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/30 text-teal-400 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Encrypted Sessions</div>
                  <div className="text-[11px] text-slate-400">Private video, audio & visit</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Fixed BDT Fees</div>
                  <div className="text-[11px] text-slate-400">Transparent upfront pricing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATUTORY BR-20 DISCLAIMER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <LegalDisclaimerBanner />
      </div>

      {/* 5. CONSULTATION MODES (PRD SECTION 1.3) */}
      <section className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-50 text-sky-700 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Tailored Consultation Channels
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three Flexible Ways to Consult
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every consultation is strictly confidential, conducted within a structured 30-minute window, and concludes with a formal legal advice note.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mode 1: Video Consultation */}
            <div className="group relative bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-200/90 hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Most Popular
                </span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition">
                  Video Consultation
                </h3>
                <p className="text-xs font-semibold text-sky-600 mt-1">
                  Starting from ৳800 · 30-Min Session
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Encrypted face-to-face consultation via high-definition WebRTC with live document and deed screen-sharing capabilities.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Peer-to-peer WebRTC encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Screen-sharing for title deeds & petitions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Digital written Advice Note delivered post-call</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/lawyers?consultationType=VIDEO"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 group-hover:bg-sky-600 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Book Video Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* Mode 2: Audio Consultation */}
            <div className="group relative bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-200/90 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Zap className="w-3 h-3 text-emerald-600" /> Low Bandwidth
                </span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <PhoneCall className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  Audio Consultation
                </h3>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Starting from ৳600 · 30-Min Session
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Low-bandwidth voice calling optimized for mobile networks across all 64 districts in Bangladesh.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Works smoothly on 3G/4G connections</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct browser dial-in (no app download)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prompt preliminary legal advice note</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/lawyers?consultationType=AUDIO"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Book Voice Consultation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

            {/* Mode 3: Physical Chamber Visit */}
            <div className="group relative bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-200/90 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  <Landmark className="w-3 h-3 text-purple-600" /> Chamber Visit
                </span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition">
                  Physical Chamber Visit
                </h3>
                <p className="text-xs font-semibold text-purple-600 mt-1">
                  Starting from ৳1,500 · In-Chamber Meeting
                </p>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Scheduled in-person consultation at the advocate’s registered chamber in Supreme Court or District Bar associations.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-200/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Original case dockets & deeds inspection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>In-person strategy & representation prep</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official chamber receipt & consultation memo</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/lawyers?consultationType=CHAMBER"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 group-hover:bg-purple-600 text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Book Chamber Appointment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DYNAMIC PRACTICE AREAS SHOWCASE & FILTER */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-200/70 text-slate-700 border border-slate-300">
                <Scale className="w-3.5 h-3.5 text-slate-700" />
                Specialized Jurisdictions
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Explore Legal Practice Areas
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Filter verified advocates by their primary areas of court enrollment, litigation specialization, and advisory expertise.
              </p>
            </div>
            <Link
              href="/practice-areas"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 group shrink-0"
            >
              <span>View All Practice Areas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Interactive Specialty Filter Pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none">
            <button
              onClick={() => setSelectedPracticeAreaId("ALL")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                selectedPracticeAreaId === "ALL"
                  ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-[1.02]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
              }`}
            >
              All Practice Areas
            </button>
            {practiceAreas.map((area: any) => (
              <button
                key={area.id}
                onClick={() => setSelectedPracticeAreaId(area.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  selectedPracticeAreaId === area.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50"
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TOP-RATED VERIFIED LAWYERS SHOWCASE */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                Senior Advocate Roster
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Top-Rated Verified Advocates
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Audited against Bangladesh Bar Council roll numbers and certified for high-confidentiality counsel.
              </p>
            </div>
            <Link
              href="/lawyers"
              className="text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-5 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <span>Explore Full Directory ({totalDirectoryCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLawyersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-7 animate-pulse space-y-4"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-10 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : lawyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lawyers.slice(0, 6).map((lawyer: any) => {
                const name = lawyer.name || lawyer.user?.name || "Advocate";
                const experience = lawyer.experience || lawyer.experienceYears || 0;
                const fee = lawyer.consultationFee || 1000;
                const rating = lawyer.averageRating || 4.8;
                const reviewCount = lawyer.reviewCount || 0;
                const barCouncil = lawyer.barCouncilNo || "DH-Verified";
                const photoUrl = getLawyerPhoto(lawyer);
                const chamber =
                  lawyer.chamberAddress || "Supreme Court of Bangladesh / Dhaka Bar";
                const practiceList = (lawyer.practiceAreas || [])
                  .map((pa: any) => pa.practiceArea?.title || pa.title)
                  .filter(Boolean);

                return (
                  <div
                    key={lawyer.id}
                    className="group bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Top Accent Gradient Border on Hover */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-teal-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Card Top Meta Ribbon */}
                      <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 text-[10px]">
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          <Scale className="w-3 h-3 text-slate-600" />
                          <span>{barCouncil}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Available 30-Min Slot</span>
                        </span>
                      </div>

                      {/* Main Profile Info Row */}
                      <div className="flex items-start gap-4">
                        {/* Advocate Photo with Status Indicator */}
                        <div className="relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={name}
                            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-slate-100 group-hover:ring-sky-400/50 transition duration-300 bg-slate-100"
                            loading="lazy"
                          />
                          <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs"
                            title="Verified Enrolled Advocate"
                          >
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>

                        {/* Name & Credentials */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-sky-700 transition flex items-center gap-1.5 leading-snug truncate">
                            <span className="truncate">{name}</span>
                            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 fill-sky-100" />
                          </h3>

                          {/* Ratings & Seniority */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {Number(rating).toFixed(1)}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              ({reviewCount} reviews)
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-600 font-semibold">
                              {experience} yrs exp
                            </span>
                          </div>

                          {/* Fee Pill */}
                          <div className="mt-2.5">
                            <span className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 text-sky-900 font-black text-xs shadow-2xs">
                              <span className="text-sm font-black text-sky-800">{formatBDT(fee)}</span>
                              <span className="text-[10px] font-normal text-slate-500">/ 30 min</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chamber Location */}
                      <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{chamber}</span>
                      </p>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {lawyer.bio ||
                          "Enrolled advocate handling preliminary consultations, case evaluations, and advice."}
                      </p>

                      {/* Specializations Tags */}
                      {practiceList.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {practiceList.slice(0, 3).map((pTitle: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100/90 text-slate-700 px-2.5 py-1 rounded-lg font-medium border border-slate-200/70"
                            >
                              {pTitle}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer / Booking Action */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>30-min slot</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/lawyers/${lawyer.id}`}
                          className="text-xs font-semibold px-3 py-2 text-slate-600 hover:text-slate-900 transition"
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/lawyers/${lawyer.id}`}
                          className="text-xs font-bold px-4 py-2.5 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5"
                        >
                          <span>Book Slot</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
              <Scale className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Advocates in this Category</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No lawyers found matching the current specialization filter.
              </p>
              <button
                onClick={() => setSelectedPracticeAreaId("ALL")}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Reset to All Practice Areas
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. ABOUT LEGALEASE & INSTITUTIONAL MISSION SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-100/70 text-sky-800 border border-sky-200">
                <Scale className="w-3.5 h-3.5 text-sky-600" />
                About LegalEase Bangladesh
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Democratizing Access to Accredited Legal Counsel Nationwide
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                In Bangladesh, millions of citizens and businesses face uncertainty when encountering property disputes, marital law, or commercial contracts due to lack of transparent fees and unverified practitioner rolls.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>LegalEase</strong> bridges this gap by offering a transparent, confidential appointment platform. Every advocate on our network is individually verified against official Bangladesh Bar Council rolls, ensuring legitimate legal guidance with zero touting or unethical solicitation.
              </p>

              {/* 4 Core Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">100% Bar Roll Audited</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Practicing High Court and District Bar advocates with verifiable credentials.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Escrow Hold Protection</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Transparent BDT fees held safely in escrow until your session concludes.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Guaranteed 30-Min Slots</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Structured video, audio, or chamber consultations that start on schedule.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Statutory BR-20 Advice Note</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Downloadable written legal roadmap delivered after every consultation.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <span>Explore Our Full Mission & Compliance Charter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8 sm:p-10 rounded-3xl text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-xs">
                <Landmark className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-md border border-amber-800">
                  Ethical Legal Tech
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Compliance With Bangladesh Bar Council Order 1972
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                LegalEase does not act as an advocate broker, litigate claims, or collect success commissions. We operate as an institutional appointment booking logistics platform, strictly preserving the independence and honor of the legal profession in Bangladesh.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No client bidding or auctioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero unauthorized court advertising</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fixed upfront BDT consultation fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ULTRA-PREMIUM INTERACTIVE "HOW IT WORKS" ROADMAP (PRD 2.3) */}
      <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-950/80 text-sky-400 border border-sky-800">
              <HelpCircle className="w-3.5 h-3.5" />
              Streamlined 4-Step Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              How LegalEase Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Transparent, secure, and compliant legal consultation with enrolled Bangladesh Bar Council advocates.
            </p>

            {/* Dual Pipeline Toggle Switcher */}
            <div className="pt-4 flex items-center justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveHowItWorksTab("client")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    activeHowItWorksTab === "client"
                      ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>For Clients Seeking Counsel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHowItWorksTab("lawyer")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    activeHowItWorksTab === "lawyer"
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>For Enrolled Advocates</span>
                </button>
              </div>
            </div>
          </div>

          {activeHowItWorksTab === "client" ? (
            /* CLIENT JOURNEY PIPELINE */
            <div className="relative">
              {/* Desktop Connecting Stepper Line */}
              <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-sky-500 via-teal-400 via-amber-400 to-indigo-400 z-0 opacity-40" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition duration-300">
                        <Search className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-sky-500/30 transition">
                        01
                      </span>
                    </div>

                    {/* Micro Preview Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                        <ShieldCheck className="w-3 h-3 text-sky-400" /> Bar Verified Advocates
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                      Find Verified Counsel
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Filter practitioners by legal domain (Civil, Criminal, Corporate, Family), High Court enrollment seniority, and authentic client reviews.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Roll number verified profiles</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition duration-300">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-teal-500/30 transition">
                        02
                      </span>
                    </div>

                    {/* Micro Preview Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                        <Clock className="w-3 h-3 text-teal-400" /> Real-Time 30-Min Slot
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                      Select Available Slot
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Choose an exact 30-minute calendar appointment in Asia/Dhaka local time. Instant slot reservations prevent double-booking conflicts.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Instant calendar reservation</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition duration-300">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-amber-500/30 transition">
                        03
                      </span>
                    </div>

                    {/* Micro Preview Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        <Lock className="w-3 h-3 text-amber-400" /> Escrow 30-Min Hold
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                      Pay Securely in BDT
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Pay transparent consultation fees via SSLCommerz (bKash, Nagad, Cards). Fees are safely held in escrow until the session completes.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>100% money-back escrow guarantee</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition duration-300">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-indigo-500/30 transition">
                        04
                      </span>
                    </div>

                    {/* Micro Preview Badge */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        <FileText className="w-3 h-3 text-indigo-400" /> Statutory BR-20 Note
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      Consult & Receive Advice
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Attend the private video, audio, or chamber session. Receive a structured written Advice Note summarizing remedies and legal recommendations.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Downloadable formal PDF advice note</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LAWYER ONBOARDING PIPELINE */
            <div className="relative">
              <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 z-0 opacity-40" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition duration-300">
                        <BadgeCheck className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-amber-500/30 transition">
                        01
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 mb-3">
                      Enrolment Credentials
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                      Submit Bar Credentials
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Provide your Bangladesh Bar Council roll number, high court sanad details, and practicing chamber location.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Strict compliance with Bar rules</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition duration-300">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-sky-500/30 transition">
                        02
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800 mb-3">
                      Administrative Audit
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">
                      Verification Approval
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Our administrative team reviews your credentials against bar rolls to certify your digital chamber status.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Verified advocate trust badge granted</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-slate-950 transition duration-300">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-teal-500/30 transition">
                        03
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 mb-3">
                      Flexible Scheduling
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                      Set Schedule & Fee
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Set your 30-minute consultation availability, choose accepted modes (Video, Voice, Chamber), and configure your BDT fee.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Full control over your daily schedule</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition duration-300">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-3xl font-black text-slate-800 group-hover:text-emerald-500/30 transition">
                        04
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 mb-3">
                      Direct Payouts
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                      Consult & Earn Directly
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Provide structured counsel, issue digital advice notes, and receive automated weekly fee payouts directly to your bank or bKash.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Zero hassle automated bank settlements</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Institutional Integrity Note */}
          <div className="mt-14 pt-8 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 max-w-3xl mx-auto flex items-center justify-center gap-2">
              <Scale className="w-4 h-4 text-amber-500/70 shrink-0" />
              <span>
                Operating in strict adherence to the Bangladesh Legal Practitioners and Bar Council Order (1972) and Canons of Professional Conduct. LegalEase facilitates structured preliminary appointments and does not engage in advertising, unlawful touting, or solicitation.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* 9. SECURITY, PRIVACY & COMPLIANCE PILLARS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Legal-Grade Infrastructure
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built on Complete Trust & Legal Compliance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We uphold the highest ethical and technical standards to protect attorney-client confidentiality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Bar Council Verification</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every advocate is verified by sanad, roll number, and practicing bar association before accepting clients.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">End-to-End Encryption</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                WebRTC audio/video consultations are peer-to-peer encrypted. No call content is stored on cloud servers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">30-Min Escrow Hold</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Consultation fees are held safely in escrow until the session is successfully conducted. Full refund on cancellations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Statutory Written Note</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Clients receive a structured, formal Advice Note (BR-20) delivered to their dashboard for legal record-keeping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. DUAL-AUDIENCE EXECUTIVE CALL TO ACTION BANNER */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Clients CTA */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-sky-500/30 backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  <Sparkles className="w-3.5 h-3.5" /> For Clients & Businesses
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Facing an Urgent Legal Dispute?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Do not navigate complex court filings or contract disagreements alone. Connect with an enrolled advocate for a 30-minute consultation today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/lawyers"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25"
                >
                  <span>Browse Verified Advocates</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center"
                >
                  <span>Create Free Account</span>
                </Link>
              </div>
            </div>

            {/* For Advocates CTA */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-amber-500/30 backdrop-blur-xl flex flex-col justify-between space-y-6 shadow-2xl">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Gavel className="w-3.5 h-3.5" /> For Practicing Advocates
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Expand Your Digital Chamber Presence
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Join a trusted legal network. Streamline preliminary appointments, protect your consultation time, and receive automated weekly payouts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register?role=LAWYER"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                >
                  <span>Join as an Advocate</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition flex items-center justify-center"
                >
                  <span>Advocate Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <Footer />
    </div>
  );
}
