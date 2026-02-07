"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Zap,
    ShieldCheck,
    Lightbulb,
    Atom,
    Target,
    Info,
    Thermometer,
    Combine,
    Box,
    Layers,
    BarChart3,
    Search
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAMILIES = [
    {
        id: "abs",
        name: "Sinkral®",
        fullName: "Acrylonitrile Butadiene Styrene (ABS)",
        color: "bg-blue-500",
        textColor: "text-blue-500",
        description: "Der Allrounder für höchste mechanische Ansprüche und ästhetische Oberflächen.",
        properties: [
            { label: "Impact Strength", value: 95 },
            { label: "Heat Resistance", value: 85 },
            { label: "Processability", value: 80 },
            { label: "Rigidity", value: 75 },
        ],
        details: "Sinkral® kombiniert die Härte von Acrylnitril und Styrol mit der Zähigkeit von Butadien. Ideal für Automotive, Haushaltsgeräte und Gehäuse.",
        useCases: ["Automotive Interieur", "Haushaltsgeräte", "Staubsaugergehäuse", "Kofferschalen"]
    },
    {
        id: "san",
        name: "Kostil®",
        fullName: "Styrene Acrylonitrile (SAN)",
        color: "bg-purple-500",
        textColor: "text-purple-500",
        description: "Brillante Transparenz gepaart mit hoher Steifigkeit und chemischer Beständigkeit.",
        properties: [
            { label: "Transparency", value: 98 },
            { label: "Rigidity", value: 90 },
            { label: "Chemical Resistance", value: 85 },
            { label: "Processability", value: 75 },
        ],
        details: "Kostil® ist die erste Wahl, wenn optische Reinheit und Kratzfestigkeit gefragt sind. Es bietet eine exzellente Beständigkeit gegen Fette und Öle.",
        useCases: ["Kosmetikverpackungen", "Kühlschrankfächer", "Küchenutensilien", "Feuerzeughüllen"]
    },
    {
        id: "ps",
        name: "Edistir®",
        fullName: "Polystyrene (GPPS / HIPS)",
        color: "bg-pink-500",
        textColor: "text-pink-500",
        description: "Vom glasklaren Standard-PS bis zum schlagfesten HIPS – vielseitig und effizient.",
        properties: [
            { label: "Processability", value: 95 },
            { label: "Insulation", value: 80 },
            { label: "Rigidity", value: 85 },
            { label: "Impact (HIPS)", value: 70 },
        ],
        details: "Edistir® umfasst GPPS für hohe Transparenz und HIPS für Schlagfestigkeit. Bekannt für exzellente Thermoformbarkeit und Lebensmittelkontakt-Eignung.",
        useCases: ["Lebensmittelverpackungen", "Milchprodukte-Becher", "Dämmplatten", "Spielzeug"]
    },
    {
        id: "eps",
        name: "Extir®",
        fullName: "Expandable Polystyrene (EPS)",
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
        description: "Die Referenz für thermische Isolation und sicheren Transportschutz.",
        properties: [
            { label: "Thermal Insulation", value: 100 },
            { label: "Shock Absorption", value: 95 },
            { label: "Lightweight", value: 100 },
            { label: "Ecological Efficiency", value: 85 },
        ],
        details: "Extir® besteht aus EPS-Perlen, die beim Sinterprozess expandieren. Führend in der Bauisolierung (WDVS) und im Schutz sensibler Elektronik.",
        useCases: ["Gebäudeisolierung", "Fischboxen", "Schutzverpackungen", "Helminnenteile"]
    }
];

