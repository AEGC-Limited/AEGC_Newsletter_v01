// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Mail, Users, UserCheck, UserX, Eye, RefreshCw, Trash2, AlertCircle, Download, Search, Filter } from 'lucide-react';

// interface Subscriber {
//   id: string | number;
//   email: string;
//   subscribedAt: string;
//   isActive: boolean;
//   unsubscribedAt?: string;
// }

// const NewsletterSubscriberDashboard = () => {
//   const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
//   const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Delete modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   // Fetch all subscribers
//   const fetchSubscribers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch subscribers');
//       }

//       const data = await response.json();
//       setSubscribers(data.subscribers || []);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       setError(errorMessage);
//       console.error('Error fetching subscribers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete subscriber
//   const handleDeleteSubscriber = async () => {
//     if (!subscriberToDelete) return;
    
//     try {
//       setIsDeleting(true);
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/${subscriberToDelete.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete subscriber');
//       }

//       alert('Subscriber deleted successfully!');
      
//       await fetchSubscribers();
//       setDeleteModalOpen(false);
//       setSubscriberToDelete(null);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error deleting subscriber: ${errorMessage}`);
//       console.error('Error deleting subscriber:', err);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Export subscribers to CSV
//   const handleExportCSV = () => {
//     const csvContent = [
//       ['Email', 'Status', 'Subscribed Date', 'Unsubscribed Date'],
//       ...filteredSubscribers.map(sub => [
//         sub.email,
//         sub.isActive ? 'Active' : 'Inactive',
//         formatDate(sub.subscribedAt),
//         sub.unsubscribedAt ? formatDate(sub.unsubscribedAt) : 'N/A'
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     fetchSubscribers();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchSubscribers();
//     setRefreshing(false);
//   };

//   const formatDate = (dateString: string | undefined) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const openDetailModal = (subscriber: Subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setIsDetailModalOpen(true);
//   };

//   // Filter subscribers
//   const filteredSubscribers = subscribers.filter(sub => {
//     const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || 
//       (statusFilter === 'active' && sub.isActive) ||
//       (statusFilter === 'inactive' && !sub.isActive);
//     return matchesSearch && matchesStatus;
//   });

//   const stats = {
//     total: subscribers.length,
//     active: subscribers.filter(s => s.isActive).length,
//     inactive: subscribers.filter(s => !s.isActive).length,
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading subscribers...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && subscribers.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Subscribers</h3>
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
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
//             <p className="text-gray-600">Manage your newsletter subscriber list</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleExportCSV}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Export CSV
//             </button>
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <Users className="w-8 h-8 text-indigo-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total Subscribers</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <UserCheck className="w-8 h-8 text-green-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
//             <div className="text-sm text-gray-600">Active</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <UserX className="w-8 h-8 text-red-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
//             <div className="text-sm text-gray-600">Unsubscribed</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by email..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="text-gray-400 w-5 h-5" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as any)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Unsubscribed Only</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Subscriber Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {filteredSubscribers.length === 0 ? (
//             <div className="text-center py-12">
//               <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscribers Found</h3>
//               <p className="text-gray-600">
//                 {searchTerm || statusFilter !== 'all' 
//                   ? 'Try adjusting your filters' 
//                   : 'No subscribers have signed up yet'}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredSubscribers.map((subscriber) => (
//                     <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <Mail className="w-4 h-4 text-gray-400 mr-2" />
//                           <span className="text-sm font-medium text-gray-900">{subscriber.email}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           subscriber.isActive 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {subscriber.isActive ? 'Active' : 'Unsubscribed'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(subscriber.subscribedAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() => openDetailModal(subscriber)}
//                             className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View
//                           </button>
                          
//                           <button
//                             onClick={() => {
//                               setSubscriberToDelete(subscriber);
//                               setDeleteModalOpen(true);
//                             }}
//                             className="text-red-600 hover:text-red-900 font-medium inline-flex items-center"
//                           >
//                             <Trash2 className="w-4 h-4 mr-1" />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Results count */}
//         {filteredSubscribers.length > 0 && (
//           <div className="mt-4 text-sm text-gray-600 text-center">
//             Showing {filteredSubscribers.length} of {subscribers.length} subscribers
//           </div>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {isDetailModalOpen && selectedSubscriber && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setIsDetailModalOpen(false)}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-lg" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto', zIndex: 51 }}>
//               <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
//                 <h3 className="text-xl font-semibold text-white">Subscriber Details</h3>
//                 <button onClick={() => setIsDetailModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
//                   <Mail className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="px-6 py-6">
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Email Address</div>
//                     <div className="text-base font-medium text-gray-900">{selectedSubscriber.email}</div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Status</div>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       selectedSubscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {selectedSubscriber.isActive ? 'Active Subscriber' : 'Unsubscribed'}
//                     </span>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Subscribed Date</div>
//                     <div className="text-base font-medium text-gray-900">{formatDate(selectedSubscriber.subscribedAt)}</div>
//                   </div>

//                   {selectedSubscriber.unsubscribedAt && (
//                     <div className="bg-red-50 p-4 rounded-lg border border-red-100">
//                       <div className="text-sm text-red-500 mb-1">Unsubscribed Date</div>
//                       <div className="text-base font-medium text-red-900">{formatDate(selectedSubscriber.unsubscribedAt)}</div>
//                     </div>
//                   )}

//                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//                     <div className="text-sm text-blue-700 font-medium mb-2">📊 Subscriber Information</div>
//                     <div className="text-xs text-blue-600">
//                       <p>• ID: {selectedSubscriber.id}</p>
//                       <p>• Email: {selectedSubscriber.email}</p>
//                       <p>• Member since: {new Date(selectedSubscriber.subscribedAt).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     setIsDetailModalOpen(false);
//                     setSubscriberToDelete(selectedSubscriber);
//                     setDeleteModalOpen(true);
//                   }}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//                 >
//                   Delete Subscriber
//                 </button>
//                 <button
//                   onClick={() => setIsDetailModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && subscriberToDelete && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={!isDeleting ? () => setDeleteModalOpen(false) : undefined}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-lg" onClick={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto', zIndex: 51 }}>
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <AlertCircle className="h-6 w-6 text-red-600" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Subscriber</h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete the subscriber{' '}
//                         <span className="font-semibold text-gray-900">"{subscriberToDelete.email}"</span>?
//                         This action cannot be undone.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 rounded-b-lg">
//                 <button
//                   type="button"
//                   disabled={isDeleting}
//                   onClick={handleDeleteSubscriber}
//                   className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isDeleting ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   disabled={isDeleting}
//                   onClick={() => setDeleteModalOpen(false)}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewsletterSubscriberDashboard;


///UPDATED CODE BELOW///


// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   Mail, Users, UserCheck, UserX, Eye, RefreshCw, Trash2, AlertCircle, 
//   Download, Search, Filter, UserPlus, Upload, Edit2, X, Check, FileText 
// } from 'lucide-react';

// interface Subscriber {
//   id: string | number;
//   firstName?: string;
//   lastName?: string;
//   email: string;
//   organisation?: string;
//   position?: string;
//   category?: string;
//   source?: string;
//   subscribedAt: string;
//   isActive: boolean;
//   emailVerified?: boolean;
//   unsubscribedAt?: string;
//   emailsReceived?: number;
//   emailsOpened?: number;
//   linksClicked?: number;
//   updatedAt?: string;
// }

// interface BulkImportResult {
//   message: string;
//   totalRows: number;
//   successCount: number;
//   skippedCount: number;
//   errorCount: number;
//   errors: string[];
//   addedSubscribers: any[];
//   skippedSubscribers: any[];
// }

// const EnhancedNewsletterSubscriberDashboard = () => {
//   const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
//   const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Delete modal state
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
  
//   // Add subscriber modal state
//   const [addModalOpen, setAddModalOpen] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [newSubscriber, setNewSubscriber] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     organisation: '',
//     position: '',
//     category: 'General',
//     source: 'manual_admin'
//   });

//   // Edit subscriber modal state
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [subscriberToEdit, setSubscriberToEdit] = useState<Subscriber | null>(null);

//   // Bulk import modal state
//   const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
//   const [importFile, setImportFile] = useState<File | null>(null);
//   const [isImporting, setIsImporting] = useState(false);
//   const [importResults, setImportResults] = useState<BulkImportResult | null>(null);
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [categoryFilter, setCategoryFilter] = useState<string>('all');
//   const [sourceFilter, setSourceFilter] = useState<string>('all');

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

//   // Fetch all subscribers
//   const fetchSubscribers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch subscribers');
//       }

//       const data = await response.json();
//       setSubscribers(data.subscribers || []);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       setError(errorMessage);
//       console.error('Error fetching subscribers:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add subscriber manually
//   const handleAddSubscriber = async () => {
//     try {
//       setIsAdding(true);
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/add`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newSubscriber)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to add subscriber');
//       }

//       alert(data.message || 'Subscriber added successfully!');
      
//       // Reset form
//       setNewSubscriber({
//         firstName: '',
//         lastName: '',
//         email: '',
//         organisation: '',
//         position: '',
//         category: 'General',
//         source: 'manual_admin'
//       });
      
//       await fetchSubscribers();
//       setAddModalOpen(false);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error adding subscriber: ${errorMessage}`);
//       console.error('Error adding subscriber:', err);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // Update subscriber
//   const handleUpdateSubscriber = async () => {
//     if (!subscriberToEdit) return;

