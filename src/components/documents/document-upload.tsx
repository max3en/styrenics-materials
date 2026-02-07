"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2, X, Plus, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  productId?: string;
  categoryId?: string;
}

export function DocumentUpload({ productId, categoryId }: DocumentUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setError(null);
    } else {
      setError("Only PDF files are allowed");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type === "application/pdf") {
        setFile(selected);
        setError(null);
      } else {
        setError("Only PDF files are allowed");
      }
    }
  };

  async function handleUpload() {
    if (!file || !docType) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);
    if (productId) formData.append("productId", productId);
    if (categoryId) formData.append("categoryId", categoryId);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      setUploading(false);

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Upload failed");
        return;
      }

      setFile(null);
      setDocType("");
      router.refresh();
    } catch (err) {
      setUploading(false);
      setError("An unexpected error occurred during upload");
    }
  }

  return (
    <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          Upload Document
        </CardTitle>
        <CardDescription>Add new TDS/SDS for this material</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "group relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300",
            dragOver
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
          )}
        >
          {file ? (
            <div className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded-xl border border-white/10 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="font-bold text-sm truncate max-w-[150px]">{file.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  PDF documents only
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>

        {/* Document type selection and Upload button */}
        <div className="flex flex-col gap-3">
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all font-semibold">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-background/95 backdrop-blur-xl">
              <SelectItem value="TDS">Technical Data Sheet (TDS)</SelectItem>
              <SelectItem value="SDS">Safety Data Sheet (SDS)</SelectItem>
              {categoryId && (
                <SelectItem value="REGULATORY">Regulatory Information</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            onClick={handleUpload}
            disabled={!file || !docType || uploading}
            className="w-full h-11 rounded-xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add to Grade
              </>
            )}
          </Button>
        </div>

        {error && (
          <p className="text-[11px] font-bold text-destructive text-center uppercase tracking-widest bg-destructive/5 py-2 rounded-lg border border-destructive/10">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
