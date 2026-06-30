"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { ExamScheduleData } from "../flow/ExamFlowWizard";
import type { RoomSchedule } from "../flow/ExamFlowProvider";
import type { Committee } from "@/types/committee";
import { scheduleService } from "@/api/service/schedule.service";

interface EditScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleData?: ExamScheduleData;
  onSave?: (updatedData: ExamScheduleData) => void;
}

export function EditScheduleDialog({
  open,
  onOpenChange,
  scheduleData,
  onSave,
}: EditScheduleDialogProps) {
  const [editedData, setEditedData] = useState<ExamScheduleData | undefined>(
    scheduleData,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [committeeSearchQuery, setCommitteeSearchQuery] = useState("");
  const [isCommitteePopoverOpen, setIsCommitteePopoverOpen] = useState(false);
  const [activeRoomIndex, setActiveRoomIndex] = useState<number | null>(null);
  const [committees, setCommittees] = useState<Committee[]>([]);

  // Load committees from API
  useEffect(() => {
    if (open) {
      scheduleService
        .getAllCommittees()
        .then((response) => {
          console.log(
            "[EditScheduleDialog] Committees loaded:",
            response.data || response,
          );
          const committeeData = response.data || response;
          // Map department.departmentName -> department.name for CommitteeDepartment compatibility
          const mappedCommittees = Array.isArray(committeeData)
            ? committeeData.map((c) => ({
                ...c,
                department: c.department
                  ? {
                      id: c.department.id,
                      name: c.department.name ?? "",
                    }
                  : null,
              }))
            : [];
          setCommittees(mappedCommittees);
        })
        .catch((error) => {
          console.error(
            "[EditScheduleDialog] Failed to load committees:",
            error,
          );
          toast.error("Failed to load committee data");
          setCommittees([]);
        })
        .finally(() => {});
    }
  }, [open]);

  // For backward compatibility - simplified batch list
  const availableBatches = [
    "Fall 2024",
    "Spring 2024",
    "Summer 2024",
  ] as unknown as string[];

  // Sync editedData with scheduleData when dialog opens
  useEffect(() => {
    if (open && scheduleData) {
      setEditedData(scheduleData);
    }
  }, [open, scheduleData]);

  const timeOptions = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  const availableCommitteeMembers = committees.map((c) => c.name);

  const handleUpdateRoom = (
    index: number,
    field: keyof RoomSchedule,
    value: string | number | string[],
  ) => {
    if (!editedData?.roomSchedules) return;

    const updatedRoomSchedules = [...editedData.roomSchedules];
    updatedRoomSchedules[index] = {
      ...updatedRoomSchedules[index],
      [field]: value,
    };

    setEditedData((prev) =>
      prev ? { ...prev, roomSchedules: updatedRoomSchedules } : undefined,
    );
  };

  const handleCommitteeToggle = (roomIndex: number, member: string) => {
    if (!editedData?.roomSchedules) return;

    const currentCommittee =
      editedData.roomSchedules[roomIndex].committee || [];
    const updatedCommittee = currentCommittee.includes(member)
      ? currentCommittee.filter((m) => m !== member)
      : [...currentCommittee, member];

    handleUpdateRoom(roomIndex, "committee", updatedCommittee);
  };

  const handleRemoveCommitteeMember = (roomIndex: number, member: string) => {
    if (!editedData?.roomSchedules) return;

    const currentCommittee =
      editedData.roomSchedules[roomIndex].committee || [];
    const updatedCommittee = currentCommittee.filter((m) => m !== member);
    handleUpdateRoom(roomIndex, "committee", updatedCommittee);
  };

  const getFilteredCommitteeMembers = () => {
    return availableCommitteeMembers.filter((member) =>
      member.toLowerCase().includes(committeeSearchQuery.toLowerCase()),
    );
  };

  const handleSaveEdit = () => {
    if (!editedData?.selectedBatch.trim()) {
      toast.error("Please select a batch");
      return;
    }
    if (!editedData?.selectedDate) {
      toast.error("Please select exam date");
      return;
    }
    if (!editedData?.roomSchedules || editedData.roomSchedules.length === 0) {
      toast.error("Please add at least one room schedule");
      return;
    }

    for (const room of editedData.roomSchedules) {
      if (room.roomName.trim().length < 3) {
        toast.error("Room name must be at least 3 characters");
        return;
      }
      if (room.roomName.trim().length > 100) {
        toast.error("Room name must be at most 100 characters");
        return;
      }
      if (room.capacity <= 0) {
        toast.error("Please enter valid room capacity");
        return;
      }
      if (room.location.trim().length < 3) {
        toast.error("Location must be at least 3 characters");
        return;
      }
      if (room.location.trim().length > 100) {
        toast.error("Location must be at most 100 characters");
        return;
      }
      if (!room.startTime) {
        toast.error("Please select start time");
        return;
      }
      if (!room.endTime) {
        toast.error("Please select end time");
        return;
      }
      if (room.startTime >= room.endTime) {
        toast.error("Start time must be before end time");
        return;
      }
      if (room.committee.length === 0) {
        toast.error("Please select at least one committee member");
        return;
      }
    }

    onSave?.(editedData);
    onOpenChange(false);
    toast.success("Schedule updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exam Schedule</DialogTitle>
          <DialogDescription>
            Update batch details, date, rooms, capacity, locations, exam types,
            times, and committee assignments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Schedule Details Section */}
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/30">
            <h3 className="text-sm font-semibold">Schedule Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-select">Select Batch</Label>
                <Select
                  value={
                    editedData?.selectedBatch ||
                    scheduleData?.selectedBatch ||
                    ""
                  }
                  onValueChange={(value) =>
                    setEditedData({
                      ...editedData!,
                      selectedBatch: value,
                    })
                  }
                >
                  <SelectTrigger id="batch-select">
                    <SelectValue placeholder="Choose a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editedData?.selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedData?.selectedDate
                        ? format(editedData.selectedDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedData?.selectedDate}
                      onSelect={(date: Date | undefined) => {
                        setEditedData({
                          ...editedData!,
                          selectedDate: date,
                        });
                        setIsCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Room Schedules Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Room Schedules</h3>
            </div>

            {editedData?.roomSchedules?.map((room, roomIndex) => (
              <div
                key={room.id}
                className="border border-border/50 rounded-lg p-4 bg-card/50 hover:border-border transition-colors"
              >
                <div className="space-y-4">
                  {/* Room Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border/30">
                    <h4 className="text-sm font-semibold text-foreground">
                      Room Schedule #{roomIndex + 1}
                    </h4>
                    <Badge
                      variant="outline"
                      className={
                        room.examType === "math"
                          ? "text-xs border-blue-300 text-blue-700 bg-blue-50/80"
                          : "text-xs border-emerald-300 text-emerald-700 bg-emerald-50/80"
                      }
                    >
                      {room.examType === "math" ? "Mathematics" : "English"}
                    </Badge>
                  </div>

                  {/* Room Basic Information */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Basic Information
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Room Name</Label>
                        <Input
                          value={room.roomName}
                          onChange={(e) =>
                            handleUpdateRoom(
                              roomIndex,
                              "roomName",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Room 101"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Capacity</Label>
                        <Input
                          type="number"
                          value={room.capacity}
                          onChange={(e) =>
                            handleUpdateRoom(
                              roomIndex,
                              "capacity",
                              Number.parseInt(e.target.value),
                            )
                          }
                          placeholder="e.g. 30"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Location</Label>
                        <Input
                          value={room.location}
                          onChange={(e) =>
                            handleUpdateRoom(
                              roomIndex,
                              "location",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Building A, 1st Floor"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exam Schedule Details */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Schedule Details
                    </h5>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Exam Type</Label>
                        <Select
                          value={room.examType}
                          onValueChange={(value: "math" | "english") =>
                            handleUpdateRoom(roomIndex, "examType", value)
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Start Time
                        </Label>
                        <Select
                          value={room.startTime}
                          onValueChange={(value) =>
                            handleUpdateRoom(roomIndex, "startTime", value)
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-40">
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">End Time</Label>
                        <Select
                          value={room.endTime}
                          onValueChange={(value) =>
                            handleUpdateRoom(roomIndex, "endTime", value)
                          }
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-40">
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Committee Assignment */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Committee Assignment
                    </h5>
                    <div className="space-y-2">
                      <Popover
                        open={
                          isCommitteePopoverOpen &&
                          activeRoomIndex === roomIndex
                        }
                        onOpenChange={(open) => {
                          setIsCommitteePopoverOpen(open);
                          setActiveRoomIndex(open ? roomIndex : null);
                          if (!open) setCommitteeSearchQuery("");
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal text-sm h-9"
                          >
                            {room.committee && room.committee.length > 0
                              ? `${room.committee.length} member${room.committee.length > 1 ? "s" : ""} selected`
                              : "Select committee members"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-0" align="start">
                          <div className="flex flex-col">
                            <div className="p-2 border-b">
                              <Input
                                placeholder="Search members..."
                                value={committeeSearchQuery}
                                onChange={(e) =>
                                  setCommitteeSearchQuery(e.target.value)
                                }
                                className="h-8 text-sm"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto p-1">
                              {getFilteredCommitteeMembers().map((member) => (
                                <div
                                  key={member}
                                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded cursor-pointer text-sm"
                                  onClick={() =>
                                    handleCommitteeToggle(roomIndex, member)
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      room.committee?.includes(member) || false
                                    }
                                    onChange={() => {}}
                                    className="w-3 h-3 cursor-pointer"
                                  />
                                  <label className="flex-1 cursor-pointer text-sm">
                                    {member}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Selected Committee Members */}
                      {room.committee && room.committee.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {room.committee.map((member) => (
                            <Badge
                              key={member}
                              variant="secondary"
                              className="text-xs flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400"
                            >
                              {member}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() =>
                                  handleRemoveCommitteeMember(roomIndex, member)
                                }
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            className="bg-[#0F386D] hover:bg-[#0955b1] text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
