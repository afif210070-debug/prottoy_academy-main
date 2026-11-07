'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Role = 'admin' | 'teacher' | 'student';

type Teacher = {
  id: string;
  name: string;
  subject: string;
  email: string;
};

type Student = {
  id: string;
  name: string;
  department: string;
  semester: string;
  email: string;
  marks: number;
  totalFee: number;
  paidFee: number;
};

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<Role>('admin');
  const [activeTab, setActiveTab] = useState('admin-control');

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [teacherId, setTeacherId] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');

  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [studentSemester, setStudentSemester] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const [selectedStudent, setSelectedStudent] = useState('');
  const [newMarks, setNewMarks] = useState('');
  const [newPaidFee, setNewPaidFee] = useState('');

  const [message, setMessage] = useState('');

  useEffect(() => {
    const requestedRole = searchParams.get('role');

    if (
      requestedRole === 'admin' ||
      requestedRole === 'teacher' ||
      requestedRole === 'student'
    ) {
      setRole(requestedRole);

      if (requestedRole === 'admin') {
        setActiveTab('admin-control');
      } else if (requestedRole === 'teacher') {
        setActiveTab('results');
      } else {
        setActiveTab('student-home');
      }
    }
  }, [searchParams]);

  const changeRole = (newRole: Role) => {
    setRole(newRole);

    if (newRole === 'admin') {
      setActiveTab('admin-control');
    } else if (newRole === 'teacher') {
      setActiveTab('results');
    } else {
      setActiveTab('student-home');
    }

    router.replace(`/dashboard?role=${newRole}`);
  };

  const showMessage = (text: string) => {
    setMessage(text);
  };

  const handleAddTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !teacherId.trim() ||
      !teacherName.trim() ||
      !teacherSubject.trim() ||
      !teacherEmail.trim()
    ) {
      showMessage('Please fill in all teacher information.');
      return;
    }

    if (teachers.some((teacher) => teacher.id === teacherId.trim())) {
      showMessage('Teacher ID already exists.');
      return;
    }

    const newTeacher: Teacher = {
      id: teacherId.trim(),
      name: teacherName.trim(),
      subject: teacherSubject.trim(),
      email: teacherEmail.trim(),
    };

    setTeachers((previous) => [...previous, newTeacher]);

    setTeacherId('');
    setTeacherName('');
    setTeacherSubject('');
    setTeacherEmail('');

    showMessage('Teacher added successfully.');
  };

  const handleAddStudent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !studentId.trim() ||
      !studentName.trim() ||
      !studentDepartment.trim() ||
      !studentSemester.trim() ||
      !studentEmail.trim()
    ) {
      showMessage('Please fill in all student information.');
      return;
    }

    if (students.some((student) => student.id === studentId.trim())) {
      showMessage('Student ID already exists.');
      return;
    }

    const newStudent: Student = {
      id: studentId.trim(),
      name: studentName.trim(),
      department: studentDepartment.trim(),
      semester: studentSemester.trim(),
      email: studentEmail.trim(),
      marks: 0,
      totalFee: 30000,
      paidFee: 0,
    };

    setStudents((previous) => [...previous, newStudent]);

    setStudentId('');
    setStudentName('');
    setStudentDepartment('');
    setStudentSemester('');
    setStudentEmail('');

    showMessage('Student registered successfully.');
  };

  const handleUpdateMarks = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const marks = Number(newMarks);

    if (!selectedStudent || newMarks === '') {
      showMessage('Please select a student and enter marks.');
      return;
    }

    if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
      showMessage('Marks must be between 0 and 100.');
      return;
    }

    setStudents((previous) =>
      previous.map((student) =>
        student.id === selectedStudent
          ? { ...student, marks }
          : student
      )
    );

    setNewMarks('');
    showMessage('Student result updated successfully.');
  };

  const handleUpdateFee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const paidFee = Number(newPaidFee);

    if (!selectedStudent || newPaidFee === '') {
      showMessage('Please select a student and enter the fee amount.');
      return;
    }

    if (!Number.isFinite(paidFee) || paidFee < 0) {
      showMessage('Please enter a valid fee amount.');
      return;
    }

    const student = students.find((item) => item.id === selectedStudent);

    if (!student) {
      showMessage('Student not found.');
      return;
    }

    if (paidFee > student.totalFee) {
      showMessage('Paid fee cannot exceed total fee.');
      return;
    }

    setStudents((previous) =>
      previous.map((item) =>
        item.id === selectedStudent
          ? { ...item, paidFee }
          : item
      )
    );

    setNewPaidFee('');
    showMessage('Fee information updated successfully.');
  };

  const getGrade = (marks: number) => {
    if (marks >= 80) return 'A+';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'A-';
    if (marks >= 50) return 'B';
    if (marks >= 40) return 'C';
    if (marks >= 33) return 'D';
    return 'F';
  };

  const currentStudent =
    students.find((student) => student.id === selectedStudent) || students[0];

  const menuItems: Record<Role, { id: string; label: string }[]> = {
    admin: [
      { id: 'admin-control', label: 'Dashboard Overview' },
      { id: 'teachers', label: 'Manage Teachers' },
      { id: 'students', label: 'Manage Students' },
      { id: 'results', label: 'Student Results' },
      { id: 'fees', label: 'Fee Management' },
    ],
    teacher: [
      { id: 'results', label: 'Manage Results' },
      { id: 'students', label: 'Student List' },
    ],
    student: [
      { id: 'student-home', label: 'My Dashboard' },
      { id: 'student-result', label: 'My Result' },
      { id: 'student-fee', label: 'My Fees' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-900 text-white px-6 py-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Prottoy Academy</h1>
          <p className="text-sm text-slate-300">
            Education Management System
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => changeRole('admin')}
            className={`px-4 py-2 rounded-lg text-sm ${
              role === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700'
            }`}
          >
            Admin
          </button>

          <button
            onClick={() => changeRole('teacher')}
            className={`px-4 py-2 rounded-lg text-sm ${
              role === 'teacher'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700'
            }`}
          >
            Teacher
          </button>

          <button
            onClick={() => changeRole('student')}
            className={`px-4 py-2 rounded-lg text-sm ${
              role === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700'
            }`}
          >
            Student
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-88px)]">
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5">
          <h2 className="font-bold text-lg mb-5">
            {role.toUpperCase()} PANEL
          </h2>

          <nav className="flex flex-col gap-2">
            {menuItems[role].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMessage('');
                }}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-5 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {role === 'admin'
                ? 'Admin Dashboard'
                : role === 'teacher'
                ? 'Teacher Dashboard'
                : 'Student Dashboard'}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Welcome to Prottoy Academy Management System.
            </p>
          </div>

          {message && (
            <div className="mb-5 p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
              {message}
            </div>
          )}

          {activeTab === 'admin-control' && role === 'admin' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-slate-500 text-sm">Total Students</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {students.length}
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-slate-500 text-sm">Total Teachers</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {teachers.length}
                  </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <p className="text-slate-500 text-sm">Total Fees Collected</p>
                  <h3 className="text-3xl font-bold mt-2">
                    ৳{students.reduce(
                      (total, student) => total + student.paidFee,
                      0
                    )}
                  </h3>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-3">
                  System Overview
                </h3>
                <p className="text-slate-600 text-sm leading-7">
                  The Admin can register teachers and students, manage
                  academic results, monitor student information and
                  maintain fee records from this dashboard.
                </p>
              </div>
            </>
          )}

          {activeTab === 'teachers' && role === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <form
                onSubmit={handleAddTeacher}
                className="bg-white rounded-xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-bold text-lg">Register New Teacher</h3>

                <input
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  placeholder="Teacher ID"
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Teacher Name"
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  value={teacherSubject}
                  onChange={(e) => setTeacherSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full p-3 border rounded-lg"
                />

                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full p-3 border rounded-lg"
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                >
                  Add Teacher
                </button>
              </form>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Teacher List</h3>

                {teachers.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No teachers registered yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="border rounded-lg p-4"
                      >
                        <p className="font-semibold">{teacher.name}</p>
                        <p className="text-sm text-slate-500">
                          ID: {teacher.id}
                        </p>
                        <p className="text-sm text-slate-500">
                          Subject: {teacher.subject}
                        </p>
                        <p className="text-sm text-slate-500">
                          {teacher.email}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' &&
            (role === 'admin' || role === 'teacher') && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {role === 'admin' && (
                  <form
                    onSubmit={handleAddStudent}
                    className="bg-white rounded-xl p-6 shadow-sm space-y-4"
                  >
                    <h3 className="font-bold text-lg">
                      Student Registration
                    </h3>

                    <input
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="Student ID"
                      className="w-full p-3 border rounded-lg"
                    />

                    <input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Student Name"
                      className="w-full p-3 border rounded-lg"
                    />

                    <input
                      value={studentDepartment}
                      onChange={(e) => setStudentDepartment(e.target.value)}
                      placeholder="Department"
                      className="w-full p-3 border rounded-lg"
                    />

                    <input
                      value={studentSemester}
                      onChange={(e) => setStudentSemester(e.target.value)}
                      placeholder="Semester"
                      className="w-full p-3 border rounded-lg"
                    />

                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full p-3 border rounded-lg"
                    />

                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                      Register Student
                    </button>
                  </form>
                )}

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Student List</h3>

                  {students.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      No students registered yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="border rounded-lg p-4"
                        >
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-slate-500">
                            ID: {student.id}
                          </p>
                          <p className="text-sm text-slate-500">
                            Department: {student.department}
                          </p>
                          <p className="text-sm text-slate-500">
                            Semester: {student.semester}
                          </p>
                          <p className="text-sm text-slate-500">
                            Email: {student.email}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          {activeTab === 'results' &&
            (role === 'admin' || role === 'teacher') && (
              <div className="space-y-6">
                <form
                  onSubmit={handleUpdateMarks}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <h3 className="font-bold text-lg mb-4">
                    Update Student Results
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="p-3 border rounded-lg"
                    >
                      <option value="">Select Student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.id})
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newMarks}
                      onChange={(e) => setNewMarks(e.target.value)}
                      placeholder="Enter Marks (0-100)"
                      className="p-3 border rounded-lg"
                    />

                    <button
                      type="submit"
                      className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                    >
                      Update Result
                    </button>
                  </div>
                </form>

                <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
                  <h3 className="font-bold text-lg mb-4">
                    Student Result List
                  </h3>

                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b bg-slate-50">
                        <th className="p-3">Student ID</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Marks</th>
                        <th className="p-3">Grade</th>
                      </tr>
                    </thead>

                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b">
                          <td className="p-3">{student.id}</td>
                          <td className="p-3">{student.name}</td>
                          <td className="p-3">{student.marks}</td>
                          <td className="p-3 font-semibold">
                            {getGrade(student.marks)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {students.length === 0 && (
                    <p className="text-slate-500 text-sm mt-4">
                      No student results available.
                    </p>
                  )}
                </div>
              </div>
            )}

          {activeTab === 'fees' && role === 'admin' && (
            <div className="space-y-6">
              <form
                onSubmit={handleUpdateFee}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-4">
                  Update Student Fee
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="p-3 border rounded-lg"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.id})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    value={newPaidFee}
                    onChange={(e) => setNewPaidFee(e.target.value)}
                    placeholder="Total Paid Amount"
                    className="p-3 border rounded-lg"
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                  >
                    Update Fee
                  </button>
                </div>
              </form>

              <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
                <h3 className="font-bold text-lg mb-4">Fee Records</h3>

                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Total Fee</th>
                      <th className="p-3">Paid</th>
                      <th className="p-3">Due</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="p-3">{student.id}</td>
                        <td className="p-3">{student.name}</td>
                        <td className="p-3">৳{student.totalFee}</td>
                        <td className="p-3">৳{student.paidFee}</td>
                        <td className="p-3 text-red-600">
                          ৳{student.totalFee - student.paidFee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {students.length === 0 && (
                  <p className="text-slate-500 text-sm mt-4">
                    No fee records available.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'student-home' && role === 'student' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-3">
                Welcome, Student!
              </h3>

              <p className="text-slate-600 text-sm leading-7">
                Welcome to your student dashboard. You can view your
                academic results and fee information from the menu.
              </p>
            </div>
          )}

          {activeTab === 'student-result' && role === 'student' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">My Result</h3>

              {currentStudent ? (
                <div className="space-y-3">
                  <p>
                    <strong>Name:</strong> {currentStudent.name}
                  </p>
                  <p>
                    <strong>Student ID:</strong> {currentStudent.id}
                  </p>
                  <p>
                    <strong>Marks:</strong> {currentStudent.marks}
                  </p>
                  <p>
                    <strong>Grade:</strong> {getGrade(currentStudent.marks)}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">
                  No student information available.
                </p>
              )}
            </div>
          )}

          {activeTab === 'student-fee' && role === 'student' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">My Fee Information</h3>

              {currentStudent ? (
                <div className="space-y-3">
                  <p>
                    <strong>Total Fee:</strong> ৳{currentStudent.totalFee}
                  </p>
                  <p>
                    <strong>Paid Fee:</strong> ৳{currentStudent.paidFee}
                  </p>
                  <p>
                    <strong>Due Fee:</strong>{' '}
                    ৳{currentStudent.totalFee - currentStudent.paidFee}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">
                  No fee information available.
                </p>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="bg-slate-900 text-slate-300 text-center p-4 text-sm">
        © {new Date().getFullYear()} Prottoy Academy. All rights reserved.
      </footer>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}