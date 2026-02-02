"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

interface TrendLineChartProps {
    data: {
        label: string
        value: number
        value2?: number
    }[]
    title: string
    subtitle: string
    color: string
}

export default function TrendLineChart({ data, title, subtitle, color }: TrendLineChartProps) {
    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">{title}</CardTitle>
                    <CardDescription className="hidden">{subtitle}</CardDescription> {/* Hidden description to match reference minimal style */}
                </div>
                <MoreHorizontal className="h-5 w-5 text-muted-foreground/50" />
            </CardHeader>
            <CardContent className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="label"
                            stroke="#9ca3af"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                fontFamily: "var(--font-sans)",
                                fontSize: "12px"
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#4b5563', top: -40 }}
                        />

                        {/* Actual Performance - Teal */}
                        <Line
                            name="Actual"
                            type="monotone"
                            dataKey="value"
                            stroke="#065f46" // Emerald 800
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#065f46", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />

                        {/* Target/Budget - Orange/Gold */}
                        {data[0]?.value2 !== undefined && (
                            <Line
                                name="Target"
                                type="monotone"
                                dataKey="value2"
                                stroke="#f59e0b" // Amber 500
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
