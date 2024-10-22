import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSectionHeader from "./FormSectionHeader";
import { Form } from "@/components/ui/form";
import TextField from "./TextField";

// Simplified addressSchema
const addressSchema = z.object({
  street: z.string(),
});

const schema = z.object({
  address: z.array(addressSchema).optional(),
  contactInfo: z
    .object({
      phone: z.string(),
    })
    .optional(),
});

describe("FormSectionHeader", () => {
  const TestForm = () => {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
        address: [{ street: "Main St" }],
        contactInfo: { phone: "12345" },
      },
    });

    return (
      <Form {...form}>
        <form>
          {/* Simulating the display of multiple address sections */}
          {form.getValues("address")?.map((_, index) => (
            <div key={index} data-testid={`address-${index}`}>
              <FormSectionHeader
                name="address"
                label="Addresse"
                index={index}
                form={form}
              />
              <TextField name={`address.${index}.street`} label="Straße" />
            </div>
          ))}

          {/* Simulating a single-entry contact info section */}
          {form.getValues("contactInfo") && (
            <div data-testid="contactInfo">
              <FormSectionHeader
                name="contactInfo"
                label="Contact Info"
                form={form}
              />
              <TextField name="contactInfo.phone" label="Phone" />
            </div>
          )}
        </form>
      </Form>
    );
  };

  it("should render the group header with the correct label for array section", () => {
    render(<TestForm />);

    // Check if the label is rendered correctly for the array section (with index)
    const headerLabel = screen.getByText(/Addresse\s+1/); // Use regex to handle whitespace
    expect(headerLabel).toBeInTheDocument();
  });

  it("should render the group header without an index for the single-entry section", () => {
    render(<TestForm />);

    // Check if the label is rendered correctly for the single-entry section (without index)
    const headerLabel = screen.getByText("Contact Info");
    expect(headerLabel).toBeInTheDocument();
  });

  it("should remove the address group when the Minus button is clicked", () => {
    render(<TestForm />);

    // Find the minus button for address section
    const minusButton = screen.getAllByLabelText("Remove section")[0];

    // Ensure the first address is rendered
    expect(screen.getByTestId("address-0")).toBeInTheDocument();

    // Simulate clicking the minus button
    fireEvent.click(minusButton);

    // After clicking, the address group should no longer be in the document
    expect(screen.queryByTestId("address-0")).not.toBeInTheDocument();
  });

  it("should remove the contact info section when the Minus button is clicked", () => {
    render(<TestForm />);

    // Find the minus button for contact info section
    const minusButton = screen.getAllByLabelText("Remove section")[1];

    // Ensure the contact info section is rendered
    expect(screen.getByTestId("contactInfo")).toBeInTheDocument();

    // Simulate clicking the minus button
    fireEvent.click(minusButton);

    // After clicking, the contact info section should no longer be in the document
    expect(screen.queryByTestId("contactInfo")).not.toBeInTheDocument();
  });
});
