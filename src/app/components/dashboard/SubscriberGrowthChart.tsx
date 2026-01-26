"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SubscriberGrowth {
  month: string;
  subscriptions: number;
  unsubscriptions: number;
  netGrowth: number;
}

const SubscriberGrowthChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Last 6 Months");
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrowthData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchGrowthData = async (period: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/growth?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      setChartData({
        categories: data.map((d: SubscriberGrowth) => d.month),
        series: [
          {
            name: "New Subscriptions",
            data: data.map((d: SubscriberGrowth) => d.subscriptions)
          },
          {
            name: "Unsubscriptions",
            data: data.map((d: SubscriberGrowth) => -d.unsubscriptions)
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching growth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const optionsBarChart: ApexOptions = {
    chart: {
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#4CAF50", "#F44336"],
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#90A4AE50",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "25%",
        borderRadius: 5,
      },
    },
    xaxis: {
      categories: chartData?.categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Subscribers" }
    },
    legend: { 
      show: true,
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="rounded-xl shadow-xs bg-white dark:bg-darkgray p-6 relative w-full">
      <div className="flex justify-between items-center mb-4">
        <h5 className="card-title">Subscriber Growth</h5>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="Last 12 Months">Last 12 Months</SelectItem>
            <SelectItem value="This Year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="h-[315px] flex items-center justify-center">Loading...</div>
      ) : (
        <div className="-ms-4 -me-3">
          <Chart
            options={optionsBarChart}
            series={chartData?.series || []}
            type="bar"
            height="315px"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default SubscriberGrowthChart;