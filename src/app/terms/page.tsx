import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-xs text-slate-500">Effective Date: October 2026 | LegalEase Bangladesh</p>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Booking and Cancellation (Rule BR-04)</h2>
            <p>
              Consultations must be booked at least 2 hours in advance of the scheduled start time. Clients can cancel a consultation up to 2 hours before the start time for a refund (subject to payment gateway processing fees). Cancellations made less than 2 hours before the start time are non-refundable.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Unpaid Slot Expiration (Rule BR-03)</h2>
            <p>
              When a client initiates a booking without paying immediately, the slot is reserved for 30 minutes. If payment is not completed within 30 minutes, the booking is automatically canceled, and the slot is released for others.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Conduct and Professional Etiquette</h2>
            <p>
              Both clients and advocates must maintain respect, dignity, and professional decorum. Harassment, abusive language, or fraudulent document submissions will result in immediate account suspension.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
