import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { assertUnreachable } from "@/lib/utils";
import { i } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { useState } from "react";

type TextFieldType = "text" | "number" | "stringNumber" | "currency";

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
  return (
    <FormField
      name={name}
      render={({
        field: { onChange: updateValue, onBlur, value, ...rest },
      }) => {
        const [isFocused, setIsFocused] = useState(false);

        function parseValue(value: string, type?: TextFieldType) {
          console.log("parseValue", value, typeof value);
          switch (type) {
            case "number":
              const cleanedString = value.replace(/[^0-9]/g, "");
              if (cleanedString === "") return "";
              const cleanedValue = Number(cleanedString);
              return Number.isNaN(cleanedValue) ? "" : cleanedValue;
            case "currency":
              const cleanedCurrencyString = value.replace(/[^0-9,]/g, "");
              const allowedParts = cleanedCurrencyString
                .split(",")
                .filter((_, i) => i < 2);

              if (allowedParts.length === 2)
                allowedParts[1] = allowedParts[1].slice(0, 2);

              const cleanedCurrency = allowedParts.join(",");

              if (cleanedCurrency === "") return "";
              return cleanedCurrency;

            case "stringNumber":
              return "" + value.replace(/[^0-9]/g, "");
            case "text":
            case undefined:
              return value;
            default:
              assertUnreachable(type);
          }
        }

        console.log("isFocused", isFocused);

        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                label={label}
                placeholder={placeholder ?? label}
                disabled={disabled}
                onChange={(e) => updateValue(parseValue(e.target.value, type))}
                value={value}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                onFocus={() => setIsFocused(true)}
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
