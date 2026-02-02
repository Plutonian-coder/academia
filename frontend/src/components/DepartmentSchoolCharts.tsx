'use client';

import { Card, Title, BarChart, DonutChart } from '@tremor/react';
import { DepartmentPerformance, SchoolPerformance } from '@/types';

interface DepartmentSchoolChartsProps {
    departmentData: DepartmentPerformance[];
    schoolData: SchoolPerformance[];
}

export default function DepartmentSchoolCharts({
    departmentData,
    schoolData,
}: DepartmentSchoolChartsProps) {
    // Sort departments by CGPA
    const sortedDepartments = [...departmentData]
        .sort((a, b) => b.average_cgpa - a.average_cgpa)
        .slice(0, 10);

    const departmentChartData = sortedDepartments.map((item) => ({
        department: item.department,
        'Average CGPA': parseFloat(item.average_cgpa.toFixed(2)),
    }));

    const schoolChartData = schoolData.map((item) => ({
        name: item.school,
        'Student Count': item.student_count,
    }));

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <Title>Department Performance (Top 10)</Title>
                <BarChart
                    className="mt-6"
                    data={departmentChartData}
                    index="department"
                    categories={['Average CGPA']}
                    colors={['violet']}
                    valueFormatter={(value) => value.toFixed(2)}
                    yAxisWidth={120}
                    showLegend={false}
                    layout="vertical"
                />
            </Card>

            <Card>
                <Title>Student Distribution by School</Title>
                <DonutChart
                    className="mt-6"
                    data={schoolChartData}
                    category="Student Count"
                    index="name"
                    valueFormatter={(value) => value.toLocaleString()}
                    colors={['blue', 'cyan', 'indigo', 'violet', 'purple']}
                />
                <div className="mt-4 space-y-2">
                    {schoolData.map((school) => (
                        <div
                            key={school.school}
                            className="flex items-center justify-between text-sm"
                        >
                            <span className="text-tremor-content dark:text-dark-tremor-content">
                                {school.school}
                            </span>
                            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {school.student_count} students (Avg CGPA: {school.average_cgpa.toFixed(2)})
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
