"use client";

import { useEffect } from "react";
import ProfileSettings from "@/components/settings/ProfileSettings";
import { useHeader } from "@/components/header/header-context";

export default function ProfileSettingsPage() {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle("Profile Settings");
  }, [setTitle]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <ProfileSettings />
    </div>
  );
}
