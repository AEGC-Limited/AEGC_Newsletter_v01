'use client';
import React, { useState, useEffect } from 'react';
import {
  FileText, Eye, RefreshCw, AlertCircle, Download, Search, Filter,
  X, Users, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  GraduationCap, Handshake, Save,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

type EntityType = 'mentor' | 'partner';

interface MentorApplication {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  country: string;
  linkedInProfile?: string;
  currentRole: string;
  yearsOfExperience: string;
  industryExpertise: string;
  mentorshipInterests: string;
  timeCommitment: string;
  mentoringPreferences: string;
  conflictOfInterest?: string;
  agreesToCodeOfConduct: boolean;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  submittedAt: string;
}

interface PartnerEnquiry {
  id: number;
  organizationName: string;
  organizationType: string;
  website?: string;
  contactFullName?: string;
  contactName?: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  partnershipType: string;
  areaOfInterest: string;
  budgetRange: string;
  decisionTimeline: string;
  acknowledgesCoBranding: boolean;
  agreesToPrivacyPolicy: boolean;
  agreesToDonorPrivacy: boolean;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  submittedAt: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  Accepted: 'bg-green-100 text-green-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const STATUS_OPTIONS = ['Pending', 'Under Review', 'Accepted', 'Approved', 'Rejected'];

// ─── Component ───────────────────────────────────────────────────────────────

const MentorPartnerDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<EntityType>('mentor');

  // Data
  const [mentorApps, setMentorApps] = useState<MentorApplication[]>([]);
  const [partnerEnqs, setPartnerEnqs] = useState<PartnerEnquiry[]>([]);

  // Pagination (separate per tab)
  const [mentorPagination, setMentorPagination] = useState<PaginationMeta>({
    page: 1, pageSize: 20, totalCount: 0, totalPages: 0,
  });
  const [partnerPagination, setPartnerPagination] = useState<PaginationMeta>({
    page: 1, pageSize: 20, totalCount: 0, totalPages: 0,
  });

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters (separate per tab)
  const [mentorSearch, setMentorSearch] = useState('');
  const [mentorStatusFilter, setMentorStatusFilter] = useState('all');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerStatusFilter, setPartnerStatusFilter] = useState('all');

  // Modal state
  const [selectedMentor, setSelectedMentor] = useState<MentorApplication | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerEnquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Status update state
  const [editStatus, setEditStatus] = useState('');
  const [editReviewNotes, setEditReviewNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // ── Fetchers ────────────────────────────────────────────────────────────────

  const fetchMentorApplications = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(mentorPagination.pageSize),
      });
      if (mentorStatusFilter !== 'all') params.append('status', mentorStatusFilter);

      const response = await fetch(
        `${API_BASE_URL}/api/MentorAndPartner/mentor/applications?${params}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch mentor applications');

      const data = await response.json();
      setMentorApps(data.data || []);
      setMentorPagination(data.pagination || { page: 1, pageSize: 20, totalCount: 0, totalPages: 0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerEnquiries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(partnerPagination.pageSize),
      });
      if (partnerStatusFilter !== 'all') params.append('status', partnerStatusFilter);

      const response = await fetch(
        `${API_BASE_URL}/api/MentorAndPartner/partner/enquiries?${params}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch partner enquiries');

      const data = await response.json();
      setPartnerEnqs(data.data || []);
      setPartnerPagination(data.pagination || { page: 1, pageSize: 20, totalCount: 0, totalPages: 0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mentor') fetchMentorApplications(1);
    else fetchPartnerEnquiries(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, mentorStatusFilter, partnerStatusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'mentor') await fetchMentorApplications(mentorPagination.page);
    else await fetchPartnerEnquiries(partnerPagination.page);
    setRefreshing(false);
  };

  // ── Status update ──────────────────────────────────────────────────────────

  const openDetail = (item: MentorApplication | PartnerEnquiry, type: EntityType) => {
    if (type === 'mentor') {
      setSelectedMentor(item as MentorApplication);
      setSelectedPartner(null);
    } else {
      setSelectedPartner(item as PartnerEnquiry);
      setSelectedMentor(null);
    }
    setEditStatus(item.status);
    setEditReviewNotes(item.reviewNotes || '');
    setIsDetailModalOpen(true);
  };

  const closeDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedMentor(null);
    setSelectedPartner(null);
    setEditStatus('');
    setEditReviewNotes('');
  };

  const handleStatusUpdate = async () => {
    const id = selectedMentor?.id ?? selectedPartner?.id;
    if (!id) return;

    const endpoint = activeTab === 'mentor'
      ? `${API_BASE_URL}/api/MentorAndPartner/mentor/${id}/status`
      : `${API_BASE_URL}/api/MentorAndPartner/partner/${id}/status`;

    try {
      setSavingStatus(true);
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editStatus,
          reviewNotes: editReviewNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();

      // Update local lists in place
      if (activeTab === 'mentor') {
        const updated = data.application as MentorApplication;
        setMentorApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
        setSelectedMentor((prev) => (prev ? { ...prev, ...updated } : prev));
      } else {
        const updated = data.enquiry as PartnerEnquiry;
        setPartnerEnqs((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
        setSelectedPartner((prev) => (prev ? { ...prev, ...updated } : prev));
      }

      toast({ title: 'Success', description: 'Status updated and notification email sent.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSavingStatus(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const bool = (val: boolean) => (val ? '✅ Yes' : '❌ No');

  const mentorName = (m: MentorApplication) => m.fullName || `${m.firstName} ${m.lastName}`;
  const partnerContact = (p: PartnerEnquiry) => p.contactFullName || p.contactName || '—';

  // ── Filtered data ─────────────────────────────────────────────────────────

  const filteredMentors = mentorApps.filter((m) => {
    const q = mentorSearch.toLowerCase();
    return (
      !q ||
      m.email.toLowerCase().includes(q) ||
      m.firstName?.toLowerCase().includes(q) ||
      m.lastName?.toLowerCase().includes(q) ||
      m.currentRole?.toLowerCase().includes(q) ||
      m.country?.toLowerCase().includes(q) ||
      m.industryExpertise?.toLowerCase().includes(q)
    );
  });

  const filteredPartners = partnerEnqs.filter((p) => {
    const q = partnerSearch.toLowerCase();
    return (
      !q ||
      p.contactEmail.toLowerCase().includes(q) ||
      p.organizationName?.toLowerCase().includes(q) ||
      partnerContact(p).toLowerCase().includes(q) ||
      p.partnershipType?.toLowerCase().includes(q) ||
      p.areaOfInterest?.toLowerCase().includes(q)
    );
  });

  // ── CSV Export ───────────────────────────────────────────────────────────

  const handleExportMentorCSV = async () => {
    try {
      setExporting(true);
      const allRecords: MentorApplication[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({ page: String(page), pageSize: '100' });
        if (mentorStatusFilter !== 'all') params.append('status', mentorStatusFilter);

        const response = await fetch(
          `${API_BASE_URL}/api/MentorAndPartner/mentor/applications?${params}`,
          { headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' } }
        );
        if (!response.ok) throw new Error('Failed to fetch mentor applications for export');

        const data = await response.json();
        allRecords.push(...(data.data || []));
        totalPages = data.pagination?.totalPages ?? 1;
        page++;
      } while (page <= totalPages);

      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Country',
        'LinkedIn Profile', 'Current Role', 'Years of Experience', 'Industry Expertise',
        'Mentorship Interests', 'Time Commitment', 'Mentoring Preferences',
        'Conflict of Interest', 'Agrees to Code of Conduct', 'Status',
        'Review Notes', 'Reviewed At', 'Reviewed By', 'Submitted At', 'IP Address',
      ];

      const rows = allRecords.map((a) => [
        a.id,
        a.firstName,
        a.lastName,
        a.email,
        a.phone,
        a.country,
        a.linkedInProfile || '',
        a.currentRole,
        a.yearsOfExperience,
        a.industryExpertise,
        a.mentorshipInterests,
        a.timeCommitment,
        a.mentoringPreferences,
        a.conflictOfInterest || '',
        a.agreesToCodeOfConduct ? 'Yes' : 'No',
        a.status,
        `"${(a.reviewNotes || '').replace(/"/g, '""')}"`,
        formatDate(a.reviewedAt),
        a.reviewedBy || '',
        formatDate(a.submittedAt),
        a.ipAddress || '',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `20260615_AEGC_MentorApplications_v01.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ title: 'Success', description: `Exported ${allRecords.length} mentor application(s)` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to export';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  const handleExportPartnerCSV = async () => {
    try {
      setExporting(true);
      const allRecords: PartnerEnquiry[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({ page: String(page), pageSize: '100' });
        if (partnerStatusFilter !== 'all') params.append('status', partnerStatusFilter);

        const response = await fetch(
          `${API_BASE_URL}/api/MentorAndPartner/partner/enquiries?${params}`,
          { headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' } }
        );
        if (!response.ok) throw new Error('Failed to fetch partner enquiries for export');

        const data = await response.json();
        allRecords.push(...(data.data || []));
        totalPages = data.pagination?.totalPages ?? 1;
        page++;
      } while (page <= totalPages);

      const headers = [
        'ID', 'Organization Name', 'Organization Type', 'Website',
        'Contact Name', 'Contact Role', 'Contact Email', 'Contact Phone',
        'Partnership Type', 'Area of Interest', 'Budget Range', 'Decision Timeline',
        'Acknowledges Co-Branding', 'Agrees to Privacy Policy', 'Agrees to Donor Privacy',
        'Status', 'Review Notes', 'Reviewed At', 'Reviewed By', 'Submitted At', 'IP Address',
      ];

      const rows = allRecords.map((p) => [
        p.id,
        p.organizationName,
        p.organizationType,
        p.website || '',
        partnerContact(p),
        p.contactRole,
        p.contactEmail,
        p.contactPhone,
        p.partnershipType,
        p.areaOfInterest,
        p.budgetRange,
        p.decisionTimeline,
        p.acknowledgesCoBranding ? 'Yes' : 'No',
        p.agreesToPrivacyPolicy ? 'Yes' : 'No',
        p.agreesToDonorPrivacy ? 'Yes' : 'No',
        p.status,
        `"${(p.reviewNotes || '').replace(/"/g, '""')}"`,
        formatDate(p.reviewedAt),
        p.reviewedBy || '',
        formatDate(p.submittedAt),
        p.ipAddress || '',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `20260615_AEGC_PartnerEnquiries_v01.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({ title: 'Success', description: `Exported ${allRecords.length} partner enquiry(ies)` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to export';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────────

  const mentorStats = {
    total: mentorPagination.totalCount,
    pending: mentorApps.filter((a) => a.status === 'Pending').length,
    accepted: mentorApps.filter((a) => a.status === 'Approved' || a.status === 'Accepted').length,
    rejected: mentorApps.filter((a) => a.status === 'Rejected').length,
  };

  const partnerStats = {
    total: partnerPagination.totalCount,
    pending: partnerEnqs.filter((e) => e.status === 'Pending').length,
    accepted: partnerEnqs.filter((e) => e.status === 'Approved' || e.status === 'Accepted').length,
    rejected: partnerEnqs.filter((e) => e.status === 'Rejected').length,
  };

  const currentPagination = activeTab === 'mentor' ? mentorPagination : partnerPagination;
  const currentFetch = activeTab === 'mentor' ? fetchMentorApplications : fetchPartnerEnquiries;
  const currentFilteredCount = activeTab === 'mentor' ? filteredMentors.length : filteredPartners.length;
  const currentSearch = activeTab === 'mentor' ? mentorSearch : partnerSearch;
  const currentStatusFilter = activeTab === 'mentor' ? mentorStatusFilter : partnerStatusFilter;

  // ── Loading / Error states ──────────────────────────────────────────────

  if (loading && mentorApps.length === 0 && partnerEnqs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  if (error && mentorApps.length === 0 && partnerEnqs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={handleRefresh} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor & Partner Enquiries</h1>
            <p className="text-gray-600">Review and manage TIH mentor applications and partnership enquiries</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={activeTab === 'mentor' ? handleExportMentorCSV : handleExportPartnerCSV}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mentor'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Mentor Applications
          </button>
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'partner'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Handshake className="w-4 h-4" />
            Partner Enquiries
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {activeTab === 'mentor' ? (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <Users className="w-8 h-8 text-indigo-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{mentorStats.total}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <Clock className="w-8 h-8 text-amber-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{mentorStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{mentorStats.accepted}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <XCircle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{mentorStats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <Users className="w-8 h-8 text-indigo-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{partnerStats.total}</div>
                <div className="text-sm text-gray-600">Total Enquiries</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <Clock className="w-8 h-8 text-amber-500 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{partnerStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{partnerStats.accepted}</div>
                <div className="text-sm text-gray-600">Approved</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <XCircle className="w-8 h-8 text-red-600 mb-2" />
                <div className="text-2xl font-bold text-gray-900">{partnerStats.rejected}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={activeTab === 'mentor'
                  ? 'Search by name, email, role, country...'
                  : 'Search by organization, contact, email, type...'}
                value={currentSearch}
                onChange={(e) => activeTab === 'mentor' ? setMentorSearch(e.target.value) : setPartnerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5 shrink-0" />
              <select
                value={currentStatusFilter}
                onChange={(e) => activeTab === 'mentor' ? setMentorStatusFilter(e.target.value) : setPartnerStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════ MENTOR TABLE ════════════════════════════════ */}
        {activeTab === 'mentor' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredMentors.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mentor Applications Found</h3>
                <p className="text-gray-600">
                  {mentorSearch || mentorStatusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No mentor applications have been submitted yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'Applicant', 'Email', 'Country', 'Current Role',
                        'Years of Exp.', 'Industry', 'Time Commitment', 'Status', 'Submitted', 'Actions',
                      ].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMentors.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{mentorName(m)}</div>
                          <div className="text-xs text-gray-500">{m.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.currentRole}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.yearsOfExperience}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {m.industryExpertise}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.timeCommitment}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[m.status] || 'bg-gray-100 text-gray-700'}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(m.submittedAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => openDetail(m, 'mentor')}
                            className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════ PARTNER TABLE ════════════════════════════════ */}
        {activeTab === 'partner' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {filteredPartners.length === 0 ? (
              <div className="text-center py-12">
                <Handshake className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partner Enquiries Found</h3>
                <p className="text-gray-600">
                  {partnerSearch || partnerStatusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No partnership enquiries have been submitted yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'Organization', 'Contact', 'Email', 'Partnership Type',
                        'Area of Interest', 'Budget Range', 'Timeline', 'Status', 'Submitted', 'Actions',
                      ].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPartners.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{p.organizationName}</div>
                          <div className="text-xs text-gray-500">{p.organizationType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{partnerContact(p)}</div>
                          <div className="text-xs text-gray-500">{p.contactRole}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.contactEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {p.partnershipType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.areaOfInterest}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.budgetRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.decisionTimeline}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[p.status] || 'bg-gray-100 text-gray-700'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(p.submittedAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => openDetail(p, 'partner')}
                            className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {currentPagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {currentFilteredCount} of {currentPagination.totalCount} {activeTab === 'mentor' ? 'applications' : 'enquiries'} (page {currentPagination.page} of {currentPagination.totalPages})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPagination.page <= 1}
                onClick={() => currentFetch(currentPagination.page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                disabled={currentPagination.page >= currentPagination.totalPages}
                onClick={() => currentFetch(currentPagination.page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentFilteredCount > 0 && currentPagination.totalPages <= 1 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {currentFilteredCount} of {currentPagination.totalCount} {activeTab === 'mentor' ? 'applications' : 'enquiries'}
          </div>
        )}
      </div>

      {/* ════════════════════════════════ DETAIL MODAL ════════════════════════════════ */}
      {isDetailModalOpen && (selectedMentor || selectedPartner) && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={closeDetail} />

          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedMentor ? 'Mentor Application Details' : 'Partner Enquiry Details'}
                  </h3>
                  <p className="text-indigo-200 text-sm mt-0.5">
                    {selectedMentor
                      ? `#${selectedMentor.id} · ${selectedMentor.industryExpertise}`
                      : `#${selectedPartner!.id} · ${selectedPartner!.partnershipType}`}
                  </p>
                </div>
                <button onClick={closeDetail} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[75vh]">

                {/* ── MENTOR DETAIL ── */}
                {selectedMentor && (
                  <>
                    <Section title="Applicant Information">
                      <Row label="Full Name" value={mentorName(selectedMentor)} />
                      <Row label="Email" value={selectedMentor.email} />
                      <Row label="Phone" value={selectedMentor.phone} />
                      <Row label="Country" value={selectedMentor.country} />
                      <Row label="LinkedIn"
                        value={selectedMentor.linkedInProfile
                          ? <a href={selectedMentor.linkedInProfile} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View Profile</a>
                          : undefined}
                      />
                    </Section>

                    <Section title="Professional Background">
                      <Row label="Current Role" value={selectedMentor.currentRole} />
                      <Row label="Years of Experience" value={selectedMentor.yearsOfExperience} />
                      <Row label="Industry Expertise" value={selectedMentor.industryExpertise} />
                    </Section>

                    <Section title="Mentorship Details">
                      <TextBlock label="Mentorship Interests" value={selectedMentor.mentorshipInterests} />
                      <Row label="Time Commitment" value={selectedMentor.timeCommitment} />
                      <TextBlock label="Mentoring Preferences" value={selectedMentor.mentoringPreferences} />
                      <TextBlock label="Conflict of Interest" value={selectedMentor.conflictOfInterest} />
                      <Row label="Agrees to Code of Conduct" value={bool(selectedMentor.agreesToCodeOfConduct)} />
                    </Section>

                    <Section title="Submission Metadata">
                      <Row label="Submitted At" value={formatDate(selectedMentor.submittedAt)} />
                      <Row label="IP Address" value={selectedMentor.ipAddress} />
                    </Section>
                  </>
                )}

                {/* ── PARTNER DETAIL ── */}
                {selectedPartner && (
                  <>
                    <Section title="Organization Information">
                      <Row label="Organization Name" value={selectedPartner.organizationName} />
                      <Row label="Organization Type" value={selectedPartner.organizationType} />
                      <Row label="Website"
                        value={selectedPartner.website
                          ? <a href={selectedPartner.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{selectedPartner.website}</a>
                          : undefined}
                      />
                    </Section>

                    <Section title="Contact Information">
                      <Row label="Contact Name" value={partnerContact(selectedPartner)} />
                      <Row label="Contact Role" value={selectedPartner.contactRole} />
                      <Row label="Contact Email" value={selectedPartner.contactEmail} />
                      <Row label="Contact Phone" value={selectedPartner.contactPhone} />
                    </Section>

                    <Section title="Partnership Details">
                      <Row label="Partnership Type" value={selectedPartner.partnershipType} />
                      <Row label="Area of Interest" value={selectedPartner.areaOfInterest} />
                      <Row label="Budget Range" value={selectedPartner.budgetRange} />
                      <Row label="Decision Timeline" value={selectedPartner.decisionTimeline} />
                      <Row label="Acknowledges Co-Branding" value={bool(selectedPartner.acknowledgesCoBranding)} />
                      <Row label="Agrees to Privacy Policy" value={bool(selectedPartner.agreesToPrivacyPolicy)} />
                      <Row label="Agrees to Donor Privacy" value={bool(selectedPartner.agreesToDonorPrivacy)} />
                    </Section>

                    <Section title="Submission Metadata">
                      <Row label="Submitted At" value={formatDate(selectedPartner.submittedAt)} />
                      <Row label="IP Address" value={selectedPartner.ipAddress} />
                    </Section>
                  </>
                )}

                {/* ── STATUS UPDATE (shared) ── */}
                <Section title="Application Status">
                  <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 px-4 py-2.5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1.5">Current Status</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[(selectedMentor ?? selectedPartner)!.status] || 'bg-gray-100 text-gray-700'}`}>
                        {(selectedMentor ?? selectedPartner)!.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 px-4 py-2.5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1.5">Update Status</div>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-span-full bg-gray-50 px-4 py-2.5 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1.5">Review Notes</div>
                    <textarea
                      value={editReviewNotes}
                      onChange={(e) => setEditReviewNotes(e.target.value)}
                      rows={3}
                      placeholder="Add internal notes about this application/enquiry..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {(selectedMentor ?? selectedPartner)!.reviewedAt && (
                    <>
                      <Row label="Last Reviewed At" value={formatDate((selectedMentor ?? selectedPartner)!.reviewedAt)} />
                      <Row label="Reviewed By" value={(selectedMentor ?? selectedPartner)!.reviewedBy} />
                    </>
                  )}
                </Section>

              </div>

              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between rounded-b-lg border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Updating status will trigger an automated email notification to the applicant.
                </p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={closeDetail}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={savingStatus || editStatus === (selectedMentor ?? selectedPartner)!.status && editReviewNotes === ((selectedMentor ?? selectedPartner)!.reviewNotes || '')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className={`w-4 h-4 ${savingStatus ? 'animate-spin' : ''}`} />
                    {savingStatus ? 'Saving...' : 'Save & Notify'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Helper sub-components ───────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-2 border-b border-indigo-100 pb-1">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value?: React.ReactNode | string }) => (
  <div className="bg-gray-50 px-4 py-2.5 rounded-lg">
    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
    <div className="text-sm font-medium text-gray-900">{value ?? 'Not provided'}</div>
  </div>
);

const TextBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="col-span-full bg-gray-50 px-4 py-2.5 rounded-lg">
    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
    <div className="text-sm text-gray-900 leading-relaxed">{value || 'Not provided'}</div>
  </div>
);

export default MentorPartnerDashboard;