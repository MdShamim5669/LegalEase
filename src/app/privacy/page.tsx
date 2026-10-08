import React from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy & Confidentiality</h1>
        <p className="text-xs text-slate-500">LegalEase Data Governance & Attorney-Client Privilege Protection</p>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Case Document Confidentiality (PRD Section 1.3 & D10)</h2>
            <p>
              Uploaded case documents (PDFs, images) and written legal advice notes are strictly confidential and encrypted in storage. They are accessible exclusively by the specific client and the consulted advocate. Platform administrators cannot read document contents or advice notes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Data Security & Storage</h2>
            <p>
              Uploaded files are validated against malware and MIME types and stored securely via Cloudinary with signed access. User sessions are managed via secure httpOnly cookies. We never store unhashed passwords.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Rights of Users</h2>
            <p>
              Users have the right to inspect their consultation metadata, download their advice notes, request account deletion, and export receipts.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
