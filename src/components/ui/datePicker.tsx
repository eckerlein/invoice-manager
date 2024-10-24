import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
}

export default function DatePicker({ label = "test" }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            "relative", // Added relative positioning
            "hover:bg-background ring-offset-background ring-offset-2 ring-primary",
            "border-border hover:border-primary",
            open && "ring-2",
            "py-6"
          )}
        >
          {label && (
            <span className="absolute text-xs font-medium -top-2.5 left-2 px-1 bg-background text-muted-foreground">
              {label}
            </span>
          )}
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
