import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { ProductTable } from "@/components/products/product-table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAuth();

  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      brands: { orderBy: { name: "asc" } },
    },
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { brand: { categoryId: category.id } },
    include: { brand: { include: { category: true } }, documents: true },
    orderBy: { name: "asc" },
  });

  const allCategories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const productRows = products.map((p) => ({
    ...p,
    brand: {
      name: p.brand.name,
      category: { name: p.brand.category.name, slug: p.brand.category.slug },
    },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/categories" className="hover:text-foreground">
          Categories
        </Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <div className="mt-2 flex gap-2">
            {category.brands.map((b) => (
              <Badge key={b.id} variant="outline">{b.name}</Badge>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <ProductTable
        products={productRows}
        categories={allCategories.map((c) => ({ name: c.name, slug: c.slug }))}
      />
    </div>
  );
}
