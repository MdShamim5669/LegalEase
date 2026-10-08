import React from "react";
import { AlertCircle, Scale } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-base text-amber-950">
            <AlertCircle className="w-5 h-5 text-amber-600" /> Statutory Disclaimer (Rule BR-20)
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            &quot;This is a preliminary consultation, not formal legal representation.&quot;
            <br />
            (এটি একটি প্রাথমিক পরামর্শ, কোনো আনুষ্ঠানিক আইনি প্রতিনিধিত্ব নয়।)
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <h1 className="text-2xl font-extrabold text-slate-900">LegalEase Platform Disclaimer</h1>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Nature of the Service</h2>
            <p>
              LegalEase is a technological intermediary enabling communication between users and licensed advocates. The platform does not constitute a law firm and does not provide formal legal services directly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. No Formal Attorney-Client Representation (No Vakalatnama)</h2>
            <p>
              Booking or attending a 30-minute preliminary consultation does NOT create a formal legal retainer, power of attorney (vakalatnama), or obligation for an advocate to file, appear in court, or represent the user in litigation. Formal representation requires separate bilateral agreement between the advocate and client outside this preliminary platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Bar Council Compliance</h2>
            <p>
              LegalEase complies with the Bangladesh Legal Practitioners and Bar Council Order, 1972 (President&apos;s Order No. 46 of 1972) and the Canons of Professional Conduct and Etiquette. The listing of advocates is informational and based strictly on verified Bar Council credentials.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
