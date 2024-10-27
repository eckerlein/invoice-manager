import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "@/components/ui/datePicker";

export default ({
  name,
  label,
  className,
  disabled,
  defaultValue,
}: {
  name: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: Date;
}) => {
  return (
    <FormField
      name={name}
      render={({ field: { onChange, value, ...rest }, fieldState }) => (
        <FormItem className={className}>
          <FormControl>
            <DatePicker
              defaultValue={defaultValue ?? value}
              onChange={onChange}
              disabled={disabled}
              label={label}
              {...rest} // Pass any other necessary props
            />
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
