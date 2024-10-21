import React from "react";
import { useTsController } from "@ts-react/form";

const RepresentativeComponent = () => {
  const { field, error } = useTsController<{
    title?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
  }>();

  return (
    <div className="mb-4">
      <label>Title</label>
      <input
        type="text"
        name="title"
        value={field.value?.title || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, title: e.target.value })
        }
        className="border p-2"
        placeholder="Enter title (e.g., Mr., Ms.)"
      />

      <label>First Name</label>
      <input
        type="text"
        name="firstName"
        value={field.value?.firstName || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, firstName: e.target.value })
        }
        className="border p-2"
        placeholder="Enter first name"
        required
      />

      <label>Last Name</label>
      <input
        type="text"
        name="lastName"
        value={field.value?.lastName || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, lastName: e.target.value })
        }
        className="border p-2"
        placeholder="Enter last name"
        required
      />

      <label>Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        value={field.value?.phoneNumber || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, phoneNumber: e.target.value })
        }
        className="border p-2"
        placeholder="Enter phone number"
      />

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={field.value?.email || ""}
        onChange={(e) =>
          field.onChange({ ...field.value, email: e.target.value })
        }
        className="border p-2"
        placeholder="Enter email"
      />

      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default RepresentativeComponent;
