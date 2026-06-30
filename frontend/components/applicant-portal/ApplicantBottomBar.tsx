"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, TrendingUp, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Application", url: "/applicant/application", icon: FileText },
  { title: "Progress", url: "/applicant/progress", icon: TrendingUp },
  { title: "Exam", url: "/applicant/exam", icon: Calendar },
  { title: "Profile", url: "/applicant/profile", icon: User },
];

export default function ApplicantBottomBar({
  className,
}: {
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t lg:hidden",
        className,
      )}
    >
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="w-8 h-8 relative hidden md:block">
            <Image
              src="/assets/LogoCamtech.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex w-full justify-around">
            {items.map((it) => {
              const Icon = it.icon;
              const active = pathname?.startsWith(it.url);
              return (
                <Link
                  key={it.url}
                  href={it.url}
                  className="flex flex-col items-center justify-center px-2 py-1"
                >
                  <Icon
                    className={cn(
                      "size-6",
                      active ? "text-slate-900" : "text-slate-500",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs mt-1",
                      active ? "text-slate-900 font-medium" : "text-slate-500",
                    )}
                  >
                    {it.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
