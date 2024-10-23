import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const TextField = ({
  name,
  label,
  placeholder,
  className,
  type,
  disabled,
}: {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: "text" | "number";
}) => {
  return (
    <FormField
      name={name}
      render={({ field: { onChange, ...rest } }) => {
        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                label={label}
                placeholder={placeholder ?? label}
                type={type}
                disabled={disabled}
                onChange={(e) => {
                  type === "number"
                    ? onChange(Number(e.target.value))
                    : onChange(e);
                }}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextField;
