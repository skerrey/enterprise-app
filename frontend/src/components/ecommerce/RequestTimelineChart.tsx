import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "axios";
import ChartTab from "../common/ChartTabV2";

interface TimelineData {
  month: string;
  monthName: string;
  totalRequests: number;
  completedRequests: number;
  highPriorityRequests: number;
  avgBudget: number;
}

interface TimelineResponse {
  timeline: TimelineData[];
  summary: {
    totalRequests: number;
    avgMonthlyRequests: number;
    peakMonth: string;
  };
}

export default function RequestTimelineChart() {
  const [timelineData, setTimelineData] = useState<TimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"requests" | "budget" | "priority">("requests");

  const fetchTimelineData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/Requests/timeline`);
      setTimelineData(data);
    } catch (error) {
      console.error("Failed to fetch timeline data", error);
      // Fallback mock data
      setTimelineData({
        timeline: [
          { month: "2024-01", monthName: "Jan 2024", totalRequests: 18, completedRequests: 12, highPriorityRequests: 3, avgBudget: 1500 },
          { month: "2024-02", monthName: "Feb 2024", totalRequests: 25, completedRequests: 20, highPriorityRequests: 5, avgBudget: 1800 },
          { month: "2024-03", monthName: "Mar 2024", totalRequests: 32, completedRequests: 28, highPriorityRequests: 4, avgBudget: 2100 },
          { month: "2024-04", monthName: "Apr 2024", totalRequests: 28, completedRequests: 22, highPriorityRequests: 6, avgBudget: 1900 },
          { month: "2024-05", monthName: "May 2024", totalRequests: 35, completedRequests: 30, highPriorityRequests: 5, avgBudget: 2200 },
          { month: "2024-06", monthName: "Jun 2024", totalRequests: 41, completedRequests: 35, highPriorityRequests: 8, avgBudget: 2400 },
          { month: "2024-07", monthName: "Jul 2024", totalRequests: 38, completedRequests: 32, highPriorityRequests: 6, avgBudget: 2100 }
        ],
        summary: {
          totalRequests: 217,
          avgMonthlyRequests: 31,
          peakMonth: "Jun 2024"
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!timelineData) {
    return <div className="p-6">No data available</div>;
  }

  const categories = timelineData.timeline.map(item => item.monthName);

  // Dynamic chart configuration based on active tab
  const getChartConfig = () => {
    switch (activeTab) {
      case "requests":
        return {
          title: "Request Timeline",
          subtitle: "Monthly request trends and completion rates",
          colors: ["#465FFF", "#EF4444"],
          series: [
            {
              name: "Completed Requests",
              data: timelineData.timeline.map(item => item.completedRequests),
            },
            {
              name: "High Priority",
              data: timelineData.timeline.map(item => item.highPriorityRequests),
            },
          ],
          yAxisTitle: "Number of Requests"
        };
      
      case "budget":
        return {
          title: "Budget Timeline",
          subtitle: "Average budget trends over time", 
          colors: ["#FBBF24"],
          series: [
            {
              name: "Average Budget",
              data: timelineData.timeline.map(item => Math.round(item.avgBudget)),
            }
          ],
          yAxisTitle: "Budget ($)"
        };
        
      default:
        return {
          title: "Request Timeline",
          subtitle: "Monthly request trends and completion rates",
          colors: ["#465FFF", "#10B981"],
          series: [],
          yAxisTitle: "Number of Requests"
        };
    }
  };

  const chartConfig = getChartConfig();

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: chartConfig.colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: chartConfig.series.length === 1 ? [3] : [3, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (value, ) {
          if (activeTab === "budget") {
            return "$" + value.toLocaleString();
          }
          return value.toString();
        }
      }
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: function (value) {
          if (activeTab === "budget") {
            return "$" + value.toLocaleString();
          }
          return value.toString();
        }
      },
      title: {
        text: chartConfig.yAxisTitle,
        style: {
          fontSize: "12px",
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {chartConfig.title}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {chartConfig.subtitle}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="">
          <Chart options={options} series={chartConfig.series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}