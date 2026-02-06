export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PROPERTY_LABELS, CATEGORY_COLUMNS } from "@/lib/constants";
import { formatFloat } from "@/lib/utils";
import { ArrowLeft, Edit, FileText, Download } from "lucide-react";
import { auth } from "@/lib/auth";

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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${categorySlug}`}
          className="hover:text-foreground"
        >
          {product.brand.category.name}
        </Link>
        <span>/</span>
        <span>{product.brand.name}</span>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge>{product.brand.category.name}</Badge>
            <Badge variant="outline">{product.brand.name}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {canEdit && (
            <Button size="sm" asChild>
              <Link href={`/products/${product.slug}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {propertyKeys.map((key) => {
              const value = (product as any)[key];
              if (value == null) return null;
              const label = PROPERTY_LABELS[key] || key;
              const isNumeric = typeof value === "number";
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className="font-medium">
                    {isNumeric ? formatFloat(value) : value}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Description & Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.type && (
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="mt-1">{product.type}</p>
              </div>
            )}
            {product.mainApplications && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Main Applications
                </p>
                <p className="mt-1">{product.mainApplications}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No documents uploaded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {product.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        doc.docType === "TDS"
                          ? "default"
                          : doc.docType === "SDS"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {doc.docType}
                    </Badge>
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <a href={doc.blobUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
