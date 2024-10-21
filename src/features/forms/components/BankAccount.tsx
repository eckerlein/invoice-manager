import React from "react";
import { useTsController } from "@ts-react/form";

const BankAccountComponent = () => {
  const { field, error } = useTsController<{ iban: string; bic: string; bankName: string; accountHolder: string }>();

  return (
    <div className="mb-4">
      <label>IBAN</label>
      <input
        type="text"
        name="iban"
        value={field.value?.iban || ""}
        onChange={(e) => field.onChange({ ...field.value, iban: e.target.value })}
        className="border p-2"
        placeholder="Enter IBAN"
        required
      />

      <label>BIC</label>
      <input
        type="text"
        name="bic"
        value={field.value?.bic || ""}
        onChange={(e) => field.onChange({ ...field.value, bic: e.target.value })}
        className="border p-2"
        placeholder="Enter BIC"
        required
      />

      <label>Bank Name</label>
      <input
        type="text"
        name="bankName"
        value={field.value?.bankName || ""}
        onChange={(e) => field.onChange({ ...field.value, bankName: e.target.value })}
        className="border p-2"
        placeholder="Enter bank name"
        required
      />

      <label>Account Holder</label>
      <input
        type="text"
        name="accountHolder"
        value={field.value?.accountHolder || ""}
        onChange={(e) => field.onChange({ ...field.value, accountHolder: e.target.value })}
        className="border p-2"
        placeholder="Enter account holder name"
        required
      />

      {error?.errorMessage && <span className="text-red-500">{error?.errorMessage}</span>}
    </div>
  );
};

export default BankAccountComponent;