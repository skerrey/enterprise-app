
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";
import MultiSelect from "../../../components/form/MultiSelect";
import { TForm, TProduct } from "../types";

const catalog = [
  { label: "Product 1", unitPrice: 99.99 },
  { label: "Product 2", unitPrice: 149.50 },
  { label: "Product 3", unitPrice: 29.00 },
];

const costCenterOptions = [
  { value: "CC100", label: "CC100 – Marketing" },
  { value: "CC200", label: "CC200 – Finance" },
  { value: "CC300", label: "CC300 – IT" },
];

type Props = {
  form: TForm;
  setForm: (form: TForm) => void;
};

export default function ProductSelection({ form, setForm }: Props) {
  const selectedLabels = form.products.map((p) => p.label);

  // Handle product selection changes
  const onProductsChange = (labels: string[]) => {
    const newProducts: TProduct[] = labels.map((label) => {
      const existing = form.products.find((p) => p.label === label);
      const quantity = existing?.quantity ?? 1;
      const unitPrice = catalog.find((c) => c.label === label)!.unitPrice;
      return {
        label,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
    });
    setForm({ ...form, products: newProducts });
  };

  // Update quantity for a given product
  const updateQty = (label: string, qty: number) => {
    const updated = form.products.map((p) =>
      p.label === label
        ? { ...p, quantity: qty, totalPrice: qty * p.unitPrice }
        : p
    );
    setForm({ ...form, products: updated });
  };

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
                <div className="w-1/6">${p.unitPrice.toFixed(2)}</div>
                <div className="w-1/6">${p.totalPrice.toFixed(2)}</div>
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
            options={costCenterOptions}
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
