import StudentExamPanel from "@/components/applicant-portal/student-portal/StudentExamPanel";
import TitleSetter from "@/components/header/tittle-setter";

export default function ApplicantExamPage() {
  return (
    <>
      <TitleSetter title="Exam & Schedule" />
      <StudentExamPanel />
    </>
  );
}
