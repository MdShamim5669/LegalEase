"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Scale,
  Shield,
  Heart,
  Building2,
  Briefcase,
  Lock,
  Globe,
  FileText,
  Users,
  Award,
  BookOpen,
  Landmark,
  Search,
  ArrowRight,
  CheckCircle2,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard,
  FileCheck2,
  Gavel,
  Home,
  Cpu,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LegalDisclaimerBanner } from "@/components/common/LegalDisclaimerBanner";

// Detailed interface for Practice Area card and modal
export interface IPracticeAreaDetail {
  id: string;
  title: string;
  banglaTitle: string;
  category: "Civil & Property" | "Criminal & Bail" | "Corporate & Commercial" | "Family & Personal" | "Constitutional & Writ" | "Taxation & Maritime";
  jurisdiction: string;
  shortDesc: string;
  fullDesc: string;
  statutes: string[];
  commonMatters: string[];
  prepDocuments: string[];
  recommendedQuestions: string[];
  iconKey: string;
  highlightBadge?: string;
  estimatedFeeRange: string;
  lawyerCount: number;
}

interface IPracticeAreaMeta {
  banglaTitle: string;
  category: "Civil & Property" | "Criminal & Bail" | "Corporate & Commercial" | "Family & Personal" | "Constitutional & Writ" | "Taxation & Maritime";
  jurisdiction: string;
  shortDesc: string;
  fullDesc: string;
  statutes: string[];
  commonMatters: string[];
  prepDocuments: string[];
  recommendedQuestions: string[];
  iconKey: string;
  highlightBadge?: string;
  estimatedFeeRange: string;
}

