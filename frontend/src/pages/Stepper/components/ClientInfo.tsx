// src/stepper/components/RequestForm.tsx
import React from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Select from "../../../components/form/Select";
import DatePicker from "../../../components/form/date-picker";
import { TForm } from "../types";

type RequestFormProps = {
  form: TForm;
  setForm: (form: TForm) => void;
};

export default function ClientInfo({ form, setForm }: RequestFormProps) {
  const departmentOptions = [
    { id: 1, value: "engineering", label: "Engineering" },
    { id: 2, value: "marketing", label: "Marketing" },
    { id: 3, value: "finance", label: "Finance" },
  ];

  const priorityOptions = [
    { id: 1, value: "low", label: "Low", color: "green" },
    { id: 2, value: "medium", label: "Medium", color: "yellow" },
    { id: 3, value: "high", label: "High", color: "red" },
  ];

  return (
    <ComponentCard title="Service Request">
      <div className="space-y-4">
        <div>
          <Label htmlFor="requestor-name" required>Requestor Name</Label>
          <Input
            id="requestor-name"
            type="text"
            value={form.requestorName}
            onChange={(e) =>
              setForm({ ...form, requestorName: e.target.value })
            }
            placeholder="Your full name"
          />
        </div>

        <div>
          <Label htmlFor="requestor-email" required>Requestor Email</Label>
          <Input
            id="requestor-email"
            type="email"
            value={form.requestorEmail}
            onChange={(e) =>
              setForm({ ...form, requestorEmail: e.target.value })
            }
            placeholder="Corporate email"
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            id="department"
            options={departmentOptions}
            defaultValue={form.department}
            placeholder="Select department"
            onChange={(value) =>
              setForm({ ...form, department: value })
            }
            className="dark:bg-dark-900"
          />
        </div>

        <div>
          <Label htmlFor="employee-id">Employee ID</Label>
          <Input
            id="employee-id"
            type="text"
            value={form.employeeID}
            onChange={(e) =>
              setForm({ ...form, employeeID: e.target.value })
            }
            placeholder="Your internal employee number"
          />
        </div>

        <div>
          <Label htmlFor="on-behalf-of">
            On Behalf Of <span className="text-sm font-normal">(Optional)</span>
          </Label>
          <Input
            id="on-behalf-of"
            type="text"
            value={form.onBehalfOf}
            onChange={(e) =>
              setForm({ ...form, onBehalfOf: e.target.value })
            }
            placeholder="Name of the person"
          />
        </div>

        <div>
          <Label htmlFor="request-title">Request Title</Label>
          <Input
            id="request-title"
            type="text"
            value={form.requestTitle}
            onChange={(e) =>
              setForm({ ...form, requestTitle: e.target.value })
            }
            placeholder="Short summary of the request"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={form.description}
            onChange={(value) =>
              setForm({ ...form, description: value })
            }
            placeholder="Detailed rationale"
            rows={4}
          />
        </div>

        <div>
          <DatePicker
            id="requested-date"
            label="Requested Date"
            placeholder="When you need it by"
            defaultDate={form.requestedDate}
            onChange={(_, dateString) =>
              setForm({ ...form, requestedDate: dateString })
            }
          />
        </div>

        <div>
          <DatePicker
            id="due-date"
            label="Due Date"
            placeholder="Project deadline (if different)"
            defaultDate={form.dueDate}
            onChange={(_, dateString) =>
              setForm({ ...form, dueDate: dateString })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            options={priorityOptions}
            defaultValue={form.priority}
            placeholder="Select priority"
            onChange={(value) =>
              setForm({ ...form, priority: value })
            }
            className={`dark:bg-dark-900
              text-${priorityOptions.find(option => option.value === form.priority)?.color}-500`}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
