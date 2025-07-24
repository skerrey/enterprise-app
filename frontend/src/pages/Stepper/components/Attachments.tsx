// src/stepper/components/Attachments.tsx
import React from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import FileInput from "../../../components/form/input/FileInput";
import { TForm } from "../types";

type Props = {
  form: TForm;
  setForm: (form: TForm) => void;
};

export default function Attachments({ form, setForm }: Props) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Append new file to attachments array
      setForm({ ...form, attachments: [...form.attachments, file] });
    }
  };

  return (
    <ComponentCard title="Attachments">
      <div className="space-y-4">
        <Label htmlFor="attachment">Upload Attachment</Label>
        <FileInput
          id="attachment"
          onChange={handleFileChange}
          className="custom-class"
        />
        {form.attachments.length > 0 && (
          <ul className="list-disc list-inside pt-2">
            {form.attachments.map((file, i) => (
              <li key={i} className="text-gray-500">
                <span className="text-blue-500 hover:underline hover:cursor-pointer">{file.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ComponentCard>
  );
}
