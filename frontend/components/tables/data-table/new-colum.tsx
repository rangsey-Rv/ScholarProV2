//new column

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StudentStatus } from "@/constants/enum";

const StatusBadge = ({
  status,
  student,
}: {
  status: StudentStatus;
  student?: Student;
}) => {
  const statusConfig = {
    // "new-applicant": {
    //   label: "New Applicant",
    //   variant: "default" as const,
    //   className: "text-white",
    // },
    shortlisted: {
      label: "Shortlisted",
      variant: "outline" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
    graded: {
      label: "Graded",
      variant: "outline" as const,
      className: "bg-blue-100 text-blue-700 border-blue-300",
    },
    accepted: {
      label: "Accepted",
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
    rejected: {
      label: "Rejected",
      variant: "outline" as const,
      className: "bg-red-100 text-red-700 border-red-300",
    },
    submitted: {
      label: "Submitted",
      variant: "outline" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
    accepted_email_sent: {
      label: "Accepted Email",
      variant: "default" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
    shortlisted_email_sent: {
      label: "Shortlisted Email ",
      variant: "outline" as const,
      className: "bg-green-100 text-green-700 border-green-300",
    },
  };

  const config = statusConfig[status];

  // If the original status from API is "submitted", display that instead
  let displayLabel = config.label;
  if (
    // status === "new-applicant" &&
    student?.originalStatus?.toLowerCase() === "submitted"
  ) {
    displayLabel = "Submitted";
  }

  return (
    <Badge
      variant={config.variant}
      className={`whitespace-nowrap ${config.className}`}
    >
      {displayLabel}
    </Badge>
  );
};

// Base columns that are common across all table variants
export const baseStudentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("number")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "nameEn",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        NameEn
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div
          onClick={() => router.push(`/applicant/${row.original.id}`)}
          className="font-medium text-primary  cursor-pointer hover:underline"
        >
          {row.getValue("nameEn")}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Gender
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Email
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "major",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Major
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("major")}</div>,
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Province
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => (
  //     <div
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       className="flex items-center cursor-pointer text-white font-medium"
  //     >
  //       Email
  //       <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
  //     </div>
  //   ),
  //   cell: ({ row }) => <div>{row.getValue("email")}</div>,
  // },

  {
    accessorKey: "dateApplied",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Date Applied
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("dateApplied") as Date;
      try {
        const validDate = new Date(date);
        if (isNaN(validDate.getTime())) {
          return <div>-</div>;
        }
        return <div>{format(validDate, "dd/MM/yyyy")}</div>;
      } catch {
        return <div>-</div>;
      }
    },
  },
];

// Evaluation score column - shows interview evaluation total
export const evaluationColumn: ColumnDef<Student> = {
  id: "evaluation",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Evaluation
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  // cell: ({ row }) => {
  //   const student = row.original;
  //   const evaluation = student.evaluation;

  //   if (!evaluation || !evaluation.totalScore) {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Badge variant="outline" className="text-gray-400">
  //           Not Evaluated
  //         </Badge>
  //       </div>
  //     );
  //   }

  cell: ({ row }) => {
    return (
      <div className="font-semibold">
        {row.original.evaluation?.totalScore || "-"}
      </div>
    );

    // Color based on score
    // const score = evaluation.totalScore;
    // let colorClass = "bg-red-100 text-red-700 border-red-300";
    // if (score >= 80)
    //   colorClass = "bg-green-100 text-green-700 border-green-300";
    // else if (score >= 60)
    //   colorClass = "bg-blue-100 text-blue-700 border-blue-300";
    // else if (score >= 40)
    //   colorClass = "bg-yellow-100 text-yellow-700 border-yellow-300";

    // return (
    //   <div className="flex items-center gap-2">
    //     <Badge variant="outline" className={`${colorClass} font-semibold`}>
    //       {score}/100
    //     </Badge>
    //   </div>
    // );
  },
  sortingFn: (rowA, rowB) => {
    const scoreA = rowA.original.evaluation?.totalScore || 0;
    const scoreB = rowB.original.evaluation?.totalScore || 0;
    return scoreA - scoreB;
  },
};

// Status column for tables that need it
export const statusColumn: ColumnDef<Student> = {
  accessorKey: "status",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Status
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  cell: ({ row }) => {
    const status = row.getValue("status") as StudentStatus;
    return <StatusBadge status={status} student={row.original} />;
  },
};

const ActionsCell: React.FC<{ student: Student }> = ({ student }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/applicant/${student.id}`)}
        >
          View details
        </DropdownMenuItem>

        {/* <DropdownMenuItem className="text-destructive">
          Delete student
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const actionsColumn: ColumnDef<Student> = {
  id: "actions",
  enableHiding: true,
  cell: ({ row }) => <ActionsCell student={row.original} />,
};

// Actions column for Result/Exam tab with scholarship award options
export const examActionsColumn: ColumnDef<Student> = {
  id: "actions",
  enableHiding: true,
  meta: {
    isSticky: true,
  },
  cell: ({ row }) => {
    const student = row.original;
    return <ExamActionsCell student={student} />;
  },
};

const ExamActionsCell: React.FC<{ student: Student }> = ({ student }) => {
  const router = useRouter();

  const handleScholarshipAward = async (percentage: number) => {
    // Calculate award amount (3000 = 100%)
    const awardAmount = (percentage / 100) * 3000;

    try {
      // TODO: Call your API endpoint to update scholarship award
      // Example: await updateScholarshipAward(student.id, { awardAmount, status: 'awarded' })

      console.log(
        `Awarding ${percentage}% scholarship to student ${student.id}`,
      );
      console.log(`Award amount: $${awardAmount}`);
    } catch (error) {
      console.error("Error updating scholarship:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/applicant/${student.id}`)}
        >
          View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Award Scholarship</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => handleScholarshipAward(100)}>
          Award 100% ($16000)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleScholarshipAward(75)}>
          Award 75% ($12,000)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleScholarshipAward(50)}>
          Award 50% ($8,000)
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleScholarshipAward(25)}>
          Award 25% ($4,000)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Core columns without Province for most tables
