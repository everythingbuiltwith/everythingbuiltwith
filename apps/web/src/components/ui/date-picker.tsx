import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
  id?: string;
  onChange: (nextDate: Date | undefined) => void;
  value?: Date;
}

export function DatePicker({
  className,
  disabled,
  id,
  onChange,
  value,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            className={cn(
              "w-full justify-start text-left font-normal",
              !value ? "text-muted-foreground" : undefined,
              className
            )}
            disabled={disabled}
            id={id}
            type="button"
            variant="outline"
          />
        }
      >
        <CalendarDays />
        {value ? format(value, "PPP") : <span>Pick a date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" onSelect={onChange} selected={value} />
      </PopoverContent>
    </Popover>
  );
}
