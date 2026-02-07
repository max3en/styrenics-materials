"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Thermometer,
    Droplet,
    Wind,
    Clock,
    CheckCircle2,
    AlertCircle,
    Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROCESSING_DATA = [
    {
        family: "Sinkral® (ABS)",
        color: "bg-blue-500",
        meltTemp: "210 - 240°C",
        moldTemp: "40 - 80°C",
        drying: "80°C / 2 - 4h",
        shrinkage: "0.4 - 0.7%",
        notes: "Vermeiden Sie lange Verweilzeiten bei Temperaturen über 250°C."
    },
    {
        family: "Kostil® (SAN)",
        color: "bg-purple-500",
        meltTemp: "200 - 230°C",
        moldTemp: "40 - 80°C",
        drying: "80°C / 2h",
        shrinkage: "0.4 - 0.7%",
        notes: "Sehr hygroskopisch – sorgfältige Trocknung für optische Qualität essenziell."
    },
    {
        family: "Edistir® (HIPS)",
        color: "bg-pink-500",
        meltTemp: "190 - 240°C",
        moldTemp: "20 - 60°C",
        drying: "70°C / 1 - 2h",
        shrinkage: "0.4 - 0.7%",
        notes: "Exzellente thermische Stabilität und weites Verarbeitungsfenster."
    },
    {
        family: "Edistir® (GPPS)",
        color: "bg-pink-400",
        meltTemp: "180 - 230°C",
        moldTemp: "20 - 50°C",
        drying: "Optional",
        shrinkage: "0.4 - 0.6%",
        notes: "Geringe Neigung zu Verzug; ideal für dünnwandige transparente Teile."
    }
];

export function ProcessingGuide() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {PROCESSING_DATA.map((item) => (
                    <Card key={item.family} className="border-none shadow-xl bg-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/10 group">
                        <div className={cn("h-1 w-full", item.color)} />
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-black italic">{item.family}</CardTitle>
                            <CardDescription>Recommended parameters for injection molding</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Thermometer className="h-3 w-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Melt Temp</span>
                                    </div>
                                    <p className="text-sm font-bold">{item.meltTemp}</p>
                                </div>
                                <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Thermometer className="h-3 w-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Mold Temp</span>
                                    </div>
                                    <p className="text-sm font-bold">{item.moldTemp}</p>
                                </div>
                                <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Timer className="h-3 w-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Drying</span>
                                    </div>
                                    <p className="text-sm font-bold">{item.drying}</p>
                                </div>
                                <div className="space-y-1.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Wind className="h-3 w-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Shrinkage</span>
                                    </div>
                                    <p className="text-sm font-bold">{item.shrinkage}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Technical Advice</span>
                                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{item.notes}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-xl">
                <div className="h-16 w-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black italic text-emerald-500 tracking-tight">Best Practice: Material Handling</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                        Eine konsequente Vortrocknung von ABS und SAN ist für fehlerfreie Oberflächen (Silberstreifen) und konstante mechanische Eigenschaften unerlässlich.
                        Verwenden Sie vorzugsweise Trockenluft-Trockner, um eine restfeuchte von &lt; 0.05% zu erreichen.
                    </p>
                </div>
            </div>
        </div>
    );
}
