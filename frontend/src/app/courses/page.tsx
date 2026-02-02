'use client';

import { useState, useEffect } from 'react';
import {
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    BarChart2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@tremor/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

import { getDashboardInsights, DashboardInsights } from '@/lib/api';

export default function CoursesPage() {
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

    const courseData = insights?.course_difficulty || [];

    // Sort by failure rate descending for the table
    const sortedCourses = [...courseData].sort((a, b) => b.fail_rate - a.fail_rate);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Course Analysis</h1>
                    <p className="text-muted-foreground">Identify "Gatekeeper" courses and curriculum health.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-emerald-500 dark:bg-slate-900">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Courses</p>
                        <p className="text-3xl font-bold mt-1">{courseData.length}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 dark:bg-slate-900">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">High Pass Rate ({">"} 80%)</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">{courseData.filter(c => c.pass_rate > 80).length}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 dark:bg-slate-900">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Medium (50-80%)</p>
                        <p className="text-3xl font-bold mt-1 text-amber-600">{courseData.filter(c => c.pass_rate >= 50 && c.pass_rate <= 80).length}</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 dark:bg-slate-900">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical ({"<"} 50%)</p>
                        <p className="text-3xl font-bold mt-1 text-red-600">{courseData.filter(c => c.pass_rate < 50).length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart */}
            <Card className="shadow-premium border-none rounded-xl bg-white dark:bg-neutral-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-emerald-600" />
                        Course Performance Overview
                    </CardTitle>
                    <CardDescription>Pass vs Failure Rate by Course Code</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={courseData} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="course_code" tick={{ fontSize: 11, fontWeight: 600 }} />
                            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Legend />
                            <Bar dataKey="pass_rate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="fail_rate" name="Fail Rate %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Course Table */}
            <Card className="shadow-premium border-none rounded-xl bg-white dark:bg-neutral-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                        Course Leaderboard (Sorted by Difficulty)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Rank</th>
                                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Course Code</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Pass Rate</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Fail Rate</th>
                                    <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedCourses.map((course, index) => (
                                    <tr key={course.course_code} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 px-4 font-mono text-muted-foreground">#{index + 1}</td>
                                        <td className="py-3 px-4 font-semibold">{course.course_code}</td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-green-600 font-medium">{course.pass_rate}%</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <span className="text-red-600 font-medium">{course.fail_rate}%</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {course.pass_rate >= 80 ? (
                                                <Badge color="emerald" size="sm"><CheckCircle2 className="h-3 w-3 mr-1 inline" />Healthy</Badge>
                                            ) : course.pass_rate >= 50 ? (
                                                <Badge color="amber" size="sm"><AlertTriangle className="h-3 w-3 mr-1 inline" />Needs Review</Badge>
                                            ) : (
                                                <Badge color="red" size="sm"><XCircle className="h-3 w-3 mr-1 inline" />Critical</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
