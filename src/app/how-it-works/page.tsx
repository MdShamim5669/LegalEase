"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  CreditCard,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Users,
  ChevronDown,
  Landmark,
  Scale,
  Award,
  Zap,
  PhoneCall,
  Building2,
  UserCheck,
  CalendarCheck,
  BadgeCheck,
  Gavel,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"client" | "lawyer">("client");
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const clientSteps = [
    {
      num: "01",
      stepTag: "Step 01",
      icon: Search,
      badgeIcon: ShieldCheck,
      badge: "Bar Council Verified",
      title: "Find a Verified Advocate",
      subtitle: "Filter by Domain & Court",
      desc: "Browse certified practitioners across Bangladesh. Filter by legal domain (Civil, Criminal, Corporate, Family), Supreme Court or District Bar affiliation, language, and transparent BDT pricing.",
      preview: {
        title: "Sanad #DH-14820",
        tag: "Supreme Court Division",
        detail: "Civil • Criminal • Corporate • Family",
      },
      gradient: "from-sky-500 via-blue-600 to-indigo-600",
      accentBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      iconColor: "text-sky-400 group-hover:text-sky-300",
      iconGlow: "group-hover:shadow-sky-500/20",
      borderHighlight: "border-sky-500 ring-2 ring-sky-400/20 shadow-sky-500/10",
      cta: { label: "Browse Advocates", href: "/lawyers" },
      perks: [
        "100% verified roll numbers",
        "Transparent fixed BDT fees",
        "Authentic client reviews & seniority ratings",
      ],
    },
    {
      num: "02",
      stepTag: "Step 02",
      icon: Calendar,
      badgeIcon: Clock,
      badge: "Real-Time Asia/Dhaka Sync",
      title: "Select a 30-Minute Slot",
      subtitle: "Asia/Dhaka Calendar",
      desc: "Choose an available date and 30-minute consultation window. Real-time slot locking guarantees zero double-bookings and sends automated calendar invites with reminders.",
      preview: {
        title: "Tomorrow, 4:30 PM",
        tag: "30-Min Locked Window",
        detail: "Google & Outlook Calendar sync",
      },
      gradient: "from-indigo-500 via-purple-600 to-pink-500",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      iconColor: "text-indigo-400 group-hover:text-indigo-300",
      iconGlow: "group-hover:shadow-indigo-500/20",
      borderHighlight: "border-indigo-500 ring-2 ring-indigo-400/20 shadow-indigo-500/10",
      cta: { label: "View Available Slots", href: "/lawyers" },
      perks: [
        "30-minute structured sessions",
        "SMS & Email appointment reminders",
        "Zero scheduling clashes or double-bookings",
      ],
    },
    {
      num: "03",
      stepTag: "Step 03",
      icon: CreditCard,
      badgeIcon: Lock,
      badge: "Escrow Hold Guarantee",
      title: "Escrow-Protected Payment",
      subtitle: "bKash, Nagad, Cards & SSLCommerz",
      desc: "Pay upfront safely via SSLCommerz. Your fee is placed into a secure escrow hold for the duration of the appointment. If the advocate does not attend, you receive a full refund.",
      preview: {
        title: "৳3,000 in Escrow Hold",
        tag: "SSLCommerz PCI-DSS",
        detail: "Released only after completed session",
      },
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
      iconColor: "text-emerald-400 group-hover:text-emerald-300",
      iconGlow: "group-hover:shadow-emerald-500/20",
      borderHighlight: "border-emerald-500 ring-2 ring-emerald-400/20 shadow-emerald-500/10",
      cta: { label: "Refund & Escrow Policy", href: "/disclaimer" },
      perks: [
        "Instant payment confirmation",
        "100% money-back if counsel cancels",
        "Strictly transparent—no hidden commission",
      ],
    },
    {
      num: "04",
      stepTag: "Step 04",
      icon: FileText,
      badgeIcon: Award,
      badge: "Statutory BR-20 Deliverable",
      title: "Consult & Written Advice Note",
      subtitle: "Encrypted WebRTC or Chamber",
      desc: "Attend your end-to-end encrypted video/audio room or physical chamber visit. Following the session, the advocate delivers an official written Advice Note detailing your legal remedies.",
      preview: {
        title: "Formal Advice Note (PDF)",
        tag: "Statutory BR-20 Deliverable",
        detail: "Encrypted WebRTC / Physical Chamber",
      },
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200/80",
      iconColor: "text-amber-400 group-hover:text-amber-300",
      iconGlow: "group-hover:shadow-amber-500/20",
      borderHighlight: "border-amber-500 ring-2 ring-amber-400/20 shadow-amber-500/10",
      cta: { label: "Consult With Counsel", href: "/lawyers" },
      perks: [
        "Peer-to-peer WebRTC encryption",
        "Deed & petition screen-sharing",
        "Downloadable formal PDF advice note",
      ],
    },
  ];

  const lawyerSteps = [
    {
      num: "01",
      stepTag: "Step 01",
      icon: BadgeCheck,
      badgeIcon: Landmark,
      badge: "Credential Audit",
      title: "Submit Enrolment Credentials",
      subtitle: "Sanad & Bar Association Details",
      desc: "Register your professional profile with your Bangladesh Bar Council roll number, High Court Division sanad date, and primary chamber jurisdiction.",
      preview: {
        title: "Sanad Verification Form",
        tag: "1972 Bar Order Audit",
        detail: "Supreme Court & District Registry",
      },
      gradient: "from-amber-500 via-yellow-600 to-orange-500",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200/80",
      iconColor: "text-amber-400 group-hover:text-amber-300",
      iconGlow: "group-hover:shadow-amber-500/20",
      borderHighlight: "border-amber-500 ring-2 ring-amber-400/20 shadow-amber-500/10",
      cta: { label: "Apply as Advocate", href: "/register?role=lawyer" },
      perks: [
        "Bangladesh Bar Council compliance",
        "Protection of professional standing",
        "Privacy-first credential verification",
      ],
    },
    {
      num: "02",
      stepTag: "Step 02",
      icon: UserCheck,
      badgeIcon: ShieldCheck,
      badge: "Certified Trust Badge",
      title: "Administrative Verification",
      subtitle: "Digital Chamber Certification",
      desc: "Our compliance team validates your bar roll against official records to award the verified advocate badge and unlock your digital appointment dashboard.",
      preview: {
        title: "Compliance Status: Approved",
        tag: "Verified Sanad Checkmark",
        detail: "Digital Chamber unlocked",
      },
      gradient: "from-sky-500 via-blue-600 to-indigo-600",
      accentBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      iconColor: "text-sky-400 group-hover:text-sky-300",
      iconGlow: "group-hover:shadow-sky-500/20",
      borderHighlight: "border-sky-500 ring-2 ring-sky-400/20 shadow-sky-500/10",
      cta: { label: "Verification Guidelines", href: "/terms" },
      perks: [
        "Official verified advocate checkmark",
        "Elevated client trust and visibility",
        "Access to digital chamber tools",
      ],
    },
    {
      num: "03",
      stepTag: "Step 03",
      icon: CalendarCheck,
      badgeIcon: Clock,
      badge: "Complete Autonomy",
      title: "Set Availability & Fees",
      subtitle: "Tailored Chamber Hours",
      desc: "Set your weekly consultation hours, choose which consultation modes you offer (Video, Voice, Chamber), and configure your custom 30-minute consultation fee.",
      preview: {
        title: "Chamber Hours: Mon-Fri",
        tag: "Custom Fee per 30-min",
        detail: "Video • Audio • Physical Chamber",
      },
      gradient: "from-teal-500 via-emerald-600 to-cyan-600",
      accentBg: "bg-teal-50 text-teal-800 border-teal-200/80",
      iconColor: "text-teal-400 group-hover:text-teal-300",
      iconGlow: "group-hover:shadow-teal-500/20",
      borderHighlight: "border-teal-500 ring-2 ring-teal-400/20 shadow-teal-500/10",
      cta: { label: "Manage Calendar", href: "/dashboard/lawyer/availability" },
      perks: [
        "Set your own consultation rates",
        "Flexible daily appointment caps",
        "Toggle instant video or scheduled chamber",
      ],
    },
    {
      num: "04",
      stepTag: "Step 04",
      icon: Zap,
      badgeIcon: CreditCard,
      badge: "Weekly Payouts",
      title: "Conduct Sessions & Direct Payouts",
      subtitle: "Automated Weekly Settlements",
      desc: "Conduct structured 30-minute consultations, issue the standard digital advice note, and receive automated weekly fee settlements straight to your designated bank account or bKash.",
      preview: {
        title: "Settlement: BEFTN / bKash",
        tag: "Weekly Automatic Payout",
        detail: "Zero fee-chasing • Full history",
      },
      gradient: "from-indigo-500 via-purple-600 to-pink-500",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      iconColor: "text-indigo-400 group-hover:text-indigo-300",
      iconGlow: "group-hover:shadow-indigo-500/20",
      borderHighlight: "border-indigo-500 ring-2 ring-indigo-400/20 shadow-indigo-500/10",
      cta: { label: "View Payout Portal", href: "/dashboard" },
      perks: [
        "Automated direct bank & bKash payouts",
        "Zero payment chasing or delayed fees",
        "Comprehensive consultation archive",
      ],
    },
  ];

  const faqs = [
    {
      q: "What happens if an advocate does not attend the consultation?",
      a: "LegalEase operates an escrow-backed hold system. If an advocate fails to join the consultation within the scheduled grace window, the consultation is marked as cancelled, and 100% of your fee is refunded to your original payment method.",
    },
    {
      q: "Are the video and audio consultation sessions recorded?",
      a: "No. Video and audio calls are transmitted peer-to-peer via encrypted WebRTC. We do not store audiovisual recordings on our servers to ensure absolute attorney-client privilege.",
    },
    {
      q: "What is the Statutory Written Advice Note (BR-20)?",
      a: "In compliance with Bangladesh legal standards and our institutional charter, every consultation concludes with a written advice note from the advocate. It summarizes the facts discussed, relevant statutory provisions, and actionable next steps.",
    },
    {
      q: "Can I consult an advocate for High Court or Supreme Court matters?",
      a: "Yes. LegalEase features advocates enrolled in the High Court Division and Appellate Division of the Supreme Court of Bangladesh, as well as District and Sessions Judge courts across all divisions.",
    },
    {
      q: "How does LegalEase comply with Bangladesh Bar Council regulations?",
      a: "LegalEase strictly complies with the Canons of Professional Conduct (1972). It operates as an administrative appointment facilitation platform with fixed transparent fees, without engaging in unlawful solicitation, advertising, or touting.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sky-600/15 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official LegalEase Consultation Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            How LegalEase Operates
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A transparent, 4-step framework designed to deliver secure, accredited legal counsel across all 64 districts of Bangladesh.
          </p>

          {/* Dual Perspective Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("client")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "client"
                    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>For Clients Seeking Counsel</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("lawyer")}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === "lawyer"
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
      </section>

      {/* 2. STATUTORY DISCLAIMER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <LegalDisclaimerBanner />
      </div>

      {/* 3. STEP-BY-STEP ROADMAP PIPELINE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              {activeTab === "client" ? "Client Workflow" : "Advocate Onboarding Workflow"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeTab === "client"
                ? "4 Steps from Legal Query to Written Advice"
                : "4 Steps to Establish Your Digital Chamber"}
            </h2>
          </div>

          {/* INTERACTIVE DESKTOP STEPPER PIPELINE */}
          <div className="hidden lg:grid grid-cols-4 gap-3 p-2 bg-slate-100/90 rounded-2xl border border-slate-200/80 backdrop-blur-sm max-w-5xl mx-auto mb-6">
            {(activeTab === "client" ? clientSteps : lawyerSteps).map((step, idx) => {
              const isSelected = selectedStep === idx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setSelectedStep(idx)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-900 shadow-md border border-slate-200/80 ring-1 ring-sky-500/20"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-black ${
                      isSelected
                        ? "bg-slate-900 text-sky-400"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {step.num}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {step.stepTag}
                    </span>
                    <span className="block text-xs font-bold truncate">
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 2x2 GRID (TWO CARDS PER ROW, 4 CARDS TOTAL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto">
            {(activeTab === "client" ? clientSteps : lawyerSteps).map((s, index) => {
              const Icon = s.icon;
              const BadgeIcon = s.badgeIcon;
              const isSelected = selectedStep === index;

              return (
                <div
                  key={s.num}
                  onClick={() => setSelectedStep(index)}
                  className={`group relative rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between cursor-pointer border overflow-hidden ${
                    isSelected
                      ? "bg-white ring-2 ring-sky-500/80 shadow-2xl shadow-sky-500/10 border-sky-400 -translate-y-1.5"
                      : "bg-white/95 backdrop-blur-sm border-slate-200/90 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {/* Top Gradient Edge Accent */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${s.gradient} ${
                      isSelected ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                    } transition-opacity duration-300`}
                  />

                  {/* Top Ambient Glow on Hover */}
                  <div
                    className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${s.gradient} rounded-full blur-2xl pointer-events-none transition-opacity duration-300 ${
                      isSelected ? "opacity-15" : "opacity-0 group-hover:opacity-10"
                    }`}
                  />

                  <div>
                    {/* Header: Squircle Icon & Step Number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 border border-slate-700/60 ${s.iconGlow}`}
                          >
                            <Icon className={`w-6 h-6 ${s.iconColor} transition-colors duration-200`} />
                          </div>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-sky-500 border-2 border-white" />
                            </span>
                          )}
                        </div>

                        <div>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${s.accentBg}`}
                          >
                            <BadgeIcon className="w-3 h-3 shrink-0" />
                            <span>{s.badge}</span>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">
                          {s.stepTag}
                        </span>
                        <span className="text-3xl font-black tracking-tighter text-slate-200 group-hover:text-slate-400 transition-colors font-mono">
                          {s.num}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-sky-700 transition leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.subtitle}</p>

                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">{s.desc}</p>

                    {/* Simulated Feature Preview Widget */}
                    <div className="mt-5 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 truncate pr-2">{s.preview.title}</span>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100/80 px-2.5 py-0.5 rounded-full border border-sky-200 shrink-0">
                          {s.preview.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{s.preview.detail}</p>
                    </div>

                    {/* Perks Checklist in 2 Columns on wider card */}
                    <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {s.perks.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Action CTA */}
                  <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
                    <Link
                      href={s.cta.href}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 group/btn transition"
                    >
                      <span>{s.cta.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      0{index + 1} / 04
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. THREE CONSULTATION CHANNELS OVERVIEW */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
              Engagement Channels
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Choose the Format That Fits Your Matter
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Every appointment is protected by client confidentiality and conducted strictly on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Video Consultation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Encrypted face-to-face WebRTC session. Ideal for document screen sharing, contract analysis, and family matters.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Audio Consultation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Low-bandwidth direct browser call. Ideal for urgent legal questions, police station guidance, and quick checks.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Physical Chamber Visit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In-person meeting at advocate’s registered chamber in Supreme Court or District Bar. Ideal for original deed review.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FREQUENTLY ASKED QUESTIONS */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">
              Clear answers on confidentiality, escrow payments, and Bar Council compliance.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-sky-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. CALL TO ACTION SECTION */}
        <div className="text-center bg-gradient-to-r from-sky-600 to-blue-700 rounded-3xl p-10 text-white shadow-xl space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Consult a Verified Advocate?</h3>
          <p className="text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            Book an accredited 30-minute consultation today or create a free client account to manage your appointments.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/lawyers"
              className="px-6 py-3 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-sky-50 transition shadow-md flex items-center gap-2"
            >
              <span>Explore Verified Advocates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?role=LAWYER"
              className="px-6 py-3 bg-sky-900/40 text-white border border-sky-300/40 rounded-xl text-xs font-bold hover:bg-sky-900/60 transition flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Join as an Advocate</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
