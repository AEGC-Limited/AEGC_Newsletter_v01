"use client";

// ─────────────────────────────────────────────────────────────────────────────
// TIH Newsletter Campaign Composer
// Wired exclusively to /api/tih-newsletter/* endpoints
// Audience is always TIH — no category selector needed
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Send, Save, Eye, FileText, Clock, CheckCircle2,
  XCircle, Upload, X, Users, Mail, Zap, ImageIcon,
  Calendar, AlertCircle, RefreshCw, ChevronLeft
} from "lucide-react";
import { Icon } from "@iconify/react";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface TihSubscriberStats {
  summary: { active: number; total: number; verified: number };
}

interface Notification {
  show: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface CampaignState {
  subject:      string;
  content:      string;
  scheduledFor: Date | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken   = () => typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const HOURS   = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

const TOAST_COLORS = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error:   "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800",
};

const TOAST_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />,
  error:   <XCircle      className="w-5 h-5 text-red-600     flex-shrink-0 mt-0.5" />,
  warning: <AlertCircle  className="w-5 h-5 text-amber-600  flex-shrink-0 mt-0.5" />,
  info:    <Mail         className="w-5 h-5 text-blue-600    flex-shrink-0 mt-0.5" />,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────────────────────────────────────

function to24h(hour: string, period: string): number {
  let h = parseInt(hour);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
}

function validateImage(file: File): string | null {
  const valid = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!valid.includes(file.type)) return "Invalid file type. Use JPG, PNG, GIF or WebP.";
  if (file.size > 5 * 1024 * 1024) return "Image must be under 5 MB.";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Email preview renderer (simple HTML rendering)
// ─────────────────────────────────────────────────────────────────────────────

const EmailPreview = ({
  subject, content, imageUrl,
}: { subject: string; content: string; imageUrl: string | null }) => (
  <div className="max-w-2xl mx-auto">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-t-xl px-6 py-3 flex items-center gap-3 border border-b-0 border-gray-200 dark:border-gray-700">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-emerald-400" />
      </div>
      <div className="flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-500 truncate">
        TIH Newsletter Preview
      </div>
    </div>

    <div className="border border-gray-200 dark:border-gray-700 rounded-b-xl bg-white overflow-hidden">
      {/* Email header */}
      <div className="bg-indigo-700 px-8 py-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-indigo-300" />
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
            TIH Newsletter
          </span>
        </div>
        <h1 className="text-xl font-bold">{subject || "Your subject line goes here"}</h1>
      </div>

      {/* Campaign image */}
      {imageUrl && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image src={imageUrl} alt="Campaign image" fill className="object-cover" />
        </div>
      )}

