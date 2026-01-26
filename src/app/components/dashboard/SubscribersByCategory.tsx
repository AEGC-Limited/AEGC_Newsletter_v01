"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface CategoryData {
  category: string;
  count: number;
}

const SubscribersByCategory = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const stats = await response.json();
      setData(stats.byCategory || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData: any = {
    series: data.map(d => d.count),
    options: {
      chart: {
        type: 'donut',
      },
      labels: data.map(d => d.category),
      colors: ['#1E88E5', '#26A69A', '#FFA726', '#AB47BC', '#EF5350', '#66BB6A'],
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        theme: 'dark',
      },
    },
  };

  return (
    <div className="bg-white dark:bg-darkgray rounded-xl shadow-xs p-6">
      <h5 className="card-title mb-6">Subscribers by Category</h5>
      
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">Loading...</div>
      ) : (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="donut"
          height="300px"
        />
      )}
    </div>
  );
};

export default SubscribersByCategory;