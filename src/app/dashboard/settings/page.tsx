"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Phone, Camera, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY">("PROFILE");

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Security Form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Fetch client profile from API
  const { data: profileData } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: async () => {
      try {
        const res = await apiClient("/client/me");
        return res?.data;
      } catch {
        return null;
      }
    },
    retry: 1,
  });

  useEffect(() => {
    if (profileData) {
      if (profileData.name) setName(profileData.name);
      if (profileData.email) setEmail(profileData.email);
      if (profileData.contactNumber) setPhone(profileData.contactNumber);
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setName(parsed.name || "Legal Client");
          setEmail(parsed.email || "user@legalease.com.bd");
        } catch {}
      }
    }
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string; contactNumber: string }) => {
      return await apiClient("/client/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      setProfileSuccess("Profile details updated successfully.");
      setProfileError(null);
      queryClient.invalidateQueries({ queryKey: ["clientProfile"] });
      // Update stored user
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            parsed.name = name;
            localStorage.setItem("user", JSON.stringify(parsed));
          } catch {}
        }
      }
    },
    onError: (err: any) => {
      setProfileError(err?.message || "Failed to update profile. Please try again.");
      setProfileSuccess(null);
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    updateProfileMutation.mutate({ name, contactNumber: phone });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await apiClient("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: oldPassword || undefined,
          newPassword,
        }),
      });

      if (res.success) {
        setPasswordSuccess("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(res.message || "Failed to update password.");
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Failed to update password. Please check your current password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your personal profile, credentials, and security preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
            activeTab === "PROFILE"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <User className="w-4 h-4" /> Profile Information
        </button>
        <button
          onClick={() => setActiveTab("SECURITY")}
          className={`pb-2.5 transition flex items-center gap-1.5 border-b-2 ${
            activeTab === "SECURITY"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Password
        </button>
      </div>

      {activeTab === "PROFILE" ? (
        <form onSubmit={handleProfileSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-sky-400 font-bold text-xl flex items-center justify-center shadow-xs">
              {name ? name[0].toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{name || "LegalEase User"}</h3>
              <p className="text-xs text-slate-400">{email || "user@legalease.com.bd"}</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801700000000"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {updateProfileMutation.isPending ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Change Password</h2>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              {changingPassword ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
