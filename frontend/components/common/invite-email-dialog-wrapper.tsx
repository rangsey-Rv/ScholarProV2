"use client";

import { API_ENDPOINTS } from "@/api/endpoint";
import InviteDialog from "./invite-email-dialog";
import type { ReactNode } from "react";
import { apiClient } from "@/api/api";
import { toast } from "sonner";

interface InviteDialogWrapperProps {
  title?: string;
  nameLabel?: string;
  emailLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonText?: ReactNode;
  confirmText?: string;
  roleOptions?: { label: string; value: string }[];
  onSubmit?: (data: {
    name: string;
    email: string;
    role?: string;
  }) => Promise<void> | void;
}

export default function InviteDialogWrapper(props: InviteDialogWrapperProps) {
  const handleSubmit = async ({
    name,
    email,
    role,
  }: {
    name: string;
    email: string;
    role?: string;
  }) => {
    try {
      console.log("Inviting:", name, email, role);

      // Send proper axios payload
      await apiClient.post(API_ENDPOINTS.INVITE, {
        name,
        email,
        role,
      });

      // Also trigger callback if provided
      if (props.onSubmit) {
        await props.onSubmit({ name, email, role });
        toast.success("Invite sent successfully");
      }
    } catch (err) {
      console.error("Invite failed", err);
      toast.error("Failed to send invite");
    }
  };

  return <InviteDialog {...props} onSubmit={handleSubmit} />;
}