//     try {
//       setIsEditing(true);
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/${subscriberToEdit.id}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           firstName: subscriberToEdit.firstName,
//           lastName: subscriberToEdit.lastName,
//           email: subscriberToEdit.email,
//           organisation: subscriberToEdit.organisation,
//           position: subscriberToEdit.position,
//           category: subscriberToEdit.category
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update subscriber');
//       }

//       alert(data.message || 'Subscriber updated successfully!');
      
//       await fetchSubscribers();
//       setEditModalOpen(false);
//       setSubscriberToEdit(null);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error updating subscriber: ${errorMessage}`);
//       console.error('Error updating subscriber:', err);
//     } finally {
//       setIsEditing(false);
//     }
//   };

//   // Bulk import subscribers
//   const handleBulkImport = async () => {
//     if (!importFile) {
//       alert('Please select a file to import');
//       return;
//     }

//     try {
//       setIsImporting(true);
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       const formData = new FormData();
//       formData.append('file', importFile);

//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/bulk-import`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to import subscribers');
//       }

//       setImportResults(data);
//       await fetchSubscribers();
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error importing subscribers: ${errorMessage}`);
//       console.error('Error importing subscribers:', err);
//     } finally {
//       setIsImporting(false);
//     }
//   };

//   // Download CSV template
//   const handleDownloadTemplate = async () => {
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/download-template`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to download template');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'newsletter_subscriber_template.csv';
//       a.click();
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error downloading template: ${errorMessage}`);
//       console.error('Error downloading template:', err);
//     }
//   };

//   // Delete subscriber
//   const handleDeleteSubscriber = async () => {
//     if (!subscriberToDelete) return;
    
//     try {
//       setIsDeleting(true);
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/${subscriberToDelete.id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete subscriber');
//       }

//       alert('Subscriber deleted successfully!');
      
//       await fetchSubscribers();
//       setDeleteModalOpen(false);
//       setSubscriberToDelete(null);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
//       alert(`Error deleting subscriber: ${errorMessage}`);
//       console.error('Error deleting subscriber:', err);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Export subscribers to CSV
//   const handleExportCSV = () => {
//     const csvContent = [
//       ['First Name', 'Last Name', 'Email', 'Organisation', 'Position', 'Category', 'Source', 'Status', 'Subscribed Date', 'Unsubscribed Date'],
//       ...filteredSubscribers.map(sub => [
//         sub.firstName || '',
//         sub.lastName || '',
//         sub.email,
//         sub.organisation || '',
//         sub.position || '',
//         sub.category || '',
//         sub.source || '',
//         sub.isActive ? 'Active' : 'Inactive',
//         formatDate(sub.subscribedAt),
//         sub.unsubscribedAt ? formatDate(sub.unsubscribedAt) : 'N/A'
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `20250204_AEGC_NewsletterSubscribers_v01.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     fetchSubscribers();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchSubscribers();
//     setRefreshing(false);
//   };

