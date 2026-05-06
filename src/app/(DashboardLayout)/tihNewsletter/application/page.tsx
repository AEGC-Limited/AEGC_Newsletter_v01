'use client';
import React, { useState, useEffect } from 'react';
import {
  FileText, Eye, RefreshCw, AlertCircle, Download, Search, Filter,
  X, Users, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProgramApplication {
  organisation: any;
  id: number;
  programTrack: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city?: string;
  gender: string;
  ageRange?: string;
  linkedInUrl?: string;
  resumeLink?: string;
  uploadedResumeUrl?: string;
  currentEmploymentStatus: string;
  yearsOfExperience?: string;
  whyJoinProgram: string;
  expectedImpact: string;
  technicalProficiency: string;
  relevantTools?: string;
  hasLaptop: boolean;
  hasReliableInternet: boolean;
  availability: string;
  scholarshipRequested: boolean;
  interestAreas: string;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: string;
  applicationStatus: string;
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
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
  Rejected: 'bg-red-100 text-red-800',
};

const ProgramApplicantsDashboard = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ProgramApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ProgramApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1, pageSize: 20, totalCount: 0, totalPages: 0,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchApplications = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pagination.pageSize),
      });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (trackFilter !== 'all') params.append('programTrack', trackFilter);

      const response = await fetch(
        `${API_BASE_URL}/api/ProgramApplication/applications?${params}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();
      setApplications(data.data || []);
      setPagination(data.pagination || { page: 1, pageSize: 20, totalCount: 0, totalPages: 0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(1); }, [statusFilter, trackFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications(pagination.page);
    setRefreshing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const bool = (val: boolean) => (val ? '✅ Yes' : '❌ No');

  // Client-side search filter
  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase();
    return (
      !q ||
      app.email.toLowerCase().includes(q) ||
      app.firstName.toLowerCase().includes(q) ||
      app.lastName.toLowerCase().includes(q) ||
      app.programTrack.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q) ||
      (app.organisation && app.organisation.toLowerCase().includes(q))
    );
  });

  const uniqueTracks = Array.from(new Set(applications.map((a) => a.programTrack)));

  // Export CSV — all fields
//   const handleExportCSV = () => {
//     try {
//       const headers = [
//         'ID', 'Program Track', 'First Name', 'Last Name', 'Email', 'Phone Number',
//         'Country', 'City', 'Gender', 'Age Range', 'LinkedIn URL', 'Resume Link',
//         'Uploaded Resume URL', 'Employment Status', 'Years of Experience',
//         'Why Join Program', 'Expected Impact', 'Technical Proficiency',
//         'Relevant Tools', 'Has Laptop', 'Has Reliable Internet', 'Availability',
//         'Scholarship Requested', 'Interest Areas', 'Application Status',
//         'Review Notes', 'Reviewed At', 'Reviewed By', 'Submitted At', 'IP Address',
//       ];

//       const rows = filteredApps.map((a) => [
//         a.id,
//         a.programTrack,
//         a.firstName,
//         a.lastName,
//         a.email,
//         a.phoneNumber,
//         a.country,
//         a.city || '',
//         a.gender,
//         a.ageRange || '',
//         a.linkedInUrl || '',
//         a.resumeLink || '',
//         a.uploadedResumeUrl || '',
//         a.currentEmploymentStatus,
//         a.yearsOfExperience || '',
//         `"${(a.whyJoinProgram || '').replace(/"/g, '""')}"`,
//         `"${(a.expectedImpact || '').replace(/"/g, '""')}"`,
//         a.technicalProficiency,
//         a.relevantTools || '',
//         a.hasLaptop ? 'Yes' : 'No',
//         a.hasReliableInternet ? 'Yes' : 'No',
//         a.availability,
//         a.scholarshipRequested ? 'Yes' : 'No',
//         a.interestAreas,
//         a.applicationStatus,
//         `"${(a.reviewNotes || '').replace(/"/g, '""')}"`,
//         formatDate(a.reviewedAt),
//         a.reviewedBy || '',
//         formatDate(a.submittedAt),
//         a.ipAddress || '',
//       ]);

