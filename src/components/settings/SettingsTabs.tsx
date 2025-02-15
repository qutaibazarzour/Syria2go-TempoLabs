import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import { lazy, Suspense } from "react";
import ProfileFormSkeleton from "./ProfileFormSkeleton";
const ProfileForm = lazy(() => import("./ProfileForm"));
import SecurityForm from "./SecurityForm";

interface SettingsTabsProps {
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function SettingsTabs({
  defaultTab = "personal",
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50">
      <Tabs
        defaultValue={defaultTab}
        onValueChange={onTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Suspense fallback={<ProfileFormSkeleton />}>
            <ProfileForm />
          </Suspense>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecurityForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
