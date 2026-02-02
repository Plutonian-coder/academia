'use client';

import { Card, Metric, Text, Flex, BadgeDelta } from '@tremor/react';
import { PerformanceMetrics } from '@/types';
import { TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';

interface KPICardsProps {
    metrics: PerformanceMetrics;
}

export default function KPICards({ metrics }: KPICardsProps) {
    const kpis = [
        {
            title: 'Total Students',
            metric: metrics.total_students.toLocaleString(),
            icon: Users,
            color: 'blue',
            deltaType: 'unchanged' as const,
        },
        {
            title: 'Average CGPA',
            metric: metrics.average_cgpa.toFixed(2),
            icon: TrendingUp,
            color: 'emerald',
            deltaType: metrics.average_cgpa >= 3.0 ? ('moderateIncrease' as const) : ('moderateDecrease' as const),
            delta: `${metrics.average_cgpa >= 3.0 ? 'Above' : 'Below'} 3.0 threshold`,
        },
        {
            title: 'Average Attendance',
            metric: `${metrics.average_attendance.toFixed(1)}%`,
            icon: Award,
            color: 'violet',
            deltaType: metrics.average_attendance >= 75 ? ('moderateIncrease' as const) : ('moderateDecrease' as const),
            delta: `${metrics.average_attendance >= 75 ? 'Good' : 'Needs improvement'}`,
        },
        {
            title: 'Excellent Performers',
            metric: metrics.excellent_performers.toLocaleString(),
            icon: Award,
            color: 'amber',
            deltaType: 'moderateIncrease' as const,
            delta: `${((metrics.excellent_performers / metrics.total_students) * 100).toFixed(1)}% of total`,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <Card key={kpi.title} decoration="top" decorationColor={kpi.color}>
                        <Flex alignItems="start">
                            <div className="flex-1">
                                <Text>{kpi.title}</Text>
                                <Metric>{kpi.metric}</Metric>
                            </div>
                            <Icon className={`h-8 w-8 text-${kpi.color}-500`} />
                        </Flex>
                        {kpi.delta && (
                            <Flex className="mt-4">
                                <BadgeDelta deltaType={kpi.deltaType} size="xs">
                                    {kpi.delta}
                                </BadgeDelta>
                            </Flex>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
