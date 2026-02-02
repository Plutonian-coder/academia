"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Crosshair } from "lucide-react"

interface PerformanceQuadrantChartProps {
    data: { x: number; y: number; student_id: string }[];
}

export default function PerformanceQuadrantChart({ data }: PerformanceQuadrantChartProps) {
    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                        <Crosshair className="h-4 w-4 text-emerald-600" />
                        Performance Quadrant
                    </CardTitle>
                    <CardDescription className="text-xs">
                        Correction: Attendance (X) vs Total Score (Y)
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Attendance"
                            unit="%"
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Attendance %', position: 'insideBottomRight', offset: -10, fontSize: 10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Score"
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                            label={{ value: 'Score', angle: -90, position: 'insideLeft', fontSize: 10 }}
                        />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: "8px" }} />

                        {/* Reference Lines for Quadrants */}
                        <ReferenceLine y={50} stroke="#9ca3af" strokeDasharray="3 3">
                            <Label value="Pass Line (50%)" position="insideTopRight" fontSize={10} fill="#6b7280" />
                        </ReferenceLine>
                        <ReferenceLine x={75} stroke="#9ca3af" strokeDasharray="3 3" />

                        <Scatter name="Students" data={data} fill="#065f46" fillOpacity={0.6} />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
