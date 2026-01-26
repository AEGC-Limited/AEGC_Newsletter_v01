import { Button } from "@/components/ui/button";
import NewsletterStatsCards from "../components/dashboard/NewsletterStatsCards";
import SubscriberGrowthChart from "../components/dashboard/SubscriberGrowthChart";
import SubscribersByCategory from "../components/dashboard/SubscribersByCategory";
import CampaignPerformanceTable from "../components/dashboard/CampaignPerformanceTable";
import RecentSubscribers from "../components/dashboard/RecentSubscribers";
import Link from "next/link";

const page = () => {
  return (

    <>
    {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Newsletter Analytics</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <Link href="/campaign/add">
            <Button>Create Campaign</Button>
          </Link>
          <Link href="/subscriber">
            <Button variant="outline">View Subscribers</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <NewsletterStatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-30 mt-30">
        {/* Subscriber Growth Chart */}
        <div className="lg:col-span-8 col-span-12">
          <SubscriberGrowthChart />
        </div>

        {/* Category Distribution */}
        <div className="lg:col-span-4 col-span-12">
          <SubscribersByCategory />
        </div>

        {/* Campaign Performance Table */}
        <div className="lg:col-span-12 col-span-12">
          <CampaignPerformanceTable />
        </div>

        {/* Recent Subscribers Activity */}
        <div className="lg:col-span-12 col-span-12">
          <RecentSubscribers />
        </div>
      </div>
    </>
  );
};

export default page;
