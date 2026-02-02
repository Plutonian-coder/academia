'use client';

import { useState } from 'react';
import { Title, Text } from '@tremor/react';
import StudentSearch from '@/components/StudentSearch';
import StudentProfileCard from '@/components/StudentProfileCard';
import TranscriptTable from '@/components/TranscriptTable';
import { getStudentDetails, StudentDetails } from '@/lib/api';

export default function SearchPage() {
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

    return (
        <div>
            {/* Page Header */}
            <div className="mb-6">
                <Title className="text-2xl text-slate-800">Student Search</Title>
                <Text className="text-slate-600">
                    Search for any student by their ID to view academic profile and transcript
                </Text>
            </div>

            <div className="space-y-6">
                {/* Search Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <Title className="text-slate-800 mb-4">Find a Student</Title>
                    <StudentSearch onSearch={handleSearch} isLoading={isSearching} />
                </div>

                {/* Search Error */}
                {searchError && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <Text className="text-red-600">❌ {searchError}</Text>
                    </div>
                )}

                {/* Student Results */}
                {selectedStudent && (
                    <div className="space-y-6">
                        <StudentProfileCard student={selectedStudent} />
                        <TranscriptTable courses={selectedStudent.courses} />
                    </div>
                )}

                {/* Empty State */}
                {!selectedStudent && !searchError && (
                    <div className="bg-slate-50 p-12 rounded-xl border-2 border-dashed border-slate-300 text-center">
                        <span className="text-5xl mb-4 block">🎓</span>
                        <Title className="text-slate-600">No Student Selected</Title>
                        <Text className="text-slate-500 mt-2">
                            Enter a Student ID above to view their academic profile and transcript
                        </Text>
                        <div className="mt-6 space-y-1 text-sm text-slate-400">
                            <p>Sample IDs to try:</p>
                            <p className="font-mono">P/ND/23/76174, F/HN/23/97156, P/HN/23/81377</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
