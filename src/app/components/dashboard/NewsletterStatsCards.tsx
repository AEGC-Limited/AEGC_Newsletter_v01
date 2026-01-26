"use client";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  inactiveSubscribers: number;
  verifiedEmails: number;
  totalEmailsSent: number;
  totalOpens: number;
  totalClicks: number;
  averageOpenRate: number;
}

const NewsletterStatsCards = () => {
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const cards = [
    {
      title: "Total Subscribers",
      value: stats?.totalSubscribers || 0,
      icon: "solar:user-plus-outline",
      color: "primary",
      bgColor: "bg-lightprimary",
      textColor: "text-primary",
      change: "+12%",
      changeType: "success"
    },
    {
      title: "Active Subscribers",
      value: stats?.activeSubscribers || 0,
      icon: "solar:users-group-rounded-outline",
      color: "success",
      bgColor: "bg-lightsuccess",
      textColor: "text-success",
      change: "+8%",
      changeType: "success"
    },
    {
  title: "Total Emails Sent",
  value: stats?.totalEmailsSent || 0,
  icon: "solar:letter-outline",
  color: "secondary",
  bgColor: "bg-lightsecondary",
  textColor: "text-secondary",
  change: stats?.averageOpenRate != null 
    ? `${stats.averageOpenRate.toFixed(1)}%` 
    : "—",
  changeType: "info",
  label: "Open Rate"
},
    {
      title: "Verified Emails",
      value: stats?.verifiedEmails || 0,
      icon: "solar:shield-check-outline",
      color: "warning",
      bgColor: "bg-lightwarning",
      textColor: "text-warning",
      percentage: stats?.totalSubscribers ? 
        ((stats.verifiedEmails / stats.totalSubscribers) * 100).toFixed(1) : 0,
      changeType: "info"
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-30">
      {cards.map((card, index) => (
        <div key={index} className="lg:col-span-3 md:col-span-6 col-span-12">
          <div className="bg-white dark:bg-darkgray rounded-xl shadow-xs p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`${card.bgColor} ${card.textColor} p-3 rounded-md`}>
                <Icon icon={card.icon} height={24} />
              </div>
              <p className="text-sm card-title">{card.title}</p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-dark dark:text-white mb-2">
                  {card.value.toLocaleString()}
                </p>
                {card.change && (
                  <Badge className={`${
                    card.changeType === 'success' ? 'bg-lightsuccess text-success' :
                    card.changeType === 'error' ? 'bg-lighterror text-error' :
                    'bg-lightinfo text-info'
                  } hover:bg-opacity-80`}>
                    {card.label || 'vs last month'}: {card.change}
                  </Badge>
                )}
                {card.percentage && (
                  <Badge className="bg-lightinfo text-info hover:bg-opacity-80">
                    {card.percentage}% Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsletterStatsCards;