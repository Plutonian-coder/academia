"use client"

import { Badge } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

// Status Badge Component
const StatusBadge = ({ grade }: { grade: string }) => {
    const isPass = !['E', 'F'].includes(grade);
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border ${isPass
                ? "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                : "border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
            }`}>
            {isPass ? 'PASS' : 'FAIL'}
        </span>
    )
}

interface Course {
    course_code: string;
    course_title: string;
    credit_unit: number;
    grade: string;
    total_score: number;
    gp: number;
}

interface TranscriptTableProps {
    courses: Course[];
}

export default function TranscriptTable({ courses }: TranscriptTableProps) {
    // Financial Ledger Style
    return (
        <div className="w-full border border-zinc-200 dark:border-zinc-800 rounded-md bg-background overflow-hidden relative">
            {/* Decorative top line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-900 dark:bg-zinc-100 opacity-10"></div>

            <Table className="font-mono text-xs">
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
                    <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
                        <TableHead className="w-[100px] font-semibold text-zinc-500">CODE</TableHead>
                        <TableHead className="font-semibold text-zinc-500">COURSE TITLE</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-500">UNIT</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-500">SCORE</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-500">GRADE</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-500">GP</TableHead>
                        <TableHead className="text-right font-semibold text-zinc-500">STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow
                            key={course.course_code}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors border-b border-zinc-100 dark:border-zinc-800/50"
                        >
                            <TableCell className="font-medium text-foreground">{course.course_code}</TableCell>
                            <TableCell className="text-muted-foreground">{course.course_title}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{course.credit_unit}</TableCell>
                            <TableCell className="text-right tabular-nums text-foreground">{course.total_score}</TableCell>
                            <TableCell className="text-right font-bold tabular-nums text-foreground">{course.grade}</TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">{course.gp.toFixed(1)}</TableCell>
                            <TableCell className="text-right">
                                <StatusBadge grade={course.grade} />
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/20 font-semibold border-t-2 border-zinc-200 dark:border-zinc-800">
                        <TableCell colSpan={2} className="text-right py-4">TOTALS</TableCell>
                        <TableCell className="text-right py-4">{courses.reduce((acc, c) => acc + c.credit_unit, 0)}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
