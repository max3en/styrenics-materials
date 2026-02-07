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
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, X, Plus, FileUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";


interface Item {
    id: string;
    name: string;
}

interface DocumentUploadStandaloneProps {
    products: Item[];
    categories: Item[];
}

export function DocumentUploadStandalone({ products, categories }: DocumentUploadStandaloneProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState<string>("");
    const [targetType, setTargetType] = useState<"product" | "category">("product");
    const [targetId, setTargetId] = useState<string>("");
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped?.type === "application/pdf") {
            setFile(dropped);
            setError(null);
            setSuccess(false);
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
                setSuccess(false);
            } else {
                setError("Only PDF files are allowed");
            }
        }
    };

    async function handleUpload() {
        if (!file || !docType || !targetId) {
            setError("Please fill in all required fields");
            return;
        }
        setUploading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        if (targetType === "product") formData.append("productId", targetId);
        if (targetType === "category") formData.append("categoryId", targetId);

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
            setTargetId("");
            setSuccess(true);
            router.refresh();

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setUploading(false);
            setError("An unexpected error occurred during upload");
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
                <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-md overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/5">
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Upload PDF
                        </CardTitle>
                        <CardDescription>Select a document and assign it to a material or category</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* File Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={cn(
                                "group relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300",
                                dragOver
                                    ? "border-primary bg-primary/10 scale-[1.01]"
                                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            )}
                        >
                            {file ? (
                                <div className="flex items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                                        onClick={() => setFile(null)}
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="mx-auto h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-foreground">
                                            Drop your PDF here
                                        </p>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            or click to browse your files
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Assignment Type</Label>
                                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                                    <button
                                        onClick={() => { setTargetType("product"); setTargetId(""); }}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            targetType === "product" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Product
                                    </button>
                                    <button
                                        onClick={() => { setTargetType("category"); setTargetId(""); }}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all",
                                            targetType === "category" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        Category
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Document Type</Label>
                                <Select value={docType} onValueChange={setDocType}>
                                    <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 font-medium">
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-white/10 bg-background/95 backdrop-blur-xl">
                                        <SelectItem value="TDS">Technical Data Sheet (TDS)</SelectItem>
                                        <SelectItem value="SDS">Safety Data Sheet (SDS)</SelectItem>
                                        {targetType === "category" && (
                                            <SelectItem value="REGULATORY">Regulatory Info</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">
                                Select {targetType === "product" ? "Product Grade" : "Family Category"}
                            </Label>
                            <Select value={targetId} onValueChange={setTargetId}>
                                <SelectTrigger className="h-12 rounded-xl bg-white/5 border-white/10 font-bold">
                                    <SelectValue placeholder={`Search for a ${targetType}...`} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-white/10 bg-background/95 backdrop-blur-xl max-h-[300px]">
                                    {(targetType === "product" ? products : categories).map((item) => (
                                        <SelectItem key={item.id} value={item.id} className="font-medium">
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={handleUpload}
                            disabled={!file || !docType || !targetId || uploading}
                            className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Processing Upload...
                                </>
                            ) : (
                                <>
                                    <FileUp className="mr-3 h-6 w-6" />
                                    Confirm Upload
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="h-5 w-5" />
                                Document uploaded successfully!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Guidelines</CardTitle>
                        <CardDescription>Follow these rules for documentation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] font-black">1</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-bold text-foreground">File Format:</span> Always use PDF files. Other formats will be rejected.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] font-black">2</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-bold text-foreground">Naming:</span> The system will automatically name the document based on the file name, removing the extension.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] font-black">3</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-bold text-foreground">Visibility:</span> Documents uploaded here will immediately appear on the respective product pages.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-primary/5 border border-primary/10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 bg-primary/20 rounded-full blur-2xl" />
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Pro Tip
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            If you have multiple files for one product, you can also upload them directly on the <Link href="/products" className="text-primary font-bold hover:underline">Product Detail</Link> page to save time searching for the grade in the list.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
