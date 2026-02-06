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
import { Loader2 } from "lucide-react";

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

  const selectedBrand = brands.find((b) => b.id === brandId);
  const categorySlug = selectedBrand?.category.slug || "";
  const propertyKeys = CATEGORY_COLUMNS[categorySlug] || [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {
      name: formData.get("name"),
      brandId: formData.get("brandId"),
      type: formData.get("type") || null,
      mainApplications: formData.get("mainApplications") || null,
    };

    // Add numeric properties
    for (const key of propertyKeys) {
      const value = formData.get(key) as string;
      if (value && !isNaN(parseFloat(value))) {
        data[key] = parseFloat(value);
      } else if (value) {
        data[key] = value; // string properties like particleSizeRange
      } else {
        data[key] = null;
      }
    }

    const url = product
      ? `/api/products/${product.id}`
      : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setError(err.error?.message || "Failed to save product");
      return;
    }

    const saved = await res.json();
    router.push(`/products/${saved.slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandId">Brand</Label>
            <Select
              name="brandId"
              value={brandId}
              onValueChange={setBrandId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.category.name} / {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type / Description</Label>
            <Input
              id="type"
              name="type"
              defaultValue={product?.type || ""}
            />
          </div>

          {/* Dynamic properties based on category */}
          {propertyKeys.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Technical Properties</h3>
              {propertyKeys.map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>{PROPERTY_LABELS[key]}</Label>
                  <Input
                    id={key}
                    name={key}
                    defaultValue={product?.[key] ?? ""}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="mainApplications">Main Applications</Label>
            <Textarea
              id="mainApplications"
              name="mainApplications"
              defaultValue={product?.mainApplications || ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
