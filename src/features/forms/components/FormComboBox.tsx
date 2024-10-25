import { ComboBox, ComboBoxOption } from "@/components/ui/ComboBox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

type FormComboBoxProps = {
  name: string;
  label?: string;
  options: ComboBoxOption[];
  placeholder?: string;
  className?: string;
};

export default function FormComboBox({
  name,
  label,
  options,
  placeholder,
  className,
}: FormComboBoxProps) {
  return (
    <FormField
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem className={className}>
          {label && <label>{label}</label>}
          <FormControl>
            <ComboBox
              options={options}
              placeholder={placeholder}
              onSelect={(val) => onChange(val)}
              value={value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
