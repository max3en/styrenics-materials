"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  fileName: string;
  blobUrl: string;
  fileSize: number;
  docType: string;
  createdAt: string;
}

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const canDelete = session?.user?.role !== "VIEWER";

  async function handleDelete(id: string) {
    if (!confirm("Delete this document?")) return;
    const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No documents uploaded.</p>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
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
            <div>
              <p className="text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">
                {(doc.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <a href={doc.blobUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </a>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
