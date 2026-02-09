"""
YabaTech Student Academic Performance Analytics API
FastAPI Backend with Pandas Data Processing

Endpoints:
- GET /api/dashboard/insights - Aggregated dashboard data
- GET /api/student/{student_id:path} - Individual student KPIs
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path
from typing import Optional

# Initialize FastAPI app
app = FastAPI(
    title="YabaTech Analytics API",
    description="Student Academic Performance Analytics for Yaba College of Technology",
    version="1.0.0"
)

# CORS Configuration - Allow all origins for production flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CSV data on startup
# Load CSV data on startup
# Update path to look in current directory for deployment
DATA_PATH = Path(__file__).parent / "yabatechqwe_expanded_data.csv"

def load_data() -> pd.DataFrame:
    """Load and cache the CSV data"""
    try:
        df = pd.read_csv(DATA_PATH)
        return df
    except FileNotFoundError:
        raise RuntimeError(f"Data file not found at {DATA_PATH}")

# Load data once at startup
df = load_data()


@app.get("/")
def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "YabaTech Analytics API is running"}


@app.get("/api/dashboard/insights")
def get_dashboard_insights(
    session: Optional[str] = None,
    semester: Optional[str] = None
):
    """
    Get aggregated dashboard insights with optional filtering.
    """
    # Start with full dataset
    filtered_df = df.copy()
    
    # Apply filters if provided
    if session and session != "All Sessions":
        filtered_df = filtered_df[filtered_df['Session'] == session]
        
    if semester and semester != "All Semesters":
        filtered_df = filtered_df[filtered_df['Semester'] == semester]
    
    # Get available options for filters (from the full dataset to ensure all options are visible)
    available_sessions = sorted(df['Session'].dropna().unique().tolist())
    available_semesters = sorted(df['Semester'].dropna().unique().tolist())

    # If filtered data is empty, return zeroed structure but with filter options
    if filtered_df.empty:
        return sanitize_for_json({
            "summary": {
                "total_students": 0,
                "average_gpa": 0,
                "pass_rate": 0,
                "at_risk_count": 0
            },
            "geo_performance": [],
            "grade_distribution": {},
            "department_performance": [],
            "attendance_vs_score": [],
            "course_difficulty": [],
            "performance_quadrant": [],
            "filters": {
                "sessions": available_sessions,
                "semesters": available_semesters
            }
        })
    
    # Calculate unique students
    unique_students = filtered_df.drop_duplicates(subset=['Student_ID'])
    total_students = len(unique_students)
    
    # Calculate GPA per student
    student_gpas = filtered_df.groupby('Student_ID').apply(
        lambda x: (x['GP'] * x['Credit_Unit']).sum() / x['Credit_Unit'].sum() 
        if x['Credit_Unit'].sum() > 0 else 0
    ).reset_index(name='GPA')
    
    average_gpa = round(student_gpas['GPA'].mean(), 2)
    
    # Pass rate: Students with GPA >= 2.0
    passing_students = len(student_gpas[student_gpas['GPA'] >= 2.0])
    pass_rate = round((passing_students / total_students) * 100, 1) if total_students > 0 else 0
    
    # At-risk (GPA < 1.5 or Attendance < 50%)
    # Note: Attendance is averaged per student across their records in the filtered view
    student_attendance = filtered_df.groupby('Student_ID')['Attendance_Rate'].mean().reset_index()
    student_metrics = student_gpas.merge(student_attendance, on='Student_ID')
    at_risk_count = len(student_metrics[
        (student_metrics['GPA'] < 1.5) | (student_metrics['Attendance_Rate'] < 50)
    ])
    
    # Geo Performance
    state_gpa = filtered_df.groupby('State_of_Origin').apply(
        lambda x: round((x['GP'] * x['Credit_Unit']).sum() / x['Credit_Unit'].sum(), 2)
        if x['Credit_Unit'].sum() > 0 else 0
    ).reset_index(name='avg_gpa')
    state_gpa = state_gpa.sort_values('avg_gpa', ascending=False)
    geo_performance = state_gpa.to_dict('records')
    
    # Grade Distribution
    grade_counts = filtered_df['Grade'].value_counts().to_dict()
    all_grades = ['A', 'AB', 'B', 'BC', 'C', 'CD', 'D', 'E', 'F']
    grade_distribution = {grade: grade_counts.get(grade, 0) for grade in all_grades}
    
    # Department Performance
    dept_gpa = filtered_df.groupby('Department').apply(
        lambda x: round((x['GP'] * x['Credit_Unit']).sum() / x['Credit_Unit'].sum(), 2)
        if x['Credit_Unit'].sum() > 0 else 0
    ).reset_index(name='avg_gpa')
    dept_gpa = dept_gpa.sort_values('avg_gpa', ascending=False)
    department_performance = dept_gpa.to_dict('records')
    
    # Attendance vs Score (Correlation)
    attendance_score = filtered_df.groupby(
        pd.cut(filtered_df['Attendance_Rate'], bins=range(0, 110, 10))
    ).agg({
        'Total_Score': 'mean',
        'Attendance_Rate': 'mean'
    }).dropna().reset_index(drop=True)
    
    attendance_vs_score = [
        {"attendance": round(row['Attendance_Rate'], 1), "score": round(row['Total_Score'], 1)}
        for _, row in attendance_score.iterrows()
    ]

    # --- DEEP ANALYTICS ---

    # 1. Course Difficulty Index
    course_stats = filtered_df.groupby('Course_Code').apply(
        lambda x: pd.Series({
            'pass_count': (x['Total_Score'] >= 40).sum(),
            'total_count': len(x)
        })
    ).reset_index()
    
    course_stats['pass_rate'] = round((course_stats['pass_count'] / course_stats['total_count']) * 100, 1)
    course_stats['fail_rate'] = round(100 - course_stats['pass_rate'], 1)
    hardest_courses = course_stats.sort_values('pass_rate').head(6) 
    course_difficulty = hardest_courses[['Course_Code', 'pass_rate', 'fail_rate']].rename(
        columns={'Course_Code': 'course_code'}
    ).to_dict('records')

    # 3. Performance Quadrant
    student_avg_score = filtered_df.groupby('Student_ID')['Total_Score'].mean().reset_index(name='Avg_Score')
    quadrant_data = student_metrics.merge(student_avg_score, on='Student_ID')
    
    performance_quadrant = []
    for _, row in quadrant_data.iterrows():
        performance_quadrant.append({
            "x": round(row['Attendance_Rate'], 1),
            "y": round(row['Avg_Score'], 1),
            "student_id": row['Student_ID']
        })
    
    return sanitize_for_json({
        "summary": {
            "total_students": total_students,
            "average_gpa": average_gpa,
            "pass_rate": pass_rate,
            "at_risk_count": at_risk_count
        },
        "geo_performance": geo_performance,
        "grade_distribution": grade_distribution,
        "department_performance": department_performance,
        "attendance_vs_score": attendance_vs_score,
        "course_difficulty": course_difficulty,
        "performance_quadrant": performance_quadrant,
        "filters": {
            "sessions": available_sessions,
            "semesters": available_semesters
        }
    })


def sanitize_for_json(obj):
    """
    Recursively replace NaN and Infinity with None for JSON compliance.
    """
    import math
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_for_json(v) for v in obj]
    return obj


@app.get("/api/student/{student_id:path}")
def get_student_details(student_id: str):
    """
    Get detailed information for a specific student.
    
    Uses :path converter to handle slashes in Student IDs (e.g., P/ND/23/94170)
    
    Args:
        student_id: The student's unique identifier
        
    Returns:
        Student profile with calculated GPA, attendance, and course list
    """
    
    # Filter for the specific student
    student_data = df[df['Student_ID'] == student_id]
    
    if student_data.empty:
        raise HTTPException(
            status_code=404, 
            detail=f"Student with ID '{student_id}' not found"
        )
    
    # Get student info from first row
    first_row = student_data.iloc[0]
    
    # Calculate GPA: Sum(GP * Units) / Sum(Units)
    total_quality_points = (student_data['GP'] * student_data['Credit_Unit']).sum()
    total_units = student_data['Credit_Unit'].sum()
    gpa = round(total_quality_points / total_units, 2) if total_units > 0 else 0.0
    
    # Calculate average attendance
    attendance_avg = round(student_data['Attendance_Rate'].mean(), 1)
    
    # Build course list
    courses = []
    for _, row in student_data.iterrows():
        courses.append({
            "course_code": row['Course_Code'],
            "course_title": row['Course_Title'],
            "credit_unit": int(row['Credit_Unit']),
            "ca_score": int(row['CA_Score']),
            "exam_score": int(row['Exam_Score']),
            "total_score": int(row['Total_Score']),
            "grade": row['Grade'],
            "gp": float(row['GP']),
            "attendance": int(row['Attendance_Rate'])
        })
    
    # --- DEEP ANALYTICS: MODULE 2 ---
    # Student Consistency Score (Standard Deviation)
    import numpy as np
    scores = [c['total_score'] for c in courses]
    if scores:
        std_dev = float(np.std(scores))
    else:
        std_dev = 0.0
        
    consistency_status = "Reliable"
    if std_dev > 15:
        consistency_status = "Volatile"
    elif std_dev < 8:
        consistency_status = "Consistent"
    
    return sanitize_for_json({
        "student_id": student_id,
        "first_name": first_row['First_Name'],
        "last_name": first_row['Last_Name'],
        "email": first_row['Email'],
        "phone": first_row['Phone_Number'],
        "department": first_row['Department'],
        "level": first_row['Level'],
        "gender": first_row['Gender'],
        "age": int(first_row['Age']),
        "state_of_origin": first_row['State_of_Origin'],
        "session": first_row['Session'],
        "semester": first_row['Semester'],
        "gpa": gpa,
        "total_units": int(total_units),
        "attendance_avg": attendance_avg,
        "courses": courses,
        "std_dev": round(std_dev, 2),
        "consistency_status": consistency_status
    })


@app.get("/api/students/search")
def search_students(q: Optional[str] = None, limit: int = 20):
    """
    Search for students by ID or name.
    
    Args:
        q: Search query (matches Student_ID, First_Name, or Last_Name)
        limit: Maximum number of results to return
        
    Returns:
        List of matching students with basic info
    """
    if not q:
        # Return first N unique students
        unique_students = df.drop_duplicates(subset=['Student_ID']).head(limit)
    else:
        # Search by ID or name
        query = q.lower()
        mask = (
            df['Student_ID'].str.lower().str.contains(query, na=False) |
            df['First_Name'].str.lower().str.contains(query, na=False) |
            df['Last_Name'].str.lower().str.contains(query, na=False)
        )
        unique_students = df[mask].drop_duplicates(subset=['Student_ID']).head(limit)
    
    results = []
    for _, row in unique_students.iterrows():
        results.append({
            "student_id": row['Student_ID'],
            "name": f"{row['First_Name']} {row['Last_Name']}",
            "department": row['Department'],
            "level": row['Level']
        })
    
    return {"results": results, "count": len(results)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
