"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ShieldCheck,
  MapPin,
  Clock,
  Video,
  PhoneCall,
  Building2,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Star,
  Lock,
  Scale,
  Award,
  Languages,
  Copy,
  Check,
  Share2,
  MessageSquare,
  Sparkles,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT, formatDhakaTime, getLawyerPhoto } from "@/lib/utils";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

function LawyerDetailContent() {
  const params = useParams();
  const router = useRouter();
  const lawyerId = params?.id as string;

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"VIDEO" | "AUDIO" | "CHAMBER">("VIDEO");
  const [topic, setTopic] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [copiedBarNo, setCopiedBarNo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check auth status & restore draft booking if returning from login
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);

      const savedDraft = sessionStorage.getItem("draft_booking");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.lawyerId === lawyerId) {
            if (draft.scheduleId) setSelectedSlotId(draft.scheduleId);
            if (draft.type) setConsultationType(draft.type);
            if (draft.topic) setTopic(draft.topic);
          }
        } catch {}
      }
    }
  }, [lawyerId]);

  // 1. Fetch lawyer details
  const { data: lawyerRes, isLoading: isLawyerLoading } = useQuery({
    queryKey: ["lawyer", lawyerId],
    queryFn: () => apiClient<any>(`/lawyers/${lawyerId}`),
    enabled: !!lawyerId,
  });

  // 2. Fetch available unbooked slots
  const { data: slotsRes, isLoading: isSlotsLoading } = useQuery({
    queryKey: ["lawyer-slots", lawyerId],
    queryFn: () => apiClient<any[]>(`/lawyers/${lawyerId}/slots`),
    enabled: !!lawyerId,
  });

  // 3. Fetch reviews
  const { data: reviewsRes, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["lawyer-reviews", lawyerId],
    queryFn: () => apiClient<any[]>(`/lawyers/${lawyerId}/reviews`),
    enabled: !!lawyerId,
  });

  // 4. Booking Mutation
  const bookMutation = useMutation({
    mutationFn: (payNow: boolean) =>
      apiClient<any>("/consultations/book", {
        method: "POST",
        body: JSON.stringify({
          lawyerId,
          scheduleId: selectedSlotId,
          type: consultationType,
          topic: topic.trim() || undefined,
          payNow,
        }),
      }),
    onSuccess: (res, payNow) => {
      setBookingSuccess(res.data);
      setBookingError(null);
      if (payNow && res.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    },
    onError: (err: any) => {
      setBookingError(err.message || "Failed to book slot. The slot may have just been reserved.");
    },
  });

  const lawyer = lawyerRes?.data;
  const availableSlots = slotsRes?.data || [];
  const reviews = reviewsRes?.data || [];

  const name = lawyer?.name || lawyer?.user?.name || "Advocate";
  const fee = lawyer?.consultationFee || 1500;
  const experience = lawyer?.experience || 5;
  const rating = lawyer?.averageRating || 4.9;
  const reviewCount = lawyer?.reviewCount || reviews.length || 0;
  const chamber = lawyer?.chamberAddress || "Supreme Court Bar Building / District Bar, Bangladesh";
  const barCouncil = lawyer?.barCouncilNo || "BAR-ENROLLED";
  const languagesList = lawyer?.languages && lawyer.languages.length > 0 ? lawyer.languages : ["Bengali", "English"];
  const photoUrl = lawyer ? getLawyerPhoto(lawyer) : "";

  const practiceList = (lawyer?.practiceAreas || [])
    .map((pa: any) => pa.practiceArea?.title || pa.title)
    .filter(Boolean);

  // Group slots by date for intuitive day-by-day browsing
  const groupedSlots = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const slot of availableSlots) {
      const dt = slot.startDateTime || slot.schedule?.startDateTime;
      if (!dt) continue;
      const dateKey = formatDhakaTime(dt, "EEE, d MMM yyyy");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(slot);
    }
    return Array.from(map.entries()).map(([dateLabel, slots]) => ({
      dateLabel,
      slots,
    }));
  }, [availableSlots]);

  const handleCopyBarNo = () => {
    if (barCouncil) {
      navigator.clipboard.writeText(barCouncil);
      setCopiedBarNo(true);
      setTimeout(() => setCopiedBarNo(false), 2000);
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Share Row */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
            <span>Back to Verified Advocates</span>
          </Link>

          <button
            onClick={handleShareProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile</span>
              </>
            )}
          </button>
        </div>

        {/* BR-20 Statutory Disclaimer Notice */}
        <LegalDisclaimerBanner className="bg-amber-950/40 border-amber-500/30 text-amber-200/90 shadow-md backdrop-blur-xs" />

        {isLawyerLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-850 p-8 rounded-3xl border border-slate-800 animate-pulse h-96" />
            <div className="bg-slate-850 p-8 rounded-3xl border border-slate-800 animate-pulse h-96" />
          </div>
        ) : lawyer ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Lawyer Bio, Details, Modes & Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prestige Lawyer Profile Hero Card */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-850 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-xs space-y-6">
                {/* Decorative Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* High-res Verified Lawyer Portrait */}
                  <div className="relative shrink-0 mx-auto sm:mx-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-amber-400/30 bg-slate-800 shadow-xl relative">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-amber-400 font-extrabold text-4xl">
                          {name[0]}
                        </div>
                      )}
                    </div>
                    {/* Active Verification Shield */}
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-lg border-2 border-slate-850 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Header Bio Content */}
                  <div className="space-y-3 flex-1 text-center sm:text-left">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          {name}
                        </h1>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Bar Enrolled
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                        Senior Legal Practitioner • Bangladesh Bar Council
                      </p>
                    </div>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {Number(rating).toFixed(1)}
                        <span className="text-slate-400 font-normal">({reviewCount} reviews)</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60 font-medium">
                        <Award className="w-3.5 h-3.5 text-sky-400" />
                        {experience}+ Years Experience
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60 font-medium">
                        <Languages className="w-3.5 h-3.5 text-emerald-400" />
                        {languagesList.join(", ")}
                      </span>
                    </div>

                    {/* Chamber Address */}
                    <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2 pt-1 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{chamber}</span>
                    </p>

                    {/* Bar Council License Verification Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-[11px] text-slate-400 font-mono">
                      <span>Bar Council ID:</span>
                      <span className="font-bold text-slate-200">{barCouncil}</span>
                      <button
                        onClick={handleCopyBarNo}
                        title="Copy Bar Council No"
                        className="p-1 hover:text-white transition"
                      >
                        {copiedBarNo ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Practice Areas Badges */}
                {practiceList.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Primary Jurisdictions & Specializations:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {practiceList.map((area: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs bg-slate-800 text-amber-200/90 px-3 py-1.5 rounded-xl font-medium border border-slate-700"
                        >
                          <Scale className="w-3 h-3 text-amber-400" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* About Legal Practice & Approach */}
              <div className="rounded-3xl bg-slate-850 border border-slate-800 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    About Legal Practice & Litigation Philosophy
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lawyer.bio ||
                    "Distinguished legal practitioner enrolled with the Bangladesh Bar Council. Providing strategic litigation counsel, appellate review, document drafting, and confidential advisory sessions for preliminary case evaluations across Supreme Court and District Courts."}
                </p>

                {/* Highlights grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-white">Confidential Privilege</p>
                    <p className="text-[11px] text-slate-400">
                      Protected under Section 126 of Evidence Act 1872.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-white">Document Vetting</p>
                    <p className="text-[11px] text-slate-400">
                      Examine deeds, notices, FIRs, and court orders during the call.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-white">Written Advice Notes</p>
                    <p className="text-[11px] text-slate-400">
                      Receive summary next-steps upon session completion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation Modes Detailed */}
              <div className="rounded-3xl bg-slate-850 border border-slate-800 p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    How Consultations Work with this Advocate
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your preferred mode during booking. All sessions adhere to the 30-minute standard format.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      <Video className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Encrypted Video Call</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      One-click video room inside LegalEase. Screen-share documents and discuss strategy face-to-face.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Direct Phone Call</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Immediate telephone consultation at the scheduled slot time. Ideal for quick evaluations.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">Chamber Visit</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      In-person discussion at advocate&apos;s registered chamber with physical document inspection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Reviews Section */}
              <div className="rounded-3xl bg-slate-850 border border-slate-800 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Client Reviews & Feedback
                      <span className="text-xs text-slate-400 font-normal">
                        ({reviews.length})
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified feedback from clients who booked consultations.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{Number(rating).toFixed(1)} / 5.0</span>
                  </div>
                </div>

                {isReviewsLoading ? (
                  <div className="space-y-3">
                    <div className="h-16 bg-slate-800 rounded-2xl animate-pulse" />
                    <div className="h-16 bg-slate-800 rounded-2xl animate-pulse" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-3 divide-y divide-slate-800">
                    {reviews.map((rev: any) => (
                      <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                              {rev.client?.name ? rev.client.name[0] : "C"}
                            </div>
                            <span className="text-xs font-bold text-white">
                              {rev.client?.name || "Verified Client"}
                            </span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                              Verified
                            </span>
                          </div>

                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= rev.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed italic pl-9">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                    <MessageSquare className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">
                      No client reviews recorded yet
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Be among the first to book a preliminary consultation and share your experience!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Consultation Booking Wireframe / Purchase Card */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-3xl bg-slate-850 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6">
                {/* Header Price Strip */}
                <div className="pb-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Consultation Fee
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Standard Rate
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-3xl font-black text-white tracking-tight">
                      {formatBDT(fee)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ 30 min session</span>
                  </div>
                </div>

                {bookingSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Slot Reserved Successfully!</span>
                    </div>

                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      Your consultation ID is{" "}
                      <span className="font-mono font-bold text-white bg-emerald-900/60 px-1.5 py-0.5 rounded-sm">
                        {bookingSuccess.id?.slice(0, 8)}
                      </span>.
                      {bookingSuccess.payment?.status === "PAID"
                        ? " Payment completed! You can now join your encrypted video consultation."
                        : " Complete payment within 30 minutes to permanently lock your appointment."}
                    </p>

                    <Link
                      href={`/dashboard/consultations/${bookingSuccess.id}`}
                      className="block text-center py-3 px-4 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md hover:bg-amber-300 transition"
                    >
                      Open Consultation Details
                    </Link>
                  </div>
                ) : (
                  <>
                    {bookingError && (
                      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{bookingError}</span>
                      </div>
                    )}

                    {/* Step 1: Mode Selection */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        1. Select Consultation Mode
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "VIDEO", label: "Video Call", icon: Video },
                          { id: "AUDIO", label: "Phone", icon: PhoneCall },
                          { id: "CHAMBER", label: "Chamber", icon: Building2 },
                        ].map((m) => {
                          const Icon = m.icon;
                          const active = consultationType === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setConsultationType(m.id as any)}
                              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                                active
                                  ? "border-amber-400 bg-amber-400/10 text-amber-300 font-bold shadow-md shadow-amber-400/10"
                                  : "border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-white"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-[11px] font-semibold">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Available Slots Picker */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          2. Select Available Slot
                        </label>
                        <span className="text-[10px] text-slate-400">Time: Asia/Dhaka</span>
                      </div>

                      {isSlotsLoading ? (
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />
                          ))}
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {groupedSlots.map(({ dateLabel, slots }) => (
                            <div key={dateLabel} className="space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 pl-1">
                                {dateLabel}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                {slots.map((slot: any) => {
                                  const slotKey = slot.scheduleId || slot.schedule?.id || slot.id;
                                  const isSelected = !!selectedSlotId && selectedSlotId === slotKey;
                                  const slotTime = formatDhakaTime(
                                    slot.startDateTime || slot.schedule?.startDateTime,
                                    "h:mm a"
                                  );

                                  return (
                                    <button
                                      key={slotKey}
                                      type="button"
                                      onClick={() => setSelectedSlotId(slotKey)}
                                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition text-left flex items-center justify-between cursor-pointer ${
                                        isSelected
                                          ? "border-amber-400 bg-amber-400/15 text-amber-300 ring-2 ring-amber-400/40 font-bold"
                                          : "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
                                      }`}
                                    >
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span>{slotTime}</span>
                                      </span>
                                      {isSelected && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1.5">
                          <Clock className="w-5 h-5 text-slate-500 mx-auto" />
                          <p className="text-xs font-semibold text-slate-300">No Open Slots</p>
                          <p className="text-[11px] text-slate-400">
                            Check back soon or choose another verified advocate.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Step 3: Brief Topic (Optional, 300 chars) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          3. Topic (Optional)
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {topic.length}/300
                        </span>
                      </div>
                      <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value.slice(0, 300))}
                        rows={2}
                        placeholder="Brief summary of your legal inquiry (e.g., land mutation, bail, cheque dishonor)..."
                        className="w-full p-3 text-xs bg-slate-900/90 text-white rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 placeholder-slate-500 transition resize-none"
                      />
                    </div>

                    {/* Step 4: Pay Now vs Book & Pay Later */}
                    <div className="pt-2 space-y-2.5">
                      {!selectedSlotId ? (
                        <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
                          <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                          <span>Please select an available time slot above to activate booking.</span>
                        </div>
                      ) : !isAuthenticated ? (
                        <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center gap-2">
                          <Lock className="w-4 h-4 shrink-0 text-sky-400" />
                          <span>You will sign in as a client to complete checkout.</span>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={!selectedSlotId || bookMutation.isPending}
                        onClick={() => {
                          if (!selectedSlotId) return;
                          if (!isAuthenticated) {
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem(
                                "draft_booking",
                                JSON.stringify({
                                  lawyerId,
                                  scheduleId: selectedSlotId,
                                  type: consultationType,
                                  topic,
                                  payNow: true,
                                })
                              );
                            }
                            router.push(`/login?redirect=/lawyers/${lawyerId}`);
                            return;
                          }
                          bookMutation.mutate(true);
                        }}
                        className={`w-full py-3.5 text-xs font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${
                          !selectedSlotId
                            ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60"
                            : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 cursor-pointer"
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {bookMutation.isPending
                            ? "Locking Slot..."
                            : !selectedSlotId
                            ? "Select a Time Slot to Proceed"
                            : !isAuthenticated
                            ? `Sign In & Pay Now (${formatBDT(fee)})`
                            : `Pay Now & Confirm Slot (${formatBDT(fee)})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={!selectedSlotId || bookMutation.isPending}
                        onClick={() => {
                          if (!selectedSlotId) return;
                          if (!isAuthenticated) {
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem(
                                "draft_booking",
                                JSON.stringify({
                                  lawyerId,
                                  scheduleId: selectedSlotId,
                                  type: consultationType,
                                  topic,
                                  payNow: false,
                                })
                              );
                            }
                            router.push(`/login?redirect=/lawyers/${lawyerId}`);
                            return;
                          }
                          bookMutation.mutate(false);
                        }}
                        className={`w-full py-2.5 text-xs font-semibold rounded-xl border transition ${
                          !selectedSlotId
                            ? "bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed opacity-60"
                            : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700 cursor-pointer"
                        }`}
                      >
                        {!selectedSlotId
                          ? "Book Now, Pay Later (Slot required)"
                          : !isAuthenticated
                          ? "Sign In to Hold Slot (30-min hold)"
                          : "Book Now, Pay Later (30-min hold)"}
                      </button>
                    </div>

                    {/* Trust Guarantees */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Instant slot lock & payment receipt in BDT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Written legal advice notes upon completion</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-850 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white">Advocate Profile Not Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The requested advocate profile could not be located or has not yet been verified.
            </p>
            <Link
              href="/lawyers"
              className="inline-block px-5 py-2.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-300 transition"
            >
              Browse Verified Directory
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LawyerDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 text-slate-400 font-medium text-xs">
          Loading advocate profile...
        </div>
      }
    >
      <LawyerDetailContent />
    </Suspense>
  );
}
