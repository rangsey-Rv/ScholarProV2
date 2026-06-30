import { Separator } from "@/components/ui/separator";
import { Section, Field } from "./Section";

interface ParentGuardianProps {
  guardianName: string;
  relationship: string;
  guardianNationality: string;
  guardianOccupation: string;
  guardianPhone: string;
  guardianAddress: string;
}

export function ParentGuardianInfo({ data }: { data: ParentGuardianProps }) {
  return (
    <>
      <Section title="Parent/Guardian Details" defaultOpen={false}>
        <Field label="Name" value={data.guardianName} />
        <Field label="Relationship" value={data.relationship} />
        <Field label="Nationality" value={data.guardianNationality} />
        <Field label="Occupation" value={data.guardianOccupation} />
        <Field label="Phone" value={data.guardianPhone} />
        <Field label="Address" value={data.guardianAddress} span2 />
      </Section>
      <Separator />
    </>
  );
}
