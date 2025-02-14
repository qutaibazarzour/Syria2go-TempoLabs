import React from "react";
import SettingsTabs from "@/components/settings/SettingsTabs";

interface SettingsPageProps {
  defaultTab?: string;
}

export default function SettingsPage({
  defaultTab = "personal",
}: SettingsPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information, profile, and security settings
          </p>
        </div>

        <SettingsTabs defaultTab={defaultTab} />
      </div>
    </div>
  );
}
