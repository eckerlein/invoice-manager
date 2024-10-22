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
  FormMessage,
} from "@/components/ui/form";
import { twMerge } from "tailwind-merge";

export default function FormSelect<T extends string>({
  name,
  label,
  options,
  defaultValue,
  className,
}: {
  name: string;
  label: string;
  options: T[];
  defaultValue?: T;
  className?: string;
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              {...field}
              defaultValue={defaultValue}
              onValueChange={(value) => {
                console.log(value);
                field.onChange(value);
              }}
            >
              <SelectTrigger
                label={label}
                className={twMerge("w-[180px]", className)}
                aria-label={label}
              >
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent role="listbox">
                <SelectGroup>
                  {options.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      role="option"
                      aria-selected={field.value === option}
                    >
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
