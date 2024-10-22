import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus } from "lucide-react";
import { useForm, FieldValues, Path } from "react-hook-form";

export default function FormGroupHeader<TFieldValues extends FieldValues>({
  name,
  label,
  index,
  form,
}: {
  name: Path<TFieldValues>; // Ensures `name` matches the form fields paths
  label: string;
  index: number;
  form: ReturnType<typeof useForm<TFieldValues>>;
}) {
  return (
    <div className="flex justify-between items-center">
      <Label className="text-lg">
        {label} {index + 1}
      </Label>
      <Button
        type="button"
        variant={"outline"}
        className="border-destructive text-destructive"
        onClick={() => {
          const entries = form.getValues(name);
          if (!entries) return;
          const newValues = entries.filter(
            (_: (typeof entries)[number], i: number) => i !== index
          );
          form.setValue(name, newValues);
          form.trigger(name);
        }}
      >
        <Minus />
      </Button>
    </div>
  );
}
