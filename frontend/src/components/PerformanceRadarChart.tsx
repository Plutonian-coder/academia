"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

interface PerformanceRadarChartProps {
  data: { subject: string; A: number; fullMark: number }[]
  title: string
}

export default function PerformanceRadarChart({ data, title }: PerformanceRadarChartProps) {
  return (
    <Card className="h-full shadow-premium border-none rounded-xl bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
          {title}
        </CardTitle>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground/50" />
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Performance"
              dataKey="A"
              stroke="#065f46"
              strokeWidth={2}
              fill="#065f46"
              fillOpacity={0.2}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              itemStyle={{ color: '#065f46', fontWeight: 600 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
