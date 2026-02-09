'use client';

import { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    Users,
    Target,
    AlertTriangle,
    Zap,
    Calendar,
    Filter,
    Download,
    ChevronRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CourseDifficultyChart from '@/components/CourseDifficultyChart';
import PerformanceQuadrantChart from '@/components/PerformanceQuadrantChart';
import GradeDonutChart from '@/components/GradeDonutChart';
import StatePerformanceChart from '@/components/StatePerformanceChart';

import { getDashboardInsights, DashboardInsights } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<string>("All Sessions");
    const [selectedSemester, setSelectedSemester] = useState<string>("All Semesters");

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const data = await getDashboardInsights(selectedSession, selectedSemester);
                setInsights(data);
            } catch (err) {
                setError('Failed to load analytics data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [selectedSession, selectedSemester]);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 dark:border-emerald-400 border-r-transparent" />
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 animate-pulse">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !insights) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="bg-red-50 dark:bg-red-950/30 p-8 rounded-2xl text-center border border-red-200 dark:border-red-900">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-700 dark:text-red-400 font-medium">{error || 'Something went wrong.'}</p>
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

    const handleExport = () => {
        // Mock export functionality
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Metric,Value\n"
            + `Total Students,${insights?.summary.total_students}\n`
            + `Average GPA,${insights?.summary.average_gpa}\n`
            + `Pass Rate,${insights?.summary.pass_rate}%\n`
            + `At Risk,${insights?.summary.at_risk_count}`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "yabatech_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Modern Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            Analytics Dashboard
                        </h1>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                            <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Live</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Real-time insights • {insights.summary.total_students.toLocaleString()} students • Session 2024/2025
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                        <SelectTrigger className="w-[140px] h-9 bg-neutral-900 border-neutral-800 text-white font-mono text-xs">
                            <SelectValue placeholder="Session" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                            <SelectItem value="All Sessions">All Sessions</SelectItem>
                            {insights?.filters?.sessions.map(session => (
                                <SelectItem key={session} value={session}>{session}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                        <SelectTrigger className="w-[150px] h-9 bg-neutral-900 border-neutral-800 text-white font-mono text-xs">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                            <SelectItem value="All Semesters">All Semesters</SelectItem>
                            {insights?.filters?.semesters.map(semester => (
                                <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" size="sm" className="h-9 gap-2 border-neutral-800 bg-black text-neutral-400 hover:text-white hover:border-neutral-600 rounded-md font-mono text-xs hidden md:flex">
                        <Filter className="h-3 w-3" />
                        More Filters
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 border-neutral-800 bg-black text-white hover:border-[#BFF549] rounded-md font-mono text-xs"
                        onClick={handleExport}
                    >
                        <Download className="h-3 w-3" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Premium KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Students */}
                <Card className="relative overflow-hidden border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent dark:from-blue-400/10 rounded-bl-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            Total Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            {insights.summary.total_students.toLocaleString()}
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Active this semester
                        </p>
                    </CardContent>
                </Card>

                {/* Average GPA */}
                <Card className="relative overflow-hidden border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent dark:from-emerald-400/10 rounded-bl-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <Target className="h-3.5 w-3.5" />
                            Average GPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            {insights.summary.average_gpa.toFixed(2)}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Out of 4.00 scale
                        </p>
                    </CardContent>
                </Card>

                {/* Pass Rate */}
                <Card className="relative overflow-hidden border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-400/10 rounded-bl-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Pass Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            {insights.summary.pass_rate}%
                        </div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            GPA ≥ 2.0
                        </p>
                    </CardContent>
                </Card>

                {/* At Risk */}
                <Card className="relative overflow-hidden border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent dark:from-red-400/10 rounded-bl-full" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            At Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">
                            {insights.summary.at_risk_count}
                        </div>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Needs intervention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Insight Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-neutral-900 border-emerald-200 dark:border-emerald-900/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Overall Grade Pass Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">{overallPassRate}%</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Grades C and above</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-neutral-900 border-red-200 dark:border-red-900/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Hardest Course
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-900 dark:text-red-100">{hardestCourse?.course_code || 'N/A'}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{hardestCourse?.fail_rate || 0}% Failure Rate</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-neutral-900 border-blue-200 dark:border-blue-900/50 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Easiest Course
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{easiestCourse?.course_code || 'N/A'}</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{easiestCourse?.pass_rate || 0}% Pass Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Visualization Grid */}
            <div className="grid grid-cols-12 gap-4">
                {/* Course Difficulty */}
                <div className="col-span-12 lg:col-span-6">
                    <Card className="h-[420px] border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Course Difficulty Index</CardTitle>
                                    <CardDescription className="text-xs">Pass/Fail rates across courses</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)]">
                            <CourseDifficultyChart data={insights.course_difficulty || []} />
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Quadrant */}
                <div className="col-span-12 lg:col-span-6">
                    <Card className="h-[420px] border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Performance Quadrant</CardTitle>
                                    <CardDescription className="text-xs">Attendance vs Academic Score</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)]">
                            <PerformanceQuadrantChart data={insights.performance_quadrant || []} />
                        </CardContent>
                    </Card>
                </div>

                {/* Grade Distribution */}
                <div className="col-span-12 lg:col-span-6">
                    <Card className="h-[420px] border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Grade Distribution</CardTitle>
                                    <CardDescription className="text-xs">Overall grade breakdown</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)]">
                            <GradeDonutChart data={insights.grade_distribution} />
                        </CardContent>
                    </Card>
                </div>

                {/* Geographic Performance */}
                <div className="col-span-12 lg:col-span-6">
                    <Card className="h-[420px] border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">State Performance</CardTitle>
                                    <CardDescription className="text-xs">Top performing states by GPA</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)]">
                            <StatePerformanceChart data={insights.geo_performance} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Insights Summary */}
            <Card className="bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                        <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        Key Takeaways
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-sm">
                        <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">📌 Curriculum Review Needed</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            The course <strong>{hardestCourse?.course_code}</strong> has a <strong>{hardestCourse?.fail_rate}%</strong> failure rate.
                            Consider reviewing teaching methods, resource availability, or prerequisite requirements.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 shadow-sm">
                        <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">📈 Attendance Correlation</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            The Performance Quadrant shows a clear trend: students with higher attendance rates tend to achieve better scores.
                            Emphasize attendance tracking as a key retention metric.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
