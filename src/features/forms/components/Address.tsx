import React from "react";
import { useTsController } from "@ts-react/form";

const AddressComponent = () => {
  const { field, error } = useTsController<{
    type: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
  }>();

  return (
    <div className="mb-4">
      <label>Address Type</label>
      <select
        value={field.value?.type || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, type: e.target.value })
        }
        className="border p-2"
      >
        <option value="billing">Billing</option>
        <option value="shipping">Shipping</option>
      </select>

      <label>Street</label>
      <input
        value={field.value?.street || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, street: e.target.value })
        }
        className="border p-2"
        placeholder="Street Address"
        required
      />

      <label>Postal Code</label>
      <input
        value={field.value?.postalCode || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, postalCode: e.target.value })
        }
        className="border p-2"
        placeholder="Postal Code"
        required
      />

      <label>City</label>
      <input
        value={field.value?.city || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, city: e.target.value })
        }
        className="border p-2"
        placeholder="City"
        required
      />

      <label>Country</label>
      <input
        value={field.value?.country || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, country: e.target.value })
        }
        className="border p-2"
        placeholder="Country"
        required
      />
      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default AddressComponent;
