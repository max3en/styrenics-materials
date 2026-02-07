"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    X,
    Plus,
    Scale,
    ArrowRightLeft,
    ChevronRight,
    ChevronLeft,
    Info,
    Layers,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PROPERTY_LABELS } from "@/lib/constants";

interface Product {
    id: string;
    name: string;
    slug: string;
    type: string | null;
    brand: {
        name: string;
        category: {
            name: string;
        }
    };
    // Technical props
    vicatSofteningTemp?: number | null;
    vicatTemp?: number | null;
    vicatATemp?: number | null;
    vicatB120Temp?: number | null;
    mfi220_10?: number | null;
    mfi200_5?: number | null;
    mfi260_5?: number | null;
    izodImpact?: number | null;
    charpyImpact?: number | null;
    particleSizeRange?: string | null;
    blowingAgent?: string | null;
    densityRange?: string | null;
}

interface GradeComparatorProps {
    products: Product[];
}

export function GradeComparator({ products }: GradeComparatorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const query = searchQuery.toLowerCase();
        return products
            .filter(p =>
                !selectedIds.includes(p.id) &&
                (p.name.toLowerCase().includes(query) || p.brand.name.toLowerCase().includes(query))
            )
            .slice(0, 5);
    }, [searchQuery, products, selectedIds]);

    const selectedProducts = useMemo(() =>
        selectedIds.map(id => products.find(p => p.id === id)!).filter(Boolean)
        , [selectedIds, products]);

    const toggleProduct = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else if (selectedIds.length < 3) {
            setSelectedIds([...selectedIds, id]);
            setSearchQuery("");
        }
    };

    const propertyKeys = [
        "vicatSofteningTemp", "vicatTemp", "vicatATemp", "vicatB120Temp",
        "mfi220_10", "mfi200_5", "mfi260_5",
        "izodImpact", "charpyImpact"
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Selection Area */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            placeholder="Search grade name (e.g. Sinkral)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 h-12 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 transition-all font-medium"
                        />

                        {filteredResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                {filteredResults.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => toggleProduct(p.id)}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-left"
                                    >
                                        <div>
                                            <p className="font-bold text-sm">{p.brand.name} {p.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.brand.category.name}</p>
                                        </div>
                                        <Plus className="h-4 w-4 text-primary" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">Sales Intelligence</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Vergleichen Sie bis zu 3 Grades nebeneinander. Nutzen Sie dies, um Kunden Alternativen bei Lieferengpässen oder spezifischen Performance-Anforderungen aufzuzeigen.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-wrap gap-4 items-center">
                    {selectedProducts.length === 0 ? (
                        <div className="flex-1 h-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-white/[0.02]">
                            <ArrowRightLeft className="h-6 w-6 mb-2 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest opacity-40">Choose grades to start comparison</p>
                        </div>
                    ) : (
                        selectedProducts.map((p) => (
                            <div key={p.id} className="relative group h-32 w-full sm:w-[220px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-4 shadow-xl flex flex-col justify-between overflow-hidden">
                                <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <button
                                    onClick={() => toggleProduct(p.id)}
                                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors z-10"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div>
                                    <Badge className="mb-2 bg-primary/20 text-primary border-none text-[9px] font-black">{p.brand.category.name}</Badge>
                                    <h4 className="font-bold text-base leading-tight truncate pr-6">{p.brand.name} {p.name}</h4>
                                    <p className="text-[10px] text-muted-foreground truncate">{p.type || "Specialty Grade"}</p>
                                </div>
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary mt-2">
                                    Selected <ChevronRight className="h-2 w-2" />
                                </div>
                            </div>
                        ))
                    )}

                    {selectedIds.length > 0 && selectedIds.length < 3 && (
                        <div className="h-32 w-full sm:w-[150px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-muted-foreground/30">
                            <Plus className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Add more</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison Table */}
            {selectedProducts.length > 1 && (
                <Card className="border-none shadow-2xl bg-slate-900/50 backdrop-blur-3xl overflow-hidden group">
                    <CardHeader className="border-b border-white/5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black italic flex items-center gap-2">
                                    <Scale className="h-6 w-6 text-primary" />
                                    Side-by-Side Analysis
                                </CardTitle>
                                <CardDescription>Technical property comparison matrix</CardDescription>
                            </div>
                            <Sparkles className="h-8 w-8 text-primary/20 animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/[0.02]">
                                        <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[240px]">Property</th>
                                        {selectedProducts.map(p => (
                                            <th key={p.id} className="p-6 text-sm font-black text-primary border-l border-white/5">
                                                {p.brand.name} {p.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {propertyKeys.map((key) => {
                                        const hasValues = selectedProducts.some(p => (p as any)[key] != null);
                                        if (!hasValues) return null;

                                        return (
                                            <tr key={key} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-6 py-4">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                                        {PROPERTY_LABELS[key] || key}
                                                    </p>
                                                </td>
                                                {selectedProducts.map(p => {
                                                    const val = (p as any)[key];
                                                    return (
                                                        <td key={p.id} className="p-6 py-4 border-l border-white/5">
                                                            {val != null ? (
                                                                <div className="space-y-2">
                                                                    <span className="text-base font-black tracking-tight">{val}</span>
                                                                    {/* Visual bar for numeric relative comparison if applicable */}
                                                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-primary/40 rounded-full"
                                                                            style={{ width: `${Math.min((val / 150) * 100, 100)}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-medium text-muted-foreground/30">N/A</span>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}

                                    {/* Categorical props */}
                                    {["particleSizeRange", "blowingAgent", "densityRange"].map(key => {
                                        const hasValues = selectedProducts.some(p => (p as any)[key]);
                                        if (!hasValues) return null;

                                        return (
                                            <tr key={key} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="p-6 py-4">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                                                        {PROPERTY_LABELS[key] || key}
                                                    </p>
                                                </td>
                                                {selectedProducts.map(p => (
                                                    <td key={p.id} className="p-6 py-4 border-l border-white/5">
                                                        <span className="text-sm font-bold opacity-80">{(p as any)[key] || "—"}</span>
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
