import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface MetricProps {
  title: string;
  value: number | string;
  icon: string;
  isPositive: boolean;
  onClick?: () => void; // Optional click handler
}

const MetricCard: React.FC<MetricProps> = ({ title, value, icon, isPositive, onClick }) => (
  <div 
    className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 ${
      onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
      <span className="text-2xl">{icon}</span>
    </div>

    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-3xl dark:text-white/90">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h4>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isPositive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        <svg 
          className="w-3 h-3" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          {isPositive ? (
            <path d="M8 12L3 7h10l-5 5z" transform="rotate(180 8 8)" />
          ) : (
            <path d="M8 12L3 7h10l-5 5z" />
          )}
        </svg>

      </div>
    </div>
  </div>
);

const AddRequestCard = ({ onClick }: { onClick: () => void }) => (
  <div 
    className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-5 dark:border-gray-600 dark:bg-white/[0.03] md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors flex flex-col items-center justify-center min-h-[140px]"
    onClick={onClick}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/30 mb-4">
      <span className="text-2xl">➕</span>
    </div>
    <h4 className="font-semibold text-gray-800 dark:text-white/90 text-center">
      Create New Request
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
      Start a new request
    </p>
  </div>
);

interface IMetrics {
  totalRequests: number;
  completedThisMonth: number;
  highPriority: number;
}

export default function RequestMetrics() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<IMetrics | null>(null);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/Requests/metrics`);
      console.log("data", data);
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!metrics) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Loading metrics...</div>;
  }

  const metricsConfig = [
    {
      title: "Total Requests",
      value: metrics?.totalRequests,
      icon: "📋",
      isPositive: true
    },
    {
      title: "Completed This Month",
      value: metrics?.completedThisMonth,
      icon: "✅",
      isPositive: true
    },
    {
      title: "High Priority",
      value: metrics?.highPriority,
      icon: "🚨",
      isPositive: false
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <AddRequestCard onClick={() => navigate('/new-requests')} />
      {metricsConfig.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}