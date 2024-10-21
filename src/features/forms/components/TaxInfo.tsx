import React from "react";
import { useTsController } from "@ts-react/form";

const TaxInfoComponent = () => {
  const { field, error } = useTsController<{ taxNumber?: string; vatId?: string; allowTaxFreeInvoices?: boolean }>();

  return (
    <div className="mb-4">
      <label>Tax Number</label>
      <input
        type="text"
        name="taxNumber"
        value={field.value?.taxNumber || ""}
        onChange={(e) => field.onChange({ ...field.value, taxNumber: e.target.value })}
        className="border p-2"
        placeholder="Enter tax number"
      />

      <label>VAT ID</label>
      <input
        type="text"
        name="vatId"
        value={field.value?.vatId || ""}
        onChange={(e) => field.onChange({ ...field.value, vatId: e.target.value })}
        className="border p-2"
        placeholder="Enter VAT ID"
      />

      <label>
        <input
          type="checkbox"
          checked={!!field.value?.allowTaxFreeInvoices}
          onChange={(e) => field.onChange({ ...field.value, allowTaxFreeInvoices: e.target.checked })}
        />
        Allow Tax-Free Invoices
      </label>

      {error?.errorMessage && <span className="text-red-500">{error?.errorMessage}</span>}
    </div>
  );
};

export default TaxInfoComponent;