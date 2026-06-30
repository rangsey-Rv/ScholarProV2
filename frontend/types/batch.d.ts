export interface Batch {
  id: number;
  batchName: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  status: "active" | "inactive" | "closed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface BatchResponse {
  batches: Batch[];
}
