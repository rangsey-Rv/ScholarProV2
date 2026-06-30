import { Separator } from "@/components/ui/separator";
import { GraduationCap } from "lucide-react";
import { Section, Field } from "./Section";

interface EducationalBackgroundProps {
  educationLevel: string;
  institutionName: string;
  major: string;
  currentYear: string;
  academicYear: string;
  highSchool: string;
  highSchoolLocation: string;
  highSchoolYear: string;
  overallGrade: string;
  mathGrade: string;
  englishGrade: string;
  hasEnglishCertificate: string;
  ielts: string;
  toefl: string;
}

export function EducationalBackground({
  data,
}: {
  data: EducationalBackgroundProps;
}) {
  return (
    <>
      <Section title="Educational Background" defaultOpen={false}>
        {/* High School */}
        <div className="col-span-3 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-black" />
            <span className="font-medium text-sm">High School</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <Field label="School Name" value={data.highSchool} />
            <Field label="Location" value={data.highSchoolLocation} />
            <Field label="Academic Year" value={data.highSchoolYear} />
            <Field label="Overall Grade" value={data.overallGrade} />
            <Field label="Math Grade" value={data.mathGrade} />
            <Field label="English Grade" value={data.englishGrade} />
          </div>
        </div>

        {/* Current Education Level */}
        <div className="col-span-3 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-black" />
            <span className="font-medium text-sm">Current Education</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <Field label="Level" value={data.educationLevel} />
            <Field label="Institution" value={data.institutionName} />
            <Field label="Major" value={data.major} />
            <Field label="Current Year" value={data.currentYear} />
            <Field label="Academic Year" value={data.currentYear} />
          </div>
        </div>

        {/* English Proficiency */}
        <div className="col-span-3 mt-4">
          <div className="mb-3">
            <span className="font-medium text-sm">English Proficiency</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pl-6">
            <Field label="Has Certificate" value={data.hasEnglishCertificate} />
            <Field label="IELTS" value={data.ielts} />
            <Field label="TOEFL" value={data.toefl} />
          </div>
        </div>
      </Section>
      <Separator />
    </>
  );
}
