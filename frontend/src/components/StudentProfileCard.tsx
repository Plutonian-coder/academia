'use client';

import { Card, Metric, Text, Flex, ProgressBar, Badge } from '@tremor/react';
import { StudentDetails } from '@/lib/api';

interface StudentProfileCardProps {
    student: StudentDetails;
}

export default function StudentProfileCard({ student }: StudentProfileCardProps) {
    const getGPAColor = (gpa: number) => {
        if (gpa >= 3.5) return 'emerald';
        if (gpa >= 3.0) return 'teal';
        if (gpa >= 2.5) return 'cyan';
        if (gpa >= 2.0) return 'amber';
        return 'red';
    };

    const getAttendanceColor = (attendance: number) => {
        if (attendance >= 75) return 'emerald';
        if (attendance >= 60) return 'amber';
        return 'red';
    };

    const gpaPercentage = (student.gpa / 4.0) * 100;
    const gpaColor = getGPAColor(student.gpa);
    const attendanceColor = getAttendanceColor(student.attendance_avg);

    return (
        <Card className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-md">
            {/* Header with Name and ID */}
            <div className="border-b border-slate-200 pb-4 mb-4">
                <Flex justifyContent="between" alignItems="start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {student.first_name} {student.last_name}
                        </h2>
                        <Text className="text-slate-500">{student.student_id}</Text>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge color={gpaColor} size="lg">
                            GPA: {student.gpa.toFixed(2)}
                        </Badge>
                        {student.consistency_status && (
                            <Badge
                                color={student.consistency_status === 'Volatile' ? 'red' : student.consistency_status === 'Consistent' ? 'blue' : 'gray'}
                                size="sm"
                            >
                                {student.consistency_status === 'Volatile' ? '⚠️ High Volatility' : student.consistency_status === 'Consistent' ? '✅ Stable Performer' : 'Reliable'}
                            </Badge>
                        )}
                    </div>
                </Flex>
            </div>

            {/* Student Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Department</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.department}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Level</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.level}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Gender</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.gender}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Age</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.age} years</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">State of Origin</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.state_of_origin}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Session</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.session}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Semester</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.semester}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                    <Text className="text-slate-500 text-xs uppercase">Total Units</Text>
                    <p className="font-semibold text-slate-800 text-sm">{student.total_units}</p>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GPA Progress */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <Flex justifyContent="between" alignItems="center" className="mb-2">
                        <Text className="font-medium text-slate-700">GPA Progress</Text>
                        <Metric className="text-2xl">{student.gpa.toFixed(2)}</Metric>
                    </Flex>
                    <ProgressBar value={gpaPercentage} color={gpaColor} className="h-2" />
                    <Text className="text-xs text-slate-500 mt-1">Out of 4.00 maximum</Text>
                </div>

                {/* Attendance */}
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <Flex justifyContent="between" alignItems="center" className="mb-2">
                        <Text className="font-medium text-slate-700">Avg Attendance</Text>
                        <Metric className="text-2xl">{student.attendance_avg.toFixed(0)}%</Metric>
                    </Flex>
                    <ProgressBar value={student.attendance_avg} color={attendanceColor} className="h-2" />
                    <Text className="text-xs text-slate-500 mt-1">
                        {student.attendance_avg >= 75 ? 'Excellent' : student.attendance_avg >= 60 ? 'Needs improvement' : 'At risk'}
                    </Text>
                </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t border-slate-200">
                <Text className="text-xs uppercase text-slate-500 mb-2">Contact Information</Text>
                <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-slate-600">📧 {student.email}</span>
                    <span className="text-slate-600">📱 {student.phone}</span>
                </div>
            </div>
        </Card>
    );
}
