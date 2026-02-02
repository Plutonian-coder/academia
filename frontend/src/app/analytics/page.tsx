'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Target,
    AlertTriangle,
    Zap
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import CourseDifficultyChart from '@/components/CourseDifficultyChart';
import PerformanceQuadrantChart from '@/components/PerformanceQuadrantChart';
import GradeDonutChart from '@/components/GradeDonutChart';
import StatePerformanceChart from '@/components/StatePerformanceChart';

import { getDashboardInsights, DashboardInsights } from '@/lib/api';

export default function AnalyticsPage() {
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const data = await getDashboardInsights();
                setInsights(data);
            } catch (err) {
                setError('Failed to load analytics data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 animate-pulse">Loading Deep Analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !insights) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 dark:text-red-400">{error || 'Something went wrong.'}</p>
                </div>
            </div>
        );
    }

    // Derived Analytics
    const totalGrades = Object.values(insights.grade_distribution).reduce((a, b) => a + b, 0);
    const passingGrades = (insights.grade_distribution['A'] || 0) + (insights.grade_distribution['AB'] || 0) +
        (insights.grade_distribution['B'] || 0) + (insights.grade_distribution['BC'] || 0) +
        (insights.grade_distribution['C'] || 0);
    const overallPassRate = totalGrades > 0 ? ((passingGrades / totalGrades) * 100).toFixed(1) : '0';

    const hardestCourse = insights.course_difficulty?.[0];
    const easiestCourse = insights.course_difficulty?.slice(-1)[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Deep Analytics</h1>
                    <p className="text-muted-foreground">Diagnostic insights beyond surface-level metrics.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                    <Zap className="h-3 w-3" />
                    AI-Powered
                </div>
            </div>

            {/* Key Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-black border-emerald-200 dark:border-emerald-800 shadow-premium">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <Target className="h-4 w-4" /> Overall Grade Pass Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">{overallPassRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Grades C and above</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-black border-red-200 dark:border-red-800 shadow-premium">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" /> Hardest Course (Gatekeeper)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900 dark:text-red-100">{hardestCourse?.course_code || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">{hardestCourse?.fail_rate || 0}% Failure Rate</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-black border-blue-200 dark:border-blue-800 shadow-premium">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Easiest Course
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{easiestCourse?.course_code || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">{easiestCourse?.pass_rate || 0}% Pass Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Course Difficulty - The Gatekeeper */}
                <div className="col-span-12 lg:col-span-6 h-[400px]">
                    <CourseDifficultyChart data={insights.course_difficulty || []} />
                </div>

                {/* Performance Quadrant - Attendance vs Score */}
                <div className="col-span-12 lg:col-span-6 h-[400px]">
                    <PerformanceQuadrantChart data={insights.performance_quadrant || []} />
                </div>

                {/* Grade Distribution */}
                <div className="col-span-12 lg:col-span-6 h-[400px]">
                    <GradeDonutChart data={insights.grade_distribution} />
                </div>

                {/* Geographic Performance */}
                <div className="col-span-12 lg:col-span-6 h-[400px]">
                    <StatePerformanceChart data={insights.geo_performance} />
                </div>
            </div>

            {/* Insights Summary */}
            <Card className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        Key Takeaways
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700">
                        <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">📌 Curriculum Review Needed</h4>
                        <p className="text-xs text-muted-foreground">
                            The course <strong>{hardestCourse?.course_code}</strong> has a <strong>{hardestCourse?.fail_rate}%</strong> failure rate.
                            Consider reviewing teaching methods, resource availability, or prerequisite requirements.
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700">
                        <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">📈 Attendance Correlation</h4>
                        <p className="text-xs text-muted-foreground">
                            The Performance Quadrant shows a clear trend: students with higher attendance rates tend to achieve better scores.
                            Emphasize attendance tracking as a key retention metric.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
