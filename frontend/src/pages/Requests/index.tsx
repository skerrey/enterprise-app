// src/pages/Requests.tsx
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicRequestsTable from "./components/RequestsTable";
import axios from "axios";
import { IRequest } from "./interface";

export default function RequestsPage() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/Requests`);
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

      <div>
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No requests found.</p>
        ) : (
          <BasicRequestsTable data={requests} onDataChange={fetchRequests} />
        )}
      </div>
    </div>
  );
}
