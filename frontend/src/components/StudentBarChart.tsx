"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface StudentBarChartProps {
    data: { course_code: string; total_score: number; grade: string }[];
    studentName?: string;
}

const GRADE_COLORS: Record<string, string> = {
    'A': '#059669',
    'AB': '#10b981',
    'B': '#34d399',
    'BC': '#6ee7b7',
    'C': '#fbbf24',
    'CD': '#f59e0b',
    'D': '#ef4444',
    'E': '#dc2626',
    'F': '#991b1b'
};

export default function StudentBarChart({ data, studentName }: StudentBarChartProps) {
    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Course Scores Breakdown
                </CardTitle>
                <CardDescription className="text-xs">
                    Individual course performance with pass line at 40%
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="course_code"
                            tick={{ fontSize: 10, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <ReferenceLine y={40} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: 'Pass', position: 'left', fontSize: 10, fill: '#9ca3af' }} />
                        <Bar dataKey="total_score" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={GRADE_COLORS[entry.grade] || '#6b7280'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
