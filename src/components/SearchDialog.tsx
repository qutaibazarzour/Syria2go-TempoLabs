import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogCloseButton } from "./ui/dialog-close-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { VerticalCalendar } from "./ui/vertical-calendar";
import "./ui/calendar.css";
import { DateRange } from "react-day-picker";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { addMonths, format, isBefore, startOfToday } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

type SearchStep = "location" | "dates" | "guests";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchParams: {
    location: string;
    dates: DateRange | undefined;
    guests: number;
  }) => void;
}

const SearchDialog = ({ isOpen, onClose, onSearch }: SearchDialogProps) => {
  const [step, setStep] = useState<SearchStep>("location");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<DateRange>();
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [dateMode, setDateMode] = useState<"daily" | "monthly" | "yearly">(
    "daily",
  );
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const handleClearAll = () => {
    setLocation("");
    setDates(undefined);
    setGuests({
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    });
    setStep("location");
  };

  const handleNext = () => {
    if (step === "location") setStep("dates");
    else if (step === "dates") {
      if (dateMode === "daily" && (!dates?.from || !dates?.to)) return;
      if ((dateMode === "monthly" || dateMode === "yearly") && !startDate)
        return;
      setStep("guests");
    } else if (step === "guests") {
      const finalDates =
        dateMode === "monthly" && startDate
          ? {
              from: startDate,
              to: addMonths(startDate, numberOfMonths),
            }
          : dateMode === "yearly" && startDate
            ? {
                from: startDate,
                to: addMonths(startDate, 12),
              }
            : dates;
      const searchParams = new URLSearchParams();
      if (location) searchParams.set("location", location);
      if (finalDates?.from)
        searchParams.set("checkIn", finalDates.from.toISOString());
      if (finalDates?.to)
        searchParams.set("checkOut", finalDates.to.toISOString());
      if (guests.adults + guests.children > 0)
        searchParams.set("guests", String(guests.adults + guests.children));

      window.location.href = `/search?${searchParams.toString()}`;
      onClose();
    }
  };

  const renderStepIndicator = () => {
    const getDateDisplay = () => {
      if (dateMode === "monthly" && startDate) {
        return `${format(startDate, "MMM d")} - ${format(
          addMonths(startDate, numberOfMonths),
          "MMM d",
        )}`;
      }
      if (dateMode === "yearly" && startDate) {
        return `${format(startDate, "MMM d")} - ${format(
          addMonths(startDate, 12),
          "MMM d",
        )}`;
      }
      return dates
        ? `${format(dates.from!, "MMM d")} - ${format(dates.to!, "MMM d")}`
        : "";
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-2 bg-gray-50 border-b text-sm">
        {step !== "location" && (
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors",
              location ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed",
            )}
            onClick={() => location && setStep("location")}
          >
            <span className="text-gray-500">Where:</span>
            <span className="font-medium">{location || "Add location"}</span>
          </div>
        )}
        {step === "guests" && (
          <div
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors",
              dates || (dateMode === "months" && startDate)
                ? "hover:bg-gray-100"
                : "opacity-50 cursor-not-allowed",
            )}
            onClick={() =>
              (dates || (dateMode === "months" && startDate)) &&
              setStep("dates")
            }
          >
            <span className="text-gray-500">When:</span>
            <span className="font-medium">
              {getDateDisplay() || "Add dates"}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderLocationStep = () => (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
        Where to?
      </h1>
      <div className="relative">
        <Input
          className="w-full text-lg p-4 h-auto"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-4">
        {[
          {
            name: "Damascus, Syria",
            type: "Popular",
            description: "Capital City",
          },
          {
            name: "Aleppo, Syria",
            type: "Historic",
            description: "Ancient City",
          },
          {
            name: "Latakia, Syria",
            type: "Coastal",
            description: "Mediterranean Port",
          },
          {
            name: "Homs, Syria",
            type: "Central",
            description: "Historic Center",
          },
          { name: "Tartus, Syria", type: "Coastal", description: "Beach City" },
          {
            name: "Palmyra, Syria",
            type: "Historic",
            description: "Ancient Ruins",
          },
          {
            name: "Hama, Syria",
            type: "Historic",
            description: "Water Wheels City",
          },
          {
            name: "Al-Hasakah, Syria",
            type: "Eastern",
            description: "Agricultural Hub",
          },
          {
            name: "Deir ez-Zor, Syria",
            type: "Eastern",
            description: "Euphrates City",
          },
          {
            name: "Raqqa, Syria",
            type: "Northern",
            description: "Historic Site",
          },
          {
            name: "Idlib, Syria",
            type: "Northwestern",
            description: "Ancient City",
          },
        ].map((suggestion, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => {
              setLocation(suggestion.name);
              setStep("dates");
            }}
          >
            <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-2xl">📍</div>
            </div>
            <div className="text-left">
              <div className="font-semibold">{suggestion.name}</div>
              <div className="text-gray-500 text-sm">
                {suggestion.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDatesStep = () => (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
        When's your trip?
      </h1>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted/10">
          <TabsTrigger value="daily" onClick={() => setDateMode("daily")}>
            Daily
          </TabsTrigger>
          <TabsTrigger value="monthly" onClick={() => setDateMode("monthly")}>
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" onClick={() => setDateMode("yearly")}>
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <div className="relative">
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="grid grid-cols-7 py-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-sm font-medium text-muted-foreground text-center"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="pt-4">
              <VerticalCalendar
                mode="range"
                selected={dates}
                onSelect={(newDates) => {
                  // If we already have a complete range and user clicks a new date
                  if (dates?.from && dates?.to && newDates?.from) {
                    // Reset dates state completely
                    setDates(undefined);
                    // Set the new start date in the next tick
                    requestAnimationFrame(() => {
                      setDates({ from: newDates.from, to: undefined });
                    });
                    return;
                  }

                  // Normal selection behavior
                  setDates(newDates);
                  // Move to next step if range is complete
                  if (newDates?.from && newDates?.to) {
                    setStep("guests");
                  }
                }}
                numberOfMonths={13}
                fromMonth={startOfToday()}
                className="w-full"
                disabled={(date) => isBefore(date, startOfToday())}
                showOutsideDays={false}
                fixedWeeks
                ISOWeek
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 sm:gap-0">
              <div>
                <div className="font-medium">Number of months</div>
                <div className="text-sm text-gray-500">
                  How long is your stay?
                </div>
              </div>
              <div className="flex items-center gap-4 self-center sm:self-auto">
                <Button
                  variant="outline"
                  onClick={() =>
                    setNumberOfMonths(Math.max(1, numberOfMonths - 1))
                  }
                >
                  -
                </Button>
                <span className="text-xl font-medium w-8 text-center">
                  {numberOfMonths}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setNumberOfMonths(Math.min(12, numberOfMonths + 1))
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "dd.MM.yyyy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => isBefore(date, startOfToday())}
                      initialFocus
                      showOutsideDays={false}
                      fixedWeeks
                      ISOWeek
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="font-medium">Your stay duration</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    From {format(startDate, "MMM d, yyyy")} to{" "}
                    {format(
                      addMonths(startDate, numberOfMonths),
                      "MMM d, yyyy",
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="mt-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Move-in date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "dd.MM.yyyy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={8}
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => isBefore(date, startOfToday())}
                      initialFocus
                      showOutsideDays={false}
                      fixedWeeks
                      ISOWeek
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {startDate && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="font-medium">Your yearly contract</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    From {format(startDate, "MMM d, yyyy")} to{" "}
                    {format(addMonths(startDate, 12), "MMM d, yyyy")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderGuestsStep = () => {
    const GuestCounter = ({
      title,
      description,
      value,
      onChange,
      min = 0,
      max = 16,
    }: {
      title: string;
      description: string;
      value: number;
      onChange: (value: number) => void;
      min?: number;
      max?: number;
    }) => (
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
          >
            -
          </Button>
          <span className="w-6 text-center">{value}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
          >
            +
          </Button>
        </div>
      </div>
    );

    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
          Who's coming?
        </h1>
        <div className="border rounded-lg divide-y">
          <GuestCounter
            title="Adults"
            description="Ages 13 or above"
            value={guests.adults}
            onChange={(value) => setGuests({ ...guests, adults: value })}
            min={1}
          />
          <GuestCounter
            title="Children"
            description="Ages 2-12"
            value={guests.children}
            onChange={(value) => setGuests({ ...guests, children: value })}
          />
          <GuestCounter
            title="Infants"
            description="Under 2"
            value={guests.infants}
            onChange={(value) => setGuests({ ...guests, infants: value })}
          />
          <GuestCounter
            title="Pets"
            description="Bringing any pets?"
            value={guests.pets}
            onChange={(value) => setGuests({ ...guests, pets: value })}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 sm:h-[85vh] flex flex-col overflow-hidden max-w-full h-[100dvh] sm:h-[85vh]">
        {/* Fixed Header */}
        <div className="flex-none p-4 border-b sticky top-0 bg-background z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Search</h2>
            <DialogCloseButton />
          </div>
        </div>

        {/* Step Indicator (Fixed) */}
        {step !== "location" && (
          <div className="flex-none">{renderStepIndicator()}</div>
        )}

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <div>
            {step === "location" && renderLocationStep()}
            {step === "dates" && renderDatesStep()}
            {step === "guests" && renderGuestsStep()}
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="flex-none p-4 border-t flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between sticky bottom-0 bg-background z-10">
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="order-1 sm:order-none"
          >
            Clear all
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !location ||
              (step === "dates" &&
                dateMode === "dates" &&
                (!dates?.from || !dates?.to))
            }
            className="w-full sm:w-auto"
          >
            {step === "guests" ? "Search" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
