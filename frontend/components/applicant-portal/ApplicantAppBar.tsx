"use client";

import Image from "next/image";
import { Menu, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ApplicantAppBar({ className }: { className?: string }) {
  const { user } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setUserName(user?.name ?? "Student");
  }, [user]);

  return (
    <div
      className={cn(
        "lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b",
        className,
      )}
    >
      <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-md hover:bg-slate-50"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/assets/LogoCamtech.png"
                alt="logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-sm font-medium">Admissions</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-full hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          <Avatar>
            <AvatarImage
              src="/assets/avatar-placeholder.png"
              alt={String(userName)}
            />
            <AvatarFallback>
              {String(userName || "S")
                .split(" ")
                .map((s) => s.charAt(0))
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
