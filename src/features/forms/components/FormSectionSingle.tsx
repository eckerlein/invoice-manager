import { UseFormReturn, Path } from "react-hook-form";
import FormSectionHeader from "./FormSectionHeader";

interface FormSectionProps<TFieldValues extends Record<string, any>> {
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>; // The path of the section within the form
  label: string; // The label for the section
  children?: React.ReactNode;
}

export default function FormSectionSingle<
  TFieldValues extends Record<string, any>,
>({ form, name, label, children }: FormSectionProps<TFieldValues>) {
  console.log(name, form.getValues(name));
  return (
    <>
      {form.getValues(name) && (
        <div className="flex flex-col gap-2">
          {/* Render the section header */}
          <FormSectionHeader name={name} label={label} form={form} />

          {/* Render the custom form fields via the render prop */}
          {children}
        </div>
      )}
    </>
  );
}
