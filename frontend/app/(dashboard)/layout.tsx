"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PageHeader } from "@/components/header/header";
import { HeaderProvider } from "@/components/header/header-context";
import { useAuth, useRole } from "@/lib/context/auth-context";
import { usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { canAccessRoute } = useRole();
  const pathname = usePathname();

  const role = user?.role || "committee";

  // role-based route protection (using JWT verified role)
  useEffect(() => {
    if (!isLoading && user && !canAccessRoute(pathname)) {
      notFound(); // Trigger 404 page (route masking)
    }
  }, [pathname, user, isLoading, canAccessRoute]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If unauthorized, don't render layout
  if (user && !canAccessRoute(pathname)) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset className="overflow-hidden">
        <HeaderProvider>
          <PageHeader showNotifications showProfile />
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden min-w-0">
            {children}
          </div>
        </HeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
