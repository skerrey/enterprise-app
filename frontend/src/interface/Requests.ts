

export interface IRequest {
  id: number;
  requestorName: string;
  requestorEmail: string;
  department: string;
  employeeID: string;
  onBehalfOf?: string;
  requestTitle: string;
  description: string;
  requestedDate: string;
  dueDate?: string;
  priority: string;
  products: Array<{
    id: number;
    label: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  budget: number;
  costCenter: string;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  createdAt: string;
}