      {/* Body */}
      <div className="px-8 py-6">
        {content ? (
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br/>") }}
          />
        ) : (
          <p className="text-gray-400 italic text-sm">Your email content will appear here…</p>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-100 px-8 py-5 text-center">
        <p className="text-xs text-gray-400">
          You're receiving this as a TIH subscriber.{" "}
          <span className="underline cursor-pointer">Unsubscribe</span>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          All-Encompassing Global Consult Limited · Block 1B, A Avenue, Sparklight Estate, Isheri, Ogun State
        </p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function TihCampaignComposer() {

  // ── State ──────────────────────────────────────────────────────────────────
  const [campaign, setCampaign] = useState<CampaignState>({
    subject: "", content: "", scheduledFor: undefined,
  });
  const [savedId,     setSavedId]     = useState<number | null>(null);
  const [activeTab,   setActiveTab]   = useState("compose");
  const [isSaving,    setIsSaving]    = useState(false);
  const [isSending,   setIsSending]   = useState(false);
  const [stats,       setStats]       = useState<TihSubscriberStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [notification, setNotification] = useState<Notification>({
    show: false, type: "info", message: "",
  });

  // image state
  const [selectedImage,   setSelectedImage]   = useState<File | null>(null);
  const [imagePreview,    setImagePreview]     = useState<string | null>(null);
  const [existingImgUrl,  setExistingImgUrl]   = useState<string | null>(null);
  const [imageAltText,    setImageAltText]     = useState("");
  const [uploadingImage,  setUploadingImage]   = useState(false);

  // schedule state
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [time,           setTime]           = useState({ hour: "09", minute: "00", period: "AM" });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const notify = useCallback((type: Notification["type"], message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification((n) => ({ ...n, show: false })), 5000);
  }, []);

  const setCamp = (patch: Partial<CampaignState>) =>
    setCampaign((c) => ({ ...c, ...patch }));

  const timeLabel = `${time.hour}:${time.minute} ${time.period}`;

  // ── Load subscriber stats ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/tih-newsletter/subscribers/stats`, {
          headers: authHeader(),
        });
        if (res.ok) setStats(await res.json());
      } catch { /* non-critical */ }
      finally { setStatsLoading(false); }
    })();
  }, []);

  // ── Image handlers ─────────────────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImage(file);
    if (err) { notify("error", err); return; }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearNewImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageAltText("");
  };

  const removeExistingImage = async () => {
    if (!savedId || !existingImgUrl) return;
    if (!confirm("Remove the campaign image?")) return;
    try {
      const res = await fetch(`${API}/api/tih-newsletter/campaigns/${savedId}/image`, {
        method: "DELETE", headers: authHeader(),
      });
      if (res.ok) { setExistingImgUrl(null); notify("success", "Image removed."); }
      else notify("error", "Failed to remove image.");
    } catch { notify("error", "Error removing image."); }
  };

  const uploadImage = async (campaignId: number): Promise<string | null> => {
    if (!selectedImage) return null;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("image",   selectedImage);
      fd.append("altText", imageAltText);
      const res = await fetch(
        `${API}/api/tih-newsletter/campaigns/${campaignId}/upload-image`,
        { method: "POST", headers: authHeader(), body: fd },
      );
      if (!res.ok) throw new Error((await res.json()).message ?? "Upload failed");
      const data = await res.json();
      setExistingImgUrl(data.imageUrl);
      clearNewImage();
      return data.imageUrl;
    } finally { setUploadingImage(false); }
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    if (!campaign.subject.trim()) { notify("error", "Subject is required."); return false; }
    if (!campaign.content.trim()) { notify("error", "Content is required.");  return false; }
    return true;
  };

  // ── Create / update campaign record ───────────────────────────────────────
  const persistCampaign = async (scheduledFor?: string): Promise<number | null> => {
    const isUpdate = savedId !== null;
    const url    = isUpdate
      ? `${API}/api/tih-newsletter/campaigns/${savedId}`
      : `${API}/api/tih-newsletter/campaigns`;
    const method = isUpdate ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        subject:     campaign.subject,
        content:     campaign.content,
        scheduledFor: scheduledFor ?? null,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to save campaign");
    }

    const data = await res.json();
    const id   = isUpdate ? savedId! : (data.id as number);
    if (!isUpdate) setSavedId(id);
    return id;
  };

  // ── Save draft ─────────────────────────────────────────────────────────────
  const handleSaveDraft = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const id = await persistCampaign();
      if (id && selectedImage) {
        try { await uploadImage(id); }
        catch { notify("warning", "Draft saved but image upload failed."); return; }
      }
      notify("success", "Draft saved successfully.");
    } catch (e: any) {
      notify("error", e.message ?? "Error saving draft.");
    } finally { setIsSaving(false); }
  };

  // ── Schedule ───────────────────────────────────────────────────────────────
  const handleSchedule = async () => {
    if (!validate()) return;
    if (!campaign.scheduledFor) { notify("error", "Please pick a date and time."); return; }

    setIsSaving(true);
    try {
      const dt = new Date(campaign.scheduledFor);
      dt.setHours(to24h(time.hour, time.period), parseInt(time.minute), 0);

      const id = await persistCampaign(dt.toISOString());
      if (id && selectedImage) {
        try { await uploadImage(id); } catch { /* non-fatal */ }
      }
      notify("success", `Scheduled for ${dt.toLocaleString()}.`);
    } catch (e: any) {
      notify("error", e.message ?? "Error scheduling campaign.");
    } finally { setIsSaving(false); }
  };

  // ── Send now ───────────────────────────────────────────────────────────────
  const handleSendNow = async () => {
    if (!validate()) return;

    const activeCount = stats?.summary.active ?? 0;
    if (!confirm(
      `Send this campaign to all ${activeCount.toLocaleString()} active TIH subscribers?\n\nThis cannot be undone.`
    )) return;

    setIsSending(true);
    try {
      // 1. Persist campaign
      const id = await persistCampaign();
      if (!id) throw new Error("Could not create campaign record");

      // 2. Upload image if present
      if (selectedImage) {
        try { await uploadImage(id); } catch { /* non-fatal */ }
      }

      // 3. Send — TIH endpoint needs no targetAudience body
      const sendRes = await fetch(
        `${API}/api/tih-newsletter/campaigns/${id}/send`,
        { method: "POST", headers: { ...authHeader(), "Content-Type": "application/json" } },
      );

      if (!sendRes.ok) {
        const err = await sendRes.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to send campaign");
      }

      const data = await sendRes.json();
      notify(
        "success",
        `Campaign sent! ✅ ${data.successCount} delivered${data.failedCount ? ` · ❌ ${data.failedCount} failed` : ""}.`,
      );

      // Reset form after short delay
      setTimeout(() => {
        setCampaign({ subject: "", content: "", scheduledFor: undefined });
        setSavedId(null);
        clearNewImage();
        setExistingImgUrl(null);
        setActiveTab("compose");
      }, 3000);
    } catch (e: any) {
      notify("error", e.message ?? "Error sending campaign.");
    } finally { setIsSending(false); }
  };

  const busy = isSaving || isSending || uploadingImage;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 w-full max-w-sm border rounded-xl p-4 shadow-lg animate-in slide-in-from-top-2 ${TOAST_COLORS[notification.type]}`}>
          <div className="flex items-start gap-3">
            {TOAST_ICONS[notification.type]}
            <p className="text-sm flex-1 whitespace-pre-line">{notification.message}</p>
            <button onClick={() => setNotification((n) => ({ ...n, show: false }))}>
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Link href="/tih/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 uppercase tracking-wider">
              <Zap className="w-3 h-3" /> TIH
            </span>
            {savedId && (
              <span className="text-xs text-gray-400 font-medium">
                Draft #{savedId} saved
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Campaign Composer
          </h1>
        </div>

        {/* Recipient indicator */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
          <Users className="w-4 h-4 text-indigo-500" />
          <div>
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {statsLoading
                ? "Loading…"
                : `${(stats?.summary.active ?? 0).toLocaleString()} recipients`}
            </p>
            <p className="text-[10px] text-indigo-400">All active TIH subscribers</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-sm rounded-xl">
          <TabsTrigger value="compose"  className="gap-2 text-xs sm:text-sm rounded-lg">
            <FileText className="w-3.5 h-3.5" />Compose
          </TabsTrigger>
          <TabsTrigger value="preview"  className="gap-2 text-xs sm:text-sm rounded-lg">
            <Eye className="w-3.5 h-3.5" />Preview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2 text-xs sm:text-sm rounded-lg">
            <Calendar className="w-3.5 h-3.5" />Schedule
          </TabsTrigger>
        </TabsList>

        {/* ── COMPOSE ─────────────────────────────────────────────────────── */}
        <TabsContent value="compose" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main editor */}
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1f2e] shadow-sm p-6 space-y-6">

                {/* Subject */}
                <div>
                  <Label htmlFor="subject" className="text-sm font-semibold">
                    Subject Line <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={campaign.subject}
                    onChange={(e) => setCamp({ subject: e.target.value })}
                    placeholder="Write a compelling subject line…"
                    className="mt-2"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {campaign.subject.length}/200
                  </p>
                </div>

                {/* Image upload */}
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Header Image
                    <span className="text-xs font-normal text-gray-400">(optional · max 5 MB)</span>
                  </Label>

                  {/* Existing image */}
                  {existingImgUrl && !imagePreview && (
                    <div className="relative mt-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="relative h-48 w-full">
                        <Image src={existingImgUrl} alt="Campaign header" fill className="object-cover" />
                      </div>
                      <button
                        onClick={removeExistingImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  )}

                  {/* New image preview */}
                  {imagePreview && (
                    <div className="relative mt-3 rounded-xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700">
                      <div className="relative h-48 w-full">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                      <button
                        onClick={clearNewImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20">
                        <Label htmlFor="altText" className="text-xs font-medium">
                          Image description (accessibility)
                        </Label>
                        <Input
                          id="altText"
                          value={imageAltText}
                          onChange={(e) => setImageAltText(e.target.value)}
                          placeholder="Describe the image…"
                          className="mt-1.5 text-xs"
                          maxLength={200}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload zone */}
                  {!imagePreview && !existingImgUrl && (
                    <label
                      htmlFor="img-upload"
                      className="mt-3 flex flex-col items-center justify-center gap-2 w-full h-36 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-medium text-gray-500">Click to upload image</p>
                      <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP</p>
                      <input
                        id="img-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content" className="text-sm font-semibold">
                    Email Content <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={campaign.content}
                    onChange={(e) => setCamp({ content: e.target.value })}
                    placeholder={`Write your TIH newsletter here…\n\nYou can use HTML for rich formatting:\n<h2>Section heading</h2>\n<p>Paragraph text</p>\n<a href="...">Link text</a>`}
                    rows={14}
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {campaign.content.length} chars · HTML supported
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">

              {/* Recipient box */}
              <div className="rounded-2xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Audience</h3>
                </div>
                <div className="text-center py-2">
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                    {statsLoading ? "—" : (stats?.summary.active ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-indigo-500 mt-1">active TIH subscribers</p>
                </div>
                <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-700 flex justify-between text-xs text-indigo-400">
                  <span>{(stats?.summary.verified ?? 0).toLocaleString()} verified</span>
                  <span>{(stats?.summary.total ?? 0).toLocaleString()} total</span>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1f2e] p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Actions
                </h3>

                {/* Send Now */}
                <Button
                  onClick={handleSendNow}
                  disabled={busy}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                  {isSending ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" />Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" />Send to TIH Now</>
                  )}
                </Button>

                {/* Schedule */}
                <Button
                  onClick={() => setActiveTab("schedule")}
                  variant="outline"
                  disabled={busy}
                  className="w-full gap-2"
                >
                  <Calendar className="w-4 h-4" /> Schedule Send
                </Button>

                {/* Save draft */}
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  disabled={busy}
                  className="w-full gap-2"
                >
                  {isSaving ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" />Saving…</>
                  ) : (
                    <><Save className="w-4 h-4" />Save Draft</>
                  )}
                </Button>
              </div>

              {/* Tips */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1f2e] p-5 shadow-sm">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Tips
                </h3>
                <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">→</span>
                    Keep subject lines under 50 characters for best open rates
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">→</span>
                    Add a header image to boost click-through rates
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">→</span>
                    Preview before sending to check formatting
                  </li>
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">→</span>
                    Best send times: Tue–Thu, 9–11 AM or 2–4 PM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── PREVIEW ─────────────────────────────────────────────────────── */}
        <TabsContent value="preview" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              This is how your email will look in most clients.
            </p>
            <Button
              onClick={handleSendNow}
              disabled={busy}
              size="sm"
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="w-4 h-4" />
              {isSending ? "Sending…" : "Send Now"}
            </Button>
          </div>
          <EmailPreview
            subject={campaign.subject}
            content={campaign.content}
            imageUrl={imagePreview ?? existingImgUrl}
          />
        </TabsContent>

        {/* ── SCHEDULE ────────────────────────────────────────────────────── */}
        <TabsContent value="schedule" className="mt-6">
          <div className="max-w-lg mx-auto rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1f2e] shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Schedule Campaign
              </h2>
              <p className="text-sm text-gray-400">
                Choose when to send to your {(stats?.summary.active ?? 0).toLocaleString()} TIH subscribers.
              </p>
            </div>

            {/* Date picker */}
            <div>
              <Label className="text-sm font-semibold">Date</Label>
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between mt-2 font-normal">
                    {campaign.scheduledFor
                      ? campaign.scheduledFor.toLocaleDateString("en-GB", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "Pick a date"}
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <CalendarPicker
                    mode="single"
                    selected={campaign.scheduledFor}
                    onSelect={(d) => { setCamp({ scheduledFor: d }); setOpenDatePicker(false); }}
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time picker */}
            <div>
              <Label className="text-sm font-semibold">Time</Label>
              <div className="flex gap-2 mt-2">
                <Select value={time.hour}   onValueChange={(v) => setTime((t) => ({ ...t, hour:   v }))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
                <span className="self-center font-bold text-gray-400">:</span>
                <Select value={time.minute} onValueChange={(v) => setTime((t) => ({ ...t, minute: v }))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{MINUTES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={time.period} onValueChange={(v) => setTime((t) => ({ ...t, period: v }))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            {campaign.scheduledFor && (
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                  📅 Sending on{" "}
                  {campaign.scheduledFor.toLocaleDateString("en-GB", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric",
                  })}{" "}
                  at {timeLabel}
                </p>
                <p className="text-xs text-indigo-400 mt-1">
                  To {(stats?.summary.active ?? 0).toLocaleString()} active TIH subscribers
                </p>
              </div>
            )}

            <Button
              onClick={handleSchedule}
              disabled={busy || !campaign.scheduledFor}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              {isSaving ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Scheduling…</>
              ) : (
                <><Clock className="w-4 h-4" /> Confirm Schedule</>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}