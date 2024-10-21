import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

export function FormSelect({
  name,
  label,
  options,
  className,
}: {
  name: string;
  label: string;
  className?: string;
  options: string[];
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              {...field}
              onValueChange={(value) => {
                console.log(value);
                field.onChange(value);
              }}
            >
              <SelectTrigger label={label} className={className}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
