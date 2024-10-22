import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSectionAdder from "./FormSectionAdder";
import { Form } from "@/components/ui/form";
import TextField from "./TextField";

// Simplified schemas for test purposes
const addressSchema = z.object({
  street: z.string(),
});

const contactInfoSchema = z.object({
  phone: z.string(),
});

// Root schema for the form
const schema = z.object({
  address: z.array(addressSchema).optional(),
  contactInfo: contactInfoSchema.optional(),
});

// Mapping schemas
const schemaMap = {
  address: addressSchema,
  contactInfo: contactInfoSchema,
};

describe("FormSectionAdder", () => {
  const TestForm = () => {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { address: [], contactInfo: undefined },
    });

    return (
      <Form {...form}>
        <form>
          <FormSectionAdder
            form={form}
            sections={[
              { name: "address", label: "Addresse", type: "array" },
              { name: "contactInfo", label: "Contact Info", type: "single" },
            ]}
            schemaMap={schemaMap}
          />

          {/* Render the address fields */}
          {form.getValues("address")?.map((_, index) => (
            <div key={index} data-testid={`address-${index}`}>
              <TextField name={`address.${index}.street`} label="Straße" />
            </div>
          ))}

          {/* Render the contact info field */}
          {form.getValues("contactInfo") && (
            <div data-testid="contactInfo">
              <TextField name="contactInfo.phone" label="Phone" />
            </div>
          )}
        </form>
      </Form>
    );
  };

  it("should render the Addresse button and Contact Info button", () => {
    render(<TestForm />);

    // Find the Addresse and Contact Info buttons in the DOM
    const addButton = screen.getByText("Addresse");
    const contactInfoButton = screen.getByText("Contact Info");

    // Check if both buttons are rendered
    expect(addButton).toBeInTheDocument();
    expect(contactInfoButton).toBeInTheDocument();
  });

  it("should add a new address section when the Addresse button is clicked", () => {
    render(<TestForm />);

    // Find the Addresse button
    const addButton = screen.getByText("Addresse");

    // Simulate clicking the button
    fireEvent.click(addButton);

    // Check that the new address field is rendered
    const newAddressField = screen.getByTestId("address-0");
    expect(newAddressField).toBeInTheDocument();
  });

  it("should add a single contact info section when the Contact Info button is clicked", () => {
    render(<TestForm />);

    // Find the Contact Info button
    const contactInfoButton = screen.getByText("Contact Info");

    // Simulate clicking the button
    fireEvent.click(contactInfoButton);

    // Check that the contact info field is rendered
    const contactInfoField = screen.getByTestId("contactInfo");
    expect(contactInfoField).toBeInTheDocument();

    // Click the Contact Info button again to test that no duplicate is added
    fireEvent.click(contactInfoButton);
    expect(screen.getAllByTestId("contactInfo").length).toBe(1); // Only one instance should exist
  });

  it("should hide the Contact Info button after the section is added", () => {
    render(<TestForm />);

    // Find the Contact Info button
    const contactInfoButton = screen.getByText("Contact Info");

    // Check if the button is initially rendered
    expect(contactInfoButton).toBeInTheDocument();

    // Simulate clicking the button to add the contact info section
    fireEvent.click(contactInfoButton);

    // Check that the contact info field is rendered
    const contactInfoField = screen.getByTestId("contactInfo");
    expect(contactInfoField).toBeInTheDocument();

    // Ensure that the Contact Info button is no longer rendered
    expect(screen.queryByText("Contact Info")).not.toBeInTheDocument();
  });
});
