import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  onSearch?: (query: string) => void;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
  isMapSearchMode?: boolean;
}

const Header = ({
  isLoggedIn = false,
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onSearch = () => {},
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
  isMapSearchMode = false,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto h-20 flex items-center justify-between gap-4 px-6">
        {/* Logo - Hidden on mobile */}
        <div className="flex-none hidden md:block">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            SyriaGo
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 md:flex-none md:w-[480px]">
          <SearchBar
            onSearch={() => onSearch("")}
            className="w-full"
            isMapSearchMode={isMapSearchMode}
          />
        </div>

        {/* Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Become a host</Button>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  My Properties
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onLogin}>
                Login
              </Button>
              <Button onClick={onSignup}>Sign up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
