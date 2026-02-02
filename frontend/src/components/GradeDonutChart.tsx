"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

const COLORS = ['#064e3b', '#047857', '#10b981', '#f59e0b', '#fffbeb'];

interface GradeDonutChartProps {
    data: Record<string, number>
}

export default function GradeDonutChart({ data }: GradeDonutChartProps) {
    // Aggregate data for cleaner chart (Top 5 grades + Others)
    const chartData = Object.entries(data)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    // Using the reference palette: Dark Teal, Emerald, Amber
    const customColors = ['#064e3b', '#0d9488', '#f59e0b', '#1f2937', '#9ca3af', '#e5e7eb'];

    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    GRADE DISTRIBUTION
                </CardTitle>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="40%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={customColors[index % customColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', fontWeight: 500 }}
                            formatter={(value, entry: any) => (
                                <span className="text-slate-600 ml-2">{value} <span className="text-slate-400 ml-1">({entry.payload.value})</span></span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
