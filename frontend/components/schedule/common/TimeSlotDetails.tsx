"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Users, Trash2 } from "lucide-react";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Student, TimeSlot } from "@/types/exam";

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot;
  students: Student[];
  roomInfo: {
    location: string;
    capacity: number;
  };
}

export function TimeSlotDetails({
  timeSlot,
  students,
  roomInfo,
}: TimeSlotDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Room Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 bg-gray-100 rounded">
            <MapPin className="h-4 w-4 text-gray-600" />
          </div>
          <h3 className="font-medium text-[#162456]">Room Information</h3>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Room Name</p>
            <p className="font-medium text-gray-900">{timeSlot.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Location</p>
            <p className="font-medium text-gray-900">{roomInfo.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Capacity</p>
            <p className="font-medium text-gray-900">
              {roomInfo.capacity} seats
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Students */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 bg-gray-100 rounded">
            <Users className="h-4 w-4 text-gray-600" />
          </div>
          <h3 className="font-medium text-gray-900">
            Assigned Students ({students.length})
          </h3>
        </div>

        <div className="max-h-96 overflow-y-auto overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-0 text-sm font-medium text-gray-600">
                  Student ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Math Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  English Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-0 text-sm text-gray-900">
                    {student.id}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator status={student.mathStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator status={student.englishStatus} />
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() =>
                        console.log(`TODO: Delete student ${student.id}`)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