export const coreStudentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => (
      <div className="font-medium"> {row.getValue("number")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "nameEn",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        NameEn
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div
          onClick={() => router.push(`/applicant/${row.original.id}`)}
          className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
        >
          {row.getValue("nameEn")}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Gender
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "major",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Major
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("major")}</div>,
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Email
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },

  {
    accessorKey: "province",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Province
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("province")}</div>,
  },

  {
    accessorKey: "requestTerm",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Request Term
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),

    cell: ({ row }) => {
      const date = row.getValue("requestTerm") as Date;
      try {
        const validDate = new Date(date);
        if (isNaN(validDate.getTime())) {
          return <div>-</div>;
        }
        return <div>{format(validDate, "dd/MM/yyyy")}</div>;
      } catch {
        return <div>-</div>;
      }
    },
    // cell: ({ row }) => <div>{row.getValue("requestTerm")}</div>,
  },

  {
    accessorKey: "overAllGrade",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Overall Grade
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("overAllGrade")}</div>,
  },

  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <div
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center cursor-pointer text-white font-medium"
      >
        Phone Number
        <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
  },

  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <div
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       className="flex items-center cursor-pointer text-white font-medium"
  //     >
  //       Status
  //       <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
  //     </div>
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.getValue("status") as StudentStatus;
  //     return <StatusBadge status={status} student={row.original} />;
  //   },
  // },
];

// Date Applied column
export const dateAppliedColumn: ColumnDef<Student> = {
  accessorKey: "dateApplied",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Date Applied
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  cell: ({ row }) => {
    const date = row.getValue("dateApplied") as Date;
    try {
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        return <div>-</div>;
      }
      return <div>{format(validDate, "dd/MM/yyyy")}</div>;
    } catch {
      return <div>-</div>;
    }
  },
};

// Exam Score column (renamed from Exam Date) for Awards and Rejected tabs
export const examDateColumn: ColumnDef<Student> = {
  accessorKey: "interviewDate",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Exam Score
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  cell: ({ row }) => {
    const date = row.getValue("interviewDate") as Date;
    if (!date) return <div>-</div>;
    try {
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        return <div>-</div>;
      }
      return <div>{format(validDate, "dd/MM/yyyy")}</div>;
    } catch {
      return <div>-</div>;
    }
  },
};

