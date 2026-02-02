'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Search,
  BookOpen,
  Landmark,
  Award,
  Filter,
  ChevronDown,
  Calendar
} from 'lucide-react';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import KPICard from '@/components/KPICard';
import TrendLineChart from '@/components/TrendLineChart';
import PerformanceRadarChart from '@/components/PerformanceRadarChart';
import GradeDonutChart from '@/components/GradeDonutChart';
import DepartmentBarChart from '@/components/DepartmentBarChart';
import StatePerformanceChart from '@/components/StatePerformanceChart';
import CourseDifficultyChart from '@/components/CourseDifficultyChart';
import PerformanceQuadrantChart from '@/components/PerformanceQuadrantChart';
import StudentSearch from '@/components/StudentSearch';
import StudentProfileCard from '@/components/StudentProfileCard';
import TranscriptTable from '@/components/TranscriptTable';

import {
  getDashboardInsights,
  getStudentDetails,
  DashboardInsights,
  StudentDetails
} from '@/lib/api';

export default function Home() {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedSemester, setSelectedSemester] = useState("First");

  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [isSearching, setIsLoadingSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setIsLoading(true);
        const data = await getDashboardInsights();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data. Ensure backend is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInsights();
  }, []);

  const handleSearch = async (studentId: string) => {
    try {
      setIsLoadingSearching(true);
      setSearchError(null);
      const student = await getStudentDetails(studentId);
      setSelectedStudent(student);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to find student');
      setSelectedStudent(null);
    } finally {
      setIsLoadingSearching(false);
    }
  };

  const trendData = insights?.attendance_vs_score.map(item => ({
    label: `${item.attendance}%`,
    value: item.score,
    value2: item.score * 0.95 // Simulated budget/target
  })) || [];

  const radarData = [
    { subject: 'ATT', A: 85, fullMark: 100 },
    { subject: 'ASSGN', A: 78, fullMark: 100 },
    { subject: 'EXAM', A: 65, fullMark: 100 },
    { subject: 'PART', A: 90, fullMark: 100 },
    { subject: 'PRAC', A: 70, fullMark: 100 },
    { subject: 'RSRCH', A: 80, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent" />
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">System Error</h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">

      {/* Dashboard Title Header with Filters */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-premium border border-transparent dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Landmark className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">Academic Dashboard</h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">Session {selectedYear}</p>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="hidden md:flex items-center gap-3">
          {/* Year Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-emerald-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedYear}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 dark:border-neutral-800">
              <DropdownMenuLabel className="dark:text-neutral-400">Select Year</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-neutral-800" />
              {["2023", "2024", "2025"].map(year => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`cursor-pointer ${year === selectedYear ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-400' : 'dark:text-neutral-300'}`}
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Semester Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-emerald-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                <Filter className="h-4 w-4 mr-2" />
                {selectedSemester} Semester
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-neutral-900 dark:border-neutral-800">
              <DropdownMenuLabel className="dark:text-neutral-400">Select Semester</DropdownMenuLabel>
              <DropdownMenuSeparator className="dark:bg-neutral-800" />
              {["First", "Second"].map(sem => (
                <DropdownMenuItem
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`cursor-pointer ${sem === selectedSemester ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-400' : 'dark:text-neutral-300'}`}
                >
                  {sem} Semester
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        {/* Tabs Hidden for cleaner Dashboard look, defaulting to Overview */}

        <TabsContent value="overview" className="space-y-6">

          {insights && (
            <div className="grid grid-cols-12 gap-6">

              {/* Row 1: KPI Cards (3 cols each on LG, 6 on MD, 12 on SM) */}
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <KPICard
                  title="TOTAL STUDENTS"
                  value={insights.summary.total_students.toLocaleString()}
                  subtitle="Active Enrollment"
                  trend="up"
                  trendValue="1.8%"
                  icon={Users}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <KPICard
                  title="AVERAGE GPA"
                  value={insights.summary.average_gpa.toFixed(2)}
                  subtitle="Cumulative Performance"
                  trend={insights.summary.average_gpa >= 2.5 ? 'up' : 'down'}
                  trendValue="-0.5%"
                  icon={Award}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <KPICard
                  title="PASS RATE"
                  value={`${insights.summary.pass_rate}%`}
                  subtitle="GPA >= 2.0"
                  trend="down"
                  trendValue="-2.1%"
                  icon={GraduationCap}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <KPICard
                  title="AT RISK"
                  value={insights.summary.at_risk_count.toLocaleString()}
                  subtitle="Intervention Needed"
                  trend="down"
                  trendValue="-4.9%"
                  icon={AlertTriangle}
                />
              </div>

              {/* Row 2: Charts */}

              {/* Main Trend Line - Spans 8 cols */}
              <div className="col-span-12 lg:col-span-8 h-[400px]">
                <TrendLineChart
                  data={trendData}
                  title="PERFORMANCE ACTUAL VS TARGET"
                  subtitle="Average Scores vs Attendance"
                  color="#065f46"
                />
              </div>

              {/* Donut Chart - Spans 4 cols */}
              <div className="col-span-12 lg:col-span-4 h-[400px]">
                <GradeDonutChart data={insights.grade_distribution} />
              </div>

              {/* Row 3: Deep Analytics Charts */}

              {/* Course Difficulty - Gatekeeper Analysis */}
              <div className="col-span-12 lg:col-span-6 h-[380px]">
                <CourseDifficultyChart data={insights.course_difficulty || []} />
              </div>

              {/* Performance Quadrant - Attendance vs Score */}
              <div className="col-span-12 lg:col-span-6 h-[380px]">
                <PerformanceQuadrantChart data={insights.performance_quadrant || []} />
              </div>

              {/* Row 4: Secondary Charts */}

              {/* Department Bar - Spans 4 cols */}
              <div className="col-span-12 lg:col-span-4 h-[350px]">
                <DepartmentBarChart data={insights.department_performance} />
              </div>

              {/* Radar Chart - Spans 4 cols */}
              <div className="col-span-12 lg:col-span-4 h-[350px]">
                <PerformanceRadarChart
                  data={radarData}
                  title="COMPETENCY METRICS"
                />
              </div>

              {/* State Bar - Spans 4 cols */}
              <div className="col-span-12 lg:col-span-4 h-[350px]">
                <StatePerformanceChart data={insights.geo_performance} />
              </div>

            </div>
          )}
        </TabsContent>

        {/* Student Inspector removed from primary view to focus on Dashboard aesthetic */}
      </Tabs>
    </div>
  );
}
