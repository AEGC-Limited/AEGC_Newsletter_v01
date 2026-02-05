// "use client";

// import React, { useState, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Icon } from "@iconify/react";
// import { 
//   Send, 
//   Save, 
//   Eye, 
//   Users,
//   Mail,
//   FileText,
//   AlertCircle,
//   Clock,
//   CheckCircle2,
//   XCircle
// } from "lucide-react";
// import PreviewTab from "@/app/components/Campaign/PreviewTab";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const NewsletterComposer = () => {
//   const [campaign, setCampaign] = useState<{
//     subject: string;
//     content: string;
//     category: string;
//     scheduledFor: Date | undefined;
//     targetCategory: string;
//   }>({
//     subject: "",
//     content: "",
//     category: "",
//     scheduledFor: undefined,
//     targetCategory: "all"
//   });

//   const [activeTab, setActiveTab] = useState("compose");
//   const [isSaving, setIsSaving] = useState(false);
//   const [isSending, setIsSending] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [time, setTime] = useState("");
//   const [savedCampaignId, setSavedCampaignId] = useState(null);
//   const [notification, setNotification] = useState({ show: false, type: "", message: "" });

//   const [subscriberStats, setSubscriberStats] = useState<Record<string, number>>({
//     all: 0,
//     general: 0,
//     investors: 0,
//     partners: 0,
//     media: 0
//   });

//   // Get auth token from localStorage or your auth system
//   const getAuthToken = () => {
//     return localStorage.getItem("token") || "";
//   };

//   // Fetch subscriber statistics
//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/Newsletter/stats`, {
//         headers: {
//           "Authorization": `Bearer ${getAuthToken()}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // Map the API response to our stats structure
//         const categoryStats: Record<string, number> = {};
//         data.byCategory.forEach((cat: { category: string; count: number }) => {
//           categoryStats[cat.category.toLowerCase()] = cat.count;
//         });

//         setSubscriberStats({
//           all: data.activeSubscribers,
//           general: categoryStats.general || 0,
//           investors: categoryStats.investors || 0,
//           partners: categoryStats.partners || 0,
//           media: categoryStats.media || 0
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//       showNotification("error", "Failed to load subscriber statistics");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const showNotification = (type: string, message: string) => {
//     setNotification({ show: true, type, message });
//     setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
//   };

//   const handleSaveDraft = async () => {
//     if (!campaign.subject || !campaign.content) {
//       showNotification("error", "Please fill in subject and content");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const endpoint = savedCampaignId 
//         ? `${API_BASE_URL}/api/Newsletter/campaigns/${savedCampaignId}`
//         : `${API_BASE_URL}/api/Newsletter/campaigns`;
      
//       const method = savedCampaignId ? "PUT" : "POST";

