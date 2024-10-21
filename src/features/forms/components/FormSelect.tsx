import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormControl, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export function FormSelect({
  name,
  options,
  control,
}: {
  name: string;
  options: string[];
  control: ReturnType<typeof useForm>["control"];
}) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <Select {...field}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      )}
    />
  );
}
