import React, { useEffect } from 'react';
import { Send, AlertCircle, Users } from 'lucide-react';

interface SendConfirmationModalProps {
  isOpen: boolean;
  campaignName: string;
  recipientCount: number;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
  isOpen,
  campaignName,
  recipientCount,
  isLoading,
  onConfirm,
  onCancel,
}) => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Blurred Overlay */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
        style={{ pointerEvents: 'auto' }}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Panel */}
        <div 
          className="relative bg-white rounded-lg shadow-2xl transform transition-all w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: 'auto', zIndex: 51 }}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <Send className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Send Campaign
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-3">
                    Are you sure you want to send the campaign{' '}
                    <span className="font-semibold text-gray-900">"{campaignName}"</span>?
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-blue-700">
                        This campaign will be sent immediately
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      Once sent, this action cannot be undone. Make sure all content is correct before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 rounded-b-lg">
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onCancel}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendConfirmationModal;