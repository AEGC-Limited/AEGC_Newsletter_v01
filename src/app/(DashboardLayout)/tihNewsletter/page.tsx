"use client";


import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  Users, Mail, MousePointer, Send, TrendingUp, TrendingDown,
  RefreshCw, Plus, Eye, Clock, CheckCircle, AlertCircle,
  BarChart3, Activity, Zap, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


interface TihStats {
  audience: string;
  summary: {
    total: number;
    active: number;
    inactive: number;
    verified: number;
  };
  engagement: {
    totalEmailsSent: number;
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    activeEngagers: number;
  };
  monthlyGrowth: Array<{
    month: string;
    subscriptions: number;
    unsubscriptions: number;
    netGrowth: number;
  }>;
  recentSubscriptions: Array<{
    id: number;
    email: string;
    subscribedAt: string;
    emailVerified: boolean;
  }>;
  timestamp: string;
}

interface TihCampaign {
  id: number;
  subject: string;
  status: string;
  hasImage: boolean;
  imageUrl?: string;
  totalRecipients: number;
  successfullySent: number;
  failed: number;
  uniqueOpens?: number;
  uniqueClicks?: number;
  openRate?: number;
  clickThroughRate?: number;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
}

interface TihCampaignAnalytics {
  campaignId: number;
  subject: string;
  audience: string;
  sentAt?: string;
  metrics: {
    totalSent: number;
    uniqueOpens: number;
    uniqueClicks: number;
    failed: number;
  };
  rates: {
    openRate: number;
    clickRate: number;
    clickToOpenRate: number;
    bounceRate: number;
  };
  benchmarks: {
    averageOpenRate: number;
    averageClickRate: number;
    performance: {
      openRateStatus: string;
      clickRateStatus: string;
    };
  };
  engagement: {
    topEngagedSubscribers: Array<{
      subscriberId: number;
      email: string;
      opens: number;
      clicks: number;
      engagementScore: number;
    }>;
    engagementTimeline: Array<{ hour: string; opens: number; clicks: number }>;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});
const fmt = (n: number) => n.toLocaleString();
const fmtPct = (n: number) => `${n.toFixed(1)}%`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label, value, sub, icon: Icon, accent, trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
  trend?: { up: boolean; label: string };
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
    {/* accent stripe */}
    <div className={`absolute inset-y-0 left-0 w-1 ${accent} rounded-l-2xl`} />

    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-xl ${accent.replace("bg-", "bg-").replace("-500", "-50")} dark:bg-white/5`}>
        <Icon className={`w-5 h-5 ${accent.replace("bg-", "text-")}`} />
      </div>
      {trend && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend.up
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.label}
        </span>
      )}
    </div>

    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {typeof value === "number" ? fmt(value) : value}
    </p>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
  </div>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Sent:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Sending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Draft:     "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    Failed:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? map.Draft}`}>
      {status}
    </span>
  );
};

