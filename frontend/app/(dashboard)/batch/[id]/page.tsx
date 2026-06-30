"use client";

import { EditBatch } from "@/components/batch/edit-batch";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY_ENUM } from "@/constants/query-key-enum";

export default function EditBatchPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);

  const batchId = params.id as string;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Navigate back to batch list when dialog closes
      router.push("/batch");
    }
  };

  const handleBatchUpdated = () => {
    // Invalidate and refetch batch list
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.BATCHES] });
  };

  useEffect(() => {
    setIsOpen(true);
  }, [batchId]);

  return (
    <EditBatch
      open={isOpen}
      onOpenChange={handleOpenChange}
      batchId={batchId}
      onBatchUpdated={handleBatchUpdated}
    />
  );
}
