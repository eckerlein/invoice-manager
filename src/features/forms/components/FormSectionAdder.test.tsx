import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSectionAdder from "./FormSectionAdder";
import { Form } from "@/components/ui/form";
import TextField from "./TextField";

// Simplified addressSchema
const addressSchema = z.object({
  street: z.string(),
});

const schema = z.object({
  address: z.array(addressSchema).optional(),
});

const schemaMap = {
  address: addressSchema,
};

describe("FormSectionAdder", () => {
  const TestForm = () => {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { address: [] },
    });

    return (
      <Form {...form}>
        <form>
          <FormSectionAdder
            form={form}
            sections={[{ name: "address", label: "Addresse" }]}
            schemaMap={schemaMap}
          />

          {/* Render the address fields */}
          {form.getValues("address")?.map((_, index) => (
            <div key={index} data-testid={`address-${index}`}>
              <TextField name={`address.${index}.street`} label="Straße" />
            </div>
          ))}
        </form>
      </Form>
    );
  };

  it("should render the Addresse button", () => {
    render(<TestForm />);

    // Find the Addresse button in the DOM
    const addButton = screen.getByText("Addresse");

    // Check if the button is rendered
    expect(addButton).toBeInTheDocument();
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
});
