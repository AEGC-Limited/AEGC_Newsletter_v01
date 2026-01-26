"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentSubscription {
  email: string;
  name: string;
  subscribedAt: string;
  source: string;
  category: string;
}

const RecentSubscribers = () => {
  const [recent, setRecent] = useState<RecentSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSubscribers();
  }, []);

  const fetchRecentSubscribers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const stats = await response.json();
      setRecent(stats.recentSubscriptions || []);
    } catch (error) {
      console.error('Error fetching recent subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSourceColor = (source: string) => {
    const colors: any = {
      'website': 'bg-primary',
      'linkedin': 'bg-info',
      'event': 'bg-success',
      'referral': 'bg-warning'
    };
    return colors[source] || 'bg-secondary';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-xl h-full shadow-xs bg-white dark:bg-darkgray p-6 relative w-full">
      <h5 className="card-title mb-10">Recent Subscribers</h5>

      <div className="flex flex-col mt-2">
        <ul>
          {recent.map((sub, index) => (
            <li key={index}>
              <div className="flex gap-4 min-h-16 items-start">
                <div className="text-xs text-gray-500 min-w-[60px]">
                  {new Date(sub.subscribedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`rounded-full ${getSourceColor(sub.source)} p-1.5 w-fit`}></div>
                  {index < recent.length - 1 && (
                    <div className="h-full w-px bg-border"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-dark dark:text-white font-medium">{sub.name}</p>
                  <p className="text-sm text-gray-500">{sub.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-primary">{sub.category}</span>
                    <span className="text-xs text-gray-400">via {sub.source}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Link 
        href="/subscriber" 
        className="text-primary text-sm hover:underline mt-4 block text-center"
      >
        View All Subscribers
      </Link>
    </div>
  );
};

export default RecentSubscribers;