import React from "react";
import { useTsController } from "@ts-react/form";
import { BaseInfo } from "../../contacts/contactSchema";

const BaseInfoComponent = () => {
  const { field, error } = useTsController<BaseInfo>();

  const handleTypeChange = (type: "company" | "person") => {
    if (type === "company") {
      field.onChange({ type: "company", name: "" }); // Ensure valid 'company' fields
    } else {
      field.onChange({ type: "person", firstName: "", lastName: "" }); // Ensure valid 'person' fields
    }
  };

  const handleCompanyChange = (name: string) => {
    if (field.value?.type === "company") {
      field.onChange({ ...field.value, name });
    }
  };

  const handlePersonChange = (
    key: "firstName" | "lastName" | "title",
    value: string
  ) => {
    if (field.value?.type === "person") {
      field.onChange({ ...field.value, [key]: value });
    }
  };

  return (
    <div className="mb-4">
      {/* Radio buttons to select between company and person */}
      <label>
        <input
          type="radio"
          name="type"
          value="company"
          checked={field.value?.type === "company"}
          onChange={() => handleTypeChange("company")}
        />
        Company
      </label>
      <label>
        <input
          type="radio"
          name="type"
          value="person"
          checked={field.value?.type === "person"}
          onChange={() => handleTypeChange("person")}
        />
        Person
      </label>

      {/* Render different inputs based on whether it's a company or a person */}
      {field.value?.type === "company" && (
        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="name"
            value={field.value?.name || ""}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="border p-2"
            placeholder="Enter company name"
            required
          />
        </div>
      )}

      {field.value?.type === "person" && (
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={field.value?.title || ""}
            onChange={(e) => handlePersonChange("title", e.target.value)}
            className="border p-2"
            placeholder="Enter title (e.g., Mr., Ms.)"
          />

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={field.value?.firstName || ""}
            onChange={(e) => handlePersonChange("firstName", e.target.value)}
            className="border p-2"
            placeholder="Enter first name"
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={field.value?.lastName || ""}
            onChange={(e) => handlePersonChange("lastName", e.target.value)}
            className="border p-2"
            placeholder="Enter last name"
            required
          />
        </div>
      )}

      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default BaseInfoComponent;
