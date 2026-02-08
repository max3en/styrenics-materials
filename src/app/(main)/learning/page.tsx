import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    Scale,
    BrainCircuit,
    Settings2,
    Gem,
    ArrowRightLeft,
    Microscope,
    Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GradeComparator } from "@/components/learning/grade-comparator";
import { ProcessingGuide } from "@/components/learning/processing-guide";
import { TroubleshootingGuide } from "@/components/learning/troubleshooting-guide";
import { SubstitutionMatrix } from "@/components/learning/substitution-matrix";

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
        <div className="space-y-16 pb-24 text-foreground max-w-7xl mx-auto px-4">
            {/* Hero: Emotional & Scientific */}
            <section className="relative overflow-hidden pt-16 pb-8">
                <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-primary/10 rounded-full blur-[140px] -mr-48 -mt-48 animate-pulse" />
                <div className="absolute bottom-0 left-0 h-[400px] w-[400px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />

                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.2em] w-fit border border-primary/20 backdrop-blur-md">
                        <BrainCircuit className="h-3.5 w-3.5" />
                        Mastery Level: Technical Sales Expert
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent italic">
                        Science <br /> <span className="text-primary not-italic">of Materials.</span>
                    </h1>
                    <p className="text-muted-foreground text-2xl max-w-3xl leading-relaxed font-medium">
                        Vom Monomer zum präzisen Bauteil. Beherrschen Sie die physikalischen Gesetze der Styrenics, um in jedem Verkaufsgespräch durch technische Souveränität zu glänzen.
                    </p>
                </div>
            </section>

            <Tabs defaultValue="mastery" className="space-y-12">
                <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-2xl border-b border-white/5 pb-6 -mx-4 px-4 pt-4">
                    <TabsList className="bg-white/5 h-16 p-1.5 rounded-3xl border border-white/10 w-full lg:w-auto overflow-x-auto overflow-y-hidden shadow-2xl">
                        <TabsTrigger value="mastery" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">The Journey</TabsTrigger>
                        <TabsTrigger value="foundations" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">Foundations</TabsTrigger>
                        <TabsTrigger value="expert" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">Chemistry</TabsTrigger>
                        <TabsTrigger value="comparator" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">Comparison</TabsTrigger>
                        <TabsTrigger value="troubleshooting" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">Defects Guide</TabsTrigger>
                        <TabsTrigger value="strategist" className="rounded-2xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary h-full">Substitution</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab: Mastery Journey */}
                <TabsContent value="mastery" className="space-y-16 outline-none animate-in fade-in duration-700">
                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            { step: "01", title: "Grundlagen", desc: "Molekulargewicht, Schmelzfluss und Dichte verstehen.", icon: Microscope },
                            { step: "02", title: "Analyse", desc: "Technische Datenblätter lesen und interpretieren.", icon: Target },
                            { step: "03", title: "Problemlösung", desc: "Fehlerbilder im Spritzguss erkennen und beheben.", icon: Settings2 }
                        ].map(item => (
                            <div key={item.step} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative group overflow-hidden">
                                <div className="absolute -top-4 -right-4 text-8xl font-black opacity-5 group-hover:scale-110 transition-transform">{item.step}</div>
                                <item.icon className="h-10 w-10 text-primary mb-6 group-hover:rotate-12 transition-transform" />
                                <h3 className="text-xl font-black italic mb-2 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Card className="border-none bg-gradient-to-br from-primary/30 via-white/5 to-transparent backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 group">
                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h3 className="text-5xl font-black tracking-tighter italic">Die Styrenics Matrix</h3>
                                <p className="text-xl text-foreground font-medium leading-relaxed">
                                    Polystyrol (GPPS/HIPS), SAN und ABS bilden ein Kontinuum von Eigenschaften. Wir erklären, warum ABS schlagzäh ist, SAN glasklar und HIPS die Brücke dazwischen bildet.
                                </p>
                                <div className="flex gap-4">
                                    <Button className="rounded-2xl h-14 px-10 font-black uppercase text-xs" asChild>
                                        <Link href="#expert">Zur Chemie &rarr;</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="h-80 w-80 bg-primary/20 blur-[80px] rounded-full absolute" />
                                <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                                    <Atom className="h-32 w-32 text-primary animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Tab: foundations (Material Families) */}
                <TabsContent value="foundations" className="space-y-12 outline-none animate-in fade-in duration-700">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {FAMILIES.map(family => (
                            <Card key={family.id} className="border-none bg-white/5 backdrop-blur-md overflow-hidden rounded-[2.5rem] border border-white/5 group transition-all hover:bg-white/10">
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

                                    <div className="grid grid-cols-2 gap-6">
                                        {family.properties.map(prop => (
                                            <div key={prop.label} className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    <span>{prop.label}</span>
                                                    <span className={family.textColor}>{prop.value}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/5 rounded-full p-0.5 overflow-hidden">
                                                    <div className={cn("h-full rounded-full transition-all duration-1000", family.color)} style={{ width: `${prop.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 flex flex-wrap gap-3">
                                        {family.useCases.map(u => (
                                            <Badge key={u} variant="secondary" className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{u}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Tab: Expert Chemistry */}
                <TabsContent value="expert" className="space-y-16 outline-none animate-in fade-in duration-700">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-12">
                            <Card className="border-none bg-white/5 rounded-[3rem] border border-white/10 p-12 space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-[1.5rem] bg-primary/20 flex items-center justify-center">
                                        <Waves className="h-10 w-10 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black italic tracking-tighter">Morphologie & Gefüge</h3>
                                        <p className="text-lg text-muted-foreground font-medium tracking-tight">Was im Inneren passiert.</p>
                                    </div>
                                </div>

                                <div className="grid gap-8 sm:grid-cols-2">
                                    <div className="space-y-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 transition-all hover:border-primary/20">
                                        <h4 className="text-xl font-bold text-primary italic">Phasenmodell</h4>
                                        <p className="text-sm text-foreground/70 leading-relaxed">
                                            In ABS existiert eine **kontinuierliche Phase** (SAN) und eine **disperse Phase** (Butadien-Kautschuk). Die Kautschuk-Teilchen binden durch Pfropfung an das SAN – das sorgt für die Zähigkeit bei Kälte.
                                        </p>
                                    </div>
                                    <div className="space-y-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 transition-all hover:border-blue-500/20">
                                        <h4 className="text-xl font-bold text-blue-500 italic">Copolymerisation</h4>
                                        <p className="text-sm text-foreground/70 leading-relaxed">
                                            SAN verbessert PS durch die Zugabe von **Acrylnitril**. Dies erhöht die chemische Beständigkeit gegen Fette und Treibstoffe sowie die thermische Belastbarkeit.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-8">
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Analytik & Grenzwerte</h4>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Schergeschwindigkeit", desc: "Besonders kritisch für ABS. Zu hohe Scherung kann die Kautschukpartikel zerstören (Glanzverlust)." },
                                            { name: "Orientierung / Eigenspannung", desc: "Molekülketten richten sich in Fließrichtung aus. Dies führt bei SAN oft zum optischen Verzug." },
                                            { name: "Molekulargewicht (Mw)", desc: "Bestimmt die Schmelzefestigkeit. Hohe Mw für Extrusion, niedrigere für dünnwandigen Spritzguss." }
                                        ].map(item => (
                                            <div key={item.name} className="flex gap-6 p-6 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-primary italic shrink-0">?</div>
                                                <div>
                                                    <p className="font-bold text-lg tracking-tight mb-1">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="border-none bg-primary rounded-[3rem] p-12 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
                                <Zap className="absolute top-0 right-0 h-40 w-40 -mr-20 -mt-20 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                                <Gem className="h-16 w-16 mb-8" />
                                <h3 className="text-3xl font-black italic mb-6">Expert Knowledge</h3>
                                <p className="text-primary-foreground/90 text-lg leading-relaxed font-bold">
                                    "Wussten Sie, dass der **Glanzgrad** bei ABS maßgeblich von der Größe der Gummipartikel abhängt? Kleinere Partikel sorgen für Hochglanz, größere für matte Oberflächen."
                                </p>
                            </Card>
                            <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 space-y-6 text-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                                    <Thermometer className="h-8 w-8 text-primary" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tighter">Thermal Stability</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Lernen Sie die Vicat-Profile im Comparator kennen, um die ideale Einsatztemperatur für Ihre Kundenanwendung zu finden.
                                </p>
                                <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]" asChild>
                                    <Link href="#comparator">Materialien Vergleichen</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Comparator */}
                <TabsContent value="comparator" className="outline-none animate-in fade-in duration-700">
                    <div className="space-y-12">
                        <div className="max-w-4xl space-y-6">
                            <h2 className="text-6xl font-black italic tracking-tighter flex items-center gap-4">
                                <Scale className="h-12 w-12 text-primary" />
                                Interactive Comparator
                            </h2>
                            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
                                Wählen Sie bis zu drei Materialien aus der Live-Datenbank aus, um ihre physikalischen Eigenschaften detailliert gegenüberzustellen.
                            </p>
                        </div>
                        <GradeComparator products={products as any} />
                    </div>
                </TabsContent>

                {/* Tab: Troubleshooting Guide */}
                <TabsContent value="troubleshooting" className="outline-none animate-in fade-in duration-700">
                    <div className="space-y-12">
                        <div className="max-w-4xl space-y-6">
                            <h2 className="text-6xl font-black italic tracking-tighter flex items-center gap-4 text-orange-500">
                                <Activity className="h-12 w-12" />
                                Troubleshooting
                            </h2>
                            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
                                Analysieren und beheben Sie typische Verarbeitungsfehler im Spritzguss-Prozess mit wissenschaftlichen Methoden.
                            </p>
                        </div>
                        <TroubleshootingGuide />
                    </div>
                </TabsContent>

                {/* Tab: Strategist (Substitution Matrix) */}
                <TabsContent value="strategist" className="outline-none animate-in fade-in duration-700">
                    <div className="space-y-12">
                        <div className="max-w-4xl space-y-6">
                            <h2 className="text-6xl font-black italic tracking-tighter flex items-center gap-4 text-emerald-500">
                                <ArrowRightLeft className="h-12 w-12" />
                                Market Strategist
                            </h2>
                            <p className="text-2xl text-muted-foreground leading-relaxed font-medium">
                                Wann macht welcher Werkstoff Sinn? Unsere Substitutions-Matrix hilft bei der strategischen Entscheidung zwischen Kosten und Performance.
                            </p>
                        </div>
                        <SubstitutionMatrix />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Footer / CTA Section */}
            <section className="pt-12 pb-24">
                <Card className="border-none shadow-3xl bg-gradient-to-br from-primary/20 via-white/5 to-transparent backdrop-blur-3xl overflow-hidden border border-white/10 group rounded-[4rem]">
                    <CardContent className="p-16 flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="space-y-8 flex-1">
                            <h3 className="text-6xl font-black tracking-tighter italic leading-none">Bereit für den <br /> <span className="text-primary not-italic">echten Vergleich?</span></h3>
                            <p className="text-muted-foreground text-xl max-w-xl leading-relaxed font-medium">
                                Haben Sie die Chemie und die Prozesse verstanden? Jetzt ist es Zeit, die exakten TDS aller Grades direkt gegenüberzustellen.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button className="rounded-2xl h-16 px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all" asChild>
                                    <Link href="/products">
                                        <Search className="mr-3 h-6 w-6" />
                                        Produkt-Explorer
                                    </Link>
                                </Button>
                                <Button variant="outline" className="rounded-2xl h-16 px-12 font-black uppercase tracking-widest text-xs border-white/10 bg-white/5 hover:bg-white/10 transition-all" asChild>
                                    <Link href="/regulatory">TDS Download</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/40 blur-[130px] rounded-full animate-pulse" />
                            <div className="relative flex h-72 w-72 items-center justify-center rounded-[3.5rem] bg-white/5 border border-white/20 backdrop-blur-3xl rotate-[20deg] group-hover:rotate-0 transition-all duration-1000 shadow-2xl">
                                <Layers className="h-32 w-32 text-primary animate-bounce-slow" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
