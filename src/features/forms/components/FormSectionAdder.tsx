import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getEmptyObjectFromSchema } from "@/lib/utils/zod/getEmtpyObjectFromSchema";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { z } from "zod";

// Component to dynamically add sections to a form
function FormSectionAdder<TFieldValues extends FieldValues>({
  sections,
  form,
  schemaMap,
}: {
  sections: { name: Path<TFieldValues>; label: string }[];
  form: UseFormReturn<TFieldValues>;
  schemaMap: Partial<Record<Path<TFieldValues>, z.ZodObject<any>>>; // Typing it as partial
}) {
  const handleAddSection = (name: Path<TFieldValues>) => {
    const currentValues = form.getValues(name) as
      | PathValue<TFieldValues, Path<TFieldValues>>[]
      | undefined;
    const newSection = getEmptyObjectFromSchema(
      schemaMap[name] as z.ZodObject<any>
    );
    form.setValue(name, [...(currentValues ?? []), newSection] as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >);
    form.reset({
      ...form.getValues(),
      [name]: [...(currentValues ?? []), newSection] as PathValue<
        TFieldValues,
        Path<TFieldValues>
      >,
    });
  };

  return (
    <div className="flex w-full flex-wrap gap-4">
      {sections.map((section) => (
        <Button
          key={section.name as string}
          type="button"
          onClick={() => handleAddSection(section.name)}
          className="rounded-xl"
        >
          <Plus className="text-white" />
          {section.label}
        </Button>
      ))}
    </div>
  );
}

export default FormSectionAdder;