// Exam Score column for Result tab (exam-scheduled) - fetches total from student data
export const examScoreColumn: ColumnDef<Student> = {
  id: "totalScore",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Exam Score
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  // cell: ({ row }) => {
  //   const student = row.original;
  //   const mathScore = student.mathScore || 0;
  //   const englishScore = student.englishScore || 0;
  //   const total = mathScore + englishScore;
  //   return total > 0 ? (
  //     <div className="font-semibold">{total}</div>
  //   ) : (
  //     <div>-</div>
  //   );
  // },

  cell: ({ row }) => {
    return (
      <div className="font-semibold">{row.original.totalApplicationScore}</div>
    );
  },

  sortingFn: (rowA, rowB) => {
    const getTotalA = rowA.original.totalApplicationScore || 0;
    const getTotalB = rowB.original.totalApplicationScore || 0;
    return getTotalA - getTotalB;
  },
};

// Scholarship % column for Awards tab
export const scholarshipColumn: ColumnDef<Student> = {
  accessorKey: "scholarshipPercentage",
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center cursor-pointer text-white font-medium"
    >
      Scholarship
      <ChevronsUpDown className="ml-2 h-4 w-4 text-white" />
    </div>
  ),
  cell: ({ row }) => {
    const amount = row.original.scholarshipPercentage as number;

    return <div>{amount}%</div>;
  },
};

// Specific column combinations for different table types matching UI
// export const newApplicantColumns: ColumnDef<Student>[] = [
//   ...coreStudentColumns, // All core columns including new fields
//   dateAppliedColumn,
//   actionsColumn,
// ];

export const scoreColumn: ColumnDef<Student>[] = [
  {
    id: "mathScore",
    header: "Math",
    cell: ({ row }) => {
      const student = row.original;
      const mathSubject = student.subjects?.find(
        (s) => s.subjectName === "Math",
      );
      return (
        <div className="font-medium">{mathSubject?.totalScore ?? "-"}</div>
      );
    },
    enableSorting: false,
  },

  {
    id: "englishScore",
    header: "English",
    cell: ({ row }) => {
      const student = row.original;
      const englishSubject = student.subjects?.find(
        (s) => s.subjectName === "English",
      );
      return (
        <div className="font-medium">{englishSubject?.totalScore ?? "-"}</div>
      );
    },
    enableSorting: false,
  },

  {
    id: "interviewScore",
    header: "Interview",
    cell: ({ row }) => {
      const student = row.original;
      const interviewSubject = student.subjects?.find(
        (s) => s.subjectName === "Interview",
      );
      return (
        <div className="font-medium">{interviewSubject?.totalScore ?? "-"}</div>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "totalApplicationScore",
    header: "Total score",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("totalApplicationScore") ?? "-"}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("rank") ?? "-"}</div>
    ),
    enableSorting: false,
  },
];

export const sumittedColumns: ColumnDef<Student>[] = [
  ...coreStudentColumns, // All core columns including new fields
  dateAppliedColumn,

  statusColumn,
  actionsColumn,
];

export const shortlistedColumns: ColumnDef<Student>[] = [
  ...coreStudentColumns, // Number, Name, Gender, Major, Email
  dateAppliedColumn,
  statusColumn,
  actionsColumn,
];

export const examColumns: ColumnDef<Student>[] = [
  ...coreStudentColumns, // All core columns including new fields
  ...scoreColumn,
  // Show interview evaluation score
  // Use regular actions column (View details, Send email, Delete)
  statusColumn,
  actionsColumn,
];

export const awardedColumns: ColumnDef<Student>[] = [
  ...coreStudentColumns, // Number, Name, Gender, Major, Email
  scholarshipColumn,

  statusColumn,

  actionsColumn,
];

export const rejectedColumns: ColumnDef<Student>[] = [
  ...coreStudentColumns, // Number, Name, Gender, Major, Email
  statusColumn,
  actionsColumn,
];

// Helper function to get columns based on table type
export const getColumnsForTableType = (
  type: StudentStatus | "all",
): ColumnDef<Student>[] => {
  switch (type) {
    case "submitted":
      return sumittedColumns;
    case "shortlisted":
      return shortlistedColumns;
    case "graded":
      return examColumns;
    case "accepted":
      return awardedColumns;
    case "rejected":
      return rejectedColumns;
    case "all":
    default:
      // For "all" view, show all columns except status (since it would be mixed)
      return [...baseStudentColumns, actionsColumn];
  }
};
