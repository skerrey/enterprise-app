// src/pages/Requests.tsx
import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import BasicRequestsTable from "../components/tables/RequestsTable";
import axios from "axios";

interface Request {
  id: number;
  ClientName: string;
  email: string;
  selectedProduct: string;
  notes: string;
  attachmentUrl: string;
  createdAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      console.log("getting requests");
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/Requests`);
      console.log("requests data", data);
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <PageMeta title="Requests | Admin Dashboard" description="List of submitted requests." />
      <PageBreadcrumb pageTitle="Requests" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          Submitted Requests
        </h3>

        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No requests found.</p>
        ) : (
          <BasicRequestsTable data={requests} />
        )}
      </div>
    </div>
  );
}
