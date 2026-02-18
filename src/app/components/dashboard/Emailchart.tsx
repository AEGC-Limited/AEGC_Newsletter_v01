"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface CampaignPerformance {
  id: number;
  subject: string;
  recipients: number;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
  hasImage: boolean;
}

const EmailEngagementChart = () => {
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaignPerformance();
  }, []);

  const fetchCampaignPerformance = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/stats/enhanced`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      // Get recent campaigns from the enhanced stats
      setCampaigns(data.emailAnalytics?.recentCampaigns || []);
    } catch (error) {
      console.error('Error fetching campaign performance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // Transform data for chart
  const chartData = campaigns.slice(0, 8).map(c => ({
    name: c.subject.length > 25 ? c.subject.substring(0, 25) + '...' : c.subject,
    'Open Rate': c.openRate,
    'Click Rate': c.clickRate,
    hasImage: c.hasImage
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-darkgray border rounded-lg shadow-lg p-4">
          <p className="font-semibold text-sm mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-success">
              Open Rate: {payload[0].value.toFixed(1)}%
            </p>
            <p className="text-sm text-primary">
              Click Rate: {payload[1]?.value.toFixed(1)}%
            </p>
            {payload[0].payload.hasImage && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Icon icon="solar:gallery-minimalistic-outline" className="w-3 h-3" />
                <span>Has header image</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Email Engagement Trends</h3>
          <p className="text-sm text-muted-foreground">
            Open and click rates across recent campaigns
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Open Rate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span>Click Rate</span>
          </div>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Icon icon="solar:inbox-out-outline" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No campaign data available</p>
            <p className="text-xs mt-1">Send your first campaign to see engagement metrics</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Open Rate" fill="#13DEB9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Click Rate" fill="#5D87FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
        <div className="text-center">
          <p className="text-2xl font-semibold text-success">
            {campaigns.length > 0 
              ? (campaigns.reduce((acc, c) => acc + c.openRate, 0) / campaigns.length).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Avg Open Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-primary">
            {campaigns.length > 0 
              ? (campaigns.reduce((acc, c) => acc + c.clickRate, 0) / campaigns.length).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Avg Click Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-warning">
            {campaigns.filter(c => c.hasImage).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">With Images</p>
        </div>
      </div>
    </Card>
  );
};

export default EmailEngagementChart;