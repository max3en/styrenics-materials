export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Layers, ArrowRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Material Categories
        </h1>
        <p className="text-muted-foreground text-lg">
          Browse the complete Versalis styrenics portfolio by product family
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const totalProducts = category.brands.reduce(
            (sum, b) => sum + b._count.products,
            0
          );
          return (
            <Link key={category.id} href={`/categories/${category.slug}`} className="group">
              <Card className="h-full border-none shadow-xl bg-white/5 backdrop-blur-md transition-all duration-300 group-hover:bg-white/10 group-hover:-translate-y-1 group-hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{category.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Package className="h-3 w-3" />
                      {totalProducts} materials total
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.brands.map((brand) => (
                      <Badge
                        key={brand.id}
                        variant="outline"
                        className="px-2 py-0.5 rounded-lg border-white/10 bg-white/5 group-hover:border-primary/20 transition-colors"
                      >
                        {brand.name}
                        <span className="ml-1.5 opacity-40 font-normal">{brand._count.products}</span>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                    Explore Category <ArrowRight className="ml-2 h-3 w-3" />
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
