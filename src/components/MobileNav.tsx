import { Heart, Home, User, X } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogCloseButton } from "./ui/dialog-close-button";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";

interface MobileNavProps {
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
}

const MobileNav = ({
  isLoggedIn = false,
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
}: MobileNavProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden z-50">
      <div className="flex items-center justify-around h-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center gap-1"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Explore</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center gap-1"
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs">Wishlist</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="flex flex-col items-center gap-1"
          onClick={() => setIsProfileOpen(true)}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="top-0 translate-y-0 h-full max-w-full p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Profile</h2>
                <DialogCloseButton />
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={userAvatar} alt={userName} />
                          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{userName}</h3>
                          <p className="text-sm text-muted-foreground">
                            View profile
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12"
                        >
                          My Properties
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12"
                        >
                          Settings
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12 text-primary"
                        >
                          Become a host
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start h-12 text-destructive"
                          onClick={onLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <Button className="w-full h-12" onClick={onLogin}>
                        Log in
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12"
                        onClick={onSignup}
                      >
                        Sign up
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 text-primary"
                      >
                        Become a host
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MobileNav;
