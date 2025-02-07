import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { ScrollArea } from "./ui/scroll-area";

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
  const [guests, setGuests] = useState(1);

  const handleClearAll = () => {
    setLocation("");
    setDates(undefined);
    setGuests(1);
    setStep("location");
  };

  const handleNext = () => {
    if (step === "location") setStep("dates");
    else if (step === "dates") setStep("guests");
    else if (step === "guests") {
      onSearch({ location, dates, guests });
      onClose();
    }
  };

  const renderStepIndicator = () => (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 border-b">
      {location && step !== "location" && (
        <div
          className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
          onClick={() => setStep("location")}
        >
          <div>
            <div className="text-sm text-gray-500">Where</div>
            <div className="font-medium">{location}</div>
          </div>
          <Button variant="ghost" size="sm" className="ml-2">
            Edit
          </Button>
        </div>
      )}
      {dates && step === "guests" && (
        <div
          className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
          onClick={() => setStep("dates")}
        >
          <div>
            <div className="text-sm text-gray-500">When</div>
            <div className="font-medium">
              {dates.from?.toLocaleDateString()} -{" "}
              {dates.to?.toLocaleDateString()}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="ml-2">
            Edit
          </Button>
        </div>
      )}
    </div>
  );

  const renderLocationStep = () => (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Where to?</h1>
      <div className="relative">
        <Input
          className="w-full text-lg p-4 h-auto"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="mt-6 space-y-4">
        {["Damascus, Syria", "Aleppo, Syria", "Latakia, Syria"].map(
          (suggestion, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                setLocation(suggestion);
                setStep("dates");
              }}
            >
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="h-6 w-6 text-gray-600">📍</div>
              </div>
              <div className="text-left">
                <div className="font-semibold">{suggestion}</div>
                <div className="text-gray-500 text-sm">City</div>
              </div>
            </button>
          ),
        )}
      </div>
    </div>
  );

  const renderDatesStep = () => (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">When's your trip?</h1>
      <div className="flex gap-4 mb-6">
        <Button
          variant="outline"
          className={dates?.from ? "bg-primary/5" : ""}
          onClick={() => setDates(undefined)}
        >
          Exact dates
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setDates(undefined);
            setStep("guests");
          }}
        >
          Flexible dates
        </Button>
      </div>

      <Calendar
        mode="range"
        selected={dates}
        onSelect={setDates}
        numberOfMonths={2}
        className="rounded-lg border shadow-sm"
      />
    </div>
  );

  const renderGuestsStep = () => (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Who's coming?</h1>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <div className="font-medium">Guests</div>
          <div className="text-sm text-gray-500">Add guests</div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setGuests(Math.max(1, guests - 1))}
          >
            -
          </Button>
          <span className="text-xl font-medium w-8 text-center">{guests}</span>
          <Button
            variant="outline"
            onClick={() => setGuests(Math.min(16, guests + 1))}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 h-[85vh] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-none p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Search</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Step Indicator (Fixed) */}
        {step !== "location" && (
          <div className="flex-none">{renderStepIndicator()}</div>
        )}

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="h-full">
            {step === "location" && renderLocationStep()}
            {step === "dates" && renderDatesStep()}
            {step === "guests" && renderGuestsStep()}
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <div className="flex-none p-4 border-t flex justify-between">
          <Button variant="ghost" onClick={handleClearAll}>
            Clear all
          </Button>
          <Button onClick={handleNext} disabled={!location}>
            {step === "guests" ? "Search" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
