import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus } from "lucide-react";
import { useForm, FieldValues, Path } from "react-hook-form";

export default function FormSectionHeader<TFieldValues extends FieldValues>({
  name,
  label,
  index,
  form,
}: {
  name: Path<TFieldValues>; // Ensures `name` matches the form fields paths
  label: string;
  index?: number;
  form: ReturnType<typeof useForm<TFieldValues>>;
}) {
  return (
    <div className="flex justify-between items-center">
      <Label className="text-lg">
        {label} {index !== undefined && index + 1}
      </Label>
      <Button
        type="button"
        variant={"destuctiveOutline"}
        aria-label="Remove section"
        onClick={() => {
          if (index === undefined) {
            form.reset({ ...form.getValues(), [name]: undefined });
            return;
          }
          const entries = form.getValues(name);
          if (!entries) return;

          // Filter out the entry at the given index
          const newValues = entries.filter(
            (_: (typeof entries)[number], i: number) => i !== index
          );

          // Reset the specific field, properly typed
          form.reset({
            ...form.getValues(), // Spread the existing form values to retain them
            [name]: newValues, // Only update the specific field we want to reset
          });
        }}
      >
        <Minus />
      </Button>
    </div>
  );
}
