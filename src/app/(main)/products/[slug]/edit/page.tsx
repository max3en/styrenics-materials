import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { ProductForm } from "@/components/products/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole("EDITOR");

  const { slug } = await params;
  const [product, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: { brand: { include: { category: true } } },
    }),
    prisma.brand.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update {product.name}</p>
      </div>
      <ProductForm product={product} brands={brands} />
    </div>
  );
}
