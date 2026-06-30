"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ApplicantsListHeader } from "./ApplicantsListHeader";
import { ApplicantsTable } from "./ApplicantsTable";
import { useState, useMemo } from "react";
import { Users, MapPin, Book } from "lucide-react";
interface Student {
  id: string;
  name: string;
  email: string;
  mathStatus: string;
  englishStatus: string;
}

interface RoomScheduleCardProps {
  roomName: string;
  examType: "math" | "english";
  capacity: number;
  committee: string[];
  assignedStudents: Student[];
  location: string;
}

export function RoomScheduleCard({
  roomName,
  examType,
  capacity,
  committee,
  assignedStudents,
  location,
}: RoomScheduleCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    return assignedStudents.filter((student) => {
      const matchesSearch =
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [assignedStudents, searchQuery]);

  return (
    <Card className="p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: Room details */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
          <h3 className="text-lg font-bold">{roomName}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{capacity} Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <Badge
                variant={examType === "math" ? "default" : "secondary"}
                className="capitalize"
              >
                {examType}
              </Badge>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Committee</h4>
            <div className="flex flex-wrap gap-2">
              {committee.map((member) => (
                <Badge key={member} variant="outline">
                  {member}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: Enrolled students */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <h4 className="text-sm font-bold mb-4 uppercase tracking-wide text-muted-foreground">
            Enrolled Students ({filteredStudents.length})
          </h4>

          <ApplicantsListHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={assignedStudents.length}
          />

          <ApplicantsTable students={filteredStudents} />
        </div>
      </div>
    </Card>
  );
}
