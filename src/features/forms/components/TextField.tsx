import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { assertUnreachable } from "@/lib/utils";
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

        const Euro = new Intl.NumberFormat("de-DE", {
          style: "currency",
          currency: "EUR",
        });

        function getRenderedValue() {
          if (isFocused) {
            if (type === "currency") {
              if (value === undefined) return "";
              return value.toString().replace(".", ",");
            }
          } else {
            if (type === "currency") {
              if (value === undefined) return "";

              console.log("value", value, typeof value);
              return Euro.format(value);
            }
          }
          return value;
        }

        function updateValueAfterBlur() {
          if (type === "currency" && typeof value === "string") {
            updateValue(Number(value.replace(",", ".")));
          }
        }

        return (
          <FormItem className={className}>
            <FormControl>
              <Input
                label={label}
                placeholder={placeholder ?? label}
                disabled={disabled}
                onChange={(e) => updateValue(parseValue(e.target.value, type))}
                value={getRenderedValue()}
                onBlur={() => {
                  setIsFocused(false);
                  updateValueAfterBlur();
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
