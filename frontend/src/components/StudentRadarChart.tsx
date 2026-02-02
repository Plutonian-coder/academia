"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity } from "lucide-react"

interface StudentRadarChartProps {
    data: { course_code: string; score: number; max: number }[];
    studentName?: string;
}

export default function StudentRadarChart({ data, studentName }: StudentRadarChartProps) {
    // Transform data for radar chart
    const radarData = data.map(item => ({
        subject: item.course_code,
        score: item.score,
        fullMark: item.max
    }));

    return (
        <Card className="h-full shadow-premium border-none rounded-xl bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    Course Performance Radar
                </CardTitle>
                <CardDescription className="text-xs">
                    {studentName ? `${studentName}'s` : 'Student'} scores across enrolled courses
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fontSize: 9 }}
                        />
                        <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#065f46"
                            fill="#10b981"
                            fillOpacity={0.5}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
