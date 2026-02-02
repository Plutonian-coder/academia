'use client';

import { Card, Title, BarChart } from '@tremor/react';
import { StatePerformance } from '@/types';

interface StatePerformanceMapProps {
    data: StatePerformance[];
}

export default function StatePerformanceMap({ data }: StatePerformanceMapProps) {
    // Sort by average CGPA descending and take top 15
    const topStates = [...data]
        .sort((a, b) => b.average_cgpa - a.average_cgpa)
        .slice(0, 15);

    const chartData = topStates.map((item) => ({
        state: item.state,
        'Average CGPA': parseFloat(item.average_cgpa.toFixed(2)),
        'Student Count': item.student_count,
    }));

    return (
        <Card>
            <Title>State Performance (Top 15)</Title>
            <BarChart
                className="mt-6"
                data={chartData}
                index="state"
                categories={['Average CGPA']}
                colors={['emerald']}
                valueFormatter={(value) => value.toFixed(2)}
                yAxisWidth={80}
                showLegend={false}
                layout="vertical"
            />
            <div className="mt-4">
                <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                    Showing top 15 states by average CGPA. Hover over bars for student count.
                </p>
            </div>
        </Card>
    );
}
