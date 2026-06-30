"use client";
import { createContext, useState, ReactNode } from "react";

export interface RoomSchedule {
  id: string;
  roomName: string;
  capacity: number;
  location: string;
  examType: "math" | "english";
  startTime: string;
  endTime: string;
  committee: string[];
  createdAt: Date;
}

export interface RoomScheduleForm {
  roomName: string;
  capacity: string;
  location: string;
  examType: "math" | "english" | "";
  startTime: string;
  endTime: string;
  committee: string[];
  committeeSearchQuery: string;
  isCommitteeOpen: boolean;
}

export interface ExamFlowContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedRooms: string[];
  setSelectedRooms: (rooms: string[]) => void;
  roomSchedules: RoomSchedule[];
  setRoomSchedules: (schedules: RoomSchedule[]) => void;
  isRoomConfigValid: boolean;
  setIsRoomConfigValid: (isValid: boolean) => void;
  selectedCommittee: string[];
  setSelectedCommittee: (committee: string[]) => void;
  mathStartTime: string;
  setMathStartTime: (time: string) => void;
  mathEndTime: string;
  setMathEndTime: (time: string) => void;
  mathBreakTime: string;
  setMathBreakTime: (time: string) => void;
  englishStartTime: string;
  setEnglishStartTime: (time: string) => void;
  englishEndTime: string;
  setEnglishEndTime: (time: string) => void;
  englishBreakTime: string;
  setEnglishBreakTime: (time: string) => void;
  roomForm: RoomScheduleForm;
  setRoomForm: React.Dispatch<React.SetStateAction<RoomScheduleForm>>;
}

export const ExamFlowContext = createContext<ExamFlowContextType | undefined>(
  undefined,
);

export function ExamFlowProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [roomSchedules, setRoomSchedules] = useState<RoomSchedule[]>([]);
  const [isRoomConfigValid, setIsRoomConfigValid] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<string[]>([]);
  const [mathStartTime, setMathStartTime] = useState("");
  const [mathEndTime, setMathEndTime] = useState("");
  const [mathBreakTime, setMathBreakTime] = useState("");
  const [englishStartTime, setEnglishStartTime] = useState("");
  const [englishEndTime, setEnglishEndTime] = useState("");
  const [englishBreakTime, setEnglishBreakTime] = useState("");
  const [roomForm, setRoomForm] = useState<RoomScheduleForm>({
    roomName: "",
    capacity: "",
    location: "",
    examType: "",
    startTime: "",
    endTime: "",
    committee: [],
    committeeSearchQuery: "",
    isCommitteeOpen: false,
  });

  const value = {
    currentStep,
    setCurrentStep,
    selectedBatch,
    setSelectedBatch,
    selectedDate,
    setSelectedDate,
    selectedRooms,
    setSelectedRooms,
    roomSchedules,
    setRoomSchedules,
    isRoomConfigValid,
    setIsRoomConfigValid,
    selectedCommittee,
    setSelectedCommittee,
    mathStartTime,
    setMathStartTime,
    mathEndTime,
    setMathEndTime,
    mathBreakTime,
    setMathBreakTime,
    englishStartTime,
    setEnglishStartTime,
    englishEndTime,
    setEnglishEndTime,
    englishBreakTime,
    setEnglishBreakTime,
    roomForm,
    setRoomForm,
  };

  return (
    <ExamFlowContext.Provider value={value}>
      {children}
    </ExamFlowContext.Provider>
  );
}
