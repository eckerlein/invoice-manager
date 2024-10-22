import { UseFormReturn, Path } from "react-hook-form";
import FormSectionHeader from "./FormSectionHeader";

interface FormSectionProps<TFieldValues extends Record<string, any>> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>; // The path of the section within the form
  label: string; // The label for the section
  render: (index: number) => React.ReactNode; // Render prop function that returns the form fields
}

export default function FormSectionArray<
  TFieldValues extends Record<string, any>,
>({ form, name, label, render }: FormSectionProps<TFieldValues>) {
  return (
    <>
      {form.getValues(name)?.map((_: any, index: number) => (
        <div key={index} className="flex flex-col gap-2">
          {/* Render the section header */}
          <FormSectionHeader
            name={name}
            label={label}
            index={index}
            form={form}
          />

          {/* Render the custom form fields via the render prop */}
          {render(index)}
        </div>
      ))}
    </>
  );
}
