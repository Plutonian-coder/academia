/**
 * API Client for YabaTech Analytics Backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DashboardSummary {
    total_students: number;
    average_gpa: number;
    pass_rate: number;
    at_risk_count: number;
}

export interface GeoPerformance {
    State_of_Origin: string;
    avg_gpa: number;
}

export interface GradeDistribution {
    [key: string]: number;
}


export interface DepartmentPerformance {
    Department: string;
    avg_gpa: number;
}

export interface AttendanceScore {
    attendance: number;
    score: number;
}

export interface DashboardInsights {
    summary: DashboardSummary;
    geo_performance: GeoPerformance[];
    grade_distribution: GradeDistribution;
    department_performance: DepartmentPerformance[];
    attendance_vs_score: AttendanceScore[];
    course_difficulty: { course_code: string; pass_rate: number; fail_rate: number }[];
    performance_quadrant: { x: number; y: number; student_id: string }[];
    filters?: {
        sessions: string[];
        semesters: string[];
    };
}

export interface Course {
    course_code: string;
    course_title: string;
    credit_unit: number;
    ca_score: number;
    exam_score: number;
    total_score: number;
    grade: string;
    gp: number;
    attendance: number;
}

export interface StudentDetails {
    student_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department: string;
    level: string;
    gender: string;
    age: number;
    state_of_origin: string;
    session: string;
    semester: string;
    gpa: number;
    total_units: number;
    attendance_avg: number;
    courses: Course[];
    std_dev: number;
    consistency_status: 'Consistent' | 'Volatile' | 'Reliable';
}

export interface SearchResult {
    student_id: string;
    name: string;
    department: string;
    level: string;
}

export interface SearchResponse {
    results: SearchResult[];
    count: number;
}

/**
 * Fetch dashboard insights from the API
 */
/**
 * Fetch dashboard insights from the API
 */
export async function getDashboardInsights(session?: string, semester?: string): Promise<DashboardInsights> {
    const params = new URLSearchParams();
    if (session && session !== "All Sessions") params.append('session', session);
    if (semester && semester !== "All Semesters") params.append('semester', semester);

    const response = await fetch(`${API_BASE_URL}/api/dashboard/insights?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard insights');
    }
    return response.json();
}

/**
 * Fetch student details by ID
 */
export async function getStudentDetails(studentId: string): Promise<StudentDetails> {
    // Encode the student ID to handle slashes
    const encodedId = encodeURIComponent(studentId);
    const response = await fetch(`${API_BASE_URL}/api/student/${encodedId}`);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Student with ID '${studentId}' not found`);
        }
        throw new Error('Failed to fetch student details');
    }
    return response.json();
}

/**
 * Search for students
 */
export async function searchStudents(query?: string, limit: number = 20): Promise<SearchResponse> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/students/search?${params}`);
    if (!response.ok) {
        throw new Error('Failed to search students');
    }
    return response.json();
}