export default function LearningPage() {
    const [activeTab, setActiveTab] = useState("abs");

    return (
        <div className="space-y-10 pb-20 text-foreground">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest w-fit">
                    <Lightbulb className="h-3 w-3" />
                    Technical Sales Enablement
                </div>
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40 bg-clip-text text-transparent">
                    Learning Center
                </h1>
                <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
                    Verstehen Sie die Tiefe des Styrenics-Portfolios. Von der chemischen Struktur bis zur finalen Anwendung – technisches Wissen für den Verkaufserfolg.
                </p>
            </div>

            {/* Overview Matrix Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Atom className="h-20 w-20 text-blue-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5 text-blue-500" />
                            Materialkunde
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Lernen Sie die Unterschiede zwischen Copolymeren und Homopolymeren.</p>
                        <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest cursor-pointer hover:underline flex items-center gap-1">
                                Einführung &rarr;
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Thermometer className="h-20 w-20 text-orange-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-orange-500" />
                            Kennwerte
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Vicat, MFI und Izod – was die technischen Parameter für den Kunden bedeuten.</p>
                        <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest cursor-pointer hover:underline flex items-center gap-1">
                                Parameter-Guide &rarr;
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                        <Combine className="h-20 w-20 text-emerald-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Sustainability
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">Entdecken Sie Versalis Revive® und die kreislauffähigen Lösungen.</p>
                        <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase text-primary tracking-widest cursor-pointer hover:underline flex items-center gap-1">
                                Revive® Info &rarr;
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Brand deep dive */}
            <Tabs defaultValue="abs" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-black flex items-center gap-3">
                        <Box className="h-6 w-6 text-primary" />
                        Brand Deep Dive
                    </h2>
                    <TabsList className="bg-white/5 border border-white/10 h-14 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto overflow-y-hidden">
                        {FAMILIES.map(family => (
                            <TabsTrigger
                                key={family.id}
                                value={family.id}
                                className="rounded-xl px-6 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg h-full"
                            >
                                {family.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {FAMILIES.map(family => (
                    <TabsContent key={family.id} value={family.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className={cn("text-5xl font-black italic", family.textColor)}>{family.name}®</h3>
                                    <p className="text-xl font-bold text-foreground/80">{family.fullName}</p>
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {family.description}
                                </p>

                                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4 relative overflow-hidden group">
                                    <div className={cn("absolute top-0 right-0 h-32 w-32 -mr-16 -mt-16 blur-3xl opacity-20 transition-all group-hover:opacity-40", family.color)} />
                                    <h4 className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        <Info className="h-4 w-4" />
                                        Technisches Profil
                                    </h4>
                                    <p className="text-base text-foreground/80 leading-relaxed font-medium">
                                        {family.details}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Haupt-Anwendungen</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {family.useCases.map(useCase => (
                                            <div key={useCase} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold group hover:bg-white/10 transition-all cursor-default">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("h-3 w-3 rounded-md rotate-45 transition-transform group-hover:rotate-0", family.color)} />
                                                    {useCase}
                                                </div>
                                                <Search className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Technical Chart */}
                            <Card className="border-none shadow-2xl bg-black/40 backdrop-blur-3xl overflow-hidden self-start border border-white/5 p-2">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Material Performance</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Relative Stärken im Vergleich</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 space-y-10">
                                    {family.properties.map((prop, idx) => (
                                        <div key={prop.label} className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                                                    {prop.label}
                                                </span>
                                                <span className={cn("text-xs font-black px-2 py-0.5 rounded bg-white/5 shadow-inner", family.textColor)}>
                                                    {prop.value}%
                                                </span>
                                            </div>
                                            <div className="h-4 w-full bg-white/5 rounded-full p-1 border border-white/10">
                                                <div
                                                    className={cn("h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]", family.color)}
                                                    style={{
                                                        width: `${prop.value}%`,
                                                        transitionDelay: `${idx * 150}ms`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                                            <BarChart3 className="h-16 w-16" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap className="h-4 w-4 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sales Tip</span>
                                        </div>
                                        <p className="text-sm text-foreground/80 leading-relaxed font-bold italic">
                                            "Nutzen Sie die hohe {family.properties[0].label} von {family.name}, um den Kunden von der Langlebigkeit in rauen Umgebungen zu überzeugen."
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Comparison Guide */}
            <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-md overflow-hidden border border-white/10 group">
                <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6">
                        <h3 className="text-4xl font-black tracking-tighter">Grade Comparison Tool</h3>
                        <p className="text-muted-foreground text-lg max-w-lg leading-relaxed font-medium">
                            Suchen Sie nach spezifischen Materialeigenschaften? Nutzen Sie unseren Produkt-Explorer, um hunderte von Versalis Styrenics Grades direkt miteinander zu vergleichen.
                        </p>
                        <Button className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" asChild>
                            <Link href="/products">
                                <Search className="mr-3 h-5 w-5" />
                                Zum Produkt-Explorer
                            </Link>
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full animate-pulse" />
                        <div className="relative flex h-56 w-56 items-center justify-center rounded-[3rem] bg-white/5 border border-white/20 backdrop-blur-xl rotate-[15deg] group-hover:rotate-0 transition-all duration-700 shadow-2xl">
                            <Layers className="h-24 w-24 text-primary animate-bounce-slow" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
