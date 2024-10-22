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
});

describe("FormSectionHeader", () => {
  const TestForm = () => {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { address: [{ street: "Main St" }] },
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
        </form>
      </Form>
    );
  };

  it("should render the group header with the correct label", () => {
    render(<TestForm />);

    // Check if the label is rendered correctly
    const headerLabel = screen.getByText("Addresse 1");
    expect(headerLabel).toBeInTheDocument();
  });

  it("should remove the address group when the Minus button is clicked", () => {
    render(<TestForm />);

    // Find the minus button
    // Find the minus button using the aria-label
    const minusButton = screen.getByLabelText("Remove section");

    // Ensure the first address is rendered
    expect(screen.getByTestId("address-0")).toBeInTheDocument();

    // Simulate clicking the minus button
    fireEvent.click(minusButton);

    // After clicking, the address group should no longer be in the document
    expect(screen.queryByTestId("address-0")).not.toBeInTheDocument();
  });
});
