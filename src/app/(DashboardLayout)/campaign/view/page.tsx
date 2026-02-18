





// 'use client';
// import React, { useState, useEffect } from 'react';
// import { X, Mail, Users, CheckCircle, XCircle, Clock, Eye, MousePointer, Calendar, Send, RefreshCw, Plus, Trash2, Edit, AlertCircle } from 'lucide-react';

// interface Campaign {
//   id: string | number;
//   subject: string;
//   status: string;
//   category: string;
//   totalRecipients?: number;
//   successfullySent?: number;
//   failed?: number;
//   createdAt?: string;
//   createdBy?: { name: string; email: string };
//   emailLogs?: Array<{ subscriberName: string; subscriberEmail: string; status: string; sentAt: string }>;
//   scheduledFor?: string;
//   sentAt?: string;
// }

// const EmailCampaignDashboard = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const [actionLoading, setActionLoading] = useState<number | string | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState<number | string | null>(null);

//   // API Base URL - Update this to match your backend
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   // Fetch all campaigns
//   const fetchCampaigns = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch campaigns');
//       }

//       const data = await response.json();
//       setCampaigns(data.campaigns || []);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       setError(errorMessage);
//       console.error('Error fetching campaigns:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch campaign details by ID
//   const fetchCampaignDetails = async (id: any) => {
//     try {
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch campaign details');
//       }

//       const data = await response.json();
//       return data;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       console.error('Error fetching campaign details:', err);
//       throw new Error(errorMessage);
//     }
//   };

//   // Send campaign
//   const handleSendCampaign = async (campaignId: number | string) => {
//     try {
//       setActionLoading(campaignId);
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}/send`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to send campaign');
//       }

//       const data = await response.json();
      
//       // Show success message
//       alert(`Campaign sent successfully!\nSuccess: ${data.successCount}\nFailed: ${data.failedCount}`);
      
//       // Refresh campaigns list
//       await fetchCampaigns();
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error sending campaign: ${errorMessage}`);
//       console.error('Error sending campaign:', err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Delete campaign
//   const handleDeleteCampaign = async (campaignId: number | string) => {
//     try {
//       setActionLoading(campaignId);
//       const token = localStorage.getItem('token');
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete campaign');
//       }

//       alert('Campaign deleted successfully!');
      
//       // Refresh campaigns list
//       await fetchCampaigns();
//       setDeleteConfirm(null);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error deleting campaign: ${errorMessage}`);
//       console.error('Error deleting campaign:', err);
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   // Refresh campaigns
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchCampaigns();
//     setRefreshing(false);
//   };

//   const getStatusBadge = (status: string | number) => {
//     const styles = {
//       Sent: "bg-green-100 text-green-800",
//       Scheduled: "bg-blue-100 text-blue-800",
//       Draft: "bg-gray-100 text-gray-800",
//       Sending: "bg-yellow-100 text-yellow-800",
//       Failed: "bg-red-100 text-red-800"
//     };
//     return styles[status as keyof typeof styles] || styles.Draft;
//   };

//   const getCategoryBadge = (category: string | number) => {
//     const styles = {
//       newsletter: "bg-purple-100 text-purple-800",
//       promotional: "bg-orange-100 text-orange-800",
//       transactional: "bg-teal-100 text-teal-800"
//     };
//     return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-800";
//   };

//   const formatDate = (dateString: string | number | Date | undefined) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const openModal = async (campaign: { id: string | number }) => {
//     try {
//       setIsModalOpen(true);
//       setSelectedCampaign(null); // Reset to show loading state
      
//       // Fetch full details including email logs
//       const fullDetails = await fetchCampaignDetails(campaign.id);
//       setSelectedCampaign(fullDetails);
//     } catch (err) {
//       setError('Failed to load campaign details');
//       setIsModalOpen(false);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedCampaign(null), 300);
//   };

