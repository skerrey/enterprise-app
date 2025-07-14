import React from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import { TForm } from "../types";

type SummaryProps = {
  form: TForm;
};

export function Summary({ form }: SummaryProps) {
  const {
    requestorName,
    requestorEmail,
    department,
    employeeID,
    onBehalfOf,
    requestTitle,
    description,
    requestedDate,
    dueDate,
    priority,
    products,
    budget,
    costCenter,
    attachments,
  } = form;

  return (
    <ComponentCard title="Review & Submit">
      <div className="space-y-8">
        {/* Requestor Info */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Requester Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Requestor Name</Label>
              <p>{requestorName}</p>
            </div>
            <div>
              <Label>Requestor Email</Label>
              <p>{requestorEmail}</p>
            </div>
            <div>
              <Label>Department</Label>
              <p>{department}</p>
            </div>
            <div>
              <Label>Employee ID</Label>
              <p>{employeeID}</p>
            </div>
            {onBehalfOf && (
              <div className="md:col-span-2">
                <Label>On Behalf Of</Label>
                <p>{onBehalfOf}</p>
              </div>
            )}
          </div>
        </div>

        {/* Request Details */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Request Details</h3>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <p>{requestTitle}</p>
            </div>
            <div>
              <Label>Description</Label>
              <p>{description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Requested Date</Label>
                <p>{requestedDate}</p>
              </div>
              {dueDate && (
                <div>
                  <Label>Due Date</Label>
                  <p>{dueDate}</p>
                </div>
              )}
              <div>
                <Label>Priority</Label>
                <p>{priority}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Products</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex font-medium border-b pb-2">
                <div className="w-1/4">Product</div>
                <div className="w-1/6">Quantity</div>
                <div className="w-1/6">Unit Price</div>
                <div className="w-1/6">Total</div>
              </div>
              {products.map((p) => (
                <div key={p.label} className="flex items-center space-x-4">
                  <div className="w-1/4">{p.label}</div>
                  <div className="w-1/6">{p.quantity}</div>
                  <div className="w-1/6">${p.unitPrice.toFixed(2)}</div>
                  <div className="w-1/6">${p.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget & Cost Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Budget</Label>
            <p>${budget.toFixed(2)}</p>
          </div>
          <div>
            <Label>Cost Center</Label>
            <p>{costCenter}</p>
          </div>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Attachments</h3>
            <ul className="list-disc list-inside">
              {attachments.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}
