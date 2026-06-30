// Shared types for exam scheduling system

export interface Student {
  id: string
  name: string
  email: string
  major?: string
  department?: string
  room?: string
  mathStatus: "Required" | "Exempt"
  englishStatus: "Required" | "Exempt"
}

export interface TimeSlot {
  id: string
  subject: "Math" | "English"
  date: string
  time: string
  room: string
  students: number
  committee: string
}

export interface ExamData {
  id: string
  name: string
  status: string
  rooms: number
  capacity: number
  students: number
  fails: number
}

export type StudentStatus = "Required" | "Exempt"
