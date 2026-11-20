export type Role = 'admin' | 'teacher' | 'student';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  assignedClasses: string[];
  joinedAt: string;
}

export interface Student {
  id: string;
  name: string;
  roll: string;
  classId: string;
  marks: Record<Subject, number>;
  fees: { total: number; paid: number };
  attendance: { present: number; total: number };
}

export type Subject = 'bangla' | 'english' | 'math';

export interface GradeResult {
  grade: string;
  gpa: number;
}

export interface Session {
  userId: string;
  role: Role;
  name: string;
}
