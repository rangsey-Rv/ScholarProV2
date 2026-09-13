"use client";

// import Image from "next/image";
import { Bell, LogOut, PanelLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  getStudentDisplayName,
  getStudentInitials,
  getStudentRoleLabel,
} from "@/lib/utils/student-portal";

export default function ApplicantHeader({
  title = "University Admissions Portal",
  className,
  // collapsed = false,
  onToggleSidebar,
}: {
  title?: string;
  className?: string;
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState<string>("Student");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("Applicant");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const syncUser = () => {
      const name = getStudentDisplayName(user);
      const role = getStudentRoleLabel(user?.role);
      let email = user?.email || "";

      if (!email && typeof window !== "undefined") {
        try {
          const stored = sessionStorage.getItem("studentUser");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.email) email = parsed.email;
          }
        } catch {}
      }

      setUserName(name);
      setUserEmail(email);
      setUserRole(role);
      setAvatarUrl(user?.avatar);
    };

    syncUser();

    if (typeof window !== "undefined") {
      window.addEventListener("student-profile-updated", syncUser);
      window.addEventListener("storage", syncUser);
      return () => {
        window.removeEventListener("student-profile-updated", syncUser);
        window.removeEventListener("storage", syncUser);
      };
    }
  }, [user]);

  const initials = getStudentInitials(userName);

  return (
    <header
      className={cn(
        "hidden lg:flex items-center justify-between px-6 h-16 border-b bg-white sticky top-0 z-40",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-md hover:bg-slate-50 relative z-50"
        >
          <PanelLeftIcon className="w-5 h-5 text-slate-700" />
        </button>

        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-slate-50"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                aria-label="Account menu"
              >
                <Avatar className="border border-slate-200">
                  <AvatarImage
                    src={avatarUrl}
                    alt={userName}
                  />
                  <AvatarFallback className="bg-[#1e2d6b]/10 text-[#1e2d6b] font-semibold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-slate-500">{userRole}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs font-normal text-slate-500 truncate">
                  {userEmail || user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                onClick={() => logout("/students")}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

