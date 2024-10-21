import React from "react";
import { useTsController } from "@ts-react/form";

const PhoneNumberComponent = () => {
  const { field, error } = useTsController<{ number: string; type: string }>();

  return (
    <div className="mb-4">
      <label>Phone Number</label>
      <input
        value={field.value?.number || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, number: e.target.value })
        }
        className="border p-2"
        placeholder="Enter phone number"
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
        <option value="mobile">Mobil</option>
        <option value="fax">Fax</option>
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

export default PhoneNumberComponent;