//   const formatDate = (dateString: string | undefined) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const openDetailModal = (subscriber: Subscriber) => {
//     setSelectedSubscriber(subscriber);
//     setIsDetailModalOpen(true);
//   };

//   const openEditModal = (subscriber: Subscriber) => {
//     setSubscriberToEdit(subscriber);
//     setEditModalOpen(true);
//   };

//   // Get unique categories and sources
//   const uniqueCategories = Array.from(new Set(subscribers.map(s => s.category || 'Unknown')));
//   const uniqueSources = Array.from(new Set(subscribers.map(s => s.source || 'Unknown')));

//   // Filter subscribers
//   const filteredSubscribers = subscribers.filter(sub => {
//     const matchesSearch = 
//       sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (sub.firstName && sub.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (sub.lastName && sub.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (sub.organisation && sub.organisation.toLowerCase().includes(searchTerm.toLowerCase()));
    
//     const matchesStatus = statusFilter === 'all' || 
//       (statusFilter === 'active' && sub.isActive) ||
//       (statusFilter === 'inactive' && !sub.isActive);
    
//     const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
//     const matchesSource = sourceFilter === 'all' || sub.source === sourceFilter;
    
//     return matchesSearch && matchesStatus && matchesCategory && matchesSource;
//   });

//   const stats = {
//     total: subscribers.length,
//     active: subscribers.filter(s => s.isActive).length,
//     inactive: subscribers.filter(s => !s.isActive).length,
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading subscribers...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && subscribers.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Subscribers</h3>
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
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
//             <p className="text-gray-600">Manage your newsletter subscriber list</p>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setAddModalOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               <UserPlus className="w-4 h-4" />
//               Add Subscriber
//             </button>
//             <button
//               onClick={() => setBulkImportModalOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <Upload className="w-4 h-4" />
//               Bulk Import
//             </button>
//             <button
//               onClick={handleExportCSV}
//               className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Export CSV
//             </button>
//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <Users className="w-8 h-8 text-indigo-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total Subscribers</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <UserCheck className="w-8 h-8 text-green-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
//             <div className="text-sm text-gray-600">Active</div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <UserX className="w-8 h-8 text-red-600 mb-2" />
//             <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
//             <div className="text-sm text-gray-600">Unsubscribed</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search subscribers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="text-gray-400 w-5 h-5" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as any)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active Only</option>
//                 <option value="inactive">Unsubscribed Only</option>
//               </select>
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="text-gray-400 w-5 h-5" />
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="all">All Categories</option>
//                 {uniqueCategories.map(cat => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="flex items-center gap-2">
//               <Filter className="text-gray-400 w-5 h-5" />
//               <select
//                 value={sourceFilter}
//                 onChange={(e) => setSourceFilter(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="all">All Sources</option>
//                 {uniqueSources.map(src => (
//                   <option key={src} value={src}>{src}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Subscriber Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           {filteredSubscribers.length === 0 ? (
//             <div className="text-center py-12">
//               <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscribers Found</h3>
//               <p className="text-gray-600">
//                 {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || sourceFilter !== 'all'
//                   ? 'Try adjusting your filters' 
//                   : 'No subscribers have signed up yet'}
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredSubscribers.map((subscriber) => (
//                     <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {`${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim() || 'N/A'}
//                         </div>
//                         {subscriber.position && (
//                           <div className="text-xs text-gray-500">{subscriber.position}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <Mail className="w-4 h-4 text-gray-400 mr-2" />
//                           <span className="text-sm text-gray-900">{subscriber.email}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {subscriber.organisation || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {subscriber.category || 'General'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {subscriber.source || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           subscriber.isActive 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {subscriber.isActive ? 'Active' : 'Unsubscribed'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDate(subscriber.subscribedAt)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={() => openDetailModal(subscriber)}
//                             className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
//                           >
//                             <Eye className="w-4 h-4 mr-1" />
//                             View
//                           </button>
                          
//                           <button
//                             onClick={() => openEditModal(subscriber)}
//                             className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center"
//                           >
//                             <Edit2 className="w-4 h-4 mr-1" />
//                             Edit
//                           </button>
                          
//                           <button
//                             onClick={() => {
//                               setSubscriberToDelete(subscriber);
//                               setDeleteModalOpen(true);
//                             }}
//                             className="text-red-600 hover:text-red-900 font-medium inline-flex items-center"
//                           >
//                             <Trash2 className="w-4 h-4 mr-1" />
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Results count */}
//         {filteredSubscribers.length > 0 && (
//           <div className="mt-4 text-sm text-gray-600 text-center">
//             Showing {filteredSubscribers.length} of {subscribers.length} subscribers
//           </div>
//         )}
//       </div>

//       {/* Add Subscriber Modal */}
//       {addModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setAddModalOpen(false)}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
//               <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
//                 <h3 className="text-xl font-semibold text-white">Add New Subscriber</h3>
//                 <button onClick={() => setAddModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="px-6 py-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                     <input
//                       type="text"
//                       value={newSubscriber.firstName}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, firstName: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="John"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                     <input
//                       type="text"
//                       value={newSubscriber.lastName}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, lastName: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Doe"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={newSubscriber.email}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="john.doe@example.com"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
//                     <input
//                       type="text"
//                       value={newSubscriber.organisation}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, organisation: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Example Corp"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
//                     <input
//                       type="text"
//                       value={newSubscriber.position}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, position: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                       placeholder="Manager"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                     <select
//                       value={newSubscriber.category}
//                       onChange={(e) => setNewSubscriber({ ...newSubscriber, category: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                     >
//                       <option value="General">General</option>
//                       <option value="Technology">Technology</option>
//                       <option value="Business">Business</option>
//                       <option value="Marketing">Marketing</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
//                 <button
//                   onClick={() => setAddModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                   disabled={isAdding}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleAddSubscriber}
//                   disabled={isAdding || !newSubscriber.email}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {isAdding ? (
//                     <>
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                       Adding...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="w-4 h-4" />
//                       Add Subscriber
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Subscriber Modal */}
//       {editModalOpen && subscriberToEdit && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setEditModalOpen(false)}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
//               <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
//                 <h3 className="text-xl font-semibold text-white">Edit Subscriber</h3>
//                 <button onClick={() => setEditModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="px-6 py-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
//                     <input
//                       type="text"
//                       value={subscriberToEdit.firstName || ''}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, firstName: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
//                     <input
//                       type="text"
//                       value={subscriberToEdit.lastName || ''}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, lastName: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={subscriberToEdit.email}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, email: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
//                     <input
//                       type="text"
//                       value={subscriberToEdit.organisation || ''}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, organisation: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
//                     <input
//                       type="text"
//                       value={subscriberToEdit.position || ''}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, position: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                     <select
//                       value={subscriberToEdit.category || 'General'}
//                       onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, category: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="General">General</option>
//                       <option value="Technology">Technology</option>
//                       <option value="Business">Business</option>
//                       <option value="Marketing">Marketing</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
//                 <button
//                   onClick={() => setEditModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                   disabled={isEditing}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdateSubscriber}
//                   disabled={isEditing || !subscriberToEdit.email}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {isEditing ? (
//                     <>
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="w-4 h-4" />
//                       Update Subscriber
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk Import Modal */}
//       {bulkImportModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => !isImporting && setBulkImportModalOpen(false)}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
//               <div className="bg-purple-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
//                 <h3 className="text-xl font-semibold text-white">Bulk Import Subscribers</h3>
//                 <button onClick={() => !isImporting && setBulkImportModalOpen(false)} className="text-white hover:text-gray-200 transition-colors" disabled={isImporting}>
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="px-6 py-6">
//                 {!importResults ? (
//                   <>
//                     <div className="mb-6">
//                       <div className="flex items-center justify-between mb-4">
//                         <h4 className="text-lg font-semibold text-gray-900">Upload File</h4>
//                         <button
//                           onClick={handleDownloadTemplate}
//                           className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                         >
//                           <FileText className="w-4 h-4" />
//                           Download Template
//                         </button>
//                       </div>
//                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                         <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                         <input
//                           type="file"
//                           accept=".csv,.xlsx,.xls"
//                           onChange={(e) => setImportFile(e.target.files?.[0] || null)}
//                           className="hidden"
//                           id="file-upload"
//                         />
//                         <label
//                           htmlFor="file-upload"
//                           className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                         >
//                           <Upload className="w-4 h-4" />
//                           Choose File
//                         </label>
//                         {importFile && (
//                           <p className="mt-2 text-sm text-gray-600">
//                             Selected: {importFile.name}
//                           </p>
//                         )}
//                         <p className="mt-2 text-xs text-gray-500">
//                           Supported formats: CSV, Excel (.xlsx, .xls)
//                         </p>
//                       </div>
//                     </div>

