"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPin,
  Users,
  AlertCircle,
  Trash2,
  Edit3Icon,
} from "lucide-react";
import type { ExamScheduleData } from "./flow/ExamFlowWizard";
import type { UnifiedDetailResponse } from "@/types/schedule";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { format, parseISO } from "date-fns";
import { RoomScheduleCard } from "./details/RoomScheduleCard";
import { EditScheduleDialog } from "./details/EditScheduleDialog";
import { scheduleService } from "@/api/service/schedule.service";
import { toast } from "sonner";

// Type guard for Axios errors with a response property
function isAxiosErrorWithResponse(error: unknown): error is {
  response: { status: number; data?: { message?: string; data?: unknown } };
} {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const err = error as Record<string, unknown>;
  if (
    !("response" in err) ||
    typeof err.response !== "object" ||
    err.response === null
  ) {
    return false;
  }
  const response = err.response as Record<string, unknown>;
  return "status" in response;
}

// Unified type for displaying exam data from any source
interface ExamDisplayData {
  id: string;
  title: string;
  date: Date;
  totalStudents: number;
  totalRooms: number;
  totalCommittee: number;
  status: "scheduled";
  batch: string;
}

interface ExamDetailsProps {
  onBack: () => void;
  scheduleData?: ExamScheduleData;
  examSessionId?: string; // ID to fetch from API
  onDelete?: () => void;
}

