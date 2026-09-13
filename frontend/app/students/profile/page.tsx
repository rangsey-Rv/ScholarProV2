import StudentProfilePanel from "@/components/applicant-portal/student-portal/StudentProfilePanel";
import TitleSetter from "@/components/header/tittle-setter";

export default function ApplicantProfilePage() {
  return (
    <>
      <TitleSetter title="Profile" />
      <StudentProfilePanel />
    </>
  );
}