// Rich legal metadata mapping keyed by backend practice area title/concept
const PRACTICE_AREA_METADATA_MAP: Record<string, IPracticeAreaMeta> = {
  "family & divorce law": {
    banglaTitle: "পারিবারিক, বিবাহ ও অভিভাবকত্ব আইন",
    category: "Family & Personal",
    jurisdiction: "Family Courts (Assistant Judge) • District Judge Court",
    shortDesc: "Compassionate counsel for dower recovery (দেনমোহর), child custody, divorce/talaq procedures, maintenance, and marital rights.",
    fullDesc: "Family disputes involve delicate emotional and legal complexities. LegalEase provides discreet, confidential consultations with empathetic family law specialists who understand Bangladesh personal laws (Muslim Family Laws Ordinance, Hindu personal law, and Christian marriage enactments).",
    statutes: ["Muslim Family Laws Ordinance 1961", "Family Courts Act 2023", "Guardians & Wards Act 1890", "Dowry Prohibition Act 2018"],
    commonMatters: ["Dower Money Recovery (দেনমোহর আদায়)", "Child Custody & Visitation Rights (হেফাজত)", "Monthly Maintenance (খোরপোশ)", "Legal Talaq Notice Procedure", "Restitution of Conjugal Rights"],
    prepDocuments: ["Nikahnama (কাবিননামা) certified copy", "Child's Birth Certificate / school records", "Talaq notices & postal receipts", "Proof of income / bank statements"],
    recommendedQuestions: ["What are my rights regarding child custody while the suit is pending?", "Can dower and past maintenance be claimed simultaneously?", "How is monthly maintenance calculated by the Family Court?"],
    iconKey: "heart",
    highlightBadge: "Confidential",
    estimatedFeeRange: "৳1,200 – ৳3,000 / consultation",
  },
  "criminal defense": {
    banglaTitle: "ফৌজদারি ও জামিন সংক্রান্ত আইন",
    category: "Criminal & Bail",
    jurisdiction: "Chief Judicial / Metropolitan Magistrate • High Court Division",
    shortDesc: "Urgent anticipatory bail, regular bail applications, FIR defense, police remand protection, and Supreme Court criminal revisions.",
    fullDesc: "When liberty is at stake, rapid access to seasoned advocates is crucial. We connect you with advocates experienced in Bangladesh Magistrate Courts, Sessions Courts, and the High Court Division for anticipatory bail, cross-examination strategy, police inquiry defense, and bail bond processing.",
    statutes: ["Code of Criminal Procedure (CrPC) 1898", "Penal Code 1860", "Special Powers Act 1974", "Arms & Narcotics Control Acts"],
    commonMatters: ["Anticipatory Bail (আগাম জামিন)", "Regular Bail Application (নিয়মিত জামিন)", "Quashment of Criminal Proceedings (561A)", "Remand & Police Inquiry Defense", "Cross-CR & GR Case Management"],
    prepDocuments: ["First Information Report (FIR / এজাহার)", "Seizure List (জব্দতালিকা)", "Lower Court Order Sheets (আদেশনামা)", "Charge Sheet (if already submitted)"],
    recommendedQuestions: ["Am I eligible for anticipatory bail in the High Court?", "What are the bailable versus non-bailable sections in my FIR?", "What conditions are usually imposed when bail is granted?"],
    iconKey: "shield",
    highlightBadge: "Urgent Priority",
    estimatedFeeRange: "৳2,000 – ৳5,000 / consultation",
  },
  "corporate & business law": {
    banglaTitle: "বাণিজ্যিক ও কোম্পানি আইন",
    category: "Corporate & Commercial",
    jurisdiction: "High Court Division (Company Bench) • RJSC • BIDA",
    shortDesc: "RJSC incorporation, shareholder agreements, contract vetting, venture capital structuring, FDI compliance, and commercial dispute resolution.",
    fullDesc: "Strategic counsel for founders, SMEs, and established corporations operating in Bangladesh. Navigate Registrar of Joint Stock Companies (RJSC) filings, drafting binding commercial contracts, shareholder protection clauses, and BIDA foreign investment permissions.",
    statutes: ["Companies Act 1994", "Contract Act 1872", "Arbitration Act 2001", "Foreign Exchange Regulation Act 1947"],
    commonMatters: ["RJSC Incorporation & Share Structuring", "Shareholders' Agreements & Term Sheets", "Commercial Contract Vetting & Drafting", "Cross-Border Service Agreements", "M&A & Due Diligence Reviews"],
    prepDocuments: ["Draft Agreement / Term Sheet", "Company Incorporation Certificate & MOA/AOA", "Board Resolutions", "Relevant invoices / contractual correspondence"],
    recommendedQuestions: ["What indemnity and dispute clauses should be included?", "How do we structure founder vesting under Bangladesh law?", "What are the regulatory hurdles for foreign equity participation?"],
    iconKey: "building",
    highlightBadge: "Enterprise Ready",
    estimatedFeeRange: "৳2,500 – ৳6,000 / consultation",
  },
  "real estate & property": {
    banglaTitle: "দেওয়ানি ও ভূমি সংক্রান্ত আইন",
    category: "Civil & Property",
    jurisdiction: "District & Sessions Courts • High Court Division",
    shortDesc: "Resolve land ownership disputes, title suits, illegal possession, mutation complications, partition, and registered deed disputes.",
    fullDesc: "Land and property disputes represent the vast majority of civil litigations in Bangladesh courts. Our verified advocates specialize in defending ownership rights, navigating complex land survey records (CS, SA, RS, BS), challenging fraudulent deeds, and filing urgent injunctions to prevent dispossession.",
    statutes: ["Transfer of Property Act 1882", "Specific Relief Act 1877", "State Acquisition & Tenancy Act 1950", "Registration Act 1908"],
    commonMatters: ["Declaration of Title (স্বত্ব মামলা)", "Land Mutation & Khatian Discrepancies", "Partition Suits (বণ্টন মামলা)", "Deed Cancellation (দলিল বাতিল)", "Temporary Injunction (নিষেধাজ্ঞা)"],
    prepDocuments: ["CS, SA, RS, BS Khatian copies", "Registered Sale Deed (মূল/সার্টিফাইড দলিল)", "Mutation Parcha & DCR receipt", "Latest Land Development Tax (দাখিলা)"],
    recommendedQuestions: ["Does my Khatian chain show continuous unbroken title?", "Should I seek an ad-interim injunction to stop construction?", "What is the limitation period to challenge this fraudulent deed?"],
    iconKey: "landmark",
    highlightBadge: "High Demand",
    estimatedFeeRange: "৳1,500 – ৳3,500 / consultation",
  },
  "banking, cheque dishonor & artha rin": {
    banglaTitle: "ব্যাংকিং, চেক ডিজঅনার ও অর্থ ঋণ আদালত",
    category: "Corporate & Commercial",
    jurisdiction: "Artha Rin Adalat • Metropolitan Sessions Courts",
    shortDesc: "Cheque bounce cases under Section 138 NI Act, defense in bank loan suits, auction stay petitions, and loan restructuring advisory.",
    fullDesc: "Cheque dishonor disputes and Artha Rin suits carry strict statutory deadlines. Consult legal practitioners who specialize in serving statutory demand notices under Section 138 of the Negotiable Instruments Act, defending mortgaged property auctions, and negotiating bank settlements.",
    statutes: ["Negotiable Instruments Act 1881 (Sec 138/140)", "Artha Rin Adalat Ain 2003", "Bank Company Act 1991"],
    commonMatters: ["Section 138 NI Act Cheque Dishonor", "Artha Rin Adalat Defense & Written Statement", "Stay of Bank Auction Sale", "Loan Rescheduling & Settlement Negotiations", "Mortgage & Personal Guarantee Liabilities"],
    prepDocuments: ["Original or copy of dishonored cheque", "Bank Dishonor Memo / Return Slip", "Legal Demand Notice & Registered Post / AD receipt", "Sanction letter / mortgage documents"],
    recommendedQuestions: ["Has the 30-day statutory notice period been strictly complied with?", "Can an amicable settlement be recorded before the magistrate?", "What defense exists against personal guarantor liability?"],
    iconKey: "credit-card",
    highlightBadge: "Strict Deadlines",
    estimatedFeeRange: "৳1,800 – ৳4,000 / consultation",
  },
  "constitutional & civil rights": {
    banglaTitle: "রিট ও সাংবিধানিক প্রতিকার",
    category: "Constitutional & Writ",
    jurisdiction: "Supreme Court of Bangladesh (High Court Division)",
    shortDesc: "Enforce fundamental rights against illegal administrative actions, government inaction, arbitrary cancellations, or unlawful detentions.",
    fullDesc: "Under Article 102 of the Bangladesh Constitution, the High Court Division possesses extraordinary writ jurisdiction. When state authorities, statutory bodies, or government departments act unlawfully, a writ of Mandamus, Certiorari, or Prohibition can grant immediate relief.",
    statutes: ["Constitution of Bangladesh (Article 102)", "General Clauses Act 1897", "Civil Procedure Code (principles)"],
    commonMatters: ["Writ of Mandamus (compelling official duty)", "Writ of Certiorari (quashing illegal state orders)", "Writ of Habeas Corpus (illegal detention)", "Tender & Public Procurement Challenges", "Government Service & Pension Deprivation"],
    prepDocuments: ["Impugned Government Order / Notification", "Formal representation made to relevant Ministry/Authority", "Departmental communication trail", "National ID & relevant licenses"],
    recommendedQuestions: ["Is there an alternative legal remedy available before filing a writ?", "What are the grounds for an ad-interim stay from the High Court?", "How quickly can the writ petition be moved before a bench?"],
    iconKey: "scale",
    highlightBadge: "Supreme Court",
    estimatedFeeRange: "৳3,000 – ৳8,000 / consultation",
  },
  "labor & employment law": {
    banglaTitle: "শ্রম ও কর্মসংস্থান আইন",
    category: "Corporate & Commercial",
    jurisdiction: "Labour Courts of Bangladesh • Labour Appellate Tribunal",
    shortDesc: "Legal protection for unlawful termination, retrenchment, gratuity/provident fund claims, service rules, and workplace compliance.",
    fullDesc: "Both employees and corporate employers require precise guidance under the Bangladesh Labour Act 2006. Consult certified advocates on statutory severance packages, grievance procedures, show-cause inquiries, trade union compliance, and safety standards.",
    statutes: ["Bangladesh Labour Act 2006 (Amended)", "Bangladesh Labour Rules 2015", "Payment of Wages Act"],
    commonMatters: ["Unlawful Dismissal / Termination Grievance", "Gratuity, Provident Fund & Severance Claims", "Workplace Inquiries & Show-Cause Notices", "Employment Agreement & Non-Compete Clauses", "Labour Court Case Representation"],
    prepDocuments: ["Appointment Letter & Service Rules", "Termination / Show-Cause / Charge Notice", "Service Book & Salary Slips", "Formal Grievance Petition submitted to Employer"],
    recommendedQuestions: ["What is the mandatory 30-day notice requirement for filing a grievance?", "How is statutory gratuity calculated for my years of service?", "Is the non-compete clause in my contract legally enforceable?"],
    iconKey: "users",
    highlightBadge: "Workplace Rights",
    estimatedFeeRange: "৳1,500 – ৳3,500 / consultation",
  },
  "cyber & digital security law": {
    banglaTitle: "সাইবার অপরাধ, ডেটা ও আইটি আইন",
    category: "Criminal & Bail",
    jurisdiction: "Cyber Tribunals of Bangladesh • CID Cyber Police",
    shortDesc: "Legal action against online harassment, financial phishing, social media defamation, identity theft, and tech compliance advisory.",
    fullDesc: "With expanding digital services and social networks, cyber offenses require specialized legal and evidentiary knowledge. Consult advocates who understand digital forensics, preserving electronic evidence, filing cyber complaints, and defending Cyber Security Act allegations.",
    statutes: ["Cyber Security Act 2023", "ICT Act 2006 (as applicable)", "Telecommunication Act 2001"],
    commonMatters: ["Social Media Harassment & Fake Profiles", "Financial Phishing & Mobile Banking Scams", "Online Defamation & Hate Speech", "Unauthorized Data Access & Hacking", "Electronic Evidence Admissibility"],
    prepDocuments: ["Screenshots showing exact timestamp & profile URLs", "Email headers & communication records", "Bank / bKash / Nagad transaction statements", "Police General Diary (GD) copy"],
    recommendedQuestions: ["How can we legally preserve electronic evidence before it gets deleted?", "What is the procedure for filing directly before the Cyber Tribunal?", "Can we seek takedown orders through BTRC?"],
    iconKey: "lock",
    highlightBadge: "Digital Forensics",
    estimatedFeeRange: "৳1,500 – ৳4,000 / consultation",
  },
  "intellectual property": {
    banglaTitle: "বুদ্ধিবৃত্তিক সম্পদ ও ট্রেডমার্ক আইন",
    category: "Corporate & Commercial",
    jurisdiction: "Department of Patents, Designs & Trademarks (DPDT) • High Court",
    shortDesc: "Safeguard your brand name, trademark registration, copyright protection, patent filing, trade dress, and anti-counterfeiting enforcement.",
    fullDesc: "Protect your proprietary assets against unauthorized copying. Our IP advocates assist with trademark search, filing objections with DPDT, sending Cease & Desist notices, and pursuing trademark infringement suits before district courts and the High Court Division.",
    statutes: ["Trademarks Act 2009", "Copyright Act 2023", "Patents & Designs Act", "Geographical Indication Goods Act"],
    commonMatters: ["Trademark Search & Application Filing", "Opposition & Hearing before Registrar", "Cease & Desist Notices for Infringement", "Software & Content Copyright Registration", "Anti-Counterfeiting Raids & Injunctions"],
    prepDocuments: ["Logo representation / brand name specimen", "Proof of first commercial use in Bangladesh", "Business Trade License / Incorporation Certificate", "Infringing product samples / comparison photos"],
    recommendedQuestions: ["Is my trademark sufficiently distinctive to avoid objections?", "What remedies are available if a competitor registered my brand first?", "How long does the complete trademark registration cycle take?"],
    iconKey: "award",
    highlightBadge: "Brand Protection",
    estimatedFeeRange: "৳2,000 – ৳4,500 / consultation",
  },
  "taxation & revenue law": {
    banglaTitle: "আয়কর, ভ্যাট ও শুল্ক আইন",
    category: "Taxation & Maritime",
    jurisdiction: "Taxes Appellate Tribunal • Customs & VAT Tribunal • High Court",
    shortDesc: "Strategic counsel for income tax assessment appeals, corporate tax audits, VAT demand notices, NBR disputes, and customs tariff litigation.",
    fullDesc: "Taxation laws under the Income Tax Act 2023 are stringent and time-sensitive. Connect with qualified tax advocates and barristers for assessment challenges, penalty waivers, filing statutory appeals before Commissioners (Appeals), and High Court tax references.",
    statutes: ["Income Tax Act 2023", "VAT & Supplementary Duty Act 2012", "Customs Act 1969"],
    commonMatters: ["Disputed Income Tax Assessment Orders", "VAT Audit Demand Notice Challenges", "Taxes Appellate Tribunal Representation", "Customs Valuation & HS Code Disputes", "NBR Alternative Dispute Resolution (ADR)"],
    prepDocuments: ["Assessment Order & Demand Notice (IT-88/Notice)", "Submitted Annual Income Tax Return (IT-11)", "Books of Accounts / Audit Reports", "Correspondence with Deputy Commissioner of Taxes (DCT)"],
    recommendedQuestions: ["What percentage of tax must be deposited before filing an appeal?", "Can we apply for Alternative Dispute Resolution (ADR)?", "What are the grounds to quash an arbitrary best-judgment assessment?"],
    iconKey: "file-text",
    highlightBadge: "Act 2023 Compliant",
    estimatedFeeRange: "৳2,500 – ৳6,000 / consultation",
  },
  "admiralty & maritime law": {
    banglaTitle: "নৌ-বাণিজ্য ও আন্তর্জাতিক নৌ-আইন",
    category: "Taxation & Maritime",
    jurisdiction: "High Court Division (Admiralty Court) • Port Authorities",
    shortDesc: "Vessel arrest and release, maritime liens, bill of lading disputes, salvage, collision liabilities, and marine insurance arbitration.",
    fullDesc: "Bangladesh boasts major seaports in Chittagong and Mongla. Our admiralty barristers represent shipowners, charterers, P&I Clubs, and cargo interests in maritime jurisdiction matters before the Admiralty Court of the High Court Division.",
    statutes: ["Admiralty Court Act 2000", "Carriage of Goods by Sea Act 1925", "Bangladesh Merchant Shipping Ordinance"],
    commonMatters: ["Vessel Arrest & Security Furnishing", "Maritime Liens & Crew Wage Claims", "Cargo Damage & Short-Landing Claims", "Charter Party Disputes & Demurrage", "Marine Insurance & Salvage Advisory"],
    prepDocuments: ["Bill of Lading & Charter Party agreement", "Surveyor inspection report & tally sheets", "Notice of Claim served to vessel master", "Commercial invoices & packing lists"],
    recommendedQuestions: ["What security deposit is required for arresting a vessel?", "Does our claim qualify as a recognized maritime lien?", "Which port authority has territorial jurisdiction for this incident?"],
    iconKey: "globe",
    highlightBadge: "High Court Admiralty",
    estimatedFeeRange: "৳4,000 – ৳10,000 / consultation",
  },
  "inheritance, succession & probate": {
    banglaTitle: "উত্তরাধিকার, ফারায়েজ ও উইল সংক্রান্ত আইন",
    category: "Family & Personal",
    jurisdiction: "District Judge Court • Sub-Registrar Office",
    shortDesc: "Faraiz inheritance share computation, succession certificate applications, probate of wills, and estate administration.",
    fullDesc: "Navigating estate distribution requires precise knowledge of personal succession laws and statutory probate procedures. Consult our advocates to calculate accurate Faraiz shares, secure succession certificates for deceased bank accounts, and probate registered wills without family friction.",
    statutes: ["Succession Act 1925", "Muslim Personal Law (Shariat) Application Act 1937", "Probate & Administration Acts"],
    commonMatters: ["Succession Certificate for Bank Balances & Shares", "Probate of Registered Will (উইল প্রোবেট)", "Letters of Administration for Intestate Estates", "Islamic Faraiz Share Distribution Computation", "Partition of Inherited Family Property"],
    prepDocuments: ["Death Certificate of Deceased from City Corp/UP", "Waris Certificate (ওয়ারিশান সনদপত্র)", "Deceased person's bank statements/fixed deposit receipts", "Registered Will document (if available)"],
    recommendedQuestions: ["How long does the District Court take to issue a succession certificate?", "What is the exact fractional share of each legal heir under Faraiz?", "Is newspaper publication mandatory for obtaining probate?"],
    iconKey: "file-check",
    highlightBadge: "Estate Planning",
    estimatedFeeRange: "৳1,500 – ৳3,500 / consultation",
  },
  "immigration & nationality": {
    banglaTitle: "অভিবাসন ও নাগরিকত্ব আইন",
    category: "Constitutional & Writ",
    jurisdiction: "Department of Immigration & Passports • High Court Division",
    shortDesc: "Dual citizenship applications, foreign spouse visas, work permits (BIDA/BEPZA), deportation defense, and passport denial challenges.",
    fullDesc: "Guidance on Bangladesh citizenship regulations, residency permits, cross-border investor visas, and appealing arbitrary passport restrictions before administrative bodies and the High Court Division.",
    statutes: ["Citizenship Act 1951", "Bangladesh Citizenship (Temporary Provisions) Order 1972", "Passports Act 1920", "Foreigners Act 1946"],
    commonMatters: ["Dual Nationality Certificate Applications", "BIDA / BEPZA Expatriate Work Permits", "Passport Impoundment / Denial Challenges", "Renunciation and Resumption of Citizenship"],
    prepDocuments: ["Current & Expired Passports", "Proof of Bangladeshi Origin / NID / Birth Certificate", "BIDA / Ministry of Home Affairs clearance documents", "Marriage Certificate (for spousal visas)"],
    recommendedQuestions: ["What documents establish unbroken lineage for dual citizenship?", "What is the fastest route to challenge a passport refusal?", "What are the compliance mandates for foreign executives in Bangladesh?"],
    iconKey: "globe",
    highlightBadge: "Cross-Border",
    estimatedFeeRange: "৳2,000 – ৳5,000 / consultation",
  },
};

