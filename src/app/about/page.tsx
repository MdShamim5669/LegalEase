"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Users,
  Globe,
  Award,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  Building2,
  FileText,
  Gavel,
  Landmark,
  ArrowRight,
  HeartHandshake,
  Shield,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

export default function AboutPage() {
  const metrics = [
    { label: "Bar Council Verified", value: "100%", sub: "Audited against official rolls" },
    { label: "Consultation Model", value: "30-Min", sub: "Structured & on-time sessions" },
    { label: "Jurisdictional Coverage", value: "64", sub: "Districts served nationwide" },
    { label: "Statutory Adherence", value: "1972", sub: "Bar Council Order & Canons" },
  ];

  const pillars = [
    {
      icon: Scale,
      title: "Ethical Appointment Logistics",
      desc: "Operating strictly as an appointment coordination platform in full accordance with the Canons of Professional Conduct (1972). We strictly prohibit unlawful solicitation, aggressive marketing, or broker fees.",
      color: "sky",
    },
    {
      icon: ShieldCheck,
      title: "Rigorous Sanad Verification",
      desc: "Every practitioner undergoes administrative validation against Bangladesh Bar Council rolls, High Court Division enrollment records, and practicing District Bar associations prior to directory listing.",
      color: "emerald",
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Confidentiality",
      desc: "Client-advocate privileged consultations are conducted through end-to-end encrypted WebRTC streams. No video or audio streams are permanently stored on platform servers.",
      color: "amber",
    },
    {
      icon: FileText,
      title: "Written Advice Note Delivery",
      desc: "Promoting structured legal assistance, every consultation is concluded with a downloadable formal Advice Note (BR-20) outlining legal rights, remedies, and next judicial steps.",
      color: "indigo",
    },
  ];

  const leadership = [
    {
      name: "Barrister Sara Hossain",
      role: "Honorary Legal Advisor",
      credentials: "Barrister-at-Law (Lincoln's Inn) · Senior Advocate",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      bio: "Over 18 years of pioneering public interest litigation and human rights advocacy in the Supreme Court of Bangladesh.",
    },
    {
      name: "Advocate Rafiqul Islam",
      role: "Compliance & Ethics Director",
      credentials: "Supreme Court Bar Association · 14+ Years Seniority",
      photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
      bio: "Senior appellate litigator dedicated to upholding professional legal ethics and institutional digital integrity in Bangladesh.",
    },
    {
      name: "Advocate Farhana Yasmin",
      role: "Regional Chambers Coordinator",
      credentials: "Chattogram Bar Association · Title & Property Specialist",
      photo: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600",
      bio: "Spearheading grassroots legal access and land title adjudication guidance across divisional jurisdictions.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="bg-slate-950 text-white py-20 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Institutional Charter & Legal Mission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Transforming Access to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-200 to-amber-200">
              Accredited Justice in Bangladesh
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            LegalEase is Bangladesh’s premier technology platform connecting citizens and businesses with certified Bangladesh Bar Council advocates for structured, confidential, and fee-transparent 30-minute legal consultations.
          </p>

          {/* Key Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-md"
              >
                <div className="text-3xl font-black text-sky-400">{m.value}</div>
                <div className="text-xs font-bold text-white mt-1">{m.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATUTORY DISCLAIMER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <LegalDisclaimerBanner />
      </div>

      {/* 3. CORE MISSION & PROBLEM STATEMENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-sky-50 text-sky-700 border border-sky-200">
              <Scale className="w-3.5 h-3.5 text-sky-600" />
              The Foundational Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Bridging the Divide Between Citizens and the Legal Bar
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In Bangladesh, navigating the legal sector has traditionally been burdened by fragmented chamber listings, lack of transparent fee structures, and the immense difficulty citizens face in verifying an advocate’s official Bar Council standing.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              LegalEase was engineered to solve these frictions. By introducing real-time calendar reservations, an escrow-backed 30-minute hold guarantee, and post-session written Advice Notes, we eliminate guesswork and empower citizens with structured legal clarity.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero hidden commission fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Bar Council enrollment audited</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 p-8 sm:p-10 rounded-3xl text-white border border-slate-800 shadow-xl space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Institutional Charter</h3>
            <blockquote className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-amber-400/80 pl-4">
              &quot;Justice delayed or obscured by logistical opacity is justice denied. LegalEase provides the sovereign citizens of Bangladesh with instant, authenticated access to legal counsel, without infringing upon the dignity and noble traditions of the Bar.&quot;
            </blockquote>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Compliant with Bangladesh Legal Practitioners & Bar Council Order 1972</span>
            </div>
          </div>
        </section>

        {/* 4. FOUR PILLARS OF COMPLIANCE */}
        <section className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Four Pillars of Integrity
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Built on Complete Regulatory Trust
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Our platform architecture strictly separates administrative appointment facilitation from the independent exercise of legal counsel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. LEGAL LEADERSHIP & ADVISORY ROSTER */}
        <section className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Leadership & Counsel
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Guided by Experienced Legal Practitioners
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Meet the distinguished advocates shaping LegalEase’s ethical standards, compliance verification, and regional chamber coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((person, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={person.photo}
                      alt={person.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white ring-2 ring-slate-100 group-hover:ring-sky-400/50 transition duration-300 bg-slate-100"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 left-20 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 mb-2">
                    {person.role}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition">
                    {person.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {person.credentials}
                  </p>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {person.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Supreme Court Bar Enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION BANNER */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-10 sm:p-14 text-white border border-slate-800 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-600/15 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-400 border border-sky-800">
              <Zap className="w-3.5 h-3.5" /> Start Your Consultation
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Connect With a Verified Advocate Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Gain preliminary legal assessment on family disputes, title deeds, cyber laws, or commercial contracts in under 5 minutes.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3 relative z-10">
            <Link
              href="/lawyers"
              className="px-7 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-sky-500/25 flex items-center gap-2"
            >
              <span>Explore Verified Advocates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register?role=LAWYER"
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <Gavel className="w-4 h-4" />
              <span>Join as an Advocate</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
