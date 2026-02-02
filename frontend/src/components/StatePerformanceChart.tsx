"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

interface StatePerformanceChartProps {
    data: { State_of_Origin: string; avg_gpa: number }[]
}

export default function StatePerformanceChart({ data }: StatePerformanceChartProps) {
    // Sort and take top 5 for the bottom grid
    const chartData = data
        ? [...data].sort((a, b) => b.avg_gpa - a.avg_gpa).slice(0, 5)
        : [];

    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
                    STATE PERFORMANCE
                </CardTitle>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="0" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="State_of_Origin"
                            type="category"
                            width={80}
                            tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Bar
                            dataKey="avg_gpa"
                            fill="#065f46" /* Emerald 800 */
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
