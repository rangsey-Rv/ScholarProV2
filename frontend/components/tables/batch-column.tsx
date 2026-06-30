"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { BatchMenu } from "./table-menu";
import { BatchStatus } from "@/constants/enum";

import { formatDate } from "@/lib/utils/helper";

export const BatchColumns: ColumnDef<BatchData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="text-white"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "batchName",
    header: "Name",
  },

  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const startDate = row.getValue("startDate") as string;
      return formatDate(startDate);
    },
  },
  {
    accessorKey: "endDate",

    header: "End Date",
    cell: ({ row }) => {
      const endDate = row.getValue("endDate") as string;
      return formatDate(endDate);
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as BatchStatus;
      return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
    },
  },

  {
    id: "actions",
    enableHiding: true,
    meta: {
      isSticky: true,
    },
    cell: ({ row }) => {
      return (
        // <TableMenu
        //   id={row.original.id}
        //   invalidateKey={QUERY_KEY_ENUM.BATCHES}
        //   deleteEndpoint="/batches"
        //   editPath="batch"
        // />

        <BatchMenu id={row.original.id} editPath="batch" />
      );
    },
  },
];
const getStatusVariant = (status: BatchStatus) => {
  const lowercaseStatus = status.toLowerCase();
  if (lowercaseStatus === "active") return "approve";
  if (lowercaseStatus === "closed") return "reject";
  if (lowercaseStatus === "cancelled") return "warning";

  return "approve";
};
