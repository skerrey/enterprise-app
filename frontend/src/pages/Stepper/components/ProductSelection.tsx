
import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import { TForm, TProduct } from "../types";
import axios from "axios";
import { CloseIcon } from "../../../icons";

type Props = {
  form: TForm;
  setForm: (form: TForm) => void;
};

export default function ProductSelection({ form, setForm }: Props) {
  const [catalog, setCatalog] = useState<{ label: string; price: number }[]>([]);
  // const [costCenters, setCostCenters] = useState<{ value: string; label: string }[]>([]);

  const selectedLabels = form.products.map((p) => p.label);

  const costCenters = [
  {
    "id": 1,
    "value": "CC100",
    "label": "CC100--Marketing"
  },
  {
    "id": 2,
    "value": "CC200",
    "label": "CC200--Finance"
  },
  {
    "id": 3,
    "value": "CC300",
    "label": "CC300--IT"
  }
]

  const getCatalog = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/Products`);
      setCatalog(res.data);
    } catch (error) {
      console.error("Error fetching catalog data:", error);
    }
  };

  useEffect(() => {
    getCatalog();
  }, []);

  // Handle product selection changes
  const onProductsChange = (labels: string[]) => {
    if (!catalog || !costCenters) return;
    const newProducts: TProduct[] = labels.map((label) => {
      const existing = form.products.find((p) => p.label === label);
      const quantity = existing?.quantity ?? 1;
      const price = catalog.find((c) => c.label === label)!.price;
      return {
        label,
        quantity,
        price,
        total: price * quantity, // Changed from unitPrice to price, totalPrice to total
      };
    });
    setForm({ ...form, products: newProducts });
  };

  // Update quantity for a given product
  const updateQty = (label: string, qty: number) => {
    const updated = form.products.map((p) =>
      p.label === label
        ? { ...p, quantity: qty, total: qty * p.price } // Changed totalPrice to total
        : p
    );
    setForm({ ...form, products: updated });
  };

  if (!catalog || !costCenters) {
    return <div>Loading...</div>;
  }

  return (
    <ComponentCard title="Product Selection">
      <div className="space-y-4">
        {/* pick products */}
        <MultiSelect
          label="Products"
          options={catalog.map((c) => ({
            value: c.label,
            text: c.label,
            selected: selectedLabels.includes(c.label),
          }))}
          defaultSelected={selectedLabels}
          onChange={onProductsChange}
        />

        {/* header + rows */}
        {form.products.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-4 font-medium border-b pb-1">
              <div className="w-1/4">Product</div>
              <div className="w-1/6">Quantity</div>
              <div className="w-1/6">Unit Price</div>
              <div className="w-1/6">Total Price</div>
              <div className="w-1/6 flex justify-end">Remove</div>
            </div>
            {form.products.map((p) => (
              <div key={p.label} className="flex items-center space-x-4">
                <div className="w-1/4">{p.label}</div>
                <div className="w-1/6">
                  <Input
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={(e) =>
                      updateQty(p.label, Math.max(1, Number(e.target.value)))
                    }
                  />
                </div>
                <div className="w-1/6">${p.price.toFixed(2)}</div>
                <div className="w-1/6">${p.total.toFixed(2)}</div>
                <div className="w-1/6 flex justify-end">
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 mr-5"
                    onClick={() =>
                      setForm({
                        ...form,
                        products: form.products.filter((prod) => prod.label !== p.label),
                      })
                    }
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Budget */}
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
          />
        </div>

        {/* Cost Center */}
        <div>
          <Label htmlFor="cost-center">Cost Center</Label>
          <Select
            id="cost-center"
            options={costCenters.map((c) => ({
              value: c.value,
              label: c.label, 
            }))}
            defaultValue={form.costCenter}
            placeholder="Select cost center"
            onChange={(v) => setForm({ ...form, costCenter: v })}
            className="dark:bg-dark-900"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
