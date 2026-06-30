"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { getFacultyByMajor } from "@/lib/utils/department-mapper";
import { InterviewDetailResponse } from "@/types/schedule";
import {
  InterviewDetailsHeader,
  InterviewScheduleInfo,
  InterviewCommitteeMembers,
  InterviewParticipantsTable,
  EditInterviewDialog,
} from "./";

interface InterviewDetailsProps {
  interview: InterviewDetailResponse;
  onBack: () => void;
  onDelete?: () => void;
}

export function InterviewDetails({
  interview,
  onBack,
  onDelete,
}: InterviewDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Derive commonly used values from InterviewDetailResponse
  const exam = interview.examSession;
  const startISO = exam.startTime;
  const endISO = exam.endTime;
  const dateStr = format(new Date(startISO), "PPP");
  const startTimeStr = format(new Date(startISO), "HH:mm");
  const endTimeStr = format(new Date(endISO), "HH:mm");

  const committeeMembers = interview.committees.map((c) => c.committeeName);

  // --- LOGIC: Build Participants list from interview.applications ---
  const participants = useMemo(() => {
    return interview.applications.map((app) => {
      const timeSlot =
        app.interviewSlotStart && app.interviewSlotEnd
          ? `${format(new Date(app.interviewSlotStart), "HH:mm")} - ${format(
              new Date(app.interviewSlotEnd),
              "HH:mm",
            )}`
          : "Not Scheduled"; // Provide a fallback string

      return {
        id: String(app.applicationId),
        name: app.applicantName,
        major: undefined,
        department: getFacultyByMajor(""), // fallback - map if applicant major is available
        timeSlot: timeSlot,
      };
    });
  }, [interview.applications]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <InterviewDetailsHeader
        interviewName={exam.sessionName}
        batchName={interview.subject?.subjectName || ""}
        onBack={onBack}
        onEdit={() => setIsEditDialogOpen(true)}
        onDelete={onDelete}
      />

      {/* Main Interview Details Card */}
      <Card className="p-6">
        <div className="space-y-8">
          <InterviewScheduleInfo
            date={dateStr}
            time={`${startTimeStr} - ${endTimeStr}`}
            batch={interview.subject?.subjectName || ""}
            roomName={exam.sessionName}
          />

          <InterviewCommitteeMembers members={committeeMembers} />

          <InterviewParticipantsTable participants={participants} />
        </div>
      </Card>

      <EditInterviewDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        interview={interview}
        onSuccess={() => {
          // After a successful save, go back to the list view
          // The parent component should refetch the list to show updated data.
          onBack();
        }}
      />
    </div>
  );
}
