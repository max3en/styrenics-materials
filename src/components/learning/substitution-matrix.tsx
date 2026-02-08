"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRightLeft,
    CheckCircle2,
    AlertCircle,
    Target,
    Zap,
    ShieldAlert,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUBSTITUTIONS = [
    {
        from: "ABS (Standard)",
        to: "HIPS (High Impact PS)",
        reason: "Kosteneffizienz vs. Mechanik",
        scenario: "Spielzeug oder Haushaltsartikel ohne hohe Wärmeformbeständigkeit.",
        pros: ["Günstigerer Preis", "Einfachere Verarbeitung", "Geringere Dichte"],
        cons: ["Geringere Steifigkeit", "Geringere Chemikalienbeständigkeit", "Matte Oberfläche"],
        verdict: "Ideal als Spar-Alternative, wenn extreme Zähigkeit nicht gefordert ist."
    },
    {
        from: "SAN (Transparent)",
        to: "MABS / ABS Transparent",
        reason: "Schlagzähigkeit bei Transparenz",
        scenario: "Kühlboxen oder Kosmetikbehälter, die bruchsicher sein müssen.",
        pros: ["Extreme Transparenz", "Viel höhere Zähigkeit als SAN", "Gute Kratzfestigkeit"],
        cons: ["Höherer Preis", "Aufwendigere Verarbeitung", "Etwas geringere Steifigkeit"],
        verdict: "Die High-End Lösung für transparente Teile mit Fallschutz-Anforderung."
    },
    {
        from: "HIPS",
        to: "ABS Emulsion",
        reason: "Performance-Upgrade",
        scenario: "Gehäuseteile für Elektronik mit hoher Beanspruchung.",
        pros: ["Viel höhere Kerbschlagzähigkeit", "Bessere Oberflächenqualität", "Höhere Heat Resistance"],
        cons: ["Teurer", "Höhere Werkzeugtemperaturen nötig", "Leicht höhere Dichte"],
        verdict: "Pflicht-Wechsel, wenn HIPS im Dauereinsatz oder bei Hitze versagt."
    }
];

export function SubstitutionMatrix() {
    return (
        <div className="space-y-8">
            <div className="grid gap-6">
                {SUBSTITUTIONS.map((sub, i) => (
                    <Card key={i} className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/10 group">
                        <div className="grid lg:grid-cols-12">
                            {/* Left Header - The Logic */}
                            <div className="lg:col-span-4 p-8 bg-white/[0.02] border-r border-white/5 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="h-4 w-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Strategic Logic</span>
                                </div>
                                <h3 className="text-xl font-black italic mb-2">{sub.reason}</h3>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold">{sub.from}</div>
                                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                                    <div className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-lg shadow-primary/20">{sub.to}</div>
                                </div>
                            </div>

                            {/* Right Side - Details */}
                            <div className="lg:col-span-8 p-8 space-y-6">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <HelpCircle className="h-3 w-3" />
                                        Typisches Szenario
                                    </span>
                                    <p className="font-medium text-foreground/80">{sub.scenario}</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Vorteile des Wechsels
                                        </h4>
                                        <ul className="space-y-2">
                                            {sub.pros.map(p => (
                                                <li key={p} className="text-xs font-bold flex items-center gap-2 text-foreground/70">
                                                    <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                                            <ShieldAlert className="h-3 w-3" />
                                            Einschränkungen
                                        </h4>
                                        <ul className="space-y-2">
                                            {sub.cons.map(c => (
                                                <li key={c} className="text-xs font-bold flex items-center gap-2 text-foreground/70">
                                                    <div className="h-1 w-1 bg-destructive rounded-full" />
                                                    {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                                    <Zap className="h-4 w-4 text-primary shrink-0" />
                                    <p className="text-xs font-black italic text-primary uppercase tracking-tight">
                                        {sub.verdict}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                    <h4 className="text-3xl font-black italic tracking-tighter">Bereit für den Vergleich?</h4>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xl">
                        Nutzen Sie den interaktiven **Grade Comparator**, um die exakten technischen Datenblätter (TDS) dieser Werkstoffe direkt nebeneinander zu stellen und Schmelzindizes oder Schlagzähigkeiten zu analysieren.
                    </p>
                </div>
                <Badge className="h-20 w-20 rounded-full flex items-center justify-center p-0 border-4 border-white/20 bg-primary text-primary-foreground shadow-2xl animate-spin-slow">
                    <ArrowRightLeft className="h-8 w-8" />
                </Badge>
            </div>
        </div>
    );
}
