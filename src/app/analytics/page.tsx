"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell, Legend } from "recharts"
import { MainLayout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const monthlySubculturesData = [
  { month: "January", total: Math.floor(Math.random() * 100) + 50 },
  { month: "February", total: Math.floor(Math.random() * 100) + 50 },
  { month: "March", total: Math.floor(Math.random() * 100) + 50 },
  { month: "April", total: Math.floor(Math.random() * 100) + 50 },
  { month: "May", total: Math.floor(Math.random() * 100) + 50 },
  { month: "June", total: Math.floor(Math.random() * 100) + 50 },
]

const subcultureChartConfig = {
  total: {
    label: "Subcultures",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const contaminationData = [
    { name: 'Clean', value: 400, fill: "hsl(var(--primary))" },
    { name: 'Contaminated', value: 89, fill: "hsl(var(--accent))"},
];

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
  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Monthly Analytics
          </h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Contamination Rate</CardTitle>
              <CardDescription>Overview of contaminated vs. clean cultures.</CardDescription>
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

                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              className="fill-foreground text-sm font-semibold"
                            >
                              {contaminationData[index].name} ({value})
                            </text>
                          )
                        }}
                      >
                         {contaminationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
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
