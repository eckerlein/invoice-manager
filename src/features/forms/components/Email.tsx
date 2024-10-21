import React from "react";
import { useTsController } from "@ts-react/form";

const EmailComponent = () => {
  const { field, error } = useTsController<{
    emailAddress: string;
    type: string;
  }>();

  return (
    <div className="mb-4">
      <label>Email Address</label>
      <input
        value={field.value?.emailAddress || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, emailAddress: e.target.value })
        }
        className="border p-2"
        placeholder="Enter email address"
      />
      <label>Type</label>
      <select
        value={field.value?.type || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, type: e.target.value })
        }
        className="border p-2"
      >
        <option value="business">Geschäftlich</option>
        <option value="personal">Privat</option>
        <option value="office">Büro</option>
        <option value="other">Alternativ</option>
      </select>
      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default EmailComponent;
