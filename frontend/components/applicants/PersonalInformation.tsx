import { Separator } from "@/components/ui/separator";
import { Section, Field } from "./Section";

interface PersonalInfoProps {
  name: string;
  nameKh: string;
  nationality: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  address: string;
  phone: string;
  email: string;
}

export function PersonalInformation({ data }: { data: PersonalInfoProps }) {
  return (
    <>
      <Section title="Personal Information" defaultOpen>
        <Field label="Full Name (EN)" value={data.name} bold />
        <Field label="Full Name (KH)" value={data.nameKh} />
        <Field label="Nationality" value={data.nationality} />
        <Field label="Gender" value={data.gender} />
        <Field label="Date of Birth" value={data.dateOfBirth} />
        <Field label="Place of Birth" value={data.placeOfBirth} />
        <Field label="Country" value={data.country} />
        <Field label="Address" value={data.address} span2 />
        <Field label="Phone" value={data.phone} />
        <Field label="Email" value={data.email} />
      </Section>
      <Separator />
    </>
  );
}
