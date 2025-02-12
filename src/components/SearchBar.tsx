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
  isMapSearchMode?: boolean;
  variant?: "default" | "compact";
}

const SearchBar = ({
  onSearch = () => {},
  className,
  isMapSearchMode = false,
  variant = "default",
}: SearchBarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const location = isMapSearchMode
    ? "Map area"
    : searchParams.get("location") || "Anywhere";
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
    if (!guests) return window.innerWidth >= 768 ? "Add guests" : "Guests";
    return `${guests} guest${Number(guests) > 1 ? "s" : ""}`;
  };

  if (variant === "compact") {
    return (
      <>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white px-4 py-3.5",
            className,
          )}
          onClick={() => setIsDialogOpen(true)}
        >
          <Search className="h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="text-sm font-medium truncate">{location}</div>
            <div className="text-xs text-muted-foreground truncate">
              {getDateRangeDisplay()} · {getGuestsDisplay()}
            </div>
          </div>
        </div>
        <SearchDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSearch={onSearch}
        />
      </>
    );
  }

  return (
    <>
      {/* Desktop Search Bar */}
      <div
        className={cn(
          "hidden md:flex h-12 items-stretch rounded-full border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white",
          className,
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-1 items-center px-6 hover:bg-gray-50 rounded-l-full transition-colors">
          <span className="text-sm font-medium truncate">
            {isMapSearchMode ? location : "Anywhere"}
          </span>
        </div>
        <div className="h-full w-[1px] bg-gray-200" />
        <div className="flex flex-1 items-center px-6 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-medium truncate">
            {getDateRangeDisplay()}
          </span>
        </div>
        <div className="h-full w-[1px] bg-gray-200" />
        <div className="flex items-center pl-6 pr-2 hover:bg-gray-50 rounded-r-full transition-colors">
          <span className="text-sm text-gray-600 truncate">
            {getGuestsDisplay()}
          </span>
          <Button
            size="icon"
            className="ml-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 flex-shrink-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={cn(
          "md:hidden grid grid-cols-[1fr,1fr,0.8fr] items-center rounded-full border shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white h-14",
          className,
        )}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-center px-4 border-r h-full min-w-0">
          <span className="text-sm font-medium truncate">
            {isMapSearchMode ? location : "Anywhere"}
          </span>
        </div>
        <div className="flex items-center justify-center px-4 border-r h-full min-w-0">
          <span className="text-sm font-medium truncate">
            {getDateRangeDisplay()}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 h-full">
          <div className="min-w-0 flex-1 mr-2">
            <span className="text-sm text-gray-600 truncate block">
              {getGuestsDisplay()}
            </span>
          </div>
          <Button
            size="icon"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 flex-shrink-0"
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
