import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, ...props }, ref) => {
    const id = React.useId();
    return (
      <fieldset
        className={cn(
          "relative w-full rounded-md border transition-colors border-input bg-background text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "focus-within:border-primary", // Change border color on focus
          !props.disabled && "hover:border-primary", // Change border color on hover
          className
        )}
      >
        {label && (
          <legend className="mx-2 text-xs font-medium">
            <span className="text-muted-foreground bg-background px-1">
              {label}
            </span>
          </legend>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "w-full bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
          )}
          ref={ref}
          {...props}
        />
      </fieldset>
    );
  }
);

Input.displayName = "Input";

export { Input };
