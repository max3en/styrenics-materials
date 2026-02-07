import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
    Search,
    FlaskConical,
    Activity,
    Trees,
    Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeComparator } from "@/components/learning/grade-comparator";
import { ProcessingGuide } from "@/components/learning/processing-guide";

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

export default async function LearningPage() {
    const products = await prisma.product.findMany({
        include: {
            brand: {
                include: {
                    category: true,
                },
            },
        },
    });

    return (
        <div className="space-y-16 pb-24 text-foreground max-w-7xl mx-auto">
            {/* Header Section */}
            <section className="relative overflow-hidden pt-12">
                <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 animate-pulse" />
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] w-fit border border-primary/20">
                        <Lightbulb className="h-3 w-3" />
                        Technical Excellence & Sales Support
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent italic">
                        Styrenics <br /> Knowledge Hub
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed font-medium">
                        Tiefgreifendes technologisches Verständnis für Profis. Beherrschen Sie die materialwissenschaftlichen Grundlagen und steigern Sie Ihren Beratungswert.
                    </p>
                </div>
            </section>

            <Tabs defaultValue="overview" className="space-y-12">
                <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 pb-4 -mx-4 px-4 pt-2">
                    <TabsList className="bg-white/5 h-14 p-1 rounded-2xl border border-white/10">
                        <TabsTrigger value="overview" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary">Portfolio</TabsTrigger>
                        <TabsTrigger value="chemistry" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary">Chemistry</TabsTrigger>
                        <TabsTrigger value="comparator" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary">Comparator</TabsTrigger>
                        <TabsTrigger value="processing" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary">Processing</TabsTrigger>
                        <TabsTrigger value="sustainability" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary">Sustainability</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab 1: Overview & Families */}
                <TabsContent value="overview" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {FAMILIES.map(family => (
                            <Card key={family.id} className="border-none bg-white/5 backdrop-blur-md overflow-hidden rounded-[2.5rem] border border-white/5 group">
                                <CardContent className="p-10 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h3 className={cn("text-5xl font-black italic", family.textColor)}>{family.name}®</h3>
                                            <p className="text-lg font-bold text-muted-foreground">{family.fullName}</p>
                                        </div>
                                        <div className={cn("h-16 w-16 rounded-[1.5rem] flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-500 shadow-2xl", family.color)}>
                                            <Box className="h-8 w-8 text-white" />
                                        </div>
                                    </div>

                                    <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                                        {family.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {family.properties.map(prop => (
                                            <div key={prop.label} className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    <span>{prop.label}</span>
                                                    <span className={family.textColor}>{prop.value}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full">
                                                    <div className={cn("h-full rounded-full", family.color)} style={{ width: `${prop.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 flex flex-wrap gap-2">
                                        {family.useCases.slice(0, 3).map(u => (
                                            <Badge key={u} variant="secondary" className="bg-white/10 hover:bg-white/20 border-none px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{u}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab 2: Chemistry & Tech */}
                <TabsContent value="chemistry" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-8 lg:grid-cols-3">
                        <Card className="lg:col-span-2 border-none bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div className="space-y-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                    <FlaskConical className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-4xl font-black italic tracking-tight">The Core Chemistry</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Alle Versalis Styrolpolymere basieren auf der Polymerisation von Styrolmonomeren. Jedoch definieren Additive und Copolymerisation die finalen Eigenschaften.
                                </p>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                    <h4 className="text-lg font-bold text-primary">Masse-Verfahren</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                                        Extrem rein, farbneutral und kosteneffizient. Eingesetzt bei Edistir® (GPPS/HIPS) und bestimmten Kostil® (SAN) Typen.
                                    </p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                    <h4 className="text-lg font-bold text-blue-500">Emulsions-Verfahren</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                                        Ermöglicht höhere Kautschukgehalte für extreme Schlagzähigkeit. Typisch für hochwertige Sinkral® (ABS) Spezialgrade.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Parameter-Lexikon</h4>
                                <div className="space-y-4">
                                    {[
                                        { name: "Vicat Softening Point", desc: "Temperatur, bei der das Material unter Last weich wird. Kritisch für Dimensionsstabilität in heißen Umgebungen." },
                                        { name: "MFI (Melt Flow Index)", desc: "Maß für die Fließfähigkeit. Hoher MFI = Einfache Verarbeitung komplexer Teile; Niedriger MFI = Bessere mechanische Werte." },
                                        { name: "Izod/Charpy Impact", desc: "Widerstand gegen plötzliche Bruchlast. ABS glänzt hier durch die Butadien-Komponente." }
                                    ].map(item => (
                                        <div key={item.name} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                            <Activity className="h-5 w-5 text-primary shrink-0" />
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{item.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-8">
                            <Card className="border-none bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/20">
                                <Atom className="h-12 w-12 mb-6" />
                                <h3 className="text-2xl font-black italic mb-4">Wussten Sie?</h3>
                                <p className="text-blue-50 leading-relaxed font-medium">
                                    ABS besteht aus drei Komponenten. Das **Butadien** bildet feine Gummipartikel in einer steifen **SAN-Matrix**. Diese Partikel stoppen Risswachstum – das Geheimnis der Schlagzähigkeit.
                                </p>
                            </Card>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Link</h4>
                                <p className="text-[11px] text-muted-foreground">Laden Sie die vollen technischen Datenblätter im Regulatory Hub herunter.</p>
                                <Button variant="outline" className="w-full rounded-xl text-xs font-bold" asChild>
                                    <Link href="/regulatory">Direct to Hub</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab 3: Comparator */}
                <TabsContent value="comparator" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-8">
                        <div className="max-w-3xl space-y-4">
                            <h2 className="text-4xl font-black italic tracking-tight flex items-center gap-3">
                                <Scale className="h-8 w-8 text-primary" />
                                Interactive Grade Comparator
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Wählen Sie bis zu drei Materialien aus der Datenbank aus, um ihre physikalischen Eigenschaften detailliert gegenüberzustellen.
                            </p>
                        </div>
                        <GradeComparator products={products as any} />
                    </div>
                </TabsContent>

                {/* Tab 4: Processing */}
                <TabsContent value="processing" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-8">
                        <div className="max-w-3xl space-y-4">
                            <h2 className="text-4xl font-black italic tracking-tight flex items-center gap-3">
                                <Activity className="h-8 w-8 text-orange-500" />
                                Processing & Manufacturing
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Optimale Druckergebnisse und Spritzgusszyklen hängen von der exakten Einhaltung der thermischen Parameter ab.
                            </p>
                        </div>
                        <ProcessingGuide />
                    </div>
                </TabsContent>

                {/* Tab 5: Sustainability */}
                <TabsContent value="sustainability" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="h-16 w-16 rounded-[2rem] bg-emerald-500/20 flex items-center justify-center">
                                    <Trees className="h-8 w-8 text-emerald-500" />
                                </div>
                                <h2 className="text-5xl font-black italic tracking-tight text-emerald-500">Versalis Revive®</h2>
                                <p className="text-xl text-foreground font-bold tracking-tight">Kompaktlösungen für die Kreislaufwirtschaft.</p>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                Die Revive® Produktlinie kombiniert Post-Consumer-Abfälle (PCR) mit Frischware, ohne Kompromisse bei den mechanischen Eigenschaften einzugehen.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { title: "Revive® EPS", body: "Enthält bis zu 35% recyceltes Material. Perfekt für Dämmstoffe mit reduziertem CO2-Fußabdruck." },
                                    { title: "Revive® PS", body: "Entwickelt für High-End-Anwendungen in der Logistik- und Verpackungsindustrie." },
                                    { title: "Circular Economy", body: "Versalis investiert massiv in mechanisches und chemisches Recycling (Hoop® Projekt)." }
                                ].map(item => (
                                    <div key={item.title} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                                        <h5 className="font-black text-emerald-500 uppercase tracking-widest text-[10px] mb-2">{item.title}</h5>
                                        <p className="text-sm font-medium leading-relaxed">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full group-hover:bg-emerald-500/20 transition-all" />
                            <Card className="relative border-none bg-slate-900/50 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 space-y-10">
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-black italic">Der Weg zur Klimaneutralität</h4>
                                    <div className="h-1 w-20 bg-emerald-500" />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-6 items-start">
                                        <div className="h-10 w-10 p-2 rounded-full border-2 border-emerald-500 flex items-center justify-center font-black text-emerald-500 shrink-0">1</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">Phasing out fossil-only feedstock through bio-attributed monomers.</p>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="h-10 w-10 p-2 rounded-full border-2 border-emerald-500 flex items-center justify-center font-black text-emerald-500 shrink-0">2</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">Revolutionary mechanical recycling for highest purity standards.</p>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="h-10 w-10 p-2 rounded-full border-2 border-emerald-500 flex items-center justify-center font-black text-emerald-500 shrink-0">3</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed italic">Design for recycling approach for all new products.</p>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col gap-3">
                                    <Button className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-emerald-600 hover:bg-emerald-500">Download CSR Report</Button>
                                    <Button variant="ghost" className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs text-muted-foreground">Certified ISO 14001</Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
