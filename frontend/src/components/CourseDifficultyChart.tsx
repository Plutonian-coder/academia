"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface CourseDifficultyChartProps {
    data: { course_code: string; pass_rate: number; fail_rate: number }[];
}

export default function CourseDifficultyChart({ data }: CourseDifficultyChartProps) {
    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Course Difficulty Index
                    </CardTitle>
                    <CardDescription className="text-xs">
                        High failure rates indicate potential "Gatekeeper" courses
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        stackOffset="expand"
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="course_code"
                            type="category"
                            width={60}
                            tick={{ fontSize: 11, fontWeight: 600, fill: '#374151' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar dataKey="pass_rate" name="Pass Rate" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="fail_rate" name="Failure Rate" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