//                     <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                       <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Fields</h4>
//                       <ul className="text-xs text-blue-700 space-y-1">
//                         <li>• <strong>Email</strong> (required)</li>
//                         <li>• FirstName, LastName, Organisation, Position, Category (optional)</li>
//                       </ul>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-4 gap-4">
//                       <div className="bg-gray-50 p-4 rounded-lg text-center">
//                         <div className="text-2xl font-bold text-gray-900">{importResults.totalRows}</div>
//                         <div className="text-xs text-gray-600">Total Rows</div>
//                       </div>
//                       <div className="bg-green-50 p-4 rounded-lg text-center">
//                         <div className="text-2xl font-bold text-green-900">{importResults.successCount}</div>
//                         <div className="text-xs text-green-600">Success</div>
//                       </div>
//                       <div className="bg-yellow-50 p-4 rounded-lg text-center">
//                         <div className="text-2xl font-bold text-yellow-900">{importResults.skippedCount}</div>
//                         <div className="text-xs text-yellow-600">Skipped</div>
//                       </div>
//                       <div className="bg-red-50 p-4 rounded-lg text-center">
//                         <div className="text-2xl font-bold text-red-900">{importResults.errorCount}</div>
//                         <div className="text-xs text-red-600">Errors</div>
//                       </div>
//                     </div>

