"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AlertTriangle,
    Settings2,
    Droplets,
    Flame,
    Maximize,
    ArrowDownToDot,
    CheckCircle2,
    Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFECTS = [
    {
        id: "silver-streaks",
        name: "Silberstreifen (Silver Streaks)",
        icon: Droplets,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        cause: "Feuchtigkeit im Material oder thermische Zersetzung durch zu hohe Schmelzetemperatur.",
        solutions: [
            "Material mindestens 2-4h bei 80°C vortrocknen (ABS/SAN).",
            "Schmelzetemperatur um 10-20°C senken.",
            "Einspritzgeschwindigkeit reduzieren.",
            "Gegendruck (Back Pressure) leicht erhöhen."
        ]
    },
    {
        id: "burn-marks",
        name: "Diesel-Effekt (Burn Marks)",
        icon: Flame,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        cause: "Eingeschlossene Luft wird durch die Kompression so hoch erhitzt, dass der Kunststoff verbrennt.",
        solutions: [
            "Entlüftungskanäle im Werkzeug prüfen/reinigen.",
            "Einspritzgeschwindigkeit in der Füllphase reduzieren.",
            "Schließkraft des Werkzeugs leicht verringern (falls möglich).",
            "Anschnittposition oder -größe optimieren."
        ]
    },
    {
        id: "warping",
        name: "Verzug / Schwindung (Warping)",
        icon: Maximize,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        cause: "Ungleichmäßige Abkühlung oder zu hohe Eigenspannungen im Formteil.",
        solutions: [
            "Werkzeugtemperatur anpassen (meist erhöhen für langsamere Abkühlung).",
            "Nachdruckzeit und Nachdruckhöhe optimieren.",
            "Kühlzeit verlängern.",
            "Material mit geringerer Schwindung wählen (z.B. SAN statt ABS)."
        ]
    },
    {
        id: "sink-marks",
        name: "Einfallstellen (Sink Marks)",
        icon: ArrowDownToDot,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        cause: "Material kontrahiert in Wanddickenbereichen stärker; Nachdruck reicht nicht bis in den Kern.",
        solutions: [
            "Nachdruckhöhe erhöhen.",
            "Nachdruckzeit verlängern, bis die Seele erstarrt ist.",
            "Wanddickenübergänge im Design optimieren (Radien).",
            "Verschlussdüsen-Funktion prüfen."
        ]
    }
];

export function TroubleshootingGuide() {
    const [selected, setSelected] = useState(DEFECTS[0]);

    return (
        <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Common Defects</h3>
                <div className="space-y-2">
                    {DEFECTS.map((defect) => (
                        <button
                            key={defect.id}
                            onClick={() => setSelected(defect)}
                            className={cn(
                                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                selected.id === defect.id
                                    ? "bg-white/10 border-white/10 shadow-lg scale-[1.02]"
                                    : "bg-white/5 border-transparent hover:bg-white/10"
                            )}
                        >
                            <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", defect.bg, defect.color)}>
                                <defect.icon className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm">{defect.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Card className="lg:col-span-8 border-none shadow-2xl bg-slate-900/50 backdrop-blur-3xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="bg-white/5 border-b border-white/10 p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className={cn("h-5 w-5", selected.color)} />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Problem Analysis</span>
                    </div>
                    <CardTitle className="text-3xl font-black italic">{selected.name}</CardTitle>
                    <CardDescription className="text-base font-medium text-foreground/80 mt-4 leading-relaxed">
                        {selected.cause}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                            <Settings2 className="h-4 w-4" />
                            Empfohlene Gegenmaßnahmen
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-1">
                            {selected.solutions.map((sol, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
                                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <p className="text-sm font-bold text-foreground/90">{sol}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-6">
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                            <Lightbulb className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Expert Tip</span>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1 italic">
                                "Sollten die Parameter-Anpassungen keine Besserung bringen, prüfen Sie immer zuerst die **Entgasung** des Zylinders sowie das **Feuchteniveau** im Einzugsbereich."
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
