"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, TrendingUp, Calendar, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Application", url: "/students/application", icon: FileText },
  { title: "Progress", url: "/students/progress", icon: TrendingUp },
  { title: "Exam", url: "/students/exam", icon: Calendar },
  { title: "Profile", url: "/students/profile", icon: User },
];

export default function ApplicantSidebar({
  className,
  collapsed = false,
}: {
  className?: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:fixed lg:flex lg:flex-col lg:inset-y-0 left-0 bg-white border-r transition-[width] duration-200 z-30",
        collapsed ? "w-20" : "w-72",
        className,
      )}
    >
      <div className="px-6 border-b h-16 flex items-center">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 relative bg-slate-100 rounded-md overflow-hidden">
            <Image
              src="/assets/LogoCamtech.png"
              alt="Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">
              Admissions
            </div>
            <div className="text-xs text-slate-500">Student Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-6">
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = pathname?.startsWith(it.url);
            return (
              <li key={it.url}>
                <Link
                  href={it.url}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
                    active
                      ? "bg-blue-50 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      active ? "text-blue-600" : "text-slate-500",
                    )}
                  />
                  <span
                    className={cn("truncate", collapsed ? "hidden" : "block")}
                  >
                    {it.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 py-6 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/assets/avatar-placeholder.png" alt="Applicant" />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div className={cn(collapsed ? "hidden" : "block")}>
            <div className="text-sm font-medium">Student</div>
            <div className="text-xs text-slate-500">Applicant</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
