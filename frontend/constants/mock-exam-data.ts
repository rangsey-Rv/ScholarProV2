import { Student, TimeSlot, ExamData } from "@/types/exam"

export const mockExamData: ExamData = {
  id: "2025-fall-intake",
  name: "2025-Fall Intake",
  status: "upcoming",
  rooms: 3,
  capacity: 105,
  students: 40,
  fails: 8
}

export const mockTimeSlots: TimeSlot[] = [
  {
    id: "math-nov15-examhallb",
    subject: "Math",
    date: "Nov 15",
    time: "08:00 - 10:00",
    room: "Exam Hall B",
    students: 5,
    committee: "Dr. Sarah Johnson"
  },
  {
    id: "english-nov15-examhallb",
    subject: "English",
    date: "Nov 15",
    time: "09:30 - 11:30",
    room: "Exam Hall B",
    students: 5,
    committee: "Dr. Sarah Johnson"
  },
  {
    id: "math-nov15-examhalla",
    subject: "Math",
    date: "Nov 15",
    time: "08:00 - 10:00",
    room: "Exam Hall A",
    students: 5,
    committee: "Prof. Michael Chen"
  },
  {
    id: "english-nov15-examhalla",
    subject: "English",
    date: "Nov 15",
    time: "09:30 - 11:30",
    room: "Exam Hall A",
    students: 5,
    committee: "Prof. Michael Chen"
  }
]

export const mockStudents: Student[] = [
  {
    id: "SP-2025-001",
    name: "Pheakdey Ung",
    email: "pheakdey.ung@example.com",
    major: "Software Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-002",
    name: "Bopha Chea",
    email: "bopha.chea@example.com",
    major: "Software Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Exempt",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-003",
    name: "Kunthea Prak",
    email: "kunthea.prak@example.com",
    major: "Software Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-004",
    name: "Ratanak Ly",
    email: "ratanak.ly@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-005",
    name: "Sreypov Touch",
    email: "sreypov.touch@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-006",
    name: "Sophea Kim",
    email: "sophea.kim@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-007",
    name: "Dara Meas",
    email: "dara.meas@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Exempt",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-008",
    name: "Sothea Chan",
    email: "sothea.chan@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-009",
    name: "Chenda Vong",
    email: "chenda.vong@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-010",
    name: "Pisach Heng",
    email: "pisach.heng@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-011",
    name: "Kannitha Sor",
    email: "kannitha.sor@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-012",
    name: "Thyda Ouk",
    email: "thyda.ouk@example.com",
    major: "Business Intelligence",
    department: "Business",
    room: "Lab Room 101",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-013",
    name: "Seanghai Chhim",
    email: "seanghai.chhim@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-014",
    name: "Monirath Pen",
    email: "monirath.pen@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-015",
    name: "Sokunthea Khiev",
    email: "sokunthea.khiev@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-016",
    name: "Chamreun Ros",
    email: "chamreun.ros@example.com",
    major: "Business Intelligence",
    department: "Business",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-017",
    name: "Pisey Nov",
    email: "pisey.nov@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-018",
    name: "Daravuth Mam",
    email: "daravuth.mam@example.com",
    major: "Software Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Exempt",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-019",
    name: "Raksmey Tith",
    email: "raksmey.tith@example.com",
    major: "Cyber Security",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-020",
    name: "Sopheap Lim",
    email: "sopheap.lim@example.com",
    major: "Business Intelligence",
    department: "Business",
    room: "Exam Hall A",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-021",
    name: "Visal Keo",
    email: "visal.keo@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-022",
    name: "Sambath Chhorn",
    email: "sambath.chhorn@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-023",
    name: "Rithea San",
    email: "rithea.san@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-024",
    name: "Vichet Soy",
    email: "vichet.soy@example.com",
    major: "Robotics and Automation Engineering",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-025",
    name: "Sreyleak Nhem",
    email: "sreyleak.nhem@example.com",
    major: "Data Science and Artificial Intelligence",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-026",
    name: "Kakada Bun",
    email: "kakada.bun@example.com",
    major: "Data Science and Artificial Intelligence",
    department: "Engineering",
    room: "Exam Hall A",
    mathStatus: "Exempt",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-027",
    name: "Phearum Kong",
    email: "phearum.kong@example.com",
    major: "Data Science and Artificial Intelligence",
    department: "Engineering",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-028",
    name: "Kimheng Yim",
    email: "kimheng.yim@example.com",
    major: "Data Science and Artificial Intelligence",
    department: "Engineering",
    room: "Lab Room 101",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-029",
    name: "Seyha Hour",
    email: "seyha.hour@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-030",
    name: "Leap Chhay",
    email: "leap.chhay@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-031",
    name: "Sreyneth Chhoun",
    email: "sreyneth.chhoun@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Lab Room 101",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-032",
    name: "Bunthoeun Thach",
    email: "bunthoeun.thach@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-033",
    name: "Seyma Yin",
    email: "seyma.yin@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Exam Hall B",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-034",
    name: "Sinat Hem",
    email: "sinat.hem@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Lab Room 101",
    mathStatus: "Exempt",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-035",
    name: "Sreychea Uch",
    email: "sreychea.uch@example.com",
    major: "Interior Design",
    department: "Architecture",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-036",
    name: "Vannak Phan",
    email: "vannak.phan@example.com",
    major: "Architecture",
    department: "Architecture",
    room: "Exam Hall B",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-037",
    name: "Sokha Tuy",
    email: "sokha.tuy@example.com",
    major: "Architecture",
    department: "Architecture",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Exempt"
  },
  {
    id: "SP-2025-038",
    name: "Rotha Pov",
    email: "rotha.pov@example.com",
    major: "Architecture",
    department: "Architecture",
    room: "Exam Hall A",
    mathStatus: "Required",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-039",
    name: "Sethea Eang",
    email: "sethea.eang@example.com",
    major: "Architecture",
    department: "Architecture",
    room: "Exam Hall B",
    mathStatus: "Exempt",
    englishStatus: "Required"
  },
  {
    id: "SP-2025-040",
    name: "Reachea Chum",
    email: "reachea.chum@example.com",
    major: "Architecture",
    department: "Architecture",
    room: "Lab Room 101",
    mathStatus: "Required",
    englishStatus: "Exempt"
  }
]

// Room information lookup
export const roomInfo = {
  "Exam Hall A": { location: "Building A, 1st Floor", capacity: 50 },
  "Exam Hall B": { location: "Building A, 2nd Floor", capacity: 30 },
  "Lab Room 101": { location: "Building B, Ground Floor", capacity: 25 }
} as const

export function getRoomInfo(roomName: string) {
  return roomInfo[roomName as keyof typeof roomInfo] || { location: "Unknown", capacity: 0 }
}

export function getStudentsForTimeSlot(timeSlot: TimeSlot, students: Student[] = mockStudents) {
  return students.filter(student => student.room === timeSlot.room)
}