const categoryList = [
  "All Specializations",
  "Civil & Property",
  "Criminal & Bail",
  "Corporate & Commercial",
  "Family & Personal",
  "Constitutional & Writ",
  "Taxation & Maritime",
] as const;

// Helper to pick Icon safely
const getIcon = (key: string) => {
  switch (key?.toLowerCase()) {
    case "landmark":
    case "court":
      return Landmark;
    case "shield":
      return Shield;
    case "heart":
    case "users":
      return Heart;
    case "building":
    case "building2":
      return Building2;
    case "credit-card":
    case "dollar-sign":
      return CreditCard;
    case "scale":
      return Scale;
    case "lock":
      return Lock;
    case "award":
      return Award;
    case "file-text":
      return FileText;
    case "globe":
      return Globe;
    case "file-check":
      return FileCheck2;
    case "briefcase":
      return Briefcase;
    case "home":
      return Home;
    case "cpu":
      return Cpu;
    default:
      return Scale;
  }
};

// Enrichment helper that converts any backend PracticeArea record into a full display object
function enrichPracticeArea(backendItem: any): IPracticeAreaDetail {
  const title = (backendItem.title || "").trim();
  const lowerTitle = title.toLowerCase();

  // Find best matching metadata key
  const matchedKey = Object.keys(PRACTICE_AREA_METADATA_MAP).find((key) => {
    return lowerTitle.includes(key) || key.includes(lowerTitle);
  });

  const meta = matchedKey ? PRACTICE_AREA_METADATA_MAP[matchedKey] : null;
  const lawyersCount = backendItem._count?.lawyers ?? 0;

  return {
    id: backendItem.id,
    title: backendItem.title,
    banglaTitle: meta?.banglaTitle || "আইন ও বিচারিক পরামর্শ",
    category: meta?.category || "Corporate & Commercial",
    jurisdiction: meta?.jurisdiction || "District Courts & Supreme Court of Bangladesh",
    shortDesc:
      meta?.shortDesc ||
      `Specialized legal advisory, case vetting, and court representation for ${backendItem.title} across Bangladesh.`,
    fullDesc:
      meta?.fullDesc ||
      `Connect with verified advocates enrolled in Bangladesh Bar Council specializing in ${backendItem.title}. Receive professional preliminary case assessment, document review, and litigation assistance.`,
    statutes: meta?.statutes || ["Relevant Special Acts of Bangladesh", "Constitution of Bangladesh"],
    commonMatters: meta?.commonMatters || [
      "Legal Consultation & Written Advisory",
      "Drafting & Legal Notice Vetting",
      "Court Case Filing & Representation",
    ],
    prepDocuments: meta?.prepDocuments || [
      "National ID (NID) / Trade License",
      "All relevant dispute communications & notices",
      "Relevant agreements, contracts, or court orders",
    ],
    recommendedQuestions: meta?.recommendedQuestions || [
      "What are the statutory limitation periods applicable to this case?",
      "What preliminary court filings or notices are immediately necessary?",
      "What are the expected stages and realistic timeline for this matter?",
    ],
    iconKey: backendItem.icon || meta?.iconKey || "scale",
    highlightBadge:
      meta?.highlightBadge || (lawyersCount >= 6 ? "High Demand" : "Verified Advocates"),
    estimatedFeeRange: meta?.estimatedFeeRange || "৳1,500 – ৳4,000 / consultation",
    lawyerCount: lawyersCount,
  };
}

