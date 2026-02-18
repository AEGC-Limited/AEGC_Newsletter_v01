// "use client";
// import { Icon } from "@iconify/react";
// import { Badge } from "@/components/ui/badge";
// import { useEffect, useState } from "react";

// interface NewsletterStats {
//   totalSubscribers: number;
//   activeSubscribers: number;
//   inactiveSubscribers: number;
//   verifiedEmails: number;
//   totalEmailsSent: number;
//   totalOpens: number;
//   totalClicks: number;
//   averageOpenRate: number;
// }

// const NewsletterStatsCards = () => {
//   const [stats, setStats] = useState<NewsletterStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/stats`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   const cards = [
//     {
//       title: "Total Subscribers",
//       value: stats?.totalSubscribers || 0,
//       icon: "solar:user-plus-outline",
//       color: "primary",
//       bgColor: "bg-lightprimary",
//       textColor: "text-primary",
//       change: "+12%",
//       changeType: "success"
//     },
//     {
//       title: "Active Subscribers",
//       value: stats?.activeSubscribers || 0,
//       icon: "solar:users-group-rounded-outline",
//       color: "success",
//       bgColor: "bg-lightsuccess",
//       textColor: "text-success",
//       change: "+8%",
//       changeType: "success"
//     },
//     {
//   title: "Total Emails Sent",
//   value: stats?.totalEmailsSent || 0,
//   icon: "solar:letter-outline",
//   color: "secondary",
//   bgColor: "bg-lightsecondary",
//   textColor: "text-secondary",
//   change: stats?.averageOpenRate != null 
//     ? `${stats.averageOpenRate.toFixed(1)}%` 
//     : "—",
//   changeType: "info",
//   label: "Open Rate"
// },
//     {
//       title: "Verified Emails",
//       value: stats?.verifiedEmails || 0,
//       icon: "solar:shield-check-outline",
//       color: "warning",
//       bgColor: "bg-lightwarning",
//       textColor: "text-warning",
//       percentage: stats?.totalSubscribers ? 
//         ((stats.verifiedEmails / stats.totalSubscribers) * 100).toFixed(1) : 0,
//       changeType: "info"
//     }
//   ];

//   return (
//     <div className="grid grid-cols-12 gap-30">
//       {cards.map((card, index) => (
//         <div key={index} className="lg:col-span-3 md:col-span-6 col-span-12">
//           <div className="bg-white dark:bg-darkgray rounded-xl shadow-xs p-8">
//             <div className="flex items-center gap-4 mb-8">
//               <div className={`${card.bgColor} ${card.textColor} p-3 rounded-md`}>
//                 <Icon icon={card.icon} height={24} />
//               </div>
//               <p className="text-sm card-title">{card.title}</p>
//             </div>

//             <div className="flex items-end justify-between">
//               <div>
//                 <p className="text-3xl font-semibold text-dark dark:text-white mb-2">
//                   {card.value.toLocaleString()}
//                 </p>
//                 {card.change && (
//                   <Badge className={`${
//                     card.changeType === 'success' ? 'bg-lightsuccess text-success' :
//                     card.changeType === 'error' ? 'bg-lighterror text-error' :
//                     'bg-lightinfo text-info'
//                   } hover:bg-opacity-80`}>
//                     {card.label || 'vs last month'}: {card.change}
//                   </Badge>
//                 )}
//                 {card.percentage && (
//                   <Badge className="bg-lightinfo text-info hover:bg-opacity-80">
//                     {card.percentage}% Verified
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default NewsletterStatsCards;



"use client";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus 
} from "lucide-react";

interface EnhancedNewsletterStats {
  subscribers: {
    total: number;
    active: number;
    inactive: number;
    verified: number;
  };
  campaigns: {
    total: number;
    sent: number;
    scheduled: number;
    draft: number;
    withImages: number;
  };
  emailAnalytics: {
    totalEmailsSent: number;
    totalUniqueOpens: number;
    totalUniqueClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
    averageClickToOpenRate: number;
    trends: {
      improvingOpenRate: boolean;
      improvingClickRate: boolean;
      lastMonthOpenRate: number;
      lastMonthClickRate: number;
    };
  };
  subscriberEngagement: {
    subscriberOpenRate: number;
    activeEngagers: number;
  };
}

