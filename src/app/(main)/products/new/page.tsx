export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { ProductForm } from "@/components/products/product-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    await requireRole("EDITOR");

    const brands = await prisma.brand.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        New Material
                    </h1>
                    <p className="text-muted-foreground font-medium">Add a new grade to the styrenics portfolio</p>
                </div>
                <Button variant="outline" size="sm" asChild className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-9 transition-all">
                    <Link href="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-white/5">
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Enter the technical specifications for the new grade</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <ProductForm brands={brands} />
                </CardContent>
            </Card>
        </div>
    );
}