//       const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
//       const blob = new Blob([csvContent], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `20260506_AEGC_ProgramApplications_v01.csv`;
//       a.click();
//       window.URL.revokeObjectURL(url);

//       toast({ title: 'Success', description: `Exported ${filteredApps.length} application(s)` });
//     } catch {
//       toast({ title: 'Error', description: 'Failed to export', variant: 'destructive' });
//     }
//   };


const [exporting, setExporting] = useState(false);

const handleExportCSV = async () => {
  try {
    setExporting(true);
    const allRecords: ProgramApplication[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const params = new URLSearchParams({ page: String(page), pageSize: '100' });
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (trackFilter !== 'all') params.append('programTrack', trackFilter);

      const response = await fetch(
        `${API_BASE_URL}/api/ProgramApplication/applications?${params}`,
        { headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' } }
      );

      if (!response.ok) throw new Error('Failed to fetch applications for export');

      const data = await response.json();
      allRecords.push(...(data.data || []));
      totalPages = data.pagination?.totalPages ?? 1;
      page++;
    } while (page <= totalPages);

    // Build and download CSV inline
    const headers = [
      'ID', 'Program Track', 'First Name', 'Last Name', 'Email', 'Phone Number',
      'Country', 'City', 'Gender', 'Age Range', 'LinkedIn URL', 'Resume Link',
      'Uploaded Resume URL', 'Employment Status', 'Years of Experience',
      'Why Join Program', 'Expected Impact', 'Technical Proficiency',
      'Relevant Tools', 'Has Laptop', 'Has Reliable Internet', 'Availability',
      'Scholarship Requested', 'Interest Areas', 'Application Status',
      'Review Notes', 'Reviewed At', 'Reviewed By', 'Submitted At', 'IP Address',
    ];

    const rows = allRecords.map((a) => [
      a.id,
      a.programTrack,
      a.firstName,
      a.lastName,
      a.email,
      a.phoneNumber,
      a.country,
      a.city || '',
      a.gender,
      a.ageRange || '',
      a.linkedInUrl || '',
      a.resumeLink || '',
      a.uploadedResumeUrl || '',
      a.currentEmploymentStatus,
      a.yearsOfExperience || '',
      `"${(a.whyJoinProgram || '').replace(/"/g, '""')}"`,
      `"${(a.expectedImpact || '').replace(/"/g, '""')}"`,
      a.technicalProficiency,
      a.relevantTools || '',
      a.hasLaptop ? 'Yes' : 'No',
      a.hasReliableInternet ? 'Yes' : 'No',
      a.availability,
      a.scholarshipRequested ? 'Yes' : 'No',
      a.interestAreas,
      a.applicationStatus,
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
    a.download = `20260506_AEGC_ProgramApplications_v01.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({ title: 'Success', description: `Exported ${allRecords.length} application(s)` });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to export';
    toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
  } finally {
    setExporting(false);
  }
};


  const stats = {
    total: pagination.totalCount,
    pending: applications.filter((a) => a.applicationStatus === 'Pending').length,
    accepted: applications.filter((a) => a.applicationStatus === 'Accepted').length,
    rejected: applications.filter((a) => a.applicationStatus === 'Rejected').length,
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Applications</h3>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Program Applications</h1>
            <p className="text-gray-600">View and manage TIH program applicants</p>
          </div>
          <div className="flex gap-2">
            {/* <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button> */}


            <button
  onClick={handleExportCSV}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Users className="w-8 h-8 text-indigo-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Clock className="w-8 h-8 text-amber-500 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <XCircle className="w-8 h-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, track, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5 shrink-0" />
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Program Tracks</option>
                {uniqueTracks.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || trackFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No applications have been submitted yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Applicant', 'Email', 'Phone', 'Program Track', 'Country',
                      'Employment Status', 'Technical Level', 'Scholarship',
                      'Has Laptop', 'Status', 'Submitted', 'Actions',
                    ].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.firstName} {app.lastName}</div>
                        {app.gender && <div className="text-xs text-gray-500">{app.gender}{app.ageRange ? ` · ${app.ageRange}` : ''}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {app.programTrack}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.country}{app.city ? `, ${app.city}` : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.currentEmploymentStatus}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.technicalProficiency}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        {app.scholarshipRequested
                          ? <span className="text-amber-600 font-medium">Requested</span>
                          : <span className="text-gray-400">No</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        {app.hasLaptop
                          ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.applicationStatus] || 'bg-gray-100 text-gray-700'}`}>
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.submittedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => { setSelectedApp(app); setIsDetailModalOpen(true); }}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredApps.length} of {pagination.totalCount} applications (page {pagination.page} of {pagination.totalPages})</span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchApplications(pagination.page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchApplications(pagination.page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {filteredApps.length > 0 && pagination.totalPages <= 1 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredApps.length} of {pagination.totalCount} applications
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setIsDetailModalOpen(false)} />

          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <div>
                  <h3 className="text-xl font-semibold text-white">Application Details</h3>
                  <p className="text-indigo-200 text-sm mt-0.5">#{selectedApp.id} · {selectedApp.programTrack}</p>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5 overflow-y-auto max-h-[75vh]">

                {/* Personal Info */}
                <Section title="Personal Information">
                  <Row label="Full Name" value={`${selectedApp.firstName} ${selectedApp.lastName}`} />
                  <Row label="Email" value={selectedApp.email} />
                  <Row label="Phone Number" value={selectedApp.phoneNumber} />
                  <Row label="Gender" value={selectedApp.gender} />
                  <Row label="Age Range" value={selectedApp.ageRange} />
                  <Row label="Country" value={selectedApp.country} />
                  <Row label="City" value={selectedApp.city} />
                </Section>

                {/* Professional */}
                <Section title="Professional Background">
                  <Row label="Employment Status" value={selectedApp.currentEmploymentStatus} />
                  <Row label="Years of Experience" value={selectedApp.yearsOfExperience} />
                  <Row label="LinkedIn"
                    value={selectedApp.linkedInUrl
                      ? <a href={selectedApp.linkedInUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View Profile</a>
                      : undefined}
                  />
                  <Row label="Resume Link"
                    value={selectedApp.resumeLink
                      ? <a href={selectedApp.resumeLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View Resume</a>
                      : undefined}
                  />
                  <Row label="Uploaded CV"
                    value={selectedApp.uploadedResumeUrl
                      ? <a href={selectedApp.uploadedResumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Download CV</a>
                      : undefined}
                  />
                </Section>

                {/* Technical */}
                <Section title="Technical Profile">
                  <Row label="Technical Proficiency" value={selectedApp.technicalProficiency} />
                  <Row label="Relevant Tools / Technologies" value={selectedApp.relevantTools} />
                  <Row label="Has Laptop" value={bool(selectedApp.hasLaptop)} />
                  <Row label="Has Reliable Internet" value={bool(selectedApp.hasReliableInternet)} />
                </Section>

                {/* Motivation */}
                <Section title="Motivation & Goals">
                  <TextBlock label="Why Join Program" value={selectedApp.whyJoinProgram} />
                  <TextBlock label="Expected Impact" value={selectedApp.expectedImpact} />
                </Section>

                {/* Program Details */}
                <Section title="Program Details">
                  <Row label="Program Track" value={selectedApp.programTrack} />
                  <Row label="Interest Areas" value={selectedApp.interestAreas} />
                  <Row label="Availability" value={selectedApp.availability} />
                  <Row label="Scholarship Requested" value={bool(selectedApp.scholarshipRequested)} />
                </Section>

                {/* Application Status */}
                <Section title="Application Status">
                  <Row label="Status"
                    value={
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[selectedApp.applicationStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {selectedApp.applicationStatus}
                      </span>
                    }
                  />
                  <Row label="Submitted At" value={formatDate(selectedApp.submittedAt)} />
                  {selectedApp.reviewedAt && <Row label="Reviewed At" value={formatDate(selectedApp.reviewedAt)} />}
                  {selectedApp.reviewedBy && <Row label="Reviewed By" value={selectedApp.reviewedBy} />}
                  {selectedApp.reviewNotes && <TextBlock label="Review Notes" value={selectedApp.reviewNotes} />}
                </Section>

                {/* Submission Meta */}
                <Section title="Submission Metadata">
                  <Row label="IP Address" value={selectedApp.ipAddress} />
                </Section>

              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg border-t border-gray-200">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
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

export default ProgramApplicantsDashboard;