const NewsletterStatsCards = () => {
  const [stats, setStats] = useState<EnhancedNewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-30">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="lg:col-span-3 md:col-span-6 col-span-12">
            <div className="bg-white dark:bg-darkgray rounded-xl shadow-xs p-8 animate-pulse">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Determine trend icon and color
  const getTrendIcon = (isImproving: boolean) => {
    if (isImproving) {
      return <TrendingUp className="w-4 h-4 text-success" />;
    }
    return <TrendingDown className="w-4 h-4 text-error" />;
  };

  const cards = [
    {
      title: "Total Subscribers",
      value: stats?.subscribers.active || 0,
      icon: "solar:users-group-rounded-outline",
      color: "primary",
      bgColor: "bg-lightprimary",
      textColor: "text-primary",
      subtitle: `${stats?.subscribers.total || 0} total`,
      badge: {
        text: `${stats?.subscribers.verified || 0} verified`,
        type: "info" as const
      }
    },
    {
      title: "Email Open Rate",
      value: `${stats?.emailAnalytics.averageOpenRate.toFixed(1) || 0}%`,
      icon: "solar:letter-opened-outline",
      color: "success",
      bgColor: "bg-lightsuccess",
      textColor: "text-success",
      subtitle: `${stats?.emailAnalytics.totalUniqueOpens.toLocaleString() || 0} opens`,
      badge: stats?.emailAnalytics.trends ? {
        text: stats.emailAnalytics.trends.improvingOpenRate ? "Improving" : "Declining",
        type: stats.emailAnalytics.trends.improvingOpenRate ? "success" : "error",
        icon: getTrendIcon(stats.emailAnalytics.trends.improvingOpenRate)
      } : undefined,
      // benchmark: "Industry avg: 15-25%"
    },
    {
      title: "Click-Through Rate",
      value: `${stats?.emailAnalytics.averageClickRate.toFixed(1) || 0}%`,
      icon: "solar:cursor-outline",
      color: "secondary",
      bgColor: "bg-lightsecondary",
      textColor: "text-secondary",
      subtitle: `${stats?.emailAnalytics.totalUniqueClicks.toLocaleString() || 0} clicks`,
      badge: stats?.emailAnalytics.trends ? {
        text: stats.emailAnalytics.trends.improvingClickRate ? "Improving" : "Declining",
        type: stats.emailAnalytics.trends.improvingClickRate ? "success" : "error",
        icon: getTrendIcon(stats.emailAnalytics.trends.improvingClickRate)
      } : undefined,
      // benchmark: "Industry avg: 2-5%"
    },
    {
      title: "Campaigns Sent",
      value: stats?.campaigns.sent || 0,
      icon: "solar:letter-outline",
      color: "warning",
      bgColor: "bg-lightwarning",
      textColor: "text-warning",
      subtitle: `${stats?.emailAnalytics.totalEmailsSent.toLocaleString() || 0} emails delivered`,
      badge: {
        text: `${stats?.campaigns.withImages || 0} with images`,
        type: "info" as const
      }
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-30">
      {cards.map((card, index) => (
        <div key={index} className="lg:col-span-3 md:col-span-6 col-span-12">
          <div className="bg-white dark:bg-darkgray rounded-xl shadow-xs p-8 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`${card.bgColor} ${card.textColor} p-3 rounded-md`}>
                <Icon icon={card.icon} height={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{card.title}</p>
              </div>
            </div>

            {/* Value */}
            <div className="mb-4">
              <p className="text-xl font-semibold text-dark dark:text-white mb-1">
                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
              </p>
              {card.subtitle && (
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Badges & Benchmark */}
            <div className="flex flex-col gap-2">
              {card.badge && (
                <div className="flex items-center gap-2">
                  <Badge className={`${
                    card.badge.type === 'success' ? 'bg-lightsuccess text-success' :
                    card.badge.type === 'error' ? 'bg-lighterror text-error' :
                    'bg-lightinfo text-info'
                  } hover:bg-opacity-80 flex items-center gap-1`}>
                    {card.badge.icon && card.badge.icon}
                    {card.badge.text}
                  </Badge>
                </div>
              )}
              
              {/* {card.benchmark && (
                <p className="text-xs text-muted-foreground italic">
                  {card.benchmark}
                </p>
              )} */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsletterStatsCards;