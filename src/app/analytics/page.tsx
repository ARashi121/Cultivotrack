
"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts"
import { MainLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getPlants, getHardeningData } from "@/lib/mock-data"
import { SubcultureEvent } from "@/lib/types"
import { FlaskConical, Bug, TrendingUp, ShieldCheck, Bot, FileText } from "lucide-react"
import { format, subMonths } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { generateReport } from "@/app/actions"
import ReactMarkdown from 'react-markdown'
import { useToast } from "@/hooks/use-toast"

// Chart configs can stay outside as they don't depend on random data
const subcultureChartConfig = {
  total: {
    label: "Subcultures",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const contaminationChartConfig = {
  value: {
    label: "Cultures",
  },
  Clean: {
    label: "Clean",
    color: "hsl(var(--primary))",
  },
  Contaminated: {
    label: "Contaminated",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate analytics data from mock data inside useEffect
    const plants = getPlants();
    const allSubcultures: (SubcultureEvent & {plantName: string})[] = [];
    plants.forEach(plant => {
        if (plant.type === 'tc' && plant.subcultureHistory) {
            plant.subcultureHistory.forEach(sc => {
                const contaminatedJars = Math.random() > 0.8 ? Math.floor(Math.random() * (sc.explantCount / 10)) : 0;
                const jarsToHardening = Math.floor(Math.random() * (sc.explantCount / 5));

                allSubcultures.push({
                    ...sc,
                    plantName: plant.name,
                    jarsUsed: sc.explantCount,
                    contaminatedJars: contaminatedJars,
                    jarsToHardening: jarsToHardening,
                } as any)
            });
        }
        if (plant.type === 'development' && plant.protocolExperiments) {
            plant.protocolExperiments.forEach(exp => {
                if (exp.subcultures) {
                    exp.subcultures.forEach(sc => {
                        const contaminatedJars = Math.random() > 0.8 ? Math.floor(Math.random() * (sc.explantCount / 10)) : 0;
                        const jarsToHardening = Math.floor(Math.random() * (sc.explantCount / 5));
                         allSubcultures.push({
                            ...sc,
                            plantName: plant.name,
                            jarsUsed: sc.explantCount,
                            contaminatedJars: contaminatedJars,
                            jarsToHardening: jarsToHardening,
                        } as any)
                    })
                }
            })
        }
    });

    const totalSubcultures = allSubcultures.reduce((acc, sc) => acc + (sc as any).jarsUsed, 0);
    const totalContaminated = allSubcultures.reduce((acc, sc) => acc + (sc as any).contaminatedJars, 0);
    const totalToHardening = allSubcultures.reduce((acc, sc) => acc + (sc as any).jarsToHardening, 0);
    const contaminationRate = totalSubcultures > 0 ? (totalContaminated / totalSubcultures) * 100 : 0;

    const monthlySubculturesData = Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return { month: format(d, 'MMM'), total: 0 };
    });

    allSubcultures.forEach(sc => {
        const monthStr = format(new Date(sc.date), 'MMM');
        const monthlyData = monthlySubculturesData.find(d => d.month === monthStr);
        if(monthlyData) {
            monthlyData.total += (sc as any).jarsUsed;
        }
    })

    const contaminationData = [
        { name: 'Clean', value: totalSubcultures - totalContaminated, fill: "hsl(var(--primary))" },
        { name: 'Contaminated', value: totalContaminated, fill: "hsl(var(--accent))"},
    ];

    setAnalyticsData({
      totalSubcultures,
      totalContaminated,
      totalToHardening,
      contaminationRate,
      monthlySubculturesData,
      contaminationData
    });
    setLoading(false);
  }, []);
  
  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    setReport(null);
    try {
        const plants = getPlants();
        const hardeningData = getHardeningData();
        const result = await generateReport({ plants, hardeningData });
        setReport(result.report);
    } catch (error) {
        console.error("Failed to generate report:", error);
        toast({
            title: "Report Generation Failed",
            description: "An error occurred while generating the AI report. Please try again.",
            variant: "destructive",
        })
    } finally {
        setIsGeneratingReport(false);
    }
  }


  if (loading || !analyticsData) {
    return (
      <MainLayout>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
              Lab Analytics Dashboard
          </h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/2 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4"><CardContent className="pt-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
              <Card className="lg:col-span-3"><CardContent className="pt-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  const { totalSubcultures, totalContaminated, totalToHardening, contaminationRate, monthlySubculturesData, contaminationData } = analyticsData;

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Lab Analytics Dashboard
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subcultures</CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSubcultures.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">jars processed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contamination Rate</CardTitle>
                <Bug className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contaminationRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">{totalContaminated.toLocaleString()} jars affected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transferred to Hardening</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalToHardening.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">jars ready for ex-vitro</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Success Rate</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">{ (100 - contaminationRate).toFixed(1)}%</div>
                 <p className="text-xs text-muted-foreground">clean cultures</p>
              </CardContent>
            </Card>
        </div>
        
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary"/>
                        AI-Powered Performance Report
                    </CardTitle>
                    <CardDescription>Click the button to generate an analysis of your lab's recent performance.</CardDescription>
                </div>
                 <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                    {isGeneratingReport ? 'Generating...' : 'Generate AI Report'}
                </Button>
            </CardHeader>
            <CardContent>
                {isGeneratingReport && (
                    <div className="flex items-center justify-center p-8 space-x-2 text-muted-foreground">
                        <Bot className="h-6 w-6 animate-pulse" />
                        <p className="text-lg">Analyzing your data...</p>
                    </div>
                )}
                {report && (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-lg bg-muted/50 border">
                        <ReactMarkdown
                            components={{
                                h1: ({node, ...props}) => <h2 className="text-2xl font-headline" {...props} />,
                                h2: ({node, ...props}) => <h3 className="text-xl font-headline border-b pb-2" {...props} />,
                                h3: ({node, ...props}) => <h4 className="text-lg font-semibold" {...props} />,
                                p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-1" {...props} />,
                                code: ({node, ...props}) => <code className="bg-primary/10 text-primary font-semibold rounded-sm px-1 py-0.5" {...props} />
                            }}
                        >
                            {report}
                        </ReactMarkdown>
                    </div>
                )}
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Monthly Subcultures</CardTitle>
              <CardDescription>Total number of subcultures performed each month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={subcultureChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySubculturesData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Contamination Overview</CardTitle>
              <CardDescription>Breakdown of contaminated vs. clean cultures.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={contaminationChartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={contaminationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          value,
                          index,
                        }) => {
                          const RADIAN = Math.PI / 180
                          const radius = 25 + innerRadius + (outerRadius - innerRadius)
                          const x = cx + radius * Math.cos(-midAngle * RADIAN)
                          const y = cy + radius * Math.sin(-midAngle * RADIAN)
                          const percent = ((value / totalSubcultures) * 100).toFixed(0);

                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              className="fill-foreground text-sm font-semibold"
                            >
                              {`${contaminationData[index].name} (${percent}%)`}
                            </text>
                          )
                        }}
                      >
                         {contaminationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                       <Legend content={<ChartLegendContent />} />
                    </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

const ChartLegendContent = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap gap-4 justify-center">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};
