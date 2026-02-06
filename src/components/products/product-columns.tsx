"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PROPERTY_LABELS } from "@/lib/constants";
import { formatFloat } from "@/lib/utils";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  brand: {
    name: string;
    category: { name: string; slug: string };
  };
  vicatSofteningTemp: number | null;
  vicatTemp: number | null;
  vicatATemp: number | null;
  vicatB120Temp: number | null;
  mfi220_10: number | null;
  mfi200_5: number | null;
  mfi260_5: number | null;
  izodImpact: number | null;
  charpyImpact: number | null;
  particleSizeRange: string | null;
  blowingAgent: string | null;
  densityRange: string | null;
  mainApplications: string | null;
};

function sortableHeader(column: any, label: string) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {label}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );
}

export const baseColumns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => sortableHeader(column, "Product"),
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.slug}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    id: "brand",
    accessorFn: (row) => row.brand.name,
    header: ({ column }) => sortableHeader(column, "Brand"),
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.brand.name}</Badge>
    ),
  },
  {
    id: "category",
    accessorFn: (row) => row.brand.category.name,
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.brand.category.name}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type / Description",
    cell: ({ row }) => (
      <span className="text-sm max-w-[300px] truncate block">
        {row.getValue("type") ?? "—"}
      </span>
    ),
  },
];

// Dynamic property columns
export function createPropertyColumn(
  key: string
): ColumnDef<ProductRow> {
  const label = PROPERTY_LABELS[key] || key;
  const isNumeric = !["particleSizeRange", "blowingAgent", "densityRange"].includes(key);

  return {
    accessorKey: key,
    header: ({ column }) => sortableHeader(column, label),
    cell: ({ row }) => {
      const value = row.getValue(key);
      if (value == null) return <span className="text-muted-foreground">—</span>;
      if (isNumeric) return formatFloat(value as number);
      return String(value);
    },
  };
}

export const applicationsColumn: ColumnDef<ProductRow> = {
  accessorKey: "mainApplications",
  header: "Main Applications",
  cell: ({ row }) => {
    const value = row.getValue("mainApplications") as string | null;
    if (!value) return <span className="text-muted-foreground">—</span>;
    return (
      <span className="text-sm max-w-[400px] truncate block" title={value}>
        {value}
      </span>
    );
  },
};
