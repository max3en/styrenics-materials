export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { DocumentUploadStandalone } from "@/components/documents/document-upload-standalone";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UploadDocumentPage() {
    await requireRole("EDITOR");

    const [products, categories] = await Promise.all([
        prisma.product.findMany({
            select: { id: true, name: true, brand: { select: { name: true } } },
            orderBy: { name: "asc" },
        }),
        prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Upload Center
                    </h1>
                    <p className="text-muted-foreground font-medium">Add technical or safety documentation to materials</p>
                </div>
                <Button variant="outline" size="sm" asChild className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-9 transition-all">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                </Button>
            </div>

            <DocumentUploadStandalone
                products={products.map(p => ({ id: p.id, name: `${p.brand.name} ${p.name}` }))}
                categories={categories}
            />
        </div>
    );
}
