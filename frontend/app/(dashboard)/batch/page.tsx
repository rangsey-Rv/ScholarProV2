"use client";

import BatchListClient from "@/components/batch/batch-list";
import { NewBatch } from "@/components/batch/new-batch";
import { useHeader } from "@/components/header/header-context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Batch() {
  const { setTitle } = useHeader();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleBatchCreated = () => {
    console.log("✅ Batch created - refreshing data");
  };

  useEffect(() => {
    setTitle("Batch Management");
  }, [setTitle]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex flex-row gap-2 items-center mb-4 mt-4">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white"
        >
          <Plus size={16} className="mr-2" />
          New Batch
        </Button>

        <NewBatch
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onBatchCreated={handleBatchCreated}
        />
      </div>

      <BatchListClient />
    </div>
  );
}
