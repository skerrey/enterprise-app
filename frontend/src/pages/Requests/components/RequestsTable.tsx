import { useState } from "react";
import { IRequest } from "../interface";
import EditRequestModal from "./EditRequestModal";
import axios from "axios";

interface Props {
  data: IRequest[];
  onDataChange: () => void;
}

export default function BasicRequestsTable({ data, onDataChange }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [editingRequest, setEditingRequest] = useState<IRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleEdit = (request: IRequest) => {
    setEditingRequest(request);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const request = data.find(r => r.id === id);
    const requestTitle = request?.requestTitle || `Request #${id}`;
    
    if (!confirm(`Are you sure you want to delete "${requestTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/Requests/${id}`);
      onDataChange();
      // Show success message
      alert("Request deleted successfully!");
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEdit = async (updatedRequest: IRequest) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/Requests/${updatedRequest.id}`, updatedRequest);
      onDataChange();
    } catch (error) {
      console.error("Error updating request:", error);
      throw error;
    }
  };

  const tableConfig = [
    {
      header: "ID",
      key: "id",
      render: (req: IRequest) => req.id,
      className: "px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90"
    },
    {
      header: "Requestor",
      key: "requestorName",
      render: (req: IRequest) => req.requestorName,
      className: "px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90"
    },
    {
      header: "Email",
      key: "requestorEmail",
      render: (req: IRequest) => req.requestorEmail,
      className: "px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
    },
    {
      header: "Title",
      key: "requestTitle",
      render: (req: IRequest) => req.requestTitle,
      className: "px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate"
    },
    {
      header: "Department",
      key: "department",
      render: (req: IRequest) => req.department,
      className: "px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 capitalize"
    },
    {
      header: "Products",
      key: "products",
      render: (req: IRequest) => req.products.length > 0 ? `${req.products.length} item(s)` : "—",
      className: "px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
    },
    {
      header: "Priority",
      key: "priority",
      render: (req: IRequest) => (
        <span className={`capitalize px-2 py-1 rounded-full text-xs ${
          req.priority.toLocaleLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
          req.priority.toLocaleLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {req.priority}
        </span>
      ),
      className: "px-5 py-4 text-start text-theme-sm"
    },
    {
      header: "Budget",
      key: "budget",
      render: (req: IRequest) => `$${req.budget.toLocaleString()}`,
      className: "px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400"
    },
    {
      header: "Date",
      key: "createdAt",
      render: (req: IRequest) => new Date(req.createdAt).toLocaleDateString(),
      className: "px-5 py-4 text-start text-theme-sm text-gray-400"
    },
    {
      header: "Actions",
      key: "actions",
      render: (req: IRequest) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(req);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(req.id);
            }}
            disabled={deletingId === req.id}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
            title="Delete"
          >
            {deletingId === req.id ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      ),
      className: "px-5 py-4 text-start text-theme-sm"
    }
  ];

  const ExpandedRowContent = ({ request }: { request: IRequest }) => (
    <td colSpan={tableConfig.length} className="px-5 py-6 bg-gray-50 dark:bg-white/[0.02]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Basic Information */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-600 dark:text-gray-400">Employee ID:</span> {request.employeeID}</div>
            <div><span className="font-medium text-gray-600 dark:text-gray-400">On Behalf Of:</span> {request.onBehalfOf || "—"}</div>
            <div><span className="font-medium text-gray-600 dark:text-gray-400">Cost Center:</span> {request.costCenter}</div>
          </div>
        </div>

        {/* Request Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Request Details</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium text-gray-600 dark:text-gray-400">Description:</span></div>
            <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-white/[0.05] p-3 rounded border">
              {request.description || "No description provided"}
            </p>
            <div><span className="font-medium text-gray-600 dark:text-gray-400">Requested Date:</span> {request.requestedDate}</div>
            <div><span className="font-medium text-gray-600 dark:text-gray-400">Due Date:</span> {request.dueDate || "—"}</div>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Products ({request.products.length})</h4>
          <div className="space-y-2">
            {request.products.length > 0 ? (
              request.products.map((product, index) => (
                <div key={index} className="bg-white dark:bg-white/[0.05] p-3 rounded border text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300">{product.label}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Qty: {product.quantity} × ${product.price.toLocaleString()} = ${product.total.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No products selected</p>
            )}
          </div>
        </div>

        {/* Attachments */}
        {request.attachments && request.attachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Attachments ({request.attachments.length})</h4>
            <div className="space-y-2">
              {request.attachments.map((attachment, index) => (
                <div key={index} className="bg-white dark:bg-white/[0.05] p-3 rounded border text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300">{attachment.name}</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Size: {(attachment.size / 1024).toFixed(1)} KB
                  </div>
                  {attachment.url && (
                    <a 
                      href={attachment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View File
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </td>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/[0.05]">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
              {tableConfig.map((column) => (
                <th 
                  className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400"
                  key={column.key}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((req) => (
              <>
                <tr 
                  key={req.id}
                  onClick={() => toggleRow(req.id)}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {tableConfig.map((column) => (
                    <td 
                      key={column.key} 
                      className={column.className}
                    >
                      {column.render(req)}
                    </td>
                  ))}
                </tr>
                {expandedRows.has(req.id) && (
                  <tr key={`${req.id}-expanded`}>
                    <ExpandedRowContent request={req} />
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}