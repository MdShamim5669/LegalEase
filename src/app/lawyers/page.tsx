"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Scale,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT, getLawyerPhoto } from "@/lib/utils";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

function LawyersDirectoryContent() {
  const searchParams = useSearchParams();
  const urlPracticeAreaId = searchParams.get("practiceAreaId") || "";
  const urlSearchTerm = searchParams.get("searchTerm") || "";

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [selectedPracticeAreaId, setSelectedPracticeAreaId] = useState(urlPracticeAreaId);
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    if (urlPracticeAreaId) {
      setSelectedPracticeAreaId(urlPracticeAreaId);
      setPage(1);
    }
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      setPage(1);
    }
  }, [urlPracticeAreaId, urlSearchTerm]);

  // 1. Fetch practice areas dynamically from backend
  const { data: practiceAreasRes } = useQuery({
    queryKey: ["practice-areas"],
    queryFn: () => apiClient<any[]>("/practice-areas"),
  });
  const practiceAreas = practiceAreasRes?.data || [];

  // 2. Fetch verified lawyers with dynamic search & filters
  const { data: lawyersResponse, isLoading } = useQuery({
    queryKey: ["lawyers", searchTerm, selectedPracticeAreaId, sortBy, page],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (selectedPracticeAreaId) params.append("practiceAreaId", selectedPracticeAreaId);
      if (sortBy) params.append("sortBy", sortBy);
      return apiClient<any[]>(`/lawyers?${params.toString()}`);
    },
  });

  const lawyers = lawyersResponse?.data || [];
  const meta = lawyersResponse?.meta || { total: 0, totalPages: 1, page: 1 };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Statutory BR-20 Disclaimer */}
        <LegalDisclaimerBanner />

        {/* Directory Header & Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Bangladesh Bar Council Verified Roster
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Your Legal Counsel
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                Connect with certified advocates across Supreme Court and District Bar associations. Filter by specialization, consultation fee, and genuine client ratings.
              </p>
            </div>

            <div className="text-right hidden md:block">
              <span className="text-xs font-semibold text-slate-400">Total Enrolled Advocates</span>
              <p className="text-2xl font-black text-slate-900">{meta.total || lawyers.length}</p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by advocate name, chamber, or bio..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white placeholder:text-slate-400"
              />
            </div>

            {/* Practice Area Dropdown */}
            <div className="sm:col-span-4 relative">
              <select
                value={selectedPracticeAreaId}
                onChange={(e) => {
                  setSelectedPracticeAreaId(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-700 font-medium cursor-pointer"
              >
                <option value="">All Practice Specializations</option>
                {practiceAreas.map((pa: any) => (
                  <option key={pa.id} value={pa.id}>
                    {pa.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-700 font-medium cursor-pointer"
              >
                <option value="rating">Sort: Highest Rating</option>
                <option value="experience">Sort: Most Experienced</option>
                <option value="fee">Sort: Lowest Fee (৳)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lawyer Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-4/5" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : lawyers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((lawyer: any) => {
                const name = lawyer.name || lawyer.user?.name || "Advocate";
                const experience = lawyer.experience || lawyer.experienceYears || 0;
                const fee = lawyer.consultationFee || 1000;
                const rating = lawyer.averageRating || 4.8;
                const reviewCount = lawyer.reviewCount || 0;
                const barCouncil = lawyer.barCouncilNo || "Enrolled";
                const chamber =
                  lawyer.chamberAddress || "Supreme Court of Bangladesh / District Court";
                const practiceList = (lawyer.practiceAreas || [])
                  .map((pa: any) => pa.practiceArea?.title || pa.title)
                  .filter(Boolean);

                const photoUrl = getLawyerPhoto(lawyer);

                return (
                  <div
                    key={lawyer.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:border-sky-400 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
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

                      {/* Top Header with Portrait Photo & Info */}
                      <div className="flex items-start gap-4">
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

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-sky-700 transition flex items-center gap-1.5 leading-snug truncate">
                            <span className="truncate">{name}</span>
                            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 fill-sky-100" />
                          </h3>

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

                          {/* Fee Badge (BDT) */}
                          <div className="mt-2.5">
                            <span className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 text-sky-900 font-black text-xs shadow-2xs">
                              <span className="text-sm font-black text-sky-800">{formatBDT(fee)}</span>
                              <span className="text-[10px] font-normal text-slate-500">/ 30 min</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bar Council & Chamber Address */}
                      <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{chamber}</span>
                      </p>

                      {/* Bio preview */}
                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {lawyer.bio ||
                          "Enrolled advocate practicing in civil, criminal, and commercial jurisdictions."}
                      </p>

                      {/* Specializations & Experience tags */}
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

                    {/* Booking & Details Button */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>30-min slot</span>
                      </span>

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

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Showing Page <span className="font-bold text-slate-800">{page}</span> of{" "}
                  <span className="font-bold text-slate-800">{meta.totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 text-xs font-semibold rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Verified Advocates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No lawyers matched your search query or selected specialization filter. Try adjusting your search filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedPracticeAreaId("");
                setSortBy("rating");
                setPage(1);
              }}
              className="mt-2 px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LawyersDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            Loading Verified Advocates...
          </div>
        </div>
      }
    >
      <LawyersDirectoryContent />
    </Suspense>
  );
}
