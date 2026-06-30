"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  parentsSchema,
  type ParentsValues,
} from "@/lib/schema/application-schema";
import type { ParentsData } from "@/types/application";
import {
  SectionHeader,
  RequiredMark,
  StepNavigation,
} from "./PersonalInfoStep";

const RELATIONSHIPS = [
  "Father",
  "Mother",
  "Sister",
  "Brother",
  "Aunt",
  "Uncle",
  "Grandmother",
  "Grandfather",
  "Other",
];

interface ParentsGuardiansStepProps {
  defaultValues: ParentsData;
  onNext: (data: ParentsData) => void;
  onBack: () => void;
}

export default function ParentsGuardiansStep({
  defaultValues,
  onNext,
  onBack,
}: ParentsGuardiansStepProps) {
  const form = useForm<ParentsValues>({
    resolver: zodResolver(parentsSchema),
    defaultValues: {
      name: defaultValues.name,
      relationship: defaultValues.relationship,
      nationality: defaultValues.nationality,
      currentAddress: defaultValues.currentAddress,
      jobPosition: defaultValues.jobPosition,
      phoneNumber: defaultValues.phoneNumber,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onNext(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-0">
        <SectionHeader
          title="Section 2: Parents/Guardians Details"
          subtitle="Please fill in the information below"
        />

        <div className="px-4 sm:px-8 py-6 space-y-6">
          {/* Parent/Guardian Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Parent/Guardian&apos;s name <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your answer"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Relationship */}
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Relationship to you <RequiredMark />
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
                    {RELATIONSHIPS.map((r) => (
                      <div key={r} className="flex items-center space-x-2">
                        <RadioGroupItem value={r} id={`rel-${r}`} />
                        <Label
                          htmlFor={`rel-${r}`}
                          className="cursor-pointer font-normal text-sm"
                        >
                          {r}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nationality */}
          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nationality <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your answer"
                    className="max-w-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Address */}
          <FormField
            control={form.control}
            name="currentAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Parent/Guardian Current Address <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Your answer" rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Position & Phone */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="jobPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Position <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your answer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <RequiredMark />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your answer" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <StepNavigation showBack onBack={onBack} />
      </form>
    </Form>
  );
}
