"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface CourseDifficultyChartProps {
    data: { course_code: string; pass_rate: number; fail_rate: number }[];
}

export default function CourseDifficultyChart({ data }: CourseDifficultyChartProps) {
    return (
        <Card className="h-full border-none rounded-none bg-black">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xs font-mono font-bold tracking-widest text-[#BFF549] uppercase flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-[#BFF549]" />
                        Course Difficulty Index
                    </CardTitle>
                    <CardDescription className="text-xs text-neutral-500 font-mono">
                        Gatekeeper Course Analysis
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
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="course_code"
                            type="category"
                            width={60}
                            tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af', fontFamily: 'monospace' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: "0px", border: "1px solid #333", backgroundColor: "#000", color: "#fff" }}
                            itemStyle={{ fontFamily: 'monospace' }}
                        />
                        <Legend iconType="square" wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontFamily: 'monospace' }} />
                        <Bar dataKey="pass_rate" name="Pass Rate" stackId="a" fill="#333" radius={[0, 0, 0, 0]} barSize={20} />
                        <Bar dataKey="fail_rate" name="Failure Rate" stackId="a" fill="#BFF549" radius={[0, 0, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
