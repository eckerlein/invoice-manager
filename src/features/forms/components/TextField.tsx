import React from "react";
import { useTsController } from "@ts-react/form";

const TextField = () => {
  const { field, error } = useTsController<string>();

  return (
    <div className="mb-4">
      <input
        value={field.value || ""}
        onChange={(e) => field.onChange(e.target.value)}
        className="border p-2"
        placeholder="Enter text"
      />
      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default TextField;
