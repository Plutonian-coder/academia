'use client';

import { useState } from 'react';
import {
    Users,
    Search,
    LayoutDashboard,
    AlertTriangle,
    BarChart2,
    Activity
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import StudentSearch from '@/components/StudentSearch';
import StudentProfileCard from '@/components/StudentProfileCard';
import TranscriptTable from '@/components/TranscriptTable';
import StudentRadarChart from '@/components/StudentRadarChart';
import StudentBarChart from '@/components/StudentBarChart';

import {
    getStudentDetails,
    StudentDetails
} from '@/lib/api';

export default function StudentsPage() {
    const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = async (studentId: string) => {
        try {
            setIsSearching(true);
            setSearchError(null);
            const student = await getStudentDetails(studentId);
            setSelectedStudent(student);
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : 'Failed to find student');
            setSelectedStudent(null);
        } finally {
            setIsSearching(false);
        }
    };

    // Transform courses for charts
    const radarData = selectedStudent?.courses.map(c => ({
        course_code: c.course_code,
        score: c.total_score,
        max: 100
    })) || [];

    const barData = selectedStudent?.courses.map(c => ({
        course_code: c.course_code,
        total_score: c.total_score,
        grade: c.grade
    })) || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Student Inspector</h1>
                    <p className="text-muted-foreground">Detailed academic records, performance charts, and individual metrics.</p>
                </div>
            </div>

            <Card className="shadow-premium border-none rounded-xl bg-white dark:bg-slate-900 min-h-[600px]">
                <CardHeader className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        Student Database
                    </CardTitle>
                    <CardDescription>
                        Search by Student ID (e.g., P/ND/23/76174) to view detailed analytics
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex w-full items-center space-x-2 mb-8 max-w-lg mx-auto">
                        <StudentSearch onSearch={handleSearch} isLoading={isSearching} />
                    </div>

                    {searchError && (
                        <div className="mx-auto max-w-lg p-4 mb-6 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2 border border-red-100 dark:border-red-800">
                            <AlertTriangle className="h-4 w-4" />
                            {searchError}
                        </div>
                    )}

                    {selectedStudent && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            {/* Row 1: Profile Card + Efficiency */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                <StudentProfileCard student={selectedStudent} />
                                <Card className="border border-gray-100 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-center items-center bg-emerald-50/30 dark:bg-emerald-900/10">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold mb-6 text-emerald-900 dark:text-emerald-200">Efficiency Rating</h3>
                                        <div className="relative flex items-center justify-center">
                                            <div className="text-6xl font-mono font-bold tracking-tighter text-emerald-600 dark:text-emerald-400">
                                                {(selectedStudent.gpa / 4.0 * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-4">
                                            Based on GPA vs Attendance ratio
                                        </p>
                                        {selectedStudent.std_dev !== undefined && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Score Volatility: <span className={selectedStudent.consistency_status === 'Volatile' ? 'text-red-500 font-semibold' : 'text-green-600 font-semibold'}>{selectedStudent.std_dev.toFixed(1)} σ</span>
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            {/* Row 2: Charts */}
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="h-[320px]">
                                    <StudentBarChart
                                        data={barData}
                                        studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                                    />
                                </div>
                                <div className="h-[320px]">
                                    <StudentRadarChart
                                        data={radarData}
                                        studentName={`${selectedStudent.first_name} ${selectedStudent.last_name}`}
                                    />
                                </div>
                            </div>

                            {/* Row 3: Transcript */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                                    Academic Transcript
                                </h3>
                                <TranscriptTable courses={selectedStudent.courses} />
                            </div>
                        </div>
                    )}

                    {!selectedStudent && !searchError && (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 ring-1 ring-slate-100 dark:ring-slate-700">
                                <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">No Student Selected</h3>
                            <p className="text-sm max-w-sm mt-2 text-slate-500 dark:text-slate-400">
                                Enter a valid Student ID above to retrieve their complete academic record, performance charts, and transcript.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
