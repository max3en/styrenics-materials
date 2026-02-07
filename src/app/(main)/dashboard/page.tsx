export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Layers, FileText, Users, ArrowUpRight, TrendingUp, Clock, Box } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
  const [productCount, categoryCount, documentCount, brandCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.document.count(),
      prisma.brand.count(),
    ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { brand: { include: { category: true } } },
  });

  const stats = [
    {
      title: "Total Products",
      value: productCount,
      icon: Package,
      color: "bg-blue-500",
      description: "Active material grades"
    },
    {
      title: "Categories",
      value: categoryCount,
      icon: Layers,
      color: "bg-purple-500",
      description: "Product families"
    },
    {
      title: "Brands",
      value: brandCount,
      icon: TrendingUp,
      color: "bg-pink-500",
      description: "Market brands"
    },
    {
      title: "Documents",
      value: documentCount,
      icon: FileText,
      color: "bg-orange-500",
      description: "TDS & SDS files"
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Overview of the Versalis Styrenics material database
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-px w-8 bg-primary/20" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Engineered by <span className="text-primary/60">Marc Ross</span> <span className="text-[10px] opacity-40 ml-1">(Sales Styrenics)</span>
          </p>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden group">
            <div className={cn(
              "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 group-hover:scale-150",
              stat.color
            )} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
              <div className={cn("p-2 rounded-xl text-white shadow-lg", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold mt-2 tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Products</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Newly added material grades</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 transition-all">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-3xl bg-accent/10">
                <Package className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No products yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Run the seed script to populate the database.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center justify-between group rounded-2xl border border-white/5 p-4 transition-all duration-300 hover:bg-accent/50 hover:border-primary/20 hover:translate-x-1 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Box className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold px-1.5 py-0.5 rounded bg-foreground/5">{product.brand.category.name}</span>
                          <span className="opacity-40">•</span>
                          <span>{product.brand.name}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 rounded-full bg-accent/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {product.type}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Common management tasks</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/products/new"
              className="flex items-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold group shadow-lg shadow-primary/20"
            >
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Package className="h-4 w-4" />
              </div>
              Add New Product
              <ArrowUpRight className="ml-auto h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link
              href="/documents/upload"
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold group"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              Upload Document
              <ArrowUpRight className="ml-auto h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
