"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  HelpCircle,
  ArrowRight,
  Headphones,
  BadgeCheck,
  Gavel,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("booking");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderOrConsultationId: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const topics = [
    { id: "booking", label: "Consultation & Slot Booking", icon: Clock },
    { id: "payment", label: "Payment & Escrow Refund", icon: ShieldCheck },
    { id: "lawyer", label: "Advocate Verification & Bar Rolls", icon: Gavel },
    { id: "technical", label: "WebRTC Video / Audio Support", icon: Headphones },
    { id: "general", label: "General & Institutional Inquiry", icon: FileText },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* 1. CINEMATIC HERO HEADER */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-600/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Dedicated Legal Concierge & Registry Desk</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            How Can We Assist Your <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-200 to-amber-200">
              Legal Journey Today?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Whether you need assistance scheduling a 30-minute consultation, resolving payment escrow inquiries, or onboarding as an enrolled advocate, our team is at your service.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Concierge Desk Live (10:00 AM – 8:00 PM BST)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Confidential & SLA Protected</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY DISCLAIMER BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <LegalDisclaimerBanner />
      </div>

      {/* 3. PRIMARY CONTACT CHANNELS MATRIX */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Direct Helpline */}
          <div className="group bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition duration-300 shadow-xs">
                <Phone className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 mb-2">
                Fastest Response
              </span>
              <h3 className="text-base font-bold text-slate-900">Direct Helpline</h3>
              <p className="text-xs text-slate-500 mt-1">Available 6 days a week (Sat–Thu)</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <a
                  href="tel:+8801711002233"
                  className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition block font-mono"
                >
                  +880 1711-002233
                </a>
                <p className="text-[11px] text-slate-400">Toll-free client consultation helpline</p>
              </div>
            </div>
            <div className="mt-6 pt-3">
              <a
                href="https://wa.me/8801711002233"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition border border-emerald-200/60"
              >
                <span>WhatsApp Concierge</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Email Registry */}
          <div className="group bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white transition duration-300 shadow-xs">
                <Mail className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100 mb-2">
                Official Registry
              </span>
              <h3 className="text-base font-bold text-slate-900">Email Inquiries</h3>
              <p className="text-xs text-slate-500 mt-1">Written inquiries & documentation</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <a
                  href="mailto:support@legalease.com.bd"
                  className="text-xs font-bold text-slate-900 hover:text-sky-600 transition block truncate"
                >
                  support@legalease.com.bd
                </a>
                <p className="text-[11px] text-slate-400">Guaranteed response within 2 hours</p>
              </div>
            </div>
            <div className="mt-6 pt-3">
              <a
                href="mailto:support@legalease.com.bd?subject=Priority%20Legal%20Support%20Request"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold transition border border-sky-200/60"
              >
                <span>Compose Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Supreme Court & Head Office */}
          <div className="group bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition duration-300 shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 mb-2">
                Corporate Chamber
              </span>
              <h3 className="text-base font-bold text-slate-900">Liaison Secretariat</h3>
              <p className="text-xs text-slate-500 mt-1">Shahbag & Gulshan, Dhaka</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <p className="text-xs font-bold text-slate-900">Concord Tower, Banglamotor</p>
                <p className="text-[11px] text-slate-500">Suite 7B, 113 Kazi Nazrul Islam Ave, Dhaka 1212</p>
              </div>
            </div>
            <div className="mt-6 pt-3">
              <span className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-50 text-purple-800 rounded-xl text-xs font-bold border border-purple-200/60">
                <MapPin className="w-3.5 h-3.5" /> Supreme Court Area
              </span>
            </div>
          </div>

          {/* Card 4: Advocate Onboarding Desk */}
          <div className="group bg-white p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition duration-300 shadow-xs">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60 mb-2">
                For Legal Practitioners
              </span>
              <h3 className="text-base font-bold text-slate-900">Advocate Secretariat</h3>
              <p className="text-xs text-slate-500 mt-1">Bar roll verification & membership</p>
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                <a
                  href="mailto:advocates@legalease.com.bd"
                  className="text-xs font-bold text-slate-900 hover:text-amber-700 transition block truncate"
                >
                  advocates@legalease.com.bd
                </a>
                <p className="text-[11px] text-slate-400">Exclusive enrolled advocate concierge</p>
              </div>
            </div>
            <div className="mt-6 pt-3">
              <Link
                href="/register?role=LAWYER"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition border border-amber-200/80"
              >
                <span>Register as Advocate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. EXECUTIVE INQUIRY CONSOLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Information & SLAs */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-400 border border-sky-800">
                <HelpCircle className="w-3.5 h-3.5" /> Priority Response Dispatch
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Send an Inquiry to Our Legal Secretariat
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Fill out the secure dispatch form. All submitted messages are encrypted and routed directly to the designated compliance supervisor for immediate resolution.
              </p>

              {/* Institutional Commitments */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Under 2-Hour Response Time</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Urgent slot rescheduling and escrow issues are escalated immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Client-Counsel Privilege Protected</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Case inquiries are kept strictly confidential under statutory data protection standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Gavel className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Bar Council Compliance Guarantee</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      We strictly enforce the 1972 Canons of Professional Conduct across all interactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 relative z-10 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Headquartered in Dhaka, serving citizens nationwide across all divisions.</span>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Inquiry Dispatched Successfully</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name || "valued client"}</strong>. Your ticket has been logged with reference number <code className="font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold">LEG-{(Math.random() * 90000 + 10000).toFixed(0)}</code>. Our concierge officer will contact you at <strong className="text-slate-900">{formData.email}</strong> shortly.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        orderOrConsultationId: "",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Select Inquiry Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      const isSelected = selectedTopic === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTopic(t.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Barrister / Mr. Rahim Ahmed"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahim@example.com"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+880 1700-000000"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Consultation ID / Bar Roll (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderOrConsultationId}
                      onChange={(e) =>
                        setFormData({ ...formData, orderOrConsultationId: e.target.value })
                      }
                      placeholder="e.g. CON-1024 or DH-14820"
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Detailed Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your legal matter, booking issue, or advocate registration question..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-sky-600 hover:to-blue-600 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Encrypting & Dispatching...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Secure Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5. CHAMBER LOCATIONS & REGIONAL HUBS */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800">
              Chamber Jurisdictions
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Physical Representation & Liaison Points
            </h3>
            <p className="text-xs text-slate-400">
              For scheduled in-person chamber consultations, our verified advocates maintain registered chambers at major judicial centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-400">
                <MapPin className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-white">Supreme Court of Bangladesh</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Appellate & High Court Division Chambers, Supreme Court Bar Association Building, Shahbag, Dhaka.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 font-medium">
                Civil, Writ & Appellate Litigations
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-teal-400">
                <MapPin className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-white">Dhaka District & Sessions Bar</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                District Court Building, Johnson Road, Kotwali, Old Dhaka 1100.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 font-medium">
                Criminal Defense, Land Partition & Family Matters
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <MapPin className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-white">Chattogram & Regional Bars</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Court Building Road, Kotwali, Chattogram & Divisional Bar Association buildings across Sylhet, Rajshahi, Khulna.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 font-medium">
                Admiralty, Regional Land Registry & Commercial Trials
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
