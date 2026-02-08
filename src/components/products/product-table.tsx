"use client";

import { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLUMNS } from "@/lib/constants";
import {
  baseColumns,
  createPropertyColumn,
  applicationsColumn,
  ProductRow,
} from "./product-columns";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Package, ArrowUpDown, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductTableProps {
  products: ProductRow[];
  categories: { name: string; slug: string }[];
  canEdit: boolean;
}

export function ProductTable({ products, categories, canEdit }: ProductTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");

      toast.success(`${deletingName} deleted successfully`);
      router.refresh();
    } catch (err) {
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "all") return products;
    return products.filter(
      (p) => p.brand.category.slug === categoryFilter
    );
  }, [products, categoryFilter]);

  const columns = useMemo(() => {
    const cols: ColumnDef<ProductRow>[] = [...baseColumns];

    if (categoryFilter !== "all" && CATEGORY_COLUMNS[categoryFilter]) {
      const propKeys = CATEGORY_COLUMNS[categoryFilter];
      propKeys.forEach((key) => {
        cols.push(createPropertyColumn(key));
      });
    }

    cols.push(applicationsColumn);

    if (canEdit) {
      cols.push(
        require("./product-columns").createActionsColumn(
          (id: string, name: string) => {
            setDeletingId(id);
            setDeletingName(name);
          },
          canEdit
        )
      );
    }

    return cols;
  }, [categoryFilter, canEdit]);

  const table = useReactTable({
    data: filteredProducts,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card className="border-none shadow-lg bg-white/5 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search products by name, grade or properties..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-11 h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-2xl border border-white/10">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category:</span>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px] h-12 bg-white/5 border-white/10 rounded-2xl font-semibold">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-none shadow-2xl overflow-hidden bg-white/5 backdrop-blur-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-white/10">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-14 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group border-white/5 hover:bg-white/5 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4 font-medium">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8 mb-2 opacity-20" />
                      <p>No products match your search criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
          <p className="text-sm font-medium text-muted-foreground">
            Showing <span className="text-foreground">{table.getFilteredRowModel().rows.length}</span> materials
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className="text-muted-foreground">Page</span>
              <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span>
              <span className="text-muted-foreground">of</span>
              <span className="text-foreground">{table.getPageCount()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="rounded-2xl border-white/10 bg-background/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deletingName}</strong> and all associated documents.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Grade"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
