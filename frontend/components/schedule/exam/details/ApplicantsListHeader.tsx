"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ApplicantsListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export function ApplicantsListHeader({
  searchQuery,
  onSearchChange,
  totalCount,
}: ApplicantsListHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {totalCount} applicant{totalCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
