import React from "react";
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
  className,
  type,
}: {
  name: string;
  label: string;
  className?: string;
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
                placeholder={label}
                type={type}
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