export default function PracticeAreasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Specializations");
  const [activeModalItem, setActiveModalItem] = useState<IPracticeAreaDetail | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // 1. Fetch practice areas dynamically from backend database API
  const { data: areasRes, isLoading } = useQuery({
    queryKey: ["practice-areas"],
    queryFn: () => apiClient<any[]>("/practice-areas"),
  });

  const backendAreas = areasRes?.data || [];

  // 2. Transform the real backend records into enriched display models
  const enrichedSpecializations = useMemo(() => {
    return backendAreas.map(enrichPracticeArea);
  }, [backendAreas]);

  // 3. Filter based on category and live search query
  const filteredSpecializations = useMemo(() => {
    return enrichedSpecializations.filter((item) => {
      // Category check
      const matchesCategory =
        selectedCategory === "All Specializations" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      // Search term check
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      const matchInTitle = item.title.toLowerCase().includes(q);
      const matchInBangla = item.banglaTitle.toLowerCase().includes(q);
      const matchInDesc =
        item.shortDesc.toLowerCase().includes(q) || item.fullDesc.toLowerCase().includes(q);
      const matchInMatters = item.commonMatters.some((m) => m.toLowerCase().includes(q));
      const matchInStatutes = item.statutes.some((s) => s.toLowerCase().includes(q));

      return matchInTitle || matchInBangla || matchInDesc || matchInMatters || matchInStatutes;
    });
  }, [enrichedSpecializations, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      <Navbar />

      {/* 1. LUXURY HERO BANNER & SEARCH */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-slate-800/80 bg-radial from-slate-900 via-slate-950 to-slate-950">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-1/4 w-[28rem] h-[28rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statutory Disclaimer Notice */}
          <div className="mb-8 max-w-4xl mx-auto">
            <LegalDisclaimerBanner className="bg-amber-950/40 border-amber-500/30 text-amber-200/90 shadow-lg shadow-amber-950/20 backdrop-blur-md" />
          </div>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-900/90 text-amber-300 border border-amber-500/30 shadow-inner">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Bangladesh Bar Council Enrolled Advocates</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Specialized Legal Practice Areas &{" "}
              <span className="bg-gradient-to-r from-amber-200 via-sky-200 to-amber-100 bg-clip-text text-transparent">
                Jurisdictions
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore verified Bangladeshi legal specializations. From the Supreme Court High Court Division to District & Sessions Courts, connect directly with advocates tailored to your exact case requirements.
            </p>

            {/* Quick Metrics Strip */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <p className="text-xs text-slate-400 font-medium">Practice Areas</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {backendAreas.length > 0 ? `${backendAreas.length} Domains` : "13 Domains"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <p className="text-xs text-slate-400 font-medium">Jurisdictions</p>
                <p className="text-lg font-bold text-sky-400 mt-0.5">64 District Bars</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <p className="text-xs text-slate-400 font-medium">Consultation Duration</p>
                <p className="text-lg font-bold text-amber-400 mt-0.5">30 – 60 Mins</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xs">
                <p className="text-xs text-slate-400 font-medium">Privacy Standard</p>
                <p className="text-lg font-bold text-emerald-400 mt-0.5">Privileged & Safe</p>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="pt-6 max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by legal issue (e.g. bail, land mutation, cheque dishonor, divorce, writ, trademark...)"
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 text-sm text-white placeholder-slate-400 rounded-2xl border border-slate-700/80 focus:outline-hidden focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 shadow-xl transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 p-1 text-slate-400 hover:text-white transition"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILL FILTER */}
      <section className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 shrink-0 pr-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              Category:
            </span>
            {categoryList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 font-bold scale-[1.02]"
                      : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PRACTICE AREAS GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedCategory === "All Specializations" ? "All Practice Areas" : selectedCategory}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Showing {filteredSpecializations.length} legal specializations in Bangladesh jurisdiction
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified Advocates Available for Live Booking
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-slate-900/50 border border-slate-800/80 p-7 space-y-5 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-slate-800" />
                  <div className="h-4 w-20 bg-slate-800 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
                <div className="h-14 bg-slate-800 rounded-xl" />
                <div className="h-10 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredSpecializations.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-amber-400 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No practice areas match your search</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Try searching for terms like &quot;land&quot;, &quot;bail&quot;, &quot;cheque&quot;, &quot;family&quot;, &quot;cyber&quot;, or reset your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Specializations");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecializations.map((area) => {
              const Icon = getIcon(area.iconKey);
              // Target URL directly filters lawyers by backend ID
              const targetUrl = `/lawyers?practiceAreaId=${area.id}`;

              return (
                <div
                  key={area.id}
                  className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-amber-400/40 p-6 sm:p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 hover:-translate-y-1 backdrop-blur-xs"
                >
                  {/* Subtle Top Gradient Line */}
                  <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/20 group-hover:via-amber-400/60 to-transparent transition" />

                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-amber-400 border border-slate-700/80 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-amber-400/40 transition duration-300">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="text-right">
                        {area.highlightBadge && (
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            {area.highlightBadge}
                          </span>
                        )}
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          {area.category}
                        </p>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition">
                        {area.title}
                      </h3>
                      <p className="text-xs font-medium text-amber-400/80">
                        {area.banglaTitle}
                      </p>
                    </div>

                    {/* Live Lawyer Availability Badge */}
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{area.lawyerCount} Verified Advocates Available</span>
                    </div>

                    {/* Jurisdiction badge */}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Landmark className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{area.jurisdiction}</span>
                    </div>

                    {/* Description */}
                    <p className="mt-3.5 text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {area.shortDesc}
                    </p>

                    {/* Common Matters Pills */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Common Matters Handled:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {area.commonMatters.slice(0, 3).map((matter, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50"
                          >
                            {matter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-5 border-t border-slate-800/90 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Typical advisory fee:</span>
                      <span className="font-semibold text-slate-200">{area.estimatedFeeRange}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveModalItem(area)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Prep Guide</span>
                      </button>

                      <Link
                        href={targetUrl}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-md shadow-amber-400/20 cursor-pointer"
                      >
                        <span>Find Advocates</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. BANGLADESH COURT & TRIBUNAL JURISDICTION HIERARCHY GUIDE */}
        <section className="pt-12 border-t border-slate-800/80 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Court System Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Understanding Bangladesh Court Jurisdictions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Where will your legal matter be addressed? Our advocates are licensed across every tier of the legal hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20">
                <Gavel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Supreme Court of Bangladesh</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprising the <strong className="text-amber-200">Appellate Division</strong> and <strong className="text-amber-200">High Court Division</strong>. Handles Writ Petitions under Article 102, constitutional remedies, company matters, admiralty, and appeals from subordinate tribunals.
              </p>
              <div className="pt-2 text-[11px] text-amber-300/80 font-medium">
                Practiced by Senior Advocates & Barristers
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-400/10 text-sky-400 flex items-center justify-center border border-sky-400/20">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">District & Sessions Courts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Operating across all <strong className="text-sky-200">64 administrative districts</strong>. Includes District Judge Court, Sessions Judge Court, Chief Judicial Magistrate (CJM), and Chief Metropolitan Magistrate (CMM) for original civil suits and criminal trials.
              </p>
              <div className="pt-2 text-[11px] text-sky-300/80 font-medium">
                District Bar Association Enrolled Advocates
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/20">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Specialized Tribunals</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Designated benches for specific statutory matters: <strong className="text-emerald-200">Artha Rin Adalat</strong> (money loan recovery), <strong className="text-emerald-200">Cyber Tribunal</strong>, <strong className="text-emerald-200">Family Court</strong>, <strong className="text-emerald-200">Labour Court</strong>, and Taxes Appellate Tribunal.
              </p>
              <div className="pt-2 text-[11px] text-emerald-300/80 font-medium">
                Field-Specific Tribunal Advocates
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW TO PREPARE STEPPER */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                4-Step Process
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                How Legal Consultations Work on LegalEase
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Prepare for maximum clarity before your scheduled session with a verified advocate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Select Practice Area</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by legal domain and city or court jurisdiction to find the right advocate.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Verify Bar Credentials</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review bar council enrollment number, court experience, and hourly consultation fees.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Attach Case Papers</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload Khatiyan, FIR, contracts, or notices in encrypted cloud storage prior to the call.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-black text-sm flex items-center justify-center">
                4
              </div>
              <h4 className="text-sm font-bold text-white">Consult & Receive Advice</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join video call or visit chamber, then receive structured written advice notes.
              </p>
            </div>
          </div>
        </section>

        {/* 6. FREQUENTLY ASKED QUESTIONS */}
        <section className="pt-8 border-t border-slate-800/80 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-2xl font-bold text-white">
              Practice Area Consultations FAQ
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: "How do I know which practice area my case falls under?",
                a: "If your matter involves land, deeds, or partition, choose Real Estate & Property. If police or criminal complaints are involved, select Criminal Defense. If your issue involves both (e.g. fraudulent deed plus criminal cheating), start with a preliminary consultation under Real Estate Law, and the advocate will guide you on simultaneous criminal steps.",
              },
              {
                q: "Can a Supreme Court advocate represent me in a District Court?",
                a: "Yes. Advocates enrolled in the High Court Division are legally authorized to practice in all subordinate courts across Bangladesh. However, local chamber advocates often provide practical advantages for daily filing in district court registries.",
              },
              {
                q: "Is my consultation protected under lawyer-client privilege?",
                a: "Yes. Under Section 126 of the Evidence Act 1872 of Bangladesh, communications between an advocate and client for the purpose of professional engagement are confidential and legally privileged.",
              },
              {
                q: "What does the consultation fee cover?",
                a: "The fee covers a dedicated 30 or 60-minute discussion (via encrypted video call, phone, or in-person chamber meeting), review of uploaded preliminary case papers, and follow-up advice notes. It does not include formal in-court representation or filing fees.",
              },
            ].map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-200 hover:text-white transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. BOTTOM CTA */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-sky-500/10 to-amber-500/20 p-8 sm:p-12 border border-amber-400/30 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Need Direct Guidance on Your Specific Case?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Browse through our comprehensive directory of verified advocates or filter by your specific district in Bangladesh.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lawyers"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold hover:bg-amber-300 transition shadow-lg shadow-amber-400/20"
            >
              <span>Browse All Verified Advocates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-800 hover:text-white transition"
            >
              How Consultations Work
            </Link>
          </div>
        </section>
      </main>

      {/* 8. SLIDE-OVER QUICK PREPARATION DRAWER / MODAL */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
                  {React.createElement(getIcon(activeModalItem.iconKey), { className: "w-6 h-6" })}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {activeModalItem.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {activeModalItem.banglaTitle} • {activeModalItem.jurisdiction}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              {/* Scope & Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                  Scope of Representation
                </h4>
                <p className="leading-relaxed text-slate-200">
                  {activeModalItem.fullDesc}
                </p>
              </div>

              {/* Governing Statutes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Governing Statutes in Bangladesh
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalItem.statutes.map((statute, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
                    >
                      {statute}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document Preparation Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-sky-400" />
                  Recommended Documents to Have Ready
                </h4>
                <ul className="space-y-1.5">
                  {activeModalItem.prepDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Smart Questions to Ask */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Questions to Ask Your Advocate During Consultation
                </h4>
                <div className="space-y-1.5">
                  {activeModalItem.recommendedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-slate-300"
                    >
                      &ldquo;{q}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Rate: <strong className="text-white">{activeModalItem.estimatedFeeRange}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>

                <Link
                  href={`/lawyers?practiceAreaId=${activeModalItem.id}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <span>Book Advocate in This Area</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
