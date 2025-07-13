// src/components/tables/BasicRequestsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Request {
  id: number;
  ClientName: string;
  email: string;
  selectedProduct: string;
  notes: string;
  attachmentUrl: string;
  createdAt: string;
}

interface Props {
  data: Request[];
}

export default function BasicRequestsTable({ data }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Client</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Product</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Notes</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Attachment</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-theme-xs text-gray-500 dark:text-gray-400">Date</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">{req.id}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">{req.ClientName}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">{req.email}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400">{req.selectedProduct}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{req.notes}</TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-blue-600 underline">
                  {req.attachmentUrl ? (
                    <a href={req.attachmentUrl} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-400">{new Date(req.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
