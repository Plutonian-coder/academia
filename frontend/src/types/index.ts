export interface StudentData {
    id: number;
    name: string;
    age: number;
    gender: string;
    school: string;
    department: string;
    level: string;
    cgpa: number;
    grade: string;
    state: string;
    lga: string;
    attendance_rate: number;
    study_hours_per_week: number;
    extracurricular_participation: string;
    parental_education_level: string;
    family_income_bracket: string;
    internet_access: string;
    scholarship_status: string;
}

export interface PerformanceMetrics {
    total_students: number;
    average_cgpa: number;
    average_attendance: number;
    average_study_hours: number;
    excellent_performers: number;
    poor_performers: number;
}

export interface GradeDistribution {
    grade: string;
    count: number;
    percentage: number;
}

export interface StatePerformance {
    state: string;
    average_cgpa: number;
    student_count: number;
}

export interface DepartmentPerformance {
    department: string;
    average_cgpa: number;
    student_count: number;
}

export interface SchoolPerformance {
    school: string;
    average_cgpa: number;
    student_count: number;
}

export interface AnalyticsData {
    metrics: PerformanceMetrics;
    grade_distribution: GradeDistribution[];
    state_performance: StatePerformance[];
    department_performance: DepartmentPerformance[];
    school_performance: SchoolPerformance[];
}
