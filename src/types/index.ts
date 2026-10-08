// src/types/index.ts
// LegalEase domain types conforming to PRD v2.0

export type UserRole = "CLIENT" | "LAWYER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type ConsultationStatus = "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
export type ConsultationType = "VIDEO" | "AUDIO" | "CHAMBER";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
export type PaymentGatewayProvider = "STRIPE" | "SSLCOMMERZ";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IPracticeArea {
  id: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  lawyerCount?: number;
}

export interface ILawyer {
  id: string;
  userId: string;
  user: IUser;
  barCouncilEnrollmentNo: string;
  experienceYears: number;
  bio?: string | null;
  chamberAddress?: string | null;
  courtJurisdiction?: string | null;
  hourlyRate: number;
  isVerified: boolean;
  verificationNote?: string | null;
  practiceAreas?: Array<{
    practiceArea: IPracticeArea;
  }>;
  rating?: number;
  totalReviews?: number;
  completedConsultations?: number;
}

export interface IClient {
  id: string;
  userId: string;
  user: IUser;
  district?: string | null;
  occupation?: string | null;
}

export interface ISchedule {
  id: string;
  startTime: string; // UTC
  endTime: string;   // UTC
}

export interface ILawyerSchedule {
  id: string;
  lawyerId: string;
  scheduleId: string;
  schedule: ISchedule;
  isBooked: boolean;
}

export interface ICaseDocument {
  id: string;
  consultationId: string;
  uploaderId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface ILegalAdvice {
  id: string;
  consultationId: string;
  lawyerId: string;
  content: string;
  nextSteps?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  id: string;
  consultationId: string;
  clientId: string;
  lawyerId: string;
  client?: { user: { name: string; avatarUrl?: string | null } };
  lawyer?: { user: { name: string } };
  rating: number; // 1 to 5
  comment?: string | null;
  isFlagged?: boolean;
  createdAt: string;
}

export interface IPayment {
  id: string;
  consultationId: string;
  amount: number; // integer taka
  currency: string; // "bdt"
  status: PaymentStatus;
  gateway: PaymentGatewayProvider;
  transactionId?: string | null;
  paidAt?: string | null;
}

export interface IConsultation {
  id: string;
  clientId: string;
  lawyerId: string;
  scheduleId: string;
  type: ConsultationType;
  status: ConsultationStatus;
  topic?: string | null;
  videoCallingId?: string | null;
  unpaidExpiresAt?: string | null;
  client?: IClient;
  lawyer?: ILawyer;
  schedule?: ISchedule;
  payment?: IPayment;
  documents?: ICaseDocument[];
  advice?: ILegalAdvice;
  review?: IReview;
  createdAt: string;
  updatedAt: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
