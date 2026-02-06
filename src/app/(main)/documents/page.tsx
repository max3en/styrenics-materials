import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

export default async function DocumentsPage() {
  await requireAuth();

  const documents = await prisma.document.findMany({
    include: {
      product: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
        <p className="text-muted-foreground">
          Browse all uploaded documents across products and categories
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              No documents uploaded yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-md border p-4"
            >
              <div className="flex items-center gap-4">
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
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.product ? (
                      <Link
                        href={`/products/${doc.product.slug}`}
                        className="hover:underline"
                      >
                        {doc.product.name}
                      </Link>
                    ) : doc.category ? (
                      <Link
                        href={`/categories/${doc.category.slug}`}
                        className="hover:underline"
                      >
                        Category: {doc.category.name}
                      </Link>
                    ) : null}
                    {" - "}
                    {(doc.fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <a href={doc.blobUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
