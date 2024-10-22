import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "./FormSelect";
import { Form } from "@/components/ui/form";

// Simplified schema for testing
const schema = z.object({
  addressType: z.enum(["billing", "shipping"]),
});

describe("FormSelect", () => {
  const TestForm = () => {
    const form = useForm<z.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: { addressType: "billing" },
    });

    return (
      <Form {...form}>
        <form>
          <FormSelect
            name="addressType"
            label="Art der Addresse"
            options={["billing", "shipping"]}
          />
        </form>
      </Form>
    );
  };

  it("should render the select component with the correct label", () => {
    render(<TestForm />);

    // Check if the select trigger button with the label is rendered
    const selectButton = screen.getByLabelText("Art der Addresse");
    expect(selectButton).toBeInTheDocument();
  });

  it("should open the select dropdown and display options when clicked", () => {
    render(<TestForm />);

    // Find the select trigger button by its aria-label
    const selectButton = screen.getByLabelText("Art der Addresse");

    // Simulate clicking the select button to open the dropdown
    fireEvent.click(selectButton);

    // Check if the options are displayed in the dropdown
    const listbox = screen.getByRole("listbox");
    const billingOption = screen.getByRole("option", { name: "billing" });
    const shippingOption = screen.getByRole("option", { name: "shipping" });

    expect(listbox).toBeInTheDocument();
    expect(billingOption).toBeInTheDocument();
    expect(shippingOption).toBeInTheDocument();
  });

  it("should change the selected value when an option is clicked", () => {
    render(<TestForm />);

    // Find the select trigger button and open the dropdown
    const selectButton = screen.getByLabelText("Art der Addresse");
    fireEvent.click(selectButton);

    // Click the "shipping" option
    const shippingOption = screen.getByRole("option", { name: "shipping" });
    fireEvent.click(shippingOption);

    // Check if the value has been updated in the select trigger button
    expect(selectButton).toHaveTextContent("shipping");
  });
});