//                     {importResults.errors.length > 0 && (
//                       <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-h-40 overflow-y-auto">
//                         <h4 className="text-sm font-semibold text-red-900 mb-2">Errors</h4>
//                         <ul className="text-xs text-red-700 space-y-1">
//                           {importResults.errors.map((error, idx) => (
//                             <li key={idx}>• {error}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {importResults.addedSubscribers.length > 0 && (
//                       <div className="bg-green-50 p-4 rounded-lg border border-green-200 max-h-40 overflow-y-auto">
//                         <h4 className="text-sm font-semibold text-green-900 mb-2">
//                           Successfully Added ({importResults.addedSubscribers.length})
//                         </h4>
//                         <ul className="text-xs text-green-700 space-y-1">
//                           {importResults.addedSubscribers.slice(0, 10).map((sub, idx) => (
//                             <li key={idx}>• {sub.email} - {sub.status}</li>
//                           ))}
//                           {importResults.addedSubscribers.length > 10 && (
//                             <li className="italic">...and {importResults.addedSubscribers.length - 10} more</li>
//                           )}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
//                 {!importResults ? (
//                   <>
//                     <button
//                       onClick={() => setBulkImportModalOpen(false)}
//                       className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                       disabled={isImporting}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleBulkImport}
//                       disabled={isImporting || !importFile}
//                       className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {isImporting ? (
//                         <>
//                           <RefreshCw className="w-4 h-4 animate-spin" />
//                           Importing...
//                         </>
//                       ) : (
//                         <>
//                           <Upload className="w-4 h-4" />
//                           Import Subscribers
//                         </>
//                       )}
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       setImportResults(null);
//                       setImportFile(null);
//                       setBulkImportModalOpen(false);
//                     }}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
//                   >
//                     Done
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Detail Modal */}
//       {isDetailModalOpen && selectedSubscriber && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setIsDetailModalOpen(false)}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
//               <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
//                 <h3 className="text-xl font-semibold text-white">Subscriber Details</h3>
//                 <button onClick={() => setIsDetailModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="px-6 py-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Full Name</div>
//                     <div className="text-lg font-semibold text-gray-900">
//                       {`${selectedSubscriber.firstName || ''} ${selectedSubscriber.lastName || ''}`.trim() || 'Not Provided'}
//                     </div>
//                   </div>

//                   <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Email Address</div>
//                     <div className="text-base font-medium text-gray-900">{selectedSubscriber.email}</div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Organisation</div>
//                     <div className="text-base font-medium text-gray-900">{selectedSubscriber.organisation || 'Not Provided'}</div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Position</div>
//                     <div className="text-base font-medium text-gray-900">{selectedSubscriber.position || 'Not Provided'}</div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Category</div>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       {selectedSubscriber.category || 'General'}
//                     </span>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Source</div>
//                     <div className="text-base font-medium text-gray-900">{selectedSubscriber.source || 'Unknown'}</div>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Status</div>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       selectedSubscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {selectedSubscriber.isActive ? 'Active Subscriber' : 'Unsubscribed'}
//                     </span>
//                   </div>

