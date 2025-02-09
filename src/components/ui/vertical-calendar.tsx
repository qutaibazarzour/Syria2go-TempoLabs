import * as React from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function VerticalCalendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn("w-full", className)}
      classNames={{
        months: "flex flex-col space-y-8 w-full",
        month: "w-full",
        caption: "flex justify-start pl-2 pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "hidden",
        table: "w-full border-collapse",
        head_row: "hidden",
        row: "flex w-full",
        cell: "text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-1",
        day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground flex items-center justify-center",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => null,
        IconRight: () => null,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}
VerticalCalendar.displayName = "VerticalCalendar";

export { VerticalCalendar };
