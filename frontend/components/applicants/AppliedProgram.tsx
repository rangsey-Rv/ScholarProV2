import { Separator } from "@/components/ui/separator";
import { Section, Field } from "./Section";

interface AppliedProgramProps {
  program: string;
  scholarship: string;
  requestedTerm: string;
  considerNextIntake: string;
  source: string;
}

export function AppliedProgram({ data }: { data: AppliedProgramProps }) {
  return (
    <>
      <Section title="Applied Program" defaultOpen={false}>
        <Field label="Interest Program" value={data.program} />
        <Field label="Applying Scholarship" value={data.scholarship} />
        <Field label="Requested Term" value={data.requestedTerm} />
        <Field label="Consider Next Intake" value={data.considerNextIntake} />
        <Field label="Referral Source" value={data.source} />
      </Section>
      <Separator />
    </>
  );
}