export function ExamDetails({
  onBack,
  scheduleData,
  examSessionId,
  onDelete,
}: ExamDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [examDetail, setExamDetail] = useState<UnifiedDetailResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchDisplayName, setBatchDisplayName] = useState<string>("");

  // Fetch exam details from API if examSessionId is provided
  useEffect(() => {
    window.scrollTo(0, 0);

    if (examSessionId) {
      console.log(
        `[ExamDetails] Fetching details for exam session ID: ${examSessionId}`,
      );

      setIsLoading(true);
      setError(null);

      scheduleService
        .getExamSessionDetail(String(examSessionId))
        .then((response) => {
          console.log("[ExamDetails] API response:", response);

          // Handle API response structure
          const data = response.data;

          if (!data || !data.examSession) {
            throw new Error(
              "Invalid response structure - missing exam session data",
            );
          }

          console.log("[ExamDetails] Successfully fetched exam data:", data);
          setExamDetail(data);
          setError(null);
        })
        .catch((error: unknown) => {
          console.error("[ExamDetails] Error fetching exam:", error);

          // More user-friendly error messages
          let errorMessage = "Failed to load exam details. Please try again.";

          if (isAxiosErrorWithResponse(error)) {
            const response = error.response;
            if (response?.status === 404) {
              errorMessage =
                "This exam session could not be found. It may have been deleted or moved.";
            } else if (response?.status === 403) {
              errorMessage =
                "You don't have permission to view this exam session.";
            } else if (response?.status && response.status >= 500) {
              errorMessage =
                "Server error occurred. Please try again in a moment.";
            }
          } else if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message?: string }).message === "string"
          ) {
            errorMessage = (error as { message: string }).message;
          }

          setError(errorMessage);

          toast.error("Failed to load exam details", {
            description: errorMessage,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [examSessionId]);

  // Load batch display name for local schedule data
  useEffect(() => {
    const loadBatchDisplayName = async () => {
      if (!scheduleData?.selectedBatch) return;

      try {
        const response = await scheduleService.listBatches();
        const batchData = response.data || [];
        const validBatches = Array.isArray(batchData) ? batchData : [];

        // Find the batch display name
        const selectedBatchObj = validBatches.find(
          (b) => String(b.id) === scheduleData.selectedBatch,
        );
        setBatchDisplayName(
          selectedBatchObj
            ? selectedBatchObj.batchName
            : scheduleData.selectedBatch,
        );
      } catch (error) {
        console.error("Failed to load batch display name:", error);
        setBatchDisplayName(scheduleData.selectedBatch); // Fallback to ID
      }
    };

    loadBatchDisplayName();
  }, [scheduleData?.selectedBatch]);

  // Transform API data or use local scheduleData
  const examData: ExamDisplayData = examDetail
    ? {
        id: examDetail.examSession.sessionId.toString(),
        title: examDetail.examSession.sessionName,
        date: parseISO(examDetail.examSession.startTime),
        totalStudents: examDetail.applications.length,
        totalRooms: 1, // Currently API returns one session context
        totalCommittee: examDetail.committees.length,
        status: "scheduled" as const,
        batch: examDetail.subject.subjectName,
      }
    : scheduleData
      ? {
          id: "local-exam",
          title: batchDisplayName || scheduleData.selectedBatch,
          date: scheduleData.selectedDate || new Date(),
          totalStudents: 0, // No students in wizard data - will be assigned when session is created
          totalRooms: scheduleData.roomSchedules?.length || 0,
          totalCommittee: new Set(
            scheduleData.roomSchedules?.flatMap((r) => r.committee) || [],
          ).size,
          status: "scheduled" as const,
          batch: batchDisplayName || scheduleData.selectedBatch,
        }
      : {
          id: "fallback",
          title: "Exam Session",
          date: new Date(),
          totalStudents: 0,
          totalRooms: 0,
          totalCommittee: 0,
          status: "scheduled" as const,
          batch: "Unknown Batch",
        };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  // ---------------------------------------------------------------------------
  // RENDER STATES
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <span className="text-muted-foreground">/</span>
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-40 bg-muted rounded animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded animate-pulse" />
            <div className="h-9 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>

        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 border">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-7 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Room Schedule Card Skeleton */}
        <Card className="p-6 border">
          <div className="mb-4 pb-4 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6 p-4 rounded-lg bg-muted/30">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-muted rounded animate-pulse mb-2" />
                <div className="h-7 w-16 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-5 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Error Loading Exam</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={handleBack} variant="outline">
          Go Back to List
        </Button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={handleBack}
              className="hover:text-primary transition-colors"
            >
              Schedule
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{examData.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {examData.title}
          </h1>
          <div className="flex flex-col gap-1.5 mt-2">
            {/* Date */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(examData.date, "EEEE, MMMM d, yyyy")}</span>
            </div>

            {/* Location & Time */}
            {(() => {
              let startTime = "";
              let endTime = "";
              let location = "";

              if (examDetail) {
                startTime = format(
                  parseISO(examDetail.examSession.startTime),
                  "h:mm a",
                );
                endTime = format(
                  parseISO(examDetail.examSession.endTime),
                  "h:mm a",
                );
                location = examDetail.examSession.location;
              } else if (scheduleData?.roomSchedules?.[0]) {
                startTime = scheduleData.roomSchedules[0].startTime;
                endTime = scheduleData.roomSchedules[0].endTime;
                location = scheduleData.roomSchedules[0].location;
              }

              return (
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="font-medium">{location || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <CalendarIcon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">
                      {startTime} - {endTime}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="capitalize px-3 py-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800"
          >
            ✓ {examData.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            className="gap-2"
          >
            <Edit3Icon className="h-4 w-4" />
            Edit Schedule
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rooms Card */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg text-blue-600 bg-blue-50 dark:bg-blue-900/20">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rooms
              </p>
              <p className="text-2xl font-bold mt-1">{examData.totalRooms}</p>
            </div>
          </div>
        </Card>

        {/* Students Card */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg text-purple-600 bg-purple-50 dark:bg-purple-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Students
              </p>
              <p className="text-2xl font-bold mt-1">
                {examData.totalStudents}
              </p>
            </div>
          </div>
        </Card>

        {/* Committee Card with Names */}
        <Card className="p-5 border shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg text-orange-600 bg-orange-50 dark:bg-orange-900/20 shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Committee
              </p>
              <p className="text-2xl font-bold mt-1">
                {examData.totalCommittee}
              </p>

              {/* Committee Names Badges */}
              {examDetail && examDetail.committees.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {examDetail.committees.map((committee) => (
                    <Badge
                      key={committee.committeeId}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400"
                    >
                      {committee.committeeName}
                    </Badge>
                  ))}
                </div>
              )}

              {/* For local schedule data */}
              {!examDetail && scheduleData?.roomSchedules && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.from(
                    new Set(
                      scheduleData.roomSchedules.flatMap((r) => r.committee),
                    ),
                  ).map((member) => (
                    <Badge
                      key={member}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400"
                    >
                      {member}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <EditScheduleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        scheduleData={scheduleData}
        onSave={(data) => console.log("Save", data)}
      />

      {/* Room Schedule Cards */}
      <div className="space-y-6">
        {examDetail ? (
          // Render API data
          <RoomScheduleCard
            key={examDetail.examSession.sessionId}
            roomName={examDetail.examSession.sessionName}
            examType={
              examDetail.subject.subjectId === 1 ||
              examDetail.subject.subjectName.toLowerCase().includes("math")
                ? "math"
                : "english"
            }
            capacity={examDetail.examSession.capacity}
            committee={examDetail.committees.map((c) => c.committeeName)}
            assignedStudents={examDetail.applications.map((app) => ({
              id: app.applicationId.toString(),
              name: app.applicantName,
              email: "N/A", // Not provided in this API response
              mathStatus: examDetail.subject.subjectName
                .toLowerCase()
                .includes("math")
                ? "Required"
                : "Exempt",
              englishStatus: examDetail.subject.subjectName
                .toLowerCase()
                .includes("english")
                ? "Required"
                : "Exempt",
            }))}
            location={examDetail.examSession.location}
          />
        ) : (
          // Render local wizard data
          scheduleData?.roomSchedules?.map((room) => {
            // No students to assign in wizard data - they will be assigned after exam session creation
            return (
              <RoomScheduleCard
                key={room.id}
                roomName={room.roomName}
                examType={room.examType}
                capacity={room.capacity}
                committee={room.committee}
                assignedStudents={[]} // Empty array - students not available in wizard
                location={room.location}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
