import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Github, Twitter } from "lucide-react";

interface SecurityFormProps {
  onPasswordUpdate?: (oldPassword: string, newPassword: string) => void;
  onDisconnectSocial?: (provider: string) => void;
  connectedAccounts?: Array<{
    provider: string;
    connected: boolean;
  }>;
}

import { updateUserProfile } from "@/services/user";
import { useAuth } from "@/lib/auth";

const SecurityForm = ({
  onPasswordUpdate = () => {},
  onDisconnectSocial = () => {},
  connectedAccounts = [
    { provider: "github", connected: true },
    { provider: "twitter", connected: true },
  ],
}: SecurityFormProps) => {
  return (
    <div className="w-full max-w-2xl space-y-8 bg-white p-6 rounded-lg">
      {/* Password Update Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Update Password</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button className="w-full sm:w-auto">Update Password</Button>
        </div>
      </Card>

      {/* Connected Accounts Section */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Connected Accounts</h3>
        <div className="space-y-4">
          {/* GitHub Account */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Github className="h-6 w-6" />
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-gray-500">
                  {connectedAccounts.find((acc) => acc.provider === "github")
                    ?.connected
                    ? "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Disconnect</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect GitHub Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect your GitHub account?
                    This will remove the ability to login with GitHub.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDisconnectSocial("github")}
                  >
                    Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Twitter Account */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Twitter className="h-6 w-6" />
              <div>
                <p className="font-medium">Twitter</p>
                <p className="text-sm text-gray-500">
                  {connectedAccounts.find((acc) => acc.provider === "twitter")
                    ?.connected
                    ? "Connected"
                    : "Not connected"}
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Disconnect</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Disconnect Twitter Account
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect your Twitter account?
                    This will remove the ability to login with Twitter.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDisconnectSocial("twitter")}
                  >
                    Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityForm;
