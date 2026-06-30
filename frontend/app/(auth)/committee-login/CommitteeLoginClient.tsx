"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormInput from "../../../components/common/form-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import Image from "next/image";
import { committeeAcceptSchema } from "@/lib/schema/comittee-login-schema";
import { authService } from "@/api/service/auth.service";
import { toast } from "sonner";

type CommitteeAcceptSchemaProps = z.infer<typeof committeeAcceptSchema>;

export default function CommitteeLoginClient() {
  const searchParams = useSearchParams();
  const [rememberMe, setRememberMe] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null);

  const acceptForm = useForm<CommitteeAcceptSchemaProps>({
    mode: "onSubmit",
    resolver: zodResolver(committeeAcceptSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: CommitteeAcceptSchemaProps) => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id || !token) {
      toast.error("Missing invite token");
      return;
    }

    const res = await authService.registerWithInvite(
      id,
      token,
      values.email,
      values.password,
    );

    if (!res.success) {
      toast.error("Registration failed");
      return;
    }

    toast.success("Account created! Please login.");
    window.location.href = "/login";
  };

  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id || !token) {
      setIsValidInvite(false);
      return;
    }

    setValidating(true);

    authService
      .validateInvite(id, token)
      .then((res) => {
        if (res.success && res.email) {
          acceptForm.setValue("email", res.email);
          setIsValidInvite(true);
        } else {
          setIsValidInvite(false);
          toast.error("Invalid or expired invite link");
        }
      })
      .catch(() => {
        setIsValidInvite(false);
        toast.error("Invalid or expired invite link");
      })
      .finally(() => setValidating(false));
  }, [searchParams, acceptForm]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Image Section - Hidden on mobile */}
      <div className="hidden md:flex md:col-span-1 items-center justify-center">
        <Image src="/login.png" alt="Login visual" width={466} height={464} />
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[400px] mx-auto">
          <p className="text-2xl font-bold mt-4">Welcome To ScholarPro!</p>
          <p className="text-base font-light mb-10">
            Set up your password to accept the invitation
          </p>

          <Form {...acceptForm}>
            <form
              onSubmit={acceptForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormInput
                control={acceptForm.control}
                name="email"
                label="Email"
                disabled
              />

              <FormInput
                control={acceptForm.control}
                name="password"
                label="New Password"
                type="password"
              />

              <FormInput
                control={acceptForm.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                />
                <Label>I agree to the terms and conditions</Label>
              </div>

              <Button
                type="submit"
                className="w-full text-white"
                disabled={validating || isValidInvite === false}
              >
                {validating ? "Validating..." : "Accept Invitation"}
              </Button>

              {isValidInvite === false && (
                <p className="text-sm text-red-500">
                  This invite link is invalid or expired.
                </p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
