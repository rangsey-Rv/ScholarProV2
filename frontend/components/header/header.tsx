"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useHeader } from "@/components/header/header-context";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  showNotifications?: boolean;
  showProfile?: boolean;
}

export function PageHeader({ showProfile = true }: PageHeaderProps) {
  const { title } = useHeader();
  const { actions } = useHeader();
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials =
    user?.name
      ?.split(" ")
      ?.map((w) => w[0])
      ?.slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/setting/profile");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 overflow-x-hidden">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4 min-w-0">
        {/* Page-specific actions injected by pages via header context */}
        {actions}
        {/* Notifications */}

        {/* Profile Dropdown */}
        {showProfile && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 px-2 rounded-md flex items-center gap-3 min-w-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left min-w-0">
                  <span className="text-sm font-medium leading-none truncate max-w-[160px]">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground leading-none truncate max-w-[200px]">
                    {user.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Role: {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
