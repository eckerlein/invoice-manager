import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getEmptyObjectFromSchema } from "@/lib/utils/zod/getEmtpyObjectFromSchema";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { z } from "zod";

// Define SchemaMapType with stricter typing based on field structure
type SchemaMapType<TFieldValues> = Partial<
  Record<
    Path<TFieldValues>,
    | z.ZodObject<any> // for "single" types
    | z.ZodArray<z.ZodTypeAny> // for "array" types
  >
>;

// Component to dynamically add sections to a form
function FormSectionAdder<TFieldValues extends FieldValues>({
  sections,
  form,
  schemaMap,
}: {
  sections: {
    name: Path<TFieldValues>;
    label: string;
    type: "array" | "single";
  }[];
  form: UseFormReturn<TFieldValues>;
  schemaMap: SchemaMapType<TFieldValues>; // Strict schemaMap typing
}) {
  const handleAddSection = (
    name: Path<TFieldValues>,
    type: "array" | "single"
  ) => {
    const schema = schemaMap[name];

    if (type === "single" && schema instanceof z.ZodType) {
      const newSection = getEmptyObjectFromSchema(schema);
      form.reset({
        ...form.getValues(),
        [name]: newSection as PathValue<TFieldValues, Path<TFieldValues>>,
      });
    } else if (type === "array" && schema instanceof z.ZodType) {
      // Handle array section
      const currentValues = form.getValues(name) as
        | PathValue<TFieldValues, typeof name>[]
        | undefined;
      const newSection = getEmptyObjectFromSchema(schema);

      form.reset({
        ...form.getValues(),
        [name]: [...(currentValues ?? []), newSection] as PathValue<
          TFieldValues,
          Path<TFieldValues>
        >,
      });
    } else {
      console.error(`Schema type mismatch for ${name}. Expected a ${type}.`);
    }
  };

  return (
    <div className="flex w-full flex-wrap gap-4">
      {sections.map((section) => {
        const currentValue = form.getValues(section.name);

        if (section.type === "single" && currentValue) {
          return null; // Prevent adding a single field more than once
        }

        return (
          <Button
            key={section.name as string}
            type="button"
            onClick={() => handleAddSection(section.name, section.type)}
            className="rounded-xl"
          >
            <Plus className="text-white" />
            {section.label}
          </Button>
        );
      })}
    </div>
  );
}

export default FormSectionAdder;
