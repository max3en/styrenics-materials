export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Upload, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

export default async function DocumentsPage() {
  const session = await auth();
  await requireAuth();

  const canUpload = session?.user?.role !== "VIEWER";

  const documents = await prisma.document.findMany({
    include: {
      product: { include: { brand: { select: { name: true } } } },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Regulatory Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Access the complete technical and safety documentation database
          </p>
        </div>
        {canUpload && (
          <Button asChild className="rounded-2xl h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
            <Link href="/documents/upload">
              <Upload className="mr-2 h-5 w-5" />
              Upload New
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {documents.length === 0 ? (
          <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md">
            <CardContent className="py-20 text-center">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-bold text-foreground">No documents found</h3>
              <p className="mt-2 text-muted-foreground">
                There are currently no TDS or SDS files in the system.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="group border-none shadow-xl bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-1">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-black border-none uppercase tracking-widest",
                        doc.docType === "TDS"
                          ? "bg-blue-500 text-white"
                          : doc.docType === "SDS"
                            ? "bg-orange-500 text-white"
                            : "bg-primary text-primary-foreground"
                      )}
                    >
                      {doc.docType}
                    </Badge>
                    <a
                      href={doc.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate" title={doc.name}>
                        {doc.name}
                      </h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        {(doc.fileSize / 1024).toFixed(1)} KB • PDF
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Assigned To</p>
                      {doc.product ? (
                        <Link
                          href={`/products/${doc.product.slug}`}
                          className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
                        >
                          <span className="truncate">{doc.product.brand.name} {doc.product.name}</span>
                          <ArrowUpRight className="h-3 w-3 shrink-0" />
                        </Link>
                      ) : doc.category ? (
                        <Link
                          href={`/categories/${doc.category.slug}`}
                          className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
                        >
                          <span className="truncate">Category: {doc.category.name}</span>
                          <ArrowUpRight className="h-3 w-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
