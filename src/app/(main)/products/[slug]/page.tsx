export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PROPERTY_LABELS, CATEGORY_COLUMNS } from "@/lib/constants";
import { formatFloat } from "@/lib/utils";
import { ArrowLeft, Edit, FileText, Download, Box, Layers, ShieldCheck, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { DocumentUpload } from "@/components/documents/document-upload";

export default async function ProductDetailPage({

  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session) notFound();

  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: { include: { category: true } },
      documents: true,
    },
  });

  if (!product) notFound();

  const categorySlug = product.brand.category.slug;
  const propertyKeys = CATEGORY_COLUMNS[categorySlug] || [];
  const canEdit = session.user.role !== "VIEWER";

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href={`/categories/${categorySlug}`} className="hover:text-primary transition-colors">{product.brand.category.name}</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 h-9 transition-all">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Link>
          </Button>
          {canEdit && (
            <Button size="sm" asChild className="rounded-xl h-9 px-4 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
              <Link href={`/products/${product.slug}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Grade
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Badge className="px-3 py-1 rounded-lg bg-primary/20 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
                {product.brand.category.name}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 rounded-lg border-white/10 text-[10px] font-bold uppercase tracking-widest">
                {product.brand.name}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground max-w-3xl leading-tight">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl">
              High-performance {product.type?.toLowerCase() || 'material'} designed for specialized industrial applications.
            </p>
          </div>
        </div>
        <Box className="absolute bottom-0 right-0 h-48 w-48 text-primary/5 -mr-10 -mb-10 rotate-12" />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Technical Overview
              </CardTitle>
              <CardDescription>Primary properties and application scope</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Material Type</p>
                <p className="font-semibold text-lg">{product.type || "N/A"}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Main Applications</p>
                <p className="font-semibold">{product.mainApplications || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Properties Grid */}
          <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Physical & Mechanical Properties
              </CardTitle>
              <CardDescription>Laboratory tested specifications</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
                {propertyKeys.map((key) => {
                  const value = (product as any)[key];
                  if (value == null) return null;
                  const label = PROPERTY_LABELS[key] || key;
                  const isNumeric = typeof value === "number";
                  return (
                    <div key={key} className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-0 group">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 transition-colors group-hover:text-primary">{label}</span>
                      <span className="text-base font-bold text-foreground">
                        {isNumeric ? formatFloat(value) : value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Documents Sidebar */}
          <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Downloads
              </CardTitle>
              <CardDescription>Official datasheets and safety files</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
              {product.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center rounded-2xl border-2 border-dashed border-white/10 opacity-50">
                  <FileText className="h-8 w-8 mb-2" />
                  <p className="text-xs font-medium">No files available.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {product.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-primary/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-black border-none",
                            doc.docType === 'TDS' ? 'bg-blue-500 text-white' :
                              doc.docType === 'SDS' ? 'bg-orange-500 text-white' :
                                'bg-accent text-accent-foreground'
                          )}
                        >
                          {doc.docType}
                        </Badge>
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{doc.name}</span>
                      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">Download File &rarr;</span>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {canEdit && (
            <div className="pt-4 border-t border-white/5">
              <DocumentUpload productId={product.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

