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
      
      const response = await fetch(`${API_BASE_URL}/api/tih-newsletter/campaigns`, {
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
      
      const response = await fetch(`${API_BASE_URL}/api/tih-newsletter/campaigns/${id}`, {
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
      `${API_BASE_URL}/api/tih-newsletter/campaigns/${campaignToSend.id}/send`, 
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
      
      const response = await fetch(`${API_BASE_URL}/api/tih-newsletter/campaigns/${campaignToDelete.id}`, {
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