// ── Performance bar ───────────────────────────────────────────────────────────
const PerfBar = ({ value, max = 100, color = "bg-indigo-500" }: { value: number; max?: number; color?: string }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
    <span className="text-xs font-medium text-gray-500 w-10 text-right">{fmtPct(value)}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function TihDashboardPage() {
  const [stats, setStats]           = useState<TihStats | null>(null);
  const [campaigns, setCampaigns]   = useState<TihCampaign[]>([]);
  const [analytics, setAnalytics]   = useState<TihCampaignAnalytics | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [statsRes, campaignsRes] = await Promise.all([
        fetch(`${API}/api/tih-newsletter/subscribers/stats`, { headers: authHeaders() }),
        fetch(`${API}/api/tih-newsletter/campaigns`,          { headers: authHeaders() }),
      ]);

      if (!statsRes.ok || !campaignsRes.ok) throw new Error("Failed to load TIH data");

      const [statsData, campaignsData] = await Promise.all([
        statsRes.json(),
        campaignsRes.json(),
      ]);

      setStats(statsData);
      const camps: TihCampaign[] = campaignsData.campaigns ?? [];
      setCampaigns(camps);

      // Auto-load analytics for the most recently sent campaign
      const latest = camps.find((c) => c.status === "Sent");
      if (latest) {
        setSelectedCampaignId(latest.id);
        fetchCampaignAnalytics(latest.id);
      }
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchCampaignAnalytics = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/tih-newsletter/campaigns/${id}/analytics`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      setAnalytics(await res.json());
    } catch {/* silent — analytics are supplementary */}
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
  };

  // ── Chart data ─────────────────────────────────────────────────────────────
  const growthChartOptions: ApexOptions = {
    chart: { toolbar: { show: false }, stacked: true, sparkline: { enabled: false } },
    colors: ["#6366f1", "#f43f5e"],
    dataLabels: { enabled: false },
    plotOptions: { bar: { columnWidth: "40%", borderRadius: 4 } },
    xaxis: {
      categories: stats?.monthlyGrowth.map((d) => d.month) ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: { labels: { style: { fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px" },
    tooltip: { theme: "light" },
  };

  const growthSeries = [
    {
      name: "Subscriptions",
      data: stats?.monthlyGrowth.map((d) => d.subscriptions) ?? [],
    },
    {
      name: "Unsubscriptions",
      data: stats?.monthlyGrowth.map((d) => -d.unsubscriptions) ?? [],
    },
  ];

  const timelineOptions: ApexOptions = {
    chart: { toolbar: { show: false }, type: "area" },
    colors: ["#6366f1", "#10b981"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0 } },
    xaxis: {
      categories: analytics?.engagement.engagementTimeline.map((t) =>
        t.hour.slice(11, 16)) ?? [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: "10px" } },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px" },
    tooltip: { theme: "light" },
  };

  const timelineSeries = [
    { name: "Opens",  data: analytics?.engagement.engagementTimeline.map((t) => t.opens)  ?? [] },
    { name: "Clicks", data: analytics?.engagement.engagementTimeline.map((t) => t.clicks) ?? [] },
  ];

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 font-medium">Loading TIH Dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="font-semibold text-gray-800 dark:text-white">Failed to load dashboard</p>
          <p className="text-sm text-gray-500">{error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">Try again</Button>
        </div>
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="space-y-8 pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 uppercase tracking-wider">
              <Zap className="w-3 h-3" /> TIH
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Newsletter Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            The Innovation Hub · {fmt(s.summary.active)} active subscribers
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/tih/campaigns/add">
            <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Subscribers"
          value={s.summary.active}
          sub={`${fmt(s.summary.total)} total · ${fmt(s.summary.verified)} verified`}
          icon={Users}
          accent="bg-indigo-500"
        />
        <StatCard
          label="Avg. Open Rate"
          value={fmtPct(s.engagement.averageOpenRate)}
          sub={`${fmt(s.engagement.totalOpens)} total opens`}
          icon={Mail}
          accent="bg-emerald-500"
          trend={
            s.engagement.averageOpenRate >= 21.5
              ? { up: true,  label: "Above avg" }
              : { up: false, label: "Below avg" }
          }
        />
        <StatCard
          label="Total Clicks"
          value={s.engagement.totalClicks}
          sub={`${fmt(s.engagement.activeEngagers)} active engagers`}
          icon={MousePointer}
          accent="bg-violet-500"
        />
        <StatCard
          label="Campaigns Sent"
          value={campaigns.filter((c) => c.status === "Sent").length}
          sub={`${campaigns.filter((c) => c.status === "Draft").length} drafts · ${campaigns.filter((c) => c.status === "Scheduled").length} scheduled`}
          icon={Send}
          accent="bg-amber-500"
        />
      </div>

      {/* ── Growth chart + Recent subscribers ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Growth Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Subscriber Growth</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-300" />
          </div>
          <Chart
            options={growthChartOptions}
            series={growthSeries}
            type="bar"
            height={220}
          />
        </div>

        {/* Recent Subscribers */}
        <div className="rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Sign-ups</h2>
            <Link
              href="/tih/subscribers"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="space-y-3 flex-1 overflow-y-auto">
            {s.recentSubscriptions.slice(0, 8).map((sub) => (
              <li key={sub.id} className="flex items-center gap-3">
                {/* avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {sub.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{sub.email}</p>
                  <p className="text-xs text-gray-400">{fmtDate(sub.subscribedAt)}</p>
                </div>
                {sub.emailVerified && (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Campaign performance table ────────────────────────────────────── */}
      <div className="rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">TIH Campaigns</h2>
            <p className="text-xs text-gray-400 mt-0.5">{campaigns.length} total</p>
          </div>
          <Link href="/tih/campaigns">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <Eye className="w-3.5 h-3.5" />
              View all
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/[0.02]">
                {["Subject", "Status", "Recipients", "Open Rate", "CTR", "Sent"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {campaigns.slice(0, 8).map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer ${
                    selectedCampaignId === c.id ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                  }`}
                  onClick={() => {
                    setSelectedCampaignId(c.id);
                    fetchCampaignAnalytics(c.id);
                  }}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-[240px]">
                      {c.subject}
                    </p>
                    {c.hasImage && (
                      <span className="text-xs text-gray-400 mt-0.5 block">📷 Has image</span>
                    )}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{fmt(c.totalRecipients)}</td>
                  <td className="px-6 py-4 w-36">
                    {c.status === "Sent" ? (
                      <PerfBar value={c.openRate ?? 0} color="bg-indigo-500" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 w-36">
                    {c.status === "Sent" ? (
                      <PerfBar value={c.clickThroughRate ?? 0} max={10} color="bg-emerald-500" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {c.sentAt ? fmtDate(c.sentAt) : c.scheduledFor ? (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Clock className="w-3 h-3" /> {fmtDate(c.scheduledFor)}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${
                      selectedCampaignId === c.id ? "text-indigo-500 rotate-90" : ""
                    }`} />
                  </td>
                </tr>
              ))}

              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Mail className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-400">No TIH campaigns yet</p>
                    <p className="text-xs text-gray-300 mt-1">Create your first campaign to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Campaign Analytics Panel (shown when a campaign is selected) ──── */}
      {analytics && selectedCampaignId && (
        <div className="rounded-2xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Campaign Analytics
              </h2>
              <span className="text-xs text-gray-400 ml-1 truncate max-w-[200px]">
                · {analytics.subject}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">

            {/* Left — metrics */}
            <div className="p-6 space-y-6">
              {/* Rate grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Open Rate",   value: analytics.rates.openRate,        status: analytics.benchmarks.performance.openRateStatus },
                  { label: "Click Rate",  value: analytics.rates.clickRate,       status: analytics.benchmarks.performance.clickRateStatus },
                  { label: "CTOR",        value: analytics.rates.clickToOpenRate, status: "" },
                  { label: "Bounce Rate", value: analytics.rates.bounceRate,      status: "" },
                ].map(({ label, value, status }) => (
                  <div key={label} className="rounded-xl bg-gray-50 dark:bg-white/[0.03] p-4">
                    <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{fmtPct(value)}</p>
                    {status && (
                      <p className={`text-xs mt-1 font-medium ${
                        status === "Above Average" ? "text-emerald-500" :
                        status === "Average"       ? "text-amber-500"   : "text-red-400"
                      }`}>{status}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Send metrics */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Send breakdown</p>
                {[
                  { label: "Sent",         value: analytics.metrics.totalSent,    color: "bg-indigo-500" },
                  { label: "Unique Opens", value: analytics.metrics.uniqueOpens,  color: "bg-emerald-500" },
                  { label: "Unique Clicks",value: analytics.metrics.uniqueClicks, color: "bg-violet-500" },
                  { label: "Failed",       value: analytics.metrics.failed,       color: "bg-red-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{fmt(value)}</span>
                  </div>
                ))}
              </div>

              {/* Top engagers */}
              {analytics.engagement.topEngagedSubscribers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Top Engagers
                  </p>
                  <ul className="space-y-2">
                    {analytics.engagement.topEngagedSubscribers.slice(0, 5).map((sub) => (
                      <li key={sub.subscriberId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {sub.email[0].toUpperCase()}
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 truncate text-xs">{sub.email}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2 text-xs">
                          <span className="text-gray-400">{sub.opens}📖</span>
                          <span className="text-gray-400">{sub.clicks}🖱️</span>
                          <span className="font-semibold text-indigo-600">{sub.engagementScore}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right — timeline chart */}
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Engagement Timeline
              </p>
              {analytics.engagement.engagementTimeline.length > 0 ? (
                <Chart
                  options={timelineOptions}
                  series={timelineSeries}
                  type="area"
                  height={280}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Activity className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No engagement data yet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}