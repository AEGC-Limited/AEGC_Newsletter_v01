import React, { useEffect, useState } from 'react';
import { X, Mail, Users, CheckCircle, XCircle, Clock, Calendar, Send, RefreshCw, Eye, Code } from 'lucide-react';

interface Campaign {
  id: string | number;
  subject: string;
  content?: string;
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

interface CampaignModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, campaign, onClose }) => {
  const [previewMode, setPreviewMode] = useState<'rendered' | 'code'>('rendered');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const calculateSuccessRate = (campaign: { totalRecipients?: number; successfullySent?: number } | any) => {
    if (!campaign || campaign.totalRecipients === 0) return 0;
    return ((campaign.successfullySent || 0) / (campaign.totalRecipients || 1) * 100).toFixed(1);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Blurred Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Panel */}
        <div 
          className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-4xl my-8"
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto', zIndex: 51 }}
        >
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
            <h3 className="text-xl font-semibold text-white">
              Campaign Details
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {campaign ? (
              <div className="px-6 py-6">
                {/* Campaign Info */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Subject</div>
                      <div className="text-base font-medium text-gray-900">{campaign.subject}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Category</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(campaign.category)}`}>
                        {campaign.category}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Created By</div>
                      <div className="text-base font-medium text-gray-900">
                        {campaign.createdBy?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">{campaign.createdBy?.email || ''}</div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{campaign.totalRecipients || 0}</div>
                      <div className="text-sm text-blue-700">Total Recipients</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">{campaign.successfullySent || 0}</div>
                      <div className="text-sm text-green-700">Successfully Sent</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="flex items-center justify-between mb-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-red-900">{campaign.failed || 0}</div>
                      <div className="text-sm text-red-700">Failed</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <Send className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-900">{calculateSuccessRate(campaign)}%</div>
                      <div className="text-sm text-purple-700">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Created</div>
                        <div className="text-base font-medium text-gray-900">{formatDate(campaign.createdAt)}</div>
                      </div>
                    </div>
                    {campaign.scheduledFor && (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Scheduled For</div>
                          <div className="text-base font-medium text-gray-900">{formatDate(campaign.scheduledFor)}</div>
                        </div>
                      </div>
                    )}
                    {campaign.sentAt && (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500">Sent At</div>
                          <div className="text-base font-medium text-gray-900">{formatDate(campaign.sentAt)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Logs */}
                {campaign.emailLogs && campaign.emailLogs.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Email Logs ({campaign.emailLogs.length} recipients)
                    </h4>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {campaign.emailLogs.map((log, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3">
                                  <div className="text-sm font-medium text-gray-900">{log.subscriberName || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">{log.subscriberEmail}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(String(log.status || 'Draft'))}`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {formatDate(log.sentAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No email logs available for this campaign</p>
                  </div>
                )}

                {/* Email Content Preview */}
                {campaign.content && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Email Content Preview</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewMode('rendered')}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            previewMode === 'rendered'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Eye className="w-4 h-4 inline-block mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => setPreviewMode('code')}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            previewMode === 'code'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Code className="w-4 h-4 inline-block mr-1" />
                          HTML
                        </button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      {previewMode === 'rendered' ? (
                        <div className="bg-white">
                          <iframe
                            srcDoc={campaign.content}
                            className="w-full border-0"
                            style={{ minHeight: '500px', height: '500px' }}
                            title="Email Preview"
                            sandbox="allow-same-origin"
                          />
                        </div>
                      ) : (
                        <div className="bg-gray-900 p-4 overflow-x-auto">
                          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                            <code>{campaign.content}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading campaign details...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg border-t border-gray-200">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;