//       const response = await fetch(endpoint, {
//         method,
//         headers: {
//           "Authorization": `Bearer ${getAuthToken()}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           subject: campaign.subject,
//           content: campaign.content,
//           category: campaign.category,
//           scheduledFor: null
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (!savedCampaignId && data.id) {
//           setSavedCampaignId(data.id);
//         }
//         showNotification("success", "Draft saved successfully!");
//       } else {
//         const error = await response.json();
//         showNotification("error", error.message || "Failed to save draft");
//       }
//     } catch (error) {
//       console.error("Error saving draft:", error);
//       showNotification("error", "An error occurred while saving");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSchedule = async () => {
//     if (!campaign.subject || !campaign.content) {
//       showNotification("error", "Please fill in subject and content");
//       return;
//     }

//     if (!campaign.scheduledFor || !time) {
//       showNotification("error", "Please select both date and time");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Combine date and time
//       const [hours, minutes] = time.split(":");
//       const scheduledDateTime = new Date(campaign.scheduledFor);
//       scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

//       const endpoint = savedCampaignId 
//         ? `${API_BASE_URL}/api/Newsletter/campaigns/${savedCampaignId}`
//         : `${API_BASE_URL}/api/Newsletter/campaigns`;
      
//       const method = savedCampaignId ? "PUT" : "POST";

//       const response = await fetch(endpoint, {
//         method,
//         headers: {
//           "Authorization": `Bearer ${getAuthToken()}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           subject: campaign.subject,
//           content: campaign.content,
//           category: campaign.category,
//           scheduledFor: scheduledDateTime.toISOString()
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (!savedCampaignId && data.id) {
//           setSavedCampaignId(data.id);
//         }
//         showNotification("success", `Campaign scheduled for ${scheduledDateTime.toLocaleString()}`);
//       } else {
//         const error = await response.json();
//         showNotification("error", error.message || "Failed to schedule campaign");
//       }
//     } catch (error) {
//       console.error("Error scheduling campaign:", error);
//       showNotification("error", "An error occurred while scheduling");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleSendNow = async () => {
//     if (!campaign.subject || !campaign.content) {
//       showNotification("error", "Please fill in subject and content");
//       return;
//     }
    
//     const recipientCount = subscriberStats[campaign.targetCategory] || subscriberStats.all;
//     const confirmed = window.confirm(
//       `Send this campaign to ${recipientCount} subscribers now? This action cannot be undone.`
//     );
    
//     if (!confirmed) return;

//     setIsSending(true);
//     try {
//       // First, create/update the campaign
//       let campaignId = savedCampaignId;
      
//       if (!campaignId) {
//         const createResponse = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns`, {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${getAuthToken()}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             subject: campaign.subject,
//             content: campaign.content,
//             category: campaign.category,
//             scheduledFor: null
//           })
//         });

//         if (!createResponse.ok) {
//           throw new Error("Failed to create campaign");
//         }

//         const createData = await createResponse.json();
//         campaignId = createData.id;
//         setSavedCampaignId(campaignId);
//       }

//       // Now send the campaign
//       const sendResponse = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}/send`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${getAuthToken()}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           targetCategory: campaign.targetCategory === "all" ? null : campaign.targetCategory
//         })
//       });

//       if (sendResponse.ok) {
//         const data = await sendResponse.json();
//         showNotification("success", `Campaign sent! Success: ${data.successCount}, Failed: ${data.failedCount}`);
        
//         // Reset form after successful send
//         setTimeout(() => {
//           setCampaign({
//             subject: "",
//             content: "",
//             category: "",
//             scheduledFor: undefined,
//             targetCategory: "all"
//           });
//           setSavedCampaignId(null);
//           setTime("");
//         }, 2000);
//       } else {
//         const error = await sendResponse.json();
//         showNotification("error", error.message || "Failed to send campaign");
//       }
//     } catch (error) {
//       console.error("Error sending campaign:", error);
//       showNotification("error", "An error occurred while sending");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const getPreviewHtml = () => {
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>
//             body { 
//               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
//               line-height: 1.6; 
//               color: #333; 
//               max-width: 600px; 
//               margin: 0 auto; 
//               padding: 20px;
//               background-color: #f5f5f5;
//             }
//             .container {
//               background-color: white;
//               padding: 40px;
//               border-radius: 8px;
//               box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//             }
//             h1 { 
//               color: #2563eb; 
//               margin-top: 0;
//               font-size: 24px;
//             }
//             .content {
//               margin: 20px 0;
//             }
//             .footer { 
//               margin-top: 40px; 
//               padding-top: 20px; 
//               border-top: 1px solid #ddd; 
//               font-size: 12px; 
//               color: #666; 
//               text-align: center;
//             }
//             .footer a {
//               color: #2563eb;
//               text-decoration: none;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <h1>${campaign.subject || "Your Newsletter Subject"}</h1>
//             <div class="content">${campaign.content.replace(/\n/g, '<br/>') || "Your newsletter content will appear here..."}</div>
//             <div class="footer">
//               <p>You're receiving this email because you subscribed to our newsletter.</p>
//               <p><a href="#">Unsubscribe</a> | <a href="#">Update Preferences</a></p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Icon icon="eos-icons:loading" className="w-8 h-8 text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full mx-auto p-3 sm:p-4 md:p-6">
//       {/* Notification Toast */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 max-w-sm w-full sm:w-auto p-4 rounded-lg shadow-lg animate-in slide-in-from-top ${
//           notification.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
//         }`}>
//           <div className="flex items-start gap-3">
//             {notification.type === "success" ? (
//               <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             ) : (
//               <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             )}
//             <p className={`text-sm flex-1 ${
//               notification.type === "success" ? "text-green-800" : "text-red-800"
//             }`}>
//               {notification.message}
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="mb-6 sm:mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-2">Newsletter Campaign Composer</h1>
//         <p className="text-sm sm:text-base text-muted-foreground">Create and send engaging newsletters to your subscribers</p>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
//           <TabsTrigger value="compose" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
//             <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
//             <span className="hidden sm:inline">Compose</span>
//             <span className="sm:hidden">Edit</span>
//           </TabsTrigger>
//           <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
//             <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//             Preview
//           </TabsTrigger>
//           <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
//             <Icon icon="solar:calendar-minimalistic-linear" className="w-3 h-3 sm:w-4 sm:h-4" />
//             <span className="hidden sm:inline">Schedule</span>
//             <span className="sm:hidden">Time</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Compose Tab */}
//         <TabsContent value="compose" className="space-y-4 sm:space-y-6">
//           <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
//             {/* Main Composer */}
//             <div className="lg:col-span-2 space-y-4 sm:space-y-6">
//               <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
//                 <div className="space-y-4 sm:space-y-6">
//                   {/* Subject Line */}
//                   <div>
//                     <Label htmlFor="subject" className="text-sm sm:text-base font-semibold">
//                       Email Subject *
//                     </Label>
//                     <Input
//                       id="subject"
//                       type="text"
//                       placeholder="Enter your compelling subject line..."
//                       value={campaign.subject}
//                       onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
//                       className="mt-2 text-base sm:text-lg"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {campaign.subject.length}/100 characters
//                     </p>
//                   </div>

//                   {/* Email Content */}
//                   <div>
//                     <Label htmlFor="content" className="text-sm sm:text-base font-semibold">
//                       Email Content *
//                     </Label>
//                     <Textarea
//                       id="content"
//                       placeholder="Write your newsletter content here...

// You can include:
// • Important updates and announcements
// • Featured articles or resources
// • Call-to-action links
// • Upcoming events

// Tip: Keep it concise and engaging!"
//                       value={campaign.content}
//                       onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
//                       rows={12}
//                       className="mt-2 text-sm sm:text-base"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {campaign.content.length} characters
//                     </p>
//                   </div>

//                   {/* Rich Text Toolbar */}
//                   <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
//                     <Button variant="ghost" size="sm" title="Bold" className="h-8 w-8 p-0">
//                       <Icon icon="material-symbols:format-bold" className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" title="Italic" className="h-8 w-8 p-0">
//                       <Icon icon="material-symbols:format-italic" className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" title="Link" className="h-8 w-8 p-0">
//                       <Icon icon="material-symbols:link" className="w-4 h-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" title="List" className="h-8 w-8 p-0">
//                       <Icon icon="material-symbols:format-list-bulleted" className="w-4 h-4" />
//                     </Button>
//                     <div className="flex-1 min-w-0" />
//                     <span className="text-xs text-muted-foreground self-center hidden sm:inline">
//                       HTML supported
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-4 sm:space-y-6">
//               {/* Quick Actions */}
//               <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
//                 <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
//                   <Send className="w-4 h-4" />
//                   Quick Actions
//                 </h3>
//                 <div className="space-y-2 sm:space-y-3">
//                   <Button 
//                     onClick={handleSendNow}
//                     disabled={isSending || !campaign.subject || !campaign.content}
//                     className="w-full text-sm"
//                     size="sm"
//                   >
//                     {isSending ? (
//                       <>
//                         <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
//                         Sending...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-4 h-4 mr-2" />
//                         Send Now
//                       </>
//                     )}
//                   </Button>
                  
//                   <Button 
//                     onClick={handleSchedule}
//                     variant="outline"
//                     disabled={isSaving}
//                     className="w-full text-sm"
//                     size="sm"
//                   >
//                     <Icon icon="solar:calendar-minimalistic-linear" className="w-4 h-4 mr-2" />
//                     Schedule Send
//                   </Button>
                  
//                   <Button 
//                     onClick={handleSaveDraft}
//                     variant="outline"
//                     disabled={isSaving}
//                     className="w-full text-sm"
//                     size="sm"
//                   >
//                     {isSaving ? (
//                       <>
//                         <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="w-4 h-4 mr-2" />
//                         Save Draft
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               {/* Recipient Info */}
//               <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
//                 <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
//                   <Users className="w-4 h-4" />
//                   Recipients
//                 </h3>
//                 <div className="space-y-3 sm:space-y-4">
//                   <div>
//                     <Label htmlFor="targetCategory" className="text-sm">Target Audience</Label>
//                     <Select 
//                       value={campaign.targetCategory}
//                       onValueChange={(value) => setCampaign({ ...campaign, targetCategory: value })}
//                     >
//                       <SelectTrigger className="mt-2 text-sm">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Subscribers ({subscriberStats.all})</SelectItem>
//                         <SelectItem value="general">General ({subscriberStats.general})</SelectItem>
//                         <SelectItem value="investors">Investors ({subscriberStats.investors})</SelectItem>
//                         <SelectItem value="partners">Partners ({subscriberStats.partners})</SelectItem>
//                         <SelectItem value="media">Media ({subscriberStats.media})</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
//                     <div className="flex items-start gap-2">
//                       <Mail className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                           {subscriberStats[campaign.targetCategory] || subscriberStats.all} recipients
//                         </p>
//                         <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
//                           Active subscribers only
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Category Tag */}
//               <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
//                 <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Campaign Category</h3>
//                 <Select 
//                   value={campaign.category}
//                   onValueChange={(value) => setCampaign({ ...campaign, category: value })}
//                 >
//                   <SelectTrigger className="text-sm">
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="announcement">Announcement</SelectItem>
//                     <SelectItem value="newsletter">Newsletter</SelectItem>
//                     <SelectItem value="update">Update</SelectItem>
//                     <SelectItem value="promotion">Promotion</SelectItem>
//                     <SelectItem value="event">Event</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         </TabsContent>

//         {/* Preview Tab */}
//         <PreviewTab campaign={campaign} />
//         {/* Settings Tab */}
//         <TabsContent value="settings">
//           <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
//             <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Schedule Settings</h3>
//             <div className="space-y-4 sm:space-y-6 max-w-md">
//               <div>
//                 <Label htmlFor="schedule-date" className="text-sm sm:text-base">Schedule Date</Label>
//                 <Popover open={open} onOpenChange={setOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-between font-normal mt-2 text-sm sm:text-base"
//                     >
//                       {campaign.scheduledFor ? 
//                         campaign.scheduledFor.toLocaleDateString() : 
//                         "Select date"
//                       }
//                       <Icon icon="solar:calendar-minimalistic-linear" className="w-4 h-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={campaign.scheduledFor}
//                       onSelect={(date) => {
//                         setCampaign({ ...campaign, scheduledFor: date });
//                         setOpen(false);
//                       }}
//                       disabled={(date) => date < new Date()}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               <div>
//                 <Label htmlFor="schedule-time" className="text-sm sm:text-base">Schedule Time</Label>
//                 <div className="relative mt-2">
//                   <Input
//                     id="schedule-time"
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="pr-10 text-sm sm:text-base"
//                   />
//                   <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
//                 </div>
//               </div>

//               {campaign.scheduledFor && time && (
//                 <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//                   <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
//                     <strong>Scheduled for:</strong><br />
//                     {campaign.scheduledFor.toLocaleDateString()} at {time}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default NewsletterComposer;





"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { 
  Send, 
  Save, 
  Eye, 
  Users,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import PreviewTab from "@/app/components/Campaign/PreviewTab";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CategoryStat {
  category: string;
  count: number;
}

const NewsletterComposer = () => {
  const [campaign, setCampaign] = useState<{
    subject: string;
    content: string;
    category: string;
    scheduledFor: Date | undefined;
    targetCategory: string;
  }>({
    subject: "",
    content: "",
    category: "",
    scheduledFor: undefined,
    targetCategory: "all"
  });

  const [activeTab, setActiveTab] = useState("compose");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState({ hour: "12", minute: "00", period: "PM" });
  const [savedCampaignId, setSavedCampaignId] = useState<number | null>(null);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const [subscriberStats, setSubscriberStats] = useState<Record<string, number>>({
    all: 0
  });
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("token") || "";
  };

  // Fetch subscriber statistics
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Newsletter/stats`, {
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store category stats for dropdown
        setCategoryStats(data.byCategory || []);
        
        // Map the API response to our stats structure
        const stats: Record<string, number> = {
          all: data.activeSubscribers
        };
        
        data.byCategory?.forEach((cat: CategoryStat) => {
          stats[cat.category.toLowerCase()] = cat.count;
        });

        setSubscriberStats(stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      showNotification("error", "Failed to load subscriber statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (type: string, message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
  };

  // Get recipient count for selected category
  const getRecipientCount = () => {
    if (campaign.targetCategory === "all") {
      return subscriberStats.all;
    }
    return subscriberStats[campaign.targetCategory.toLowerCase()] || 0;
  };

  // Format time for display
  const getFormattedTime = () => {
    return `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
  };

  // Convert 12-hour time to 24-hour format
  const convertTo24Hour = (hour: string, period: string) => {
    let h = parseInt(hour);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h;
  };

  const handleSaveDraft = async () => {
    if (!campaign.subject || !campaign.content) {
      showNotification("error", "Please fill in subject and content");
      return;
    }

    setIsSaving(true);
    try {
      const endpoint = savedCampaignId 
        ? `${API_BASE_URL}/api/Newsletter/campaigns/${savedCampaignId}`
        : `${API_BASE_URL}/api/Newsletter/campaigns`;
      
      const method = savedCampaignId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: campaign.subject,
          content: campaign.content,
          category: campaign.category,
          scheduledFor: null
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (!savedCampaignId && data.id) {
          setSavedCampaignId(data.id);
        }
        showNotification("success", "Draft saved successfully!");
      } else {
        const error = await response.json();
        showNotification("error", error.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      showNotification("error", "An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!campaign.subject || !campaign.content) {
      showNotification("error", "Please fill in subject and content");
      return;
    }

    if (!campaign.scheduledFor) {
      showNotification("error", "Please select a date and time");
      return;
    }

    setIsSaving(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(campaign.scheduledFor);
      const hour24 = convertTo24Hour(selectedTime.hour, selectedTime.period);
      scheduledDateTime.setHours(hour24, parseInt(selectedTime.minute), 0);

      const endpoint = savedCampaignId 
        ? `${API_BASE_URL}/api/Newsletter/campaigns/${savedCampaignId}`
        : `${API_BASE_URL}/api/Newsletter/campaigns`;
      
      const method = savedCampaignId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Authorization": `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: campaign.subject,
          content: campaign.content,
          category: campaign.category,
          scheduledFor: scheduledDateTime.toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (!savedCampaignId && data.id) {
          setSavedCampaignId(data.id);
        }
        showNotification("success", `Campaign scheduled for ${scheduledDateTime.toLocaleString()}`);
      } else {
        const error = await response.json();
        showNotification("error", error.message || "Failed to schedule campaign");
      }
    } catch (error) {
      console.error("Error scheduling campaign:", error);
      showNotification("error", "An error occurred while scheduling");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!campaign.subject || !campaign.content) {
      showNotification("error", "Please fill in subject and content");
      return;
    }
    
    const recipientCount = getRecipientCount();
    const categoryName = campaign.targetCategory === "all" 
      ? "All Subscribers" 
      : categoryStats.find(c => c.category.toLowerCase() === campaign.targetCategory.toLowerCase())?.category || campaign.targetCategory;
    
    const confirmed = window.confirm(
      `Send this campaign to ${recipientCount} subscribers in "${categoryName}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    setIsSending(true);
    try {
      // Create campaign if not saved
      let campaignId = savedCampaignId;
      
      if (!campaignId) {
        const createResponse = await fetch(`${API_BASE_URL}/api/Newsletter/campaigns`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            subject: campaign.subject,
            content: campaign.content,
            category: campaign.category,
            scheduledFor: null
          })
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create campaign");
        }

        const createData = await createResponse.json();
        campaignId = createData.id;
        setSavedCampaignId(campaignId);
      }

      // Send campaign - convert targetCategory to targetAudience array
      const targetAudience = campaign.targetCategory === "all" 
        ? ["All Subscribers"] 
        : [categoryStats.find(c => c.category.toLowerCase() === campaign.targetCategory.toLowerCase())?.category || campaign.targetCategory];

      const sendResponse = await fetch(
        `${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}/send`, 
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            targetAudience: targetAudience
          })
        }
      );

      if (sendResponse.ok) {
        const data = await sendResponse.json();
        
        // Build success message
        let successMessage = `✅ Campaign sent successfully!\n\n`;
        successMessage += `📧 ${data.successCount} emails sent\n`;
        if (data.failedCount > 0) {
          successMessage += `❌ ${data.failedCount} failed\n`;
        }
        
        if (data.categoryBreakdown && data.categoryBreakdown.length > 0) {
          successMessage += `\n📊 Breakdown:\n`;
          data.categoryBreakdown.forEach((cat: any) => {
            successMessage += `   • ${cat.category}: ${cat.recipientCount}\n`;
          });
        }
        
        showNotification("success", successMessage);
        
        // Reset form
        setTimeout(() => {
          setCampaign({
            subject: "",
            content: "",
            category: "",
            scheduledFor: undefined,
            targetCategory: "all"
          });
          setSavedCampaignId(null);
          setSelectedTime({ hour: "12", minute: "00", period: "PM" });
        }, 3000);
      } else {
        const error = await sendResponse.json();
        showNotification("error", error.message || "Failed to send campaign");
      }
    } catch (error) {
      console.error("Error sending campaign:", error);
      showNotification("error", "An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  // Generate minutes (00-59, every 5 minutes)
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icon icon="eos-icons:loading" className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-md w-full sm:w-auto p-4 rounded-lg shadow-lg animate-in slide-in-from-top ${
          notification.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <div className="flex items-start gap-3">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div className={`text-sm flex-1 whitespace-pre-line ${
              notification.type === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {notification.message}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Newsletter Campaign Composer</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Create and send engaging newsletters to your subscribers</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
          <TabsTrigger value="compose" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Compose</span>
            <span className="sm:hidden">Edit</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Icon icon="solar:calendar-minimalistic-linear" className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Schedule</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            {/* Main Composer */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Subject */}
                  <div>
                    <Label htmlFor="subject" className="text-sm sm:text-base font-semibold">
                      Email Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Enter your compelling subject line..."
                      value={campaign.subject}
                      onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                      className="mt-2 text-base sm:text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {campaign.subject.length}/100 characters
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="content" className="text-sm sm:text-base font-semibold">
                      Email Content *
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your newsletter content here...

You can include:
• Important updates and announcements
• Featured articles or resources
• Call-to-action links
• Upcoming events

Tip: Keep it concise and engaging!"
                      value={campaign.content}
                      onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                      rows={12}
                      className="mt-2 text-sm sm:text-base"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {campaign.content.length} characters
                    </p>
                  </div>

                  {/* Rich Text Toolbar */}
                  <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
                    <Button variant="ghost" size="sm" title="Bold" className="h-8 w-8 p-0">
                      <Icon icon="material-symbols:format-bold" className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Italic" className="h-8 w-8 p-0">
                      <Icon icon="material-symbols:format-italic" className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Link" className="h-8 w-8 p-0">
                      <Icon icon="material-symbols:link" className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="List" className="h-8 w-8 p-0">
                      <Icon icon="material-symbols:format-list-bulleted" className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 min-w-0" />
                    <span className="text-xs text-muted-foreground self-center hidden sm:inline">
                      HTML supported
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Actions */}
              <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Quick Actions
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    onClick={handleSendNow}
                    disabled={isSending || !campaign.subject || !campaign.content}
                    className="w-full text-sm"
                    size="sm"
                  >
                    {isSending ? (
                      <>
                        <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Now
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSchedule}
                    variant="outline"
                    disabled={isSaving}
                    className="w-full text-sm"
                    size="sm"
                  >
                    <Icon icon="solar:calendar-minimalistic-linear" className="w-4 h-4 mr-2" />
                    Schedule Send
                  </Button>
                  
                  <Button 
                    onClick={handleSaveDraft}
                    variant="outline"
                    disabled={isSaving}
                    className="w-full text-sm"
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Recipients - Dropdown */}
              <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recipients
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="targetCategory" className="text-sm">Target Audience</Label>
                    <Select 
                      value={campaign.targetCategory}
                      onValueChange={(value) => setCampaign({ ...campaign, targetCategory: value })}
                    >
                      <SelectTrigger className="mt-2 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subscribers ({subscriberStats.all})</SelectItem>
                        {categoryStats.map((cat) => (
                          <SelectItem key={cat.category} value={cat.category.toLowerCase()}>
                            {cat.category} ({cat.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {getRecipientCount()} recipients
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Active subscribers only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Category */}
              <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Campaign Category</h3>
                <Select 
                  value={campaign.category}
                  onValueChange={(value) => setCampaign({ ...campaign, category: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <PreviewTab campaign={campaign} />
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="rounded-xl shadow-sm bg-background border p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Schedule Settings</h3>
            <div className="space-y-4 sm:space-y-6 max-w-md">
              {/* Date Picker */}
              <div>
                <Label htmlFor="schedule-date" className="text-sm sm:text-base">Schedule Date</Label>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal mt-2 text-sm sm:text-base"
                    >
                      {campaign.scheduledFor ? 
                        campaign.scheduledFor.toLocaleDateString() : 
                        "Select date"
                      }
                      <Icon icon="solar:calendar-minimalistic-linear" className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={campaign.scheduledFor}
                      onSelect={(date) => {
                        setCampaign({ ...campaign, scheduledFor: date });
                        setOpenDatePicker(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div>
                <Label htmlFor="schedule-time" className="text-sm sm:text-base">Schedule Time</Label>
                <Popover open={openTimePicker} onOpenChange={setOpenTimePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal mt-2 text-sm sm:text-base"
                    >
                      {getFormattedTime()}
                      <Clock className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4" align="start">
                    <div className="space-y-4">
                      <div className="flex gap-2 items-center justify-center">
                        {/* Hour */}
                        <Select
                          value={selectedTime.hour}
                          onValueChange={(value) => setSelectedTime({ ...selectedTime, hour: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="text-xl font-bold">:</span>

                        {/* Minute */}
                        <Select
                          value={selectedTime.minute}
                          onValueChange={(value) => setSelectedTime({ ...selectedTime, minute: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {minutes.map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* AM/PM */}
                        <Select
                          value={selectedTime.period}
                          onValueChange={(value) => setSelectedTime({ ...selectedTime, period: value })}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={() => setOpenTimePicker(false)}
                        className="w-full"
                        size="sm"
                      >
                        Done
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Schedule Summary */}
              {campaign.scheduledFor && (
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                    <strong>Scheduled for:</strong><br />
                    {campaign.scheduledFor.toLocaleDateString()} at {getFormattedTime()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterComposer;