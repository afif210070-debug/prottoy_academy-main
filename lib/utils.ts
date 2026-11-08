import type { GradeResult, Subject } from '../types';

export function calculateGrade(marks: number): GradeResult {
  if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 70) return { grade: 'A', gpa: 4.0 };
  if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
  if (marks >= 50) return { grade: 'B', gpa: 3.0 };
  if (marks >= 40) return { grade: 'C', gpa: 2.0 };
  return { grade: 'F', gpa: 0.0 };
}

export function calculateGPA(marks: Record<Subject, number>): number {
  const subjects = Object.values(marks);
  const total = subjects.reduce((sum, m) => sum + calculateGrade(m).gpa, 0);
  return Number((total / subjects.length).toFixed(2));
}

export function getFeeStatus(paid: number, total: number) {
  const due = total - paid;
  return { due, isCleared: due <= 0, percent: Math.round((paid / total) * 100) };
}
