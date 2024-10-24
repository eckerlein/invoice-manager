import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { assertUnreachable } from "@/lib/utils";

type TextFieldType = "text" | "number" | "stringNumber";

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
  type?: TextFieldType;
}) => {
  function parseValue(value: string, type?: TextFieldType) {
    switch (type) {
      case "number":
        const cleanedString = value.replace(/[^0-9]/g, "");
        if (cleanedString === "") return "";
        const cleanedValue = Number(cleanedString);
        return Number.isNaN(cleanedValue) ? "" : cleanedValue;
      case "stringNumber":
        return "" + value.replace(/[^0-9]/g, "");
      case "text":
      case undefined:
        return value;
      default:
        assertUnreachable(type);
    }
  }

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
                disabled={disabled}
                onChange={(e) => onChange(parseValue(e.target.value, type))}
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
