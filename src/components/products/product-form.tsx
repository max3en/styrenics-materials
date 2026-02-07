"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_COLUMNS, PROPERTY_LABELS } from "@/lib/constants";
import { Loader2, FileUp, Save, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  category: { slug: string; name: string };
}

interface ProductFormProps {
  product?: any;
  brands: Brand[];
}

export function ProductForm({ product, brands }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandId, setBrandId] = useState(product?.brandId || "");
  const [tdsFile, setTdsFile] = useState<File | null>(null);
  const [sdsFile, setSdsFile] = useState<File | null>(null);

  const selectedBrand = brands.find((b) => b.id === brandId);
  const categorySlug = selectedBrand?.category.slug || "";
  const propertyKeys = CATEGORY_COLUMNS[categorySlug] || [];

  async function uploadDocument(file: File, type: string, productId: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", type);
    formData.append("productId", productId);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload ${type}`);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name"),
      brandId: brandId, // Use state instead of formData for Select component
      type: formData.get("type") || null,
      mainApplications: formData.get("mainApplications") || null,
    };


    // Add numeric properties
    for (const key of propertyKeys) {
      const value = formData.get(key) as string;
      if (value && !isNaN(parseFloat(value))) {
        data[key] = parseFloat(value);
      } else if (value) {
        data[key] = value;
      } else {
        data[key] = null;
      }
    }

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save product");
      }


      const savedProduct = await res.json();

      // Handle file uploads if any
      if (!product) { // Only for new products for now, or could enable for edit too
        const uploads = [];
        if (tdsFile) uploads.push(uploadDocument(tdsFile, "TDS", savedProduct.id));
        if (sdsFile) uploads.push(uploadDocument(sdsFile, "SDS", savedProduct.id));

        if (uploads.length > 0) {
          await Promise.all(uploads);
        }
      }

      router.push(`/products/${savedProduct.slug}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="border-none bg-white/5 backdrop-blur-md shadow-xl overflow-hidden">
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name || ""}
                placeholder="e.g. EDISTIR ICE R 850E"
                required
                className="h-11 rounded-xl bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand & Category</Label>
              <Select
                name="brandId"
                value={brandId}
                onValueChange={setBrandId}
              >
                <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 font-medium">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/10 bg-background/95 backdrop-blur-xl">
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.category.name} / {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type / Description</Label>
            <Input
              id="type"
              name="type"
              defaultValue={product?.type || ""}
              placeholder="e.g. High Impact Polystyrene"
              className="h-11 rounded-xl bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainApplications" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Main Applications</Label>
            <Textarea
              id="mainApplications"
              name="mainApplications"
              defaultValue={product?.mainApplications || ""}
              placeholder="Primary use cases and target markets..."
              rows={3}
              className="rounded-xl bg-white/5 border-white/10 resize-none"
            />
          </div>

          {/* Dynamic properties based on category */}
          {propertyKeys.length > 0 && (
            <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Technical Properties</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {propertyKeys.map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{PROPERTY_LABELS[key] || key}</Label>
                    <Input
                      id={key}
                      name={key}
                      defaultValue={product?.[key] ?? ""}
                      placeholder="Value"
                      className="h-10 rounded-xl bg-white/5 border-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Uploads Section (only for new products) */}
          {!product && (
            <div className="space-y-4 pt-6 mt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <FileUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Initial Documents</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Technical Data Sheet (TDS)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setTdsFile(e.target.files?.[0] || null)}
                    className="h-10 rounded-xl bg-white/5 border-white/10 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Safety Data Sheet (SDS)</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSdsFile(e.target.files?.[0] || null)}
                    className="h-10 rounded-xl bg-white/5 border-white/10 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="rounded-2xl h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving Grade...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              {product ? "Update Grade" : "Create Grade"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-2xl h-12 px-8 border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
