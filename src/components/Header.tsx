import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/lib/auth";
import AuthModal from "./auth/AuthModal";

interface HeaderProps {
  onSearch?: (query: string) => void;
  isMapSearchMode?: boolean;
}

const Header = ({
  onSearch = () => {},
  isMapSearchMode = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">(
    "login",
  );

  const handleLogin = () => {
    setAuthDefaultTab("login");
    setShowAuth(true);
  };

  const handleSignup = () => {
    setAuthDefaultTab("signup");
    setShowAuth(true);
  };

  const handleLogout = async () => {
    await signOut();
  };

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
            onSearch={onSearch}
            className="w-full"
            isMapSearchMode={isMapSearchMode}
          />
        </div>

        {/* Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost">Become a host</Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.email || "User"}
                    />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  My Properties
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleLogin}>
                Login
              </Button>
              <Button onClick={handleSignup}>Sign up</Button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultTab={authDefaultTab}
      />
    </header>
  );
};

export default Header;
