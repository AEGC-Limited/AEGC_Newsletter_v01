'use client';
import React, { useState } from 'react';
import { Eye, Monitor, Smartphone, Code, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

// Add this state to your component
// const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');

const PreviewTab = ({ campaign }: { campaign: { subject: string; content: string } }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'code'>('desktop');

  const getPreviewHtml = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${campaign.subject || "Newsletter"}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333333; 
              background-color: #f4f6f8;
              padding: 20px;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .email-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .email-header h1 {
              color: #ffffff;
              font-size: 28px;
              font-weight: 700;
              margin: 0;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .email-body {
              padding: 40px 30px;
            }
            .email-body p {
              margin-bottom: 16px;
              font-size: 16px;
              color: #4a5568;
            }
            .email-body h2 {
              color: #2d3748;
              font-size: 22px;
              margin: 24px 0 12px 0;
              font-weight: 600;
            }
            .email-body h3 {
              color: #4a5568;
              font-size: 18px;
              margin: 20px 0 10px 0;
              font-weight: 600;
            }
            .email-body ul, .email-body ol {
              margin: 16px 0 16px 24px;
              color: #4a5568;
            }
            .email-body li {
              margin-bottom: 8px;
            }
            .email-body a {
              color: #667eea;
              text-decoration: none;
              font-weight: 500;
            }
            .email-body a:hover {
              text-decoration: underline;
            }
            .cta-button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 24px 0;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              transition: transform 0.2s;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
            }
            .email-footer {
              background-color: #f7fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .email-footer p {
              font-size: 13px;
              color: #718096;
              margin: 8px 0;
            }
            .email-footer a {
              color: #667eea;
              text-decoration: none;
              font-weight: 500;
            }
            .social-links {
              margin: 16px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 8px;
              color: #667eea;
              font-size: 14px;
            }
            .divider {
              height: 1px;
              background-color: #e2e8f0;
              margin: 24px 0;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .email-header { padding: 30px 20px; }
              .email-header h1 { font-size: 24px; }
              .email-body { padding: 30px 20px; }
              .email-footer { padding: 20px; }
              .cta-button { display: block; text-align: center; }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>${campaign.subject || "Your Newsletter Title"}</h1>
            </div>
            
            <div class="email-body">
              ${campaign.content 
                ? campaign.content
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br/>')
                    .replace(/^(.+)$/gm, '<p>$1</p>')
                : '<p style="color: #a0aec0; font-style: italic;">Your newsletter content will appear here...</p><p style="color: #a0aec0; font-style: italic;">Start typing in the compose tab to see your content come to life!</p>'}
            </div>
            
            <div class="email-footer">
              <div class="social-links">
                <a href="#">Facebook</a> • 
                <a href="#">Twitter</a> • 
                <a href="#">LinkedIn</a> • 
                <a href="#">Instagram</a>
              </div>
              
              <div class="divider"></div>
              
              <p>You're receiving this email because you subscribed to our newsletter.</p>
              <p>
                <a href="#">Unsubscribe</a> | 
                <a href="#">Update Preferences</a> | 
                <a href="#">View in Browser</a>
              </p>
              
              <p style="margin-top: 16px;">
                <strong>All-Encompassing Global Consult Limited</strong><br>
                Block 1B, A Avenue, Sparklight Estate, Isheri, Ogun State, Nigeria
              </p>
              
              <p style="font-size: 11px; color: #a0aec0; margin-top: 12px;">
                © ${new Date().getFullYear()} All Rights Reserved
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <TabsContent value="preview" className="space-y-4">
      {/* Preview Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-background border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-base sm:text-lg">Email Preview</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm" 
            onClick={() => setPreviewMode('desktop')}
            className="text-xs"
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button 
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
            className="text-xs"
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
          <Button 
            variant={previewMode === 'code' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('code')}
            className="text-xs"
          >
            <Code className="w-4 h-4 mr-1" />
            HTML
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="rounded-xl shadow-sm bg-muted/50 p-4 sm:p-8">
        {previewMode === 'code' ? (
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
              <p className="text-xs text-gray-400 font-mono">HTML Source Code</p>
            </div>
            <div className="overflow-x-auto max-h-[600px]">
              <pre className="text-xs text-green-400 font-mono p-4 whitespace-pre-wrap break-words">
                <code>{getPreviewHtml()}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[800px]'
          }`}>
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <iframe
                srcDoc={getPreviewHtml()}
                className="w-full border-0"
                style={{ 
                  minHeight: previewMode === 'mobile' ? '600px' : '700px',
                  height: previewMode === 'mobile' ? '600px' : '700px'
                }}
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Preview Information
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            This preview shows how your email will appear to recipients. Switch between Desktop, Mobile, and HTML views to see different perspectives. Note that actual rendering may vary slightly across different email clients (Gmail, Outlook, etc.).
          </p>
        </div>
      </div>
    </TabsContent>
  );
};

export default PreviewTab;