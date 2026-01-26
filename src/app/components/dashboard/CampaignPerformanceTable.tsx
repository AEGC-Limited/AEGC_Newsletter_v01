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
      setCampaigns(data.campaigns.slice(0, 10)); // Latest 10
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
      <Badge className={`${style.bg} ${style.color} border-none`}>
        {status}
      </Badge>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-xl shadow-xs bg-white dark:bg-darkgray pt-6 px-0 w-full">
      <div className="px-6 flex justify-between items-center">
        <h5 className="card-title mb-6 text-lg font-semibold">
          Recent Campaigns
        </h5>
        <Link href="/newsletter/campaigns" className="text-primary text-sm hover:underline">
          View All
        </Link>
      </div>

      <ScrollArea className="max-h-[450px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-6">Campaign</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Open Rate</TableHead> */}
                <TableHead>Sent Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="ps-6">
                    <Link 
                      href={`/newsletter/campaigns/${campaign.id}`}
                      className="text-sm font-medium hover:text-primary"
                    >
                      {campaign.subject}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm">{campaign.totalRecipients}</p>
                  </TableCell>

                  <TableCell>
                    <p className="text-sm text-success">
                      {campaign.successfullySent}
                    </p>
                    {campaign.failed > 0 && (
                      <p className="text-xs text-error">
                        {campaign.failed} failed
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(campaign.status)}
                  </TableCell>

                  {/* <TableCell>
                    <p className="text-sm font-semibold">
                      {campaign.openRate ? campaign.openRate.toFixed(1) : 'N/A'}%
                    </p>
                  </TableCell> */}

                  <TableCell>
                    <p className="text-xs text-gray-500">
                      {new Date(campaign.sentAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CampaignPerformanceTable;