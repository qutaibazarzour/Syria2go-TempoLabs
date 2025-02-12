import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchDialog from "./SearchDialog";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

interface SearchBarProps {
  onSearch?: (params: {
    location: string;
    dates: DateRange | undefined;
    guests: number;
  }) => void;
  className?: string;
}

const SearchBar = ({ onSearch = () => {}, className }: SearchBarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const location = searchParams.get("location") || "Anywhere";
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const getDateRangeDisplay = () => {
    if (!checkIn || !checkOut) return "Anytime";
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
  };

  const getGuestsDisplay = () => {
    if (!guests) return "Add guests";
    return `${guests} guest${Number(guests) > 1 ? "s" : ""}`;
  };

  return (
    <>
      <div
        className={cn(
          "flex h-12 items-stretch rounded-full border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white",
          className,
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-1 items-center px-6 hover:bg-gray-50 rounded-l-full transition-colors">
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="h-full w-[1px] bg-gray-200" />
        <div className="flex flex-1 items-center px-6 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-medium">{getDateRangeDisplay()}</span>
        </div>
        <div className="h-full w-[1px] bg-gray-200" />
        <div className="flex items-center pl-6 pr-2 hover:bg-gray-50 rounded-r-full transition-colors">
          <span className="text-sm text-gray-600">{getGuestsDisplay()}</span>
          <Button
            size="icon"
            className="ml-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SearchDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSearch={onSearch}
      />
    </>
  );
};

export default SearchBar;
