"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  X,
  Lock,
  Smartphone,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { formatBDT } from "@/lib/utils";

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultationId: string;
  advocateName: string;
  amount: number;
  onPaymentSuccess?: () => void;
}

export function PaymentGatewayModal({
  isOpen,
  onClose,
  consultationId,
  advocateName,
  amount,
  onPaymentSuccess,
}: PaymentGatewayModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<"STRIPE" | "SSLCOMMERZ">("STRIPE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProceedToPayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";

      const res = await apiClient<any>(`/consultations/${consultationId}/pay`, {
        method: "POST",
        body: JSON.stringify({
          gateway: selectedGateway,
          provider: selectedGateway,
          origin,
        }),
      });

      const redirectUrl = res?.data?.paymentUrl || res?.data?.checkoutUrl || res?.data?.url;

      if (redirectUrl) {
        // Redirect to real gateway checkout session
        window.location.href = redirectUrl;
      } else {
        // Fallback for demo consultations
        if (selectedGateway === "STRIPE") {
          // Open Stripe Checkout sandbox or prompt
          window.location.href = `https://checkout.stripe.com/c/pay/cs_test_demo_${consultationId}`;
        } else {
          // Open SSLCommerz Sandbox
          window.location.href = `https://sandbox.sslcommerz.com/gwprocess/v4/gw.php?Q=pay&SESSIONKEY=ssl_demo_${consultationId}`;
        }
      }
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      // If error occurs (e.g. backend offline or demo ID), handle gracefully
      if (selectedGateway === "STRIPE") {
        setErrorMessage(
          err.message || "Failed to initialize Stripe checkout session. Please try again."
        );
      } else {
        setErrorMessage(
          err.message || "Failed to initialize SSLCommerz gateway session. Please try again."
        );
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-slate-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Bangladesh Bank Compliant & Encrypted
            </div>
            <h3 className="text-lg font-bold text-white">
              Select Payment Gateway
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose your preferred payment method to confirm consultation booking
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consultation Summary Strip */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Consultation with</span>
            <strong className="text-slate-900 font-bold">{advocateName}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Consultation Fee</span>
            <strong className="text-emerald-700 font-extrabold text-base">
              {formatBDT(amount)}
            </strong>
          </div>
        </div>

        {/* Gateway Selection Options */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Option 1: Stripe */}
            <div
              onClick={() => setSelectedGateway("STRIPE")}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedGateway === "STRIPE"
                  ? "border-sky-600 bg-sky-50/60 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedGateway === "STRIPE"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        Stripe Payment Gateway
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                        Cards & Global
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pay directly via Debit/Credit Cards (Visa, Mastercard, Amex), Apple Pay, or international bank cards.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        Visa / Mastercard
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        American Express
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Test Cards Supported
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedGateway === "STRIPE"
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selectedGateway === "STRIPE" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: SSLCommerz */}
            <div
              onClick={() => setSelectedGateway("SSLCOMMERZ")}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                selectedGateway === "SSLCOMMERZ"
                  ? "border-emerald-600 bg-emerald-50/60 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      selectedGateway === "SSLCOMMERZ"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        SSLCommerz Gateway
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                        MFS & BD Banks
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Instant mobile banking via bKash, Nagad, Rocket, Upay, DBBL Nexus, and Bangladeshi internet banking.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px] text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 font-bold">
                        bKash
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        Nagad
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                        Rocket
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        DBBL / Local Banks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedGateway === "SSLCOMMERZ"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selectedGateway === "SSLCOMMERZ" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              256-bit End-to-End SSL Encryption
            </span>
            <span>Official LegalEase Escrow</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleProceedToPayment}
            disabled={isProcessing}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md cursor-pointer ${
              selectedGateway === "STRIPE"
                ? "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            {isProcessing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Redirecting to {selectedGateway === "STRIPE" ? "Stripe" : "SSLCommerz"}...</span>
              </>
            ) : (
              <>
                <span>
                  Pay {formatBDT(amount)} via{" "}
                  {selectedGateway === "STRIPE" ? "Stripe" : "SSLCommerz"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default PaymentGatewayModal;
