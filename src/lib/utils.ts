import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatInTimeZone } from "date-fns-tz";

/**
 * Combines Tailwind classes with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer taka into Bangladeshi Taka string (e.g. 1500 -> ৳1,500)
 * (PRD Section 2.5 & BR-24)
 */
export function formatBDT(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "৳0";
  return `৳${amount.toLocaleString("en-BD")}`;
}

/**
 * Format UTC date to Bangladesh Standard Time (Asia/Dhaka)
 * (PRD Section 2.5: UI Conventions)
 */
export function formatDhakaTime(
  date: string | Date,
  formatStr: string = "EEE, d MMM yyyy, h:mm a"
): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return formatInTimeZone(d, "Asia/Dhaka", formatStr);
  } catch {
    return String(date);
  }
}

/**
 * Resolves a lawyer's profile photo with high-res professional portraits as fallback.
 */
export function getLawyerPhoto(lawyer: any): string {
  if (lawyer?.profilePhoto && typeof lawyer.profilePhoto === "string" && lawyer.profilePhoto.trim() !== "") {
    return lawyer.profilePhoto;
  }
  if (lawyer?.user?.image && typeof lawyer.user.image === "string" && lawyer.user.image.trim() !== "") {
    return lawyer.user.image;
  }

  const name = (lawyer?.name || lawyer?.user?.name || "").toLowerCase();
  const gender = lawyer?.gender || "";

  const isFemale =
    gender === "FEMALE" ||
    name.includes("sara") ||
    name.includes("sadia") ||
    name.includes("farhana") ||
    name.includes("tahmina") ||
    name.includes("nusrat") ||
    name.includes("fatema") ||
    name.includes("aisha") ||
    name.includes("sharmin") ||
    name.includes("shamima") ||
    name.includes("rumana") ||
    name.includes("tasnim");

  const femalePortraits = [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600",
  ];

  const malePortraits = [
    "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
  ];

  const str = lawyer?.id || name || "lawyer";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash);

  return isFemale
    ? femalePortraits[index % femalePortraits.length]
    : malePortraits[index % malePortraits.length];
}
