'use client';

import { Card, Title, BarChart } from '@tremor/react';
import { GradeDistribution } from '@/types';

interface GradeDistributionChartProps {
    data: GradeDistribution[];
}

export default function GradeDistributionChart({ data }: GradeDistributionChartProps) {
    // Transform data for Tremor BarChart
    const chartData = data.map((item) => ({
        grade: item.grade,
        'Number of Students': item.count,
        Percentage: item.percentage,
    }));

    return (
        <Card>
            <Title>Grade Distribution</Title>
            <BarChart
                className="mt-6"
                data={chartData}
                index="grade"
                categories={['Number of Students']}
                colors={['blue']}
                valueFormatter={(value) => value.toLocaleString()}
                yAxisWidth={48}
                showLegend={false}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {data.map((item) => (
                    <div key={item.grade} className="text-center">
                        <p className="text-2xl font-bold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {item.grade}
                        </p>
                        <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                            {item.count} ({item.percentage.toFixed(1)}%)
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
