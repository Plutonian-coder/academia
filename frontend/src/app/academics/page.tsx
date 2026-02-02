'use client';

import { useState, useEffect } from 'react';
import {
    GraduationCap,
    BookOpen,
    Users,
    Award,
    TrendingUp
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import DepartmentBarChart from '@/components/DepartmentBarChart';
import PerformanceRadarChart from '@/components/PerformanceRadarChart';
import TrendLineChart from '@/components/TrendLineChart';

import { getDashboardInsights, DashboardInsights } from '@/lib/api';

export default function AcademicsPage() {
    const [insights, setInsights] = useState<DashboardInsights | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const data = await getDashboardInsights();
                setInsights(data);
            } catch (err) {
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
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
            </div>
        );
    }

    const trendData = insights?.attendance_vs_score.map(item => ({
        label: `${item.attendance}%`,
        value: item.score,
        value2: item.score * 0.95
    })) || [];

    const radarData = [
        { subject: 'Attendance', A: 85, fullMark: 100 },
        { subject: 'Assignments', A: 78, fullMark: 100 },
        { subject: 'Exams', A: 65, fullMark: 100 },
        { subject: 'Participation', A: 90, fullMark: 100 },
        { subject: 'Practicals', A: 70, fullMark: 100 },
        { subject: 'Research', A: 80, fullMark: 100 },
    ];

    const topDepartment = insights?.department_performance?.[0];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Academic Performance</h1>
                <p className="text-muted-foreground">Department-level analytics and competency breakdown.</p>
            </div>

            {/* Highlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Top Performing Dept</p>
                                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{topDepartment?.Department || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">GPA: {topDepartment?.avg_gpa.toFixed(2) || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Total Departments</p>
                                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{insights?.department_performance?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Active Programs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 border-emerald-200 dark:border-emerald-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Institution Avg GPA</p>
                                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{insights?.summary.average_gpa.toFixed(2) || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">All Students</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 h-[400px]">
                    <TrendLineChart
                        data={trendData}
                        title="ATTENDANCE VS PERFORMANCE TREND"
                        subtitle="Correlation Analysis"
                        color="#7c3aed"
                    />
                </div>

                <div className="col-span-12 lg:col-span-4 h-[400px]">
                    <PerformanceRadarChart
                        data={radarData}
                        title="COMPETENCY BREAKDOWN"
                    />
                </div>

                <div className="col-span-12 h-[400px]">
                    <DepartmentBarChart data={insights?.department_performance || []} />
                </div>
            </div>
        </div>
    );
}
