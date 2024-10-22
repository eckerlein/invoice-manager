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

export default function FormSelect({
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
              <SelectTrigger
                label={label}
                className={className}
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
