import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Layers } from "lucide-react";

export default async function CategoriesPage() {
  await requireAuth();

  const categories = await prisma.category.findMany({
    include: {
      brands: {
        include: { _count: { select: { products: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Styrenics product categories and brands
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const totalProducts = category.brands.reduce(
            (sum, b) => sum + b._count.products,
            0
          );
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Layers className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {totalProducts} products
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.brands.map((brand) => (
                      <Badge key={brand.id} variant="outline">
                        {brand.name} ({brand._count.products})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