//   const calculateSuccessRate = (campaign: { totalRecipients?: number; successfullySent?: number } | any) => {
//     if (!campaign || campaign.totalRecipients === 0) return 0;
//     return ((campaign.successfullySent || 0) / (campaign.totalRecipients || 1) * 100).toFixed(1);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading campaigns...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error && campaigns.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Campaigns</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Campaigns</h1>
//             <p className="text-gray-600">Manage and monitor your email campaign performance</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             disabled={refreshing}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <Mail className="w-8 h-8 text-indigo-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
//             <div className="text-sm text-gray-600">Total Campaigns</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {campaigns.filter(c => c.status === 'Sent').length}
//             </div>
//             <div className="text-sm text-gray-600">Sent</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <Clock className="w-8 h-8 text-blue-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {campaigns.filter(c => c.status === 'Scheduled').length}
//             </div>
//             <div className="text-sm text-gray-600">Scheduled</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between mb-2">
//               <Users className="w-8 h-8 text-purple-600" />
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {campaigns.reduce((sum, c) => sum + (c.totalRecipients || 0), 0)}
//             </div>
//             <div className="text-sm text-gray-600">Total Recipients</div>
//           </div>
//         </div>

//         {/* Campaign Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {campaigns.length === 0 ? (
//             <div className="text-center py-12">
//               <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
//               <p className="text-gray-600">Create your first email campaign to get started</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Campaign
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Recipients
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Success Rate
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Created
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {campaigns.map((campaign) => (
//                     <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex flex-col">
//                           <div className="text-sm font-medium text-gray-900 mb-1">
//                             {campaign.subject}
//                           </div>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getCategoryBadge(campaign.category)}`}>
//                             {campaign.category}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.status)}`}>
//                           {campaign.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center text-sm text-gray-900">
//                           <Users className="w-4 h-4 mr-2 text-gray-400" />
//                           {campaign.totalRecipients || 0}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="text-sm font-medium text-gray-900">
//                             {calculateSuccessRate(campaign)}%
//                           </div>
//                           <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-green-500 h-2 rounded-full"
//                               style={{ width: `${calculateSuccessRate(campaign)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {campaign.createdAt ? formatDate(campaign.createdAt) : 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => openModal(campaign)}
//                             className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View
//                           </button>
                          
//                           {/* Send button for Draft campaigns */}
//                           {campaign.status === 'Draft' && (
//                             <button
//                               onClick={() => handleSendCampaign(campaign.id)}
//                               disabled={actionLoading === campaign.id}
//                               className="text-green-600 hover:text-green-900 font-medium inline-flex items-center disabled:opacity-50"
//                             >
//                               {actionLoading === campaign.id ? (
//                                 <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
//                               ) : (
//                                 <Send className="w-4 h-4 mr-1" />
//                               )}
//                               Send
//                             </button>
//                           )}
                          
//                           {/* Delete button */}
//                           {deleteConfirm === campaign.id ? (
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => handleDeleteCampaign(campaign.id)}
//                                 disabled={actionLoading === campaign.id}
//                                 className="text-red-600 hover:text-red-900 font-medium text-xs disabled:opacity-50"
//                               >
//                                 Confirm
//                               </button>
//                               <button
//                                 onClick={() => setDeleteConfirm(null)}
//                                 className="text-gray-600 hover:text-gray-900 font-medium text-xs"
//                               >
//                                 Cancel
//                               </button>
//                             </div>
//                           ) : (
//                             <button
//                               onClick={() => setDeleteConfirm(campaign.id)}
//                               className="text-red-600 hover:text-red-900 font-medium inline-flex items-center"
//                             >
//                               <Trash2 className="w-4 h-4 mr-1" />
//                               Delete
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//             {/* Overlay */}
//             <div
//               className="fixed inset-0 transition-opacity bg-opacity-75"
//               onClick={closeModal}
//             ></div>

//             {/* Modal Panel */}
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
//               {/* Header */}
//               <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
//                 <h3 className="text-xl font-semibold text-white">
//                   Campaign Details
//                 </h3>
//                 <button
//                   onClick={closeModal}
//                   className="text-white hover:text-gray-200 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Content */}
//               {selectedCampaign ? (
//                 <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
//                   {/* Campaign Info */}
//                   <div className="mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h4>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <div className="text-sm text-gray-500 mb-1">Subject</div>
//                         <div className="text-base font-medium text-gray-900">{selectedCampaign.subject}</div>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <div className="text-sm text-gray-500 mb-1">Category</div>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(selectedCampaign.category)}`}>
//                           {selectedCampaign.category}
//                         </span>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <div className="text-sm text-gray-500 mb-1">Status</div>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedCampaign.status)}`}>
//                           {selectedCampaign.status}
//                         </span>
//                       </div>
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <div className="text-sm text-gray-500 mb-1">Created By</div>
//                         <div className="text-base font-medium text-gray-900">
//                           {selectedCampaign.createdBy?.name || 'N/A'}
//                         </div>
//                         <div className="text-xs text-gray-500">{selectedCampaign.createdBy?.email || ''}</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Statistics */}
//                   <div className="mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
//                     <div className="grid grid-cols-4 gap-4">
//                       <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                         <div className="flex items-center justify-between mb-2">
//                           <Users className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div className="text-2xl font-bold text-blue-900">{selectedCampaign.totalRecipients || 0}</div>
//                         <div className="text-sm text-blue-700">Total Recipients</div>
//                       </div>
//                       <div className="bg-green-50 p-4 rounded-lg border border-green-100">
//                         <div className="flex items-center justify-between mb-2">
//                           <CheckCircle className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div className="text-2xl font-bold text-green-900">{selectedCampaign.successfullySent || 0}</div>
//                         <div className="text-sm text-green-700">Successfully Sent</div>
//                       </div>
//                       <div className="bg-red-50 p-4 rounded-lg border border-red-100">
//                         <div className="flex items-center justify-between mb-2">
//                           <XCircle className="w-5 h-5 text-red-600" />
//                         </div>
//                         <div className="text-2xl font-bold text-red-900">{selectedCampaign.failed || 0}</div>
//                         <div className="text-sm text-red-700">Failed</div>
//                       </div>
//                       <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
//                         <div className="flex items-center justify-between mb-2">
//                           <Send className="w-5 h-5 text-purple-600" />
//                         </div>
//                         <div className="text-2xl font-bold text-purple-900">{calculateSuccessRate(selectedCampaign)}%</div>
//                         <div className="text-sm text-purple-700">Success Rate</div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Dates */}
//                   <div className="mb-6">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
//                     <div className="space-y-3">
//                       <div className="flex items-center">
//                         <Calendar className="w-5 h-5 text-gray-400 mr-3" />
//                         <div>
//                           <div className="text-sm text-gray-500">Created</div>
//                           <div className="text-base font-medium text-gray-900">{formatDate(selectedCampaign.createdAt)}</div>
//                         </div>
//                       </div>
//                       {selectedCampaign.scheduledFor && (
//                         <div className="flex items-center">
//                           <Clock className="w-5 h-5 text-blue-500 mr-3" />
//                           <div>
//                             <div className="text-sm text-gray-500">Scheduled For</div>
//                             <div className="text-base font-medium text-gray-900">{formatDate(selectedCampaign.scheduledFor)}</div>
//                           </div>
//                         </div>
//                       )}
//                       {selectedCampaign.sentAt && (
//                         <div className="flex items-center">
//                           <Send className="w-5 h-5 text-green-500 mr-3" />
//                           <div>
//                             <div className="text-sm text-gray-500">Sent At</div>
//                             <div className="text-base font-medium text-gray-900">{formatDate(selectedCampaign.sentAt)}</div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Email Logs */}
//                   {selectedCampaign.emailLogs && selectedCampaign.emailLogs.length > 0 ? (
//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-900 mb-4">
//                         Email Logs ({selectedCampaign.emailLogs.length} recipients)
//                       </h4>
//                       <div className="border rounded-lg overflow-hidden">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                               <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {selectedCampaign.emailLogs.map((log, index) => (
//                               <tr key={index}>
//                                 <td className="px-4 py-3">
//                                   <div className="text-sm font-medium text-gray-900">{log.subscriberName || 'N/A'}</div>
//                                   <div className="text-xs text-gray-500">{log.subscriberEmail}</div>
//                                 </td>
//                                 <td className="px-4 py-3">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(String(log.status || 'Draft'))}`}>
//                                     {log.status}
//                                   </span>
//                                 </td>
//                                 <td className="px-4 py-3 text-sm text-gray-500">
//                                   {formatDate(log.sentAt)}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 bg-gray-50 rounded-lg">
//                       <Mail className="w-12 h-12 text-gray-400 mx-auto mb-2" />
//                       <p className="text-gray-600">No email logs available for this campaign</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="px-6 py-12 text-center">
//                   <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
//                   <p className="text-gray-600">Loading campaign details...</p>
//                 </div>
//               )}

//               {/* Footer */}
//               <div className="bg-gray-50 px-6 py-4 flex justify-end">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmailCampaignDashboard;




'use client';
import React, { useState, useEffect } from 'react';
import { Mail, Users, CheckCircle, Clock, Eye, Send, RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import CampaignModal from '@/app/components/Campaign/CampaignModal';
import SendConfirmationModal from '@/app/components/Campaign/SendConfirmationModal';
import DeleteConfirmationModal from '@/app/components/Campaign/DeleteConfirmationModal';


interface Campaign {
  id: string | number;
  subject: string;
  status: string;
  category: string;
  totalRecipients?: number;
  successfullySent?: number;
  failed?: number;
  createdAt?: string;
  createdBy?: { name: string; email: string };
  emailLogs?: Array<{ subscriberName: string; subscriberEmail: string; status: string; sentAt: string }>;
  scheduledFor?: string;
  sentAt?: string;
}

const EmailCampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Send modal state
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState<Campaign | null>(null);
  const [isSending, setIsSending] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaign details by ID
  const fetchCampaignDetails = async (id: any) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign details');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching campaign details:', err);
      throw new Error(errorMessage);
    }
  };

  // Send campaign
  // const handleSendCampaign = async () => {
  //   if (!campaignToSend) return;
    
  //   try {
  //     setIsSending(true);
  //     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
  //     const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${campaignToSend.id}/send`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to send campaign');
  //     }

  //     const data = await response.json();
      
  //     alert(`Campaign sent successfully!\nSuccess: ${data.successCount}\nFailed: ${data.failedCount}`);
      
  //     await fetchCampaigns();
  //     setSendModalOpen(false);
  //     setCampaignToSend(null);
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
  //     alert(`Error sending campaign: ${errorMessage}`);
  //     console.error('Error sending campaign:', err);
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  const handleSendCampaign = async () => {
  if (!campaignToSend) return;
  
  try {
    setIsSending(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // ✅ FIX: Add targetAudience in request body
    const response = await fetch(
      `${API_BASE_URL}/api/Newsletter/campaigns/${campaignToSend.id}/send`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // ✅ CRITICAL: Send request body with targetAudience
        body: JSON.stringify({
          targetAudience: ["All Subscribers"] // Default to all subscribers
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send campaign');
    }

    const data = await response.json();
    
    // Show success message with details
    const message = `✅ Campaign sent successfully!\n\n` +
      `📧 Sent: ${data.successCount}\n` +
      `❌ Failed: ${data.failedCount}\n` +
      `📊 Total: ${data.totalSent}\n\n` +
      (data.categoryBreakdown && data.categoryBreakdown.length > 0
        ? `Categories:\n${data.categoryBreakdown.map((cat: any) => 
            `  • ${cat.category}: ${cat.recipientCount}`).join('\n')}`
        : '');
    
    alert(message);
    
    // Refresh campaigns list
    await fetchCampaigns();
    setSendModalOpen(false);
    setCampaignToSend(null);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    alert(`❌ Error sending campaign:\n${errorMessage}`);
    console.error('Error sending campaign:', err);
  } finally {
    setIsSending(false);
  }
};

  // Delete campaign
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${campaignToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete campaign');
      }

      alert('Campaign deleted successfully!');
      
      await fetchCampaigns();
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error deleting campaign: ${errorMessage}`);
      console.error('Error deleting campaign:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  };

  const getStatusBadge = (status: string | number) => {
    const styles = {
      Sent: "bg-green-100 text-green-800",
      Scheduled: "bg-blue-100 text-blue-800",
      Draft: "bg-gray-100 text-gray-800",
      Sending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800"
    };
    return styles[status as keyof typeof styles] || styles.Draft;
  };

  const getCategoryBadge = (category: string | number) => {
    const styles = {
      newsletter: "bg-purple-100 text-purple-800",
      promotional: "bg-orange-100 text-orange-800",
      transactional: "bg-teal-100 text-teal-800"
    };
    return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDetailModal = async (campaign: Campaign) => {
    try {
      setIsDetailModalOpen(true);
      setSelectedCampaign(null);
      
      const fullDetails = await fetchCampaignDetails(campaign.id);
      setSelectedCampaign(fullDetails);
    } catch (err) {
      setError('Failed to load campaign details');
      setIsDetailModalOpen(false);
    }
  };

  const calculateSuccessRate = (campaign: { totalRecipients?: number; successfullySent?: number } | any) => {
    if (!campaign || campaign.totalRecipients === 0) return 0;
    return ((campaign.successfullySent || 0) / (campaign.totalRecipients || 1) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error && campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Campaigns</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Campaigns</h1>
            <p className="text-gray-600">Manage and monitor your email campaign performance</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Mail className="w-8 h-8 text-indigo-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{campaigns.length}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {campaigns.filter(c => c.status === 'Sent').length}
            </div>
            <div className="text-sm text-gray-600">Sent</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Clock className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {campaigns.filter(c => c.status === 'Scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {campaigns.reduce((sum, c) => sum + (c.totalRecipients || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Recipients</div>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaigns Yet</h3>
              <p className="text-gray-600">Create your first email campaign to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 mb-1">{campaign.subject}</div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getCategoryBadge(campaign.category)}`}>
                            {campaign.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Users className="w-4 h-4 mr-2 text-gray-400" />
                          {campaign.totalRecipients || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{calculateSuccessRate(campaign)}%</div>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${calculateSuccessRate(campaign)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.createdAt ? formatDate(campaign.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openDetailModal(campaign)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          
                          {campaign.status === 'Draft' && (
                            <button
                              onClick={() => {
                                setCampaignToSend(campaign);
                                setSendModalOpen(true);
                              }}
                              className="text-green-600 hover:text-green-900 font-medium inline-flex items-center"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setCampaignToDelete(campaign);
                              setDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 font-medium inline-flex items-center"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Note: In your actual project, uncomment and use the imported components */}
      <CampaignModal
        isOpen={isDetailModalOpen}
        campaign={selectedCampaign}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedCampaign(null);
        }}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        campaignName={campaignToDelete?.subject || ''}
        isLoading={isDeleting}
        onConfirm={handleDeleteCampaign}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCampaignToDelete(null);
        }}
      />

      <SendConfirmationModal
        isOpen={sendModalOpen}
        campaignName={campaignToSend?.subject || ''}
        recipientCount={campaignToSend?.totalRecipients || 0}
        isLoading={isSending}
        onConfirm={handleSendCampaign}
        onCancel={() => {
          setSendModalOpen(false);
          setCampaignToSend(null);
        }}
      />
    </div>
  );
};

export default EmailCampaignDashboard;