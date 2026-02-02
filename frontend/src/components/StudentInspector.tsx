'use client';

import { useState } from 'react';
import { Card, Title, TextInput, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { Search } from 'lucide-react';
import { StudentData } from '@/types';

interface StudentInspectorProps {
    students: StudentData[];
}

export default function StudentInspector({ students }: StudentInspectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toString().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 results

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A':
                return 'emerald';
            case 'B':
                return 'blue';
            case 'C':
                return 'yellow';
            case 'D':
                return 'orange';
            case 'F':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Card>
            <Title>Student Performance Inspector</Title>
            <div className="mt-4">
                <TextInput
                    icon={Search}
                    placeholder="Search by student name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {searchTerm && filteredStudents.length > 0 && (
                <div className="mt-6">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Department</TableHeaderCell>
                                <TableHeaderCell>CGPA</TableHeaderCell>
                                <TableHeaderCell>Grade</TableHeaderCell>
                                <TableHeaderCell>Action</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.id}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.department}</TableCell>
                                    <TableCell>{student.cgpa.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge color={getGradeColor(student.grade)}>
                                            {student.grade}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="xs"
                                            variant="secondary"
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {selectedStudent && (
                <div className="mt-6 rounded-lg border border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background-muted">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                            {selectedStudent.name}
                        </h3>
                        <Button
                            size="xs"
                            variant="light"
                            onClick={() => setSelectedStudent(null)}
                        >
                            Close
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Student ID
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Age
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.age}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Gender
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.gender}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                School
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.school}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Department
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.department}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Level
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.level}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                CGPA
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.cgpa.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Grade
                            </p>
                            <Badge color={getGradeColor(selectedStudent.grade)}>
                                {selectedStudent.grade}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Attendance Rate
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.attendance_rate.toFixed(1)}%
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Study Hours/Week
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.study_hours_per_week}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                State
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.state}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                LGA
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.lga}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Extracurricular
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.extracurricular_participation}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Parental Education
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.parental_education_level}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Family Income
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.family_income_bracket}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Internet Access
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.internet_access}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                Scholarship Status
                            </p>
                            <p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {selectedStudent.scholarship_status}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
