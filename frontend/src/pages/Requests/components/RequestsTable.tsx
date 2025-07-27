import { useState } from "react";
import { IRequest } from "../interface";

interface Props {
  data: IRequest[];
}

export default function BasicRequestsTable({ data }: Props) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
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
    </div>
  );
}