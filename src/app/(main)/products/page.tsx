export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ProductTable } from "@/components/products/product-table";
import { requireAuth } from "@/lib/auth-helpers";

export default async function ProductsPage() {
  await requireAuth();

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Browse and filter the complete Versalis styrenics product portfolio
        </p>
      </div>
      <ProductTable products={productRows} categories={categoryOptions} />
    </div>
  );
}
