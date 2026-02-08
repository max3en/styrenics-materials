export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProductTable } from "@/components/products/product-table";
import { requireAuth } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const session = await auth();
  await requireAuth();

  const canEdit = session?.user?.role !== "VIEWER";

  const [products, categories] = await Promise.all([

    prisma.product.findMany({
      include: { brand: { include: { category: true } }, documents: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const productRows = products.map((p) => ({
    ...p,
    brand: {
      name: p.brand.name,
      category: { name: p.brand.category.name, slug: p.brand.category.slug },
    },
  }));

  const categoryOptions = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-muted-foreground font-medium">
            Browse and filter the complete Versalis styrenics product portfolio
          </p>
        </div>
        {canEdit && (
          <Button asChild className="rounded-2xl h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Link href="/products/new">
              <Plus className="mr-2 h-5 w-5" />
              Add Material
            </Link>
          </Button>
        )}
      </div>
      <ProductTable
        products={productRows}
        categories={categoryOptions}
        canEdit={canEdit}
      />
    </div>
  );

}
