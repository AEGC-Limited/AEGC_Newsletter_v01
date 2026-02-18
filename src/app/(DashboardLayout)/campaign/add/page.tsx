




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
//   Clock,
//   CheckCircle2,
//   XCircle
// } from "lucide-react";
// import PreviewTab from "@/app/components/Campaign/PreviewTab";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// interface CategoryStat {
//   category: string;
//   count: number;
// }

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
//   const [openDatePicker, setOpenDatePicker] = useState(false);
//   const [openTimePicker, setOpenTimePicker] = useState(false);
//   const [selectedTime, setSelectedTime] = useState({ hour: "12", minute: "00", period: "PM" });
//   const [savedCampaignId, setSavedCampaignId] = useState<number | null>(null);
//   const [notification, setNotification] = useState({ show: false, type: "", message: "" });

//   const [subscriberStats, setSubscriberStats] = useState<Record<string, number>>({
//     all: 0
//   });
//   const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);

//   // Get auth token
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
        
//         // Store category stats for dropdown
//         setCategoryStats(data.byCategory || []);
        
//         // Map the API response to our stats structure
//         const stats: Record<string, number> = {
//           all: data.activeSubscribers
//         };
        
//         data.byCategory?.forEach((cat: CategoryStat) => {
//           stats[cat.category.toLowerCase()] = cat.count;
//         });

//         setSubscriberStats(stats);
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

//   // Get recipient count for selected category
//   const getRecipientCount = () => {
//     if (campaign.targetCategory === "all") {
//       return subscriberStats.all;
//     }
//     return subscriberStats[campaign.targetCategory.toLowerCase()] || 0;
//   };

//   // Format time for display
//   const getFormattedTime = () => {
//     return `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
//   };

//   // Convert 12-hour time to 24-hour format
//   const convertTo24Hour = (hour: string, period: string) => {
//     let h = parseInt(hour);
//     if (period === "PM" && h !== 12) h += 12;
//     if (period === "AM" && h === 12) h = 0;
//     return h;
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

//     if (!campaign.scheduledFor) {
//       showNotification("error", "Please select a date and time");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Combine date and time
//       const scheduledDateTime = new Date(campaign.scheduledFor);
//       const hour24 = convertTo24Hour(selectedTime.hour, selectedTime.period);
//       scheduledDateTime.setHours(hour24, parseInt(selectedTime.minute), 0);

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
    
//     const recipientCount = getRecipientCount();
//     const categoryName = campaign.targetCategory === "all" 
//       ? "All Subscribers" 
//       : categoryStats.find(c => c.category.toLowerCase() === campaign.targetCategory.toLowerCase())?.category || campaign.targetCategory;
    
//     const confirmed = window.confirm(
//       `Send this campaign to ${recipientCount} subscribers in "${categoryName}"?\n\nThis action cannot be undone.`
//     );
    
//     if (!confirmed) return;

//     setIsSending(true);
//     try {
//       // Create campaign if not saved
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

//       // Send campaign - convert targetCategory to targetAudience array
//       const targetAudience = campaign.targetCategory === "all" 
//         ? ["All Subscribers"] 
//         : [categoryStats.find(c => c.category.toLowerCase() === campaign.targetCategory.toLowerCase())?.category || campaign.targetCategory];

//       const sendResponse = await fetch(
//         `${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}/send`, 
//         {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${getAuthToken()}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             targetAudience: targetAudience
//           })
//         }
//       );

//       if (sendResponse.ok) {
//         const data = await sendResponse.json();
        
//         // Build success message
//         let successMessage = `✅ Campaign sent successfully!\n\n`;
//         successMessage += `📧 ${data.successCount} emails sent\n`;
//         if (data.failedCount > 0) {
//           successMessage += `❌ ${data.failedCount} failed\n`;
//         }
        
//         if (data.categoryBreakdown && data.categoryBreakdown.length > 0) {
//           successMessage += `\n📊 Breakdown:\n`;
//           data.categoryBreakdown.forEach((cat: any) => {
//             successMessage += `   • ${cat.category}: ${cat.recipientCount}\n`;
//           });
//         }
        
//         showNotification("success", successMessage);
        
//         // Reset form
//         setTimeout(() => {
//           setCampaign({
//             subject: "",
//             content: "",
//             category: "",
//             scheduledFor: undefined,
//             targetCategory: "all"
//           });
//           setSavedCampaignId(null);
//           setSelectedTime({ hour: "12", minute: "00", period: "PM" });
//         }, 3000);
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

//   // Generate hours (1-12)
//   const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
//   // Generate minutes (00-59, every 5 minutes)
//   const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

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
//         <div className={`fixed top-4 right-4 z-50 max-w-md w-full sm:w-auto p-4 rounded-lg shadow-lg animate-in slide-in-from-top ${
//           notification.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
//         }`}>
//           <div className="flex items-start gap-3">
//             {notification.type === "success" ? (
//               <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             ) : (
//               <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             )}
//             <div className={`text-sm flex-1 whitespace-pre-line ${
//               notification.type === "success" ? "text-green-800" : "text-red-800"
//             }`}>
//               {notification.message}
//             </div>
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
//                   {/* Subject */}
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

//                   {/* Content */}
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

//               {/* Recipients - Dropdown */}
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
//                         {categoryStats.map((cat) => (
//                           <SelectItem key={cat.category} value={cat.category.toLowerCase()}>
//                             {cat.category} ({cat.count})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
//                     <div className="flex items-start gap-2">
//                       <Mail className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
//                       <div className="min-w-0 flex-1">
//                         <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
//                           {getRecipientCount()} recipients
//                         </p>
//                         <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
//                           Active subscribers only
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Campaign Category */}
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
//               {/* Date Picker */}
//               <div>
//                 <Label htmlFor="schedule-date" className="text-sm sm:text-base">Schedule Date</Label>
//                 <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
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
//                         setOpenDatePicker(false);
//                       }}
//                       disabled={(date) => date < new Date()}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Time Picker */}
//               <div>
//                 <Label htmlFor="schedule-time" className="text-sm sm:text-base">Schedule Time</Label>
//                 <Popover open={openTimePicker} onOpenChange={setOpenTimePicker}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-between font-normal mt-2 text-sm sm:text-base"
//                     >
//                       {getFormattedTime()}
//                       <Clock className="w-4 h-4" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-4" align="start">
//                     <div className="space-y-4">
//                       <div className="flex gap-2 items-center justify-center">
//                         {/* Hour */}
//                         <Select
//                           value={selectedTime.hour}
//                           onValueChange={(value) => setSelectedTime({ ...selectedTime, hour: value })}
//                         >
//                           <SelectTrigger className="w-20">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {hours.map((h) => (
//                               <SelectItem key={h} value={h}>{h}</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         <span className="text-xl font-bold">:</span>

//                         {/* Minute */}
//                         <Select
//                           value={selectedTime.minute}
//                           onValueChange={(value) => setSelectedTime({ ...selectedTime, minute: value })}
//                         >
//                           <SelectTrigger className="w-20">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {minutes.map((m) => (
//                               <SelectItem key={m} value={m}>{m}</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         {/* AM/PM */}
//                         <Select
//                           value={selectedTime.period}
//                           onValueChange={(value) => setSelectedTime({ ...selectedTime, period: value })}
//                         >
//                           <SelectTrigger className="w-20">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="AM">AM</SelectItem>
//                             <SelectItem value="PM">PM</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <Button 
//                         onClick={() => setOpenTimePicker(false)}
//                         className="w-full"
//                         size="sm"
//                       >
//                         Done
//                       </Button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* Schedule Summary */}
//               {campaign.scheduledFor && (
//                 <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//                   <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
//                     <strong>Scheduled for:</strong><br />
//                     {campaign.scheduledFor.toLocaleDateString()} at {getFormattedTime()}
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
  XCircle,
  Image as ImageIcon,
  Upload,
  X
} from "lucide-react";
import PreviewTab from "@/app/components/Campaign/PreviewTab";
import Image from "next/image";

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

  // ═══════════════════════════════════════════════════════════════
  // NEW: IMAGE UPLOAD STATE
  // ═══════════════════════════════════════════════════════════════
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [imageAltText, setImageAltText] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
        setCategoryStats(data.byCategory || []);
        
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

  // ═══════════════════════════════════════════════════════════════
  // NEW: IMAGE HANDLING FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showNotification("error", "Invalid file type. Please upload JPG, PNG, GIF, or WebP");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image size must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageAltText("");
  };

  const handleRemoveExistingImage = async () => {
    if (!savedCampaignId || !existingImageUrl) return;

    if (!confirm("Are you sure you want to remove the campaign image?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Newsletter/campaigns/${savedCampaignId}/image`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${getAuthToken()}`
          }
        }
      );

      if (response.ok) {
        setExistingImageUrl(null);
        showNotification("success", "Image removed successfully");
      } else {
        const error = await response.json();
        showNotification("error", error.message || "Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      showNotification("error", "An error occurred while removing image");
    }
  };

  const uploadImage = async (campaignId: number) => {
    if (!selectedImage) return null;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      if (imageAltText) {
        formData.append("altText", imageAltText);
      }

      const response = await fetch(
        `${API_BASE_URL}/api/Newsletter/campaigns/${campaignId}/upload-image`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${getAuthToken()}`
          },
          body: formData
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExistingImageUrl(data.imageUrl);
        setSelectedImage(null);
        setImagePreview(null);
        return data.imageUrl;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // UPDATED: SAVE/SEND FUNCTIONS WITH IMAGE SUPPORT
  // ═══════════════════════════════════════════════════════════════

  const handleSaveDraft = async () => {
    if (!campaign.subject || !campaign.content) {
      showNotification("error", "Please fill in subject and content");
      return;
    }

    setIsSaving(true);
    try {
      // Step 1: Create/Update Campaign
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
        const campaignId = savedCampaignId || data.id;
        
        if (!savedCampaignId && campaignId) {
          setSavedCampaignId(campaignId);
        }

        // Step 2: Upload image if selected
        if (selectedImage && campaignId) {
          try {
            await uploadImage(campaignId);
            showNotification("success", "Draft saved with image successfully!");
          } catch (imgError) {
            showNotification("warning", "Draft saved but image upload failed");
          }
        } else {
          showNotification("success", "Draft saved successfully!");
        }
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
  function isValidCampaignId(id: number | null): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

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
      // Step 1: Create campaign if not saved
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

      // Step 2: Upload image if selected
      // if (selectedImage) {
      //   try {
      //     await uploadImage(campaignId);
      //   } catch (imgError) {
      //     console.error("Image upload failed, continuing with send:", imgError);
      //   }
      // }
      if (selectedImage) {
  if (!isValidCampaignId(campaignId)) {
    showNotification("error", "Cannot upload image — invalid campaign ID");
    // maybe return or continue without image
  } else {
    await uploadImage(campaignId);   // TypeScript knows it's number
  }
}

      // Step 3: Send campaign
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
          setSelectedImage(null);
          setImagePreview(null);
          setExistingImageUrl(null);
          setImageAltText("");
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
        const campaignId = savedCampaignId || data.id;
        
        if (!savedCampaignId) {
          setSavedCampaignId(campaignId);
        }

        // Upload image if selected
        if (selectedImage) {
          try {
            await uploadImage(campaignId);
          } catch (imgError) {
            console.error("Image upload failed:", imgError);
          }
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

                  {/* ═══════════════════════════════════════════════ */}
                  {/* NEW: IMAGE UPLOAD SECTION */}
                  {/* ═══════════════════════════════════════════════ */}
                  <div>
                    <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Campaign Header Image (Optional)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                      Add a visual banner to boost engagement. Recommended: 1200x630px, max 5MB
                    </p>

                    {/* Existing Image Display */}
                    {existingImageUrl && !imagePreview && (
                      <div className="relative border-2 border-dashed rounded-lg p-4 mb-3">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={existingImageUrl}
                            alt="Campaign header"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          onClick={handleRemoveExistingImage}
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    )}

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative border-2 border-dashed border-primary rounded-lg p-4 mb-3">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          onClick={handleRemoveImage}
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                        
                        {/* Alt Text Input */}
                        <div className="mt-4">
                          <Label htmlFor="altText" className="text-sm">
                            Image Description (for accessibility)
                          </Label>
                          <Input
                            id="altText"
                            type="text"
                            placeholder="Describe the image..."
                            value={imageAltText}
                            onChange={(e) => setImageAltText(e.target.value)}
                            className="mt-2"
                            maxLength={200}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    {!imagePreview && !existingImageUrl && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Click to upload header image
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG, GIF or WebP (max 5MB)
                          </p>
                        </label>
                      </div>
                    )}
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

            {/* Sidebar - Quick Actions & Recipients (continues...) */}
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
                    disabled={isSaving || isUploadingImage}
                    className="w-full text-sm"
                    size="sm"
                  >
                    {isSaving || isUploadingImage ? (
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

              {/* Recipients */}
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
        <PreviewTab campaign={campaign} imageUrl={imagePreview || existingImageUrl} />
        
        {/* Settings Tab - Same as before */}
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