//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Email Verified</div>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       selectedSubscriber.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {selectedSubscriber.emailVerified ? 'Verified' : 'Unverified'}
//                     </span>
//                   </div>

//                   <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
//                     <div className="text-sm text-gray-500 mb-1">Subscribed Date</div>
//                     <div className="text-base font-medium text-gray-900">{formatDate(selectedSubscriber.subscribedAt)}</div>
//                   </div>

//                   {selectedSubscriber.unsubscribedAt && (
//                     <div className="col-span-2 bg-red-50 p-4 rounded-lg border border-red-100">
//                       <div className="text-sm text-red-500 mb-1">Unsubscribed Date</div>
//                       <div className="text-base font-medium text-red-900">{formatDate(selectedSubscriber.unsubscribedAt)}</div>
//                     </div>
//                   )}

//                   <div className="col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
//                     <div className="text-sm text-blue-700 font-medium mb-2">📊 Engagement Statistics</div>
//                     <div className="grid grid-cols-3 gap-4 text-center">
//                       <div>
//                         <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.emailsReceived || 0}</div>
//                         <div className="text-xs text-blue-600">Emails Received</div>
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.emailsOpened || 0}</div>
//                         <div className="text-xs text-blue-600">Emails Opened</div>
//                       </div>
//                       <div>
//                         <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.linksClicked || 0}</div>
//                         <div className="text-xs text-blue-600">Links Clicked</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
//                 <button
//                   onClick={() => {
//                     setIsDetailModalOpen(false);
//                     openEditModal(selectedSubscriber);
//                   }}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   Edit Subscriber
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsDetailModalOpen(false);
//                     setSubscriberToDelete(selectedSubscriber);
//                     setDeleteModalOpen(true);
//                   }}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//                 >
//                   Delete Subscriber
//                 </button>
//                 <button
//                   onClick={() => setIsDetailModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteModalOpen && subscriberToDelete && (
//         <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
//           <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={!isDeleting ? () => setDeleteModalOpen(false) : undefined}></div>
          
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <AlertCircle className="h-6 w-6 text-red-600" />
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Subscriber</h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Are you sure you want to delete the subscriber{' '}
//                         <span className="font-semibold text-gray-900">"{subscriberToDelete.email}"</span>?
//                         This action cannot be undone.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 rounded-b-lg">
//                 <button
//                   type="button"
//                   disabled={isDeleting}
//                   onClick={handleDeleteSubscriber}
//                   className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isDeleting ? (
//                     <>
//                       <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="w-4 h-4 mr-2" />
//                       Delete
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   disabled={isDeleting}
//                   onClick={() => setDeleteModalOpen(false)}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnhancedNewsletterSubscriberDashboard;




'use client';
import React, { useState, useEffect } from 'react';
import { 
  Mail, Users, UserCheck, UserX, Eye, RefreshCw, Trash2, AlertCircle, 
  Download, Search, Filter, UserPlus, Upload, Edit2, X, Check, FileText, 
  Import
} from 'lucide-react';
// import { useToast } from '@/contexts/ToastContext';
import { useToast } from '@/components/ui/use-toast';

interface Subscriber {
  id: string | number;
  firstName?: string;
  lastName?: string;
  email: string;
  organisation?: string;
  position?: string;
  category?: string;
  source?: string;
  subscribedAt: string;
  isActive: boolean;
  emailVerified?: boolean;
  unsubscribedAt?: string;
  emailsReceived?: number;
  emailsOpened?: number;
  linksClicked?: number;
  updatedAt?: string;
}

interface BulkImportResult {
  message: string;
  totalRows: number;
  successCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
  addedSubscribers: any[];
  skippedSubscribers: any[];
}

const EnhancedNewsletterSubscriberDashboard = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<Subscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Add subscriber modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organisation: '',
    position: '',
    category: 'General',
    source: 'manual_admin'
  });

  // Edit subscriber modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subscriberToEdit, setSubscriberToEdit] = useState<Subscriber | null>(null);

  // Bulk import modal state
  const [bulkImportModalOpen, setBulkImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<BulkImportResult | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch all subscribers
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching subscribers:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add subscriber manually
  const handleAddSubscriber = async () => {
    try {
      setIsAdding(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      console.log('Adding subscriber:', newSubscriber);
      console.log('API URL:', `${API_BASE_URL}/api/Newsletter/subscribers/add`);

      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSubscriber)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Response text:', text);
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error(`Unexpected response format. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `Failed to add subscriber (${response.status})`);
      }

      toast({
        title: 'Success',
        description: data.message || 'Subscriber added successfully!'
      });
      
      // Reset form
      setNewSubscriber({
        firstName: '',
        lastName: '',
        email: '',
        organisation: '',
        position: '',
        category: 'General',
        source: 'manual_admin'
      });
      
      await fetchSubscribers();
      setAddModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error adding subscriber:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Update subscriber
  const handleUpdateSubscriber = async () => {
    if (!subscriberToEdit) return;

    try {
      setIsEditing(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/${subscriberToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: subscriberToEdit.firstName,
          lastName: subscriberToEdit.lastName,
          email: subscriberToEdit.email,
          organisation: subscriberToEdit.organisation,
          position: subscriberToEdit.position,
          category: subscriberToEdit.category
        })
      });

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        throw new Error(`Unexpected response format. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update subscriber');
      }

      toast({
        title: 'Success',
        description: data.message || 'Subscriber updated successfully!'
      });
      
      await fetchSubscribers();
      setEditModalOpen(false);
      setSubscriberToEdit(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error updating subscriber:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Bulk import subscribers
  const handleBulkImport = async () => {
    if (!importFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to import',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsImporting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const formData = new FormData();
      formData.append('file', importFile);

      console.log('Importing file:', importFile.name);
      console.log('API URL:', `${API_BASE_URL}/api/Newsletter/subscribers/bulk-import`);

      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/bulk-import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
          // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formData
      });

      console.log('Response status:', response.status);

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Response text:', text);
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error(`Unexpected response format. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to import subscribers');
      }

      setImportResults(data);
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${data.successCount} subscriber(s)`
      });

      await fetchSubscribers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error importing subscribers:', err);
      toast({
        title: 'Import Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Download CSV template
  const handleDownloadTemplate = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/download-template`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '20250204_AEGC_NewsletterSubscriberTemplate_v01.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Template downloaded successfully'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error downloading template:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;
    
    try {
      setIsDeleting(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/subscribers/${subscriberToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subscriber');
      }

      toast({
        title: 'Success',
        description: 'Subscriber deleted successfully'
      });
      
      await fetchSubscribers();
      setDeleteModalOpen(false);
      setSubscriberToDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error deleting subscriber:', err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Export subscribers to CSV
  const handleExportCSV = () => {
    try {
      const csvContent = [
        ['First Name', 'Last Name', 'Email', 'Organisation', 'Position', 'Category', 'Source', 'Status', 'Subscribed Date', 'Unsubscribed Date'],
        ...filteredSubscribers.map(sub => [
          sub.firstName || '',
          sub.lastName || '',
          sub.email,
          sub.organisation || '',
          sub.position || '',
          sub.category || '',
          sub.source || '',
          sub.isActive ? 'Active' : 'Inactive',
          formatDate(sub.subscribedAt),
          sub.unsubscribedAt ? formatDate(sub.unsubscribedAt) : 'N/A'
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `20250204_AEGC_NewsletterSubscribers_v01.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: `Exported ${filteredSubscribers.length} subscriber(s)`
      });
    } catch (err) {
      console.error('Error exporting CSV:', err);
      toast({
        title: 'Error',
        description: 'Failed to export subscribers',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubscribers();
    setRefreshing(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDetailModal = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (subscriber: Subscriber) => {
    setSubscriberToEdit(subscriber);
    setEditModalOpen(true);
  };

  // Get unique categories and sources
  const uniqueCategories = Array.from(new Set(subscribers.map(s => s.category || 'Unknown')));
  const uniqueSources = Array.from(new Set(subscribers.map(s => s.source || 'Unknown')));

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = 
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.firstName && sub.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.lastName && sub.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.organisation && sub.organisation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && sub.isActive) ||
      (statusFilter === 'inactive' && !sub.isActive);
    
    const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
    const matchesSource = sourceFilter === 'all' || sub.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesSource;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.isActive).length,
    inactive: subscribers.filter(s => !s.isActive).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  if (error && subscribers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Subscribers</h3>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Newsletter Subscribers</h1>
            <p className="text-gray-600">Manage your newsletter subscriber list</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Subscriber
            </button>
            <button
              onClick={() => setBulkImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Bulk Import
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <Users className="w-8 h-8 text-indigo-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Subscribers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <UserCheck className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <UserX className="w-8 h-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.inactive}</div>
            <div className="text-sm text-gray-600">Unsubscribed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Unsubscribed Only</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Sources</option>
                {uniqueSources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subscriber Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscribers Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Try adjusting your filters' 
                  : 'No subscribers have signed up yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${subscriber.firstName || ''} ${subscriber.lastName || ''}`.trim() || 'N/A'}
                        </div>
                        {subscriber.position && (
                          <div className="text-xs text-gray-500">{subscriber.position}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.organisation || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {subscriber.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscriber.source || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openDetailModal(subscriber)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          
                          <button
                            onClick={() => openEditModal(subscriber)}
                            className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => {
                              setSubscriberToDelete(subscriber);
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

        {/* Results count */}
        {filteredSubscribers.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setAddModalOpen(false)}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">Add New Subscriber</h3>
                <button onClick={() => setAddModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={newSubscriber.firstName}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={newSubscriber.lastName}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newSubscriber.email}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
                    <input
                      type="text"
                      value={newSubscriber.organisation}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, organisation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Example Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={newSubscriber.position}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newSubscriber.category}
                      onChange={(e) => setNewSubscriber({ ...newSubscriber, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={isAdding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubscriber}
                  disabled={isAdding || !newSubscriber.email}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Add Subscriber
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {editModalOpen && subscriberToEdit && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setEditModalOpen(false)}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">Edit Subscriber</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={subscriberToEdit.firstName || ''}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={subscriberToEdit.lastName || ''}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={subscriberToEdit.email}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organisation</label>
                    <input
                      type="text"
                      value={subscriberToEdit.organisation || ''}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, organisation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      value={subscriberToEdit.position || ''}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={subscriberToEdit.category || 'General'}
                      onChange={(e) => setSubscriberToEdit({ ...subscriberToEdit, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubscriber}
                  disabled={isEditing || !subscriberToEdit.email}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Update Subscriber
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {bulkImportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => !isImporting && setBulkImportModalOpen(false)}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-purple-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">Bulk Import Subscribers</h3>
                <button onClick={() => !isImporting && setBulkImportModalOpen(false)} className="text-white hover:text-gray-200 transition-colors" disabled={isImporting}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6">
                {!importResults ? (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Upload File</h4>
                        <button
                          onClick={handleDownloadTemplate}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          Download Template
                        </button>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Choose File
                        </label>
                        {importFile && (
                          <p className="mt-2 text-sm text-gray-600">
                            Selected: {importFile.name}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          Supported formats: CSV, Excel (.xlsx, .xls)
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Required Fields</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>Email</strong> (required)</li>
                        <li>• FirstName, LastName, Organisation, Position, Category (optional)</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-900">{importResults.totalRows}</div>
                        <div className="text-xs text-gray-600">Total Rows</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-900">{importResults.successCount}</div>
                        <div className="text-xs text-green-600">Success</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-900">{importResults.skippedCount}</div>
                        <div className="text-xs text-yellow-600">Skipped</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-900">{importResults.errorCount}</div>
                        <div className="text-xs text-red-600">Errors</div>
                      </div>
                    </div>

                    {importResults.errors.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-h-40 overflow-y-auto">
                        <h4 className="text-sm font-semibold text-red-900 mb-2">Errors</h4>
                        <ul className="text-xs text-red-700 space-y-1">
                          {importResults.errors.map((error, idx) => (
                            <li key={idx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {importResults.addedSubscribers.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 max-h-40 overflow-y-auto">
                        <h4 className="text-sm font-semibold text-green-900 mb-2">
                          Successfully Added ({importResults.addedSubscribers.length})
                        </h4>
                        <ul className="text-xs text-green-700 space-y-1">
                          {importResults.addedSubscribers.slice(0, 10).map((sub, idx) => (
                            <li key={idx}>• {sub.email} - {sub.status}</li>
                          ))}
                          {importResults.addedSubscribers.length > 10 && (
                            <li className="italic">...and {importResults.addedSubscribers.length - 10} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
                {!importResults ? (
                  <>
                    <button
                      onClick={() => setBulkImportModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      disabled={isImporting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={isImporting || !importFile}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Import Subscribers
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setImportResults(null);
                      setImportFile(null);
                      setBulkImportModalOpen(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedSubscriber && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={() => setIsDetailModalOpen(false)}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h3 className="text-xl font-semibold text-white">Subscriber Details</h3>
                <button onClick={() => setIsDetailModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Full Name</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {`${selectedSubscriber.firstName || ''} ${selectedSubscriber.lastName || ''}`.trim() || 'Not Provided'}
                    </div>
                  </div>

                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Email Address</div>
                    <div className="text-base font-medium text-gray-900">{selectedSubscriber.email}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Organisation</div>
                    <div className="text-base font-medium text-gray-900">{selectedSubscriber.organisation || 'Not Provided'}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Position</div>
                    <div className="text-base font-medium text-gray-900">{selectedSubscriber.position || 'Not Provided'}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Category</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedSubscriber.category || 'General'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Source</div>
                    <div className="text-base font-medium text-gray-900">{selectedSubscriber.source || 'Unknown'}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSubscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSubscriber.isActive ? 'Active Subscriber' : 'Unsubscribed'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Email Verified</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedSubscriber.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSubscriber.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>

                  <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Subscribed Date</div>
                    <div className="text-base font-medium text-gray-900">{formatDate(selectedSubscriber.subscribedAt)}</div>
                  </div>

                  {selectedSubscriber.unsubscribedAt && (
                    <div className="col-span-2 bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="text-sm text-red-500 mb-1">Unsubscribed Date</div>
                      <div className="text-base font-medium text-red-900">{formatDate(selectedSubscriber.unsubscribedAt)}</div>
                    </div>
                  )}

                  <div className="col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-700 font-medium mb-2">📊 Engagement Statistics</div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.emailsReceived || 0}</div>
                        <div className="text-xs text-blue-600">Emails Received</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.emailsOpened || 0}</div>
                        <div className="text-xs text-blue-600">Emails Opened</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-900">{selectedSubscriber.linksClicked || 0}</div>
                        <div className="text-xs text-blue-600">Links Clicked</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2 rounded-b-lg border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openEditModal(selectedSubscriber);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Subscriber
                </button>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    setSubscriberToDelete(selectedSubscriber);
                    setDeleteModalOpen(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Subscriber
                </button>
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

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && subscriberToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity" onClick={!isDeleting ? () => setDeleteModalOpen(false) : undefined}></div>
          
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Subscriber</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the subscriber{' '}
                        <span className="font-semibold text-gray-900">"{subscriberToDelete.email}"</span>?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 rounded-b-lg">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteSubscriber}
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedNewsletterSubscriberDashboard;