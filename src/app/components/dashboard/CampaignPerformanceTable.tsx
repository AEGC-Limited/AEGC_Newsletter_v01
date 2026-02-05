// "use client";
// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Link from "next/link";

// interface Campaign {
//   id: number;
//   subject: string;
//   status: string;
//   totalRecipients: number;
//   successfullySent: number;
//   failed: number;
//   sentAt: string;
//   openRate?: number;
// }

// const CampaignPerformanceTable = () => {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   const fetchCampaigns = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setCampaigns(data.campaigns.slice(0, 10)); // Latest 10
//     } catch (error) {
//       console.error('Error fetching campaigns:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const statusMap: any = {
//       'Sent': { bg: 'bg-green-100', color: 'text-green-600' },
//       'Sending': { bg: 'bg-yellow-100', color: 'text-yellow-600' },
//       'Scheduled': { bg: 'bg-blue-100', color: 'text-blue-600' },
//       'Draft': { bg: 'bg-gray-100', color: 'text-gray-600' },
//       'Failed': { bg: 'bg-red-100', color: 'text-red-600' }
//     };

//     const style = statusMap[status] || statusMap['Draft'];

//     return (
//       <Badge className={`${style.bg} ${style.color} border-none`}>
//         {status}
//       </Badge>
//     );
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="rounded-xl shadow-xs bg-white dark:bg-darkgray pt-6 px-0 w-full">
//       <div className="px-6 flex justify-between items-center">
//         <h5 className="card-title mb-6 text-lg font-semibold">
//           Recent Campaigns
//         </h5>
//         <Link href="/newsletter/campaigns" className="text-primary text-sm hover:underline">
//           View All
//         </Link>
//       </div>

//       <ScrollArea className="max-h-[450px]">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="p-6">Campaign</TableHead>
//                 <TableHead>Recipients</TableHead>
//                 <TableHead>Sent</TableHead>
//                 <TableHead>Status</TableHead>
//                 {/* <TableHead>Open Rate</TableHead> */}
//                 <TableHead>Sent Date</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {campaigns.map((campaign) => (
//                 <TableRow key={campaign.id}>
//                   <TableCell className="ps-6">
//                     <Link 
//                       href={`/newsletter/campaigns/${campaign.id}`}
//                       className="text-sm font-medium hover:text-primary"
//                     >
//                       {campaign.subject}
//                     </Link>
//                   </TableCell>

//                   <TableCell>
//                     <p className="text-sm">{campaign.totalRecipients}</p>
//                   </TableCell>

//                   <TableCell>
//                     <p className="text-sm text-success">
//                       {campaign.successfullySent}
//                     </p>
//                     {campaign.failed > 0 && (
//                       <p className="text-xs text-error">
//                         {campaign.failed} failed
//                       </p>
//                     )}
//                   </TableCell>

//                   <TableCell>
//                     {getStatusBadge(campaign.status)}
//                   </TableCell>

//                   {/* <TableCell>
//                     <p className="text-sm font-semibold">
//                       {campaign.openRate ? campaign.openRate.toFixed(1) : 'N/A'}%
//                     </p>
//                   </TableCell> */}

//                   <TableCell>
//                     <p className="text-xs text-gray-500">
//                       {new Date(campaign.sentAt).toLocaleDateString()}
//                     </p>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

// export default CampaignPerformanceTable;



"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react";

interface Campaign {
  id: number;
  subject: string;
  status: string;
  totalRecipients: number;
  successfullySent: number;
  failed: number;
  sentAt: string;
  openRate?: number;
}

const CampaignPerformanceTable = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/campaigns`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      'Sent': { bg: 'bg-green-100', color: 'text-green-600' },
      'Sending': { bg: 'bg-yellow-100', color: 'text-yellow-600' },
      'Scheduled': { bg: 'bg-blue-100', color: 'text-blue-600' },
      'Draft': { bg: 'bg-gray-100', color: 'text-gray-600' },
      'Failed': { bg: 'bg-red-100', color: 'text-red-600' }
    };

    const style = statusMap[status] || statusMap['Draft'];

    return (
      <Badge className={`${style.bg} ${style.color} border-none whitespace-nowrap`}>
        {status}
      </Badge>
    );
  };

  // Pagination calculations
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="rounded-xl shadow-xs bg-white dark:bg-darkgray pt-6 px-6 pb-6 w-full">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">Loading campaigns...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-xs bg-white dark:bg-darkgray w-full overflow-hidden">
      <div className="px-6 pt-6 flex justify-between items-center mb-6">
        <h5 className="card-title text-lg font-semibold">
          Recent Campaigns
        </h5>
        <Link href="/campaign/view" className="text-primary text-sm hover:underline whitespace-nowrap">
          View All
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 min-w-[200px]">Campaign</TableHead>
                <TableHead className="min-w-[100px]">Recipients</TableHead>
                <TableHead className="min-w-[100px]">Sent</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Sent Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                currentCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="px-6">
                      <Link 
                        href={`/campaign/view`}
                        className="text-sm font-medium hover:text-primary transition-colors block truncate max-w-[300px]"
                        title={campaign.subject}
                      >
                        {campaign.subject}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm whitespace-nowrap">{campaign.totalRecipients.toLocaleString()}</p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-success whitespace-nowrap">
                        {campaign.successfullySent.toLocaleString()}
                      </p>
                      {campaign.failed > 0 && (
                        <p className="text-xs text-error whitespace-nowrap">
                          {campaign.failed} failed
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(campaign.sentAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden px-4">
        <div className="space-y-4 max-h-[450px] overflow-y-auto">
          {currentCampaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No campaigns found
            </div>
          ) : (
            currentCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <Link 
                  href={`/newsletter/campaigns/${campaign.id}`}
                  className="block"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h6 className="font-semibold text-sm text-gray-900 dark:text-white flex-1 line-clamp-2">
                      {campaign.subject}
                    </h6>
                    {getStatusBadge(campaign.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Recipients</p>
                      <p className="font-medium">{campaign.totalRecipients.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">Sent</p>
                      <p className="font-medium text-success">
                        {campaign.successfullySent.toLocaleString()}
                      </p>
                      {campaign.failed > 0 && (
                        <p className="text-xs text-error">
                          {campaign.failed} failed
                        </p>
                      )}
                    </div>

                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs">Sent Date</p>
                      <p className="text-xs">
                        {new Date(campaign.sentAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {campaigns.length > 0 && (
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                Show:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-darkgray focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center order-last sm:order-none">
              <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, campaigns.length)} of {campaigns.length}</span>
              <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, campaigns.length)} of {campaigns.length}</span>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1 w-full sm:w-auto justify-center">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="First page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers - Desktop only */}
              <div className="hidden sm:flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              {/* Mobile page indicator */}
              <div className="sm:hidden px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Last page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPerformanceTable;