export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Download, FileText } from "lucide-react";
import { DocumentUpload } from "@/components/documents/document-upload";

export default async function RegulatoryPage() {
  const session = await auth();
  if (!session) return null;

  const categories = await prisma.category.findMany({
    include: {
      documents: {
        where: { docType: "REGULATORY" },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const canUpload = session.user.role !== "VIEWER";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Regulatory Hub</h1>
        <p className="text-muted-foreground">
          Certificates and regulatory documents grouped by product category
        </p>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.documents.length} document(s)
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No regulatory documents uploaded for this category.
                </p>
              ) : (
                <div className="space-y-2">
                  {category.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.fileName} - {(doc.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {canUpload && (
                <DocumentUpload categoryId={category.id} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
