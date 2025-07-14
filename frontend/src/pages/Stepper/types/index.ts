type TProduct = {
  label: string;
  quantity: number;
  price: number;
  total: number;
};

type TForm = {
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
  products: TProduct[];
  budget: number;
  costCenter: string;
  attachments: File[];
};

export type { TProduct, TForm };