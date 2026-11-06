
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
}

interface StudentRecord {
  id: string;
  name: string;
  roll: string;
  bangla: number;
  english: number;
  math: number;
  totalFee: number;
  paidFee: number;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlRole = searchParams.get('role') || 'student';
  const urlStudentId = searchParams.get('id') || 'PAMS-S-101';

  const [role, setRole] = useState<string>(urlRole);

  const [teachers, setTeachers] = useState<TeacherRecord[]>([
    { id: 'PAMS-T-701', name: 'জনাব রফিক আহমেদ', subject: 'বাংলা ১ম পত্র' },
    { id: 'PAMS-T-702', name: 'ডা. অনিক হাসান', subject: 'উচ্চতর গণিত' },
  ]);

  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: 'PAMS-S-101',
      name: 'আফিফ হাসান অনিক',
      roll: '০১',
      bangla: 85,
      english: 78,
      math: 92,
      totalFee: 12000,
      paidFee: 8500
    },
    {
      id: 'PAMS-S-102',
      name: 'রাশেদুল ইসলাম অন্তু',
      roll: '০২',
      bangla: 74,
      english: 88,
      math: 81,
      totalFee: 12000,
      paidFee: 12000
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>('admin-control');

  const [tName, setTName] = useState('');
  const [tSub, setTSub] = useState('');
  const [tId, setTId] = useState('');

  const [sName, setSName] = useState('');
  const [sRoll, setSRoll] = useState('');
  const [sId, setSId] = useState('');

  const currentStudentData = students.find(
    s => s.id === urlStudentId
  ) || students[0];

  const calculateGrade = (marks: number) => {
    if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
    if (marks >= 70) return { grade: 'A', gpa: 4.0 };
    if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
    if (marks >= 50) return { grade: 'B', gpa: 3.0 };
    if (marks >= 40) return { grade: 'C', gpa: 2.0 };
    if (marks >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  const bGrad = calculateGrade(currentStudentData.bangla);
  const eGrad = calculateGrade(currentStudentData.english);
  const mGrad = calculateGrade(currentStudentData.math);

  const studentAvgGpa = (
    (bGrad.gpa + eGrad.gpa + mGrad.gpa) / 3
  ).toFixed(2);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tName || !tSub || !tId) {
      alert('সব তথ্য দিন!');
      return;
    }

    if (teachers.some(t => t.id === tId)) {
      alert('এই Teacher ID আগে থেকেই আছে!');
      return;
    }

    setTeachers([
      ...teachers,
      { id: tId, name: tName, subject: tSub }
    ]);

    setTName('');
    setTSub('');
    setTId('');

    alert('নতুন শিক্ষক সফলভাবে সিস্টেমে নিবন্ধিত হয়েছেন!');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sName || !sRoll || !sId) {
      alert('সব তথ্য দিন!');
      return;
    }

    if (students.some(s => s.id === sId)) {
      alert('এই Student ID আগে থেকেই আছে!');
      return;
    }

    setStudents([
      ...students,
      {
        id: sId,
        name: sName,
        roll: sRoll,
        bangla: 0,
        english: 0,
        math: 0,
        totalFee: 12000,
        paidFee: 0
      }
    ]);

    setSName('');
    setSRoll('');
    setSId('');

    alert('নতুন শিক্ষার্থী সফলভাবে সিস্টেমে নিবন্ধিত হয়েছেন!');
  };

  const handleMarkChange = (
    id: string,
    subject: 'bangla' | 'english' | 'math',
    value: number
  ) => {
    const marks = Math.max(0, Math.min(100, value));

    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [subject]: marks } : s
      )
    );
  };

  const handleFeeChange = (id: string, value: number) => {
    const fee = Math.max(0, value);

    setStudents(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, paidFee: Math.min(s.totalFee, fee) }
          : s
      )
    );
  };

  useEffect(() => {
    setRole(urlRole);

    if (urlRole === 'admin') {
      setActiveTab('admin-control');
    } else if (urlRole === 'teacher') {
      setActiveTab('results');
    } else {
      setActiveTab('student-home');
    }
  }, [urlRole]);

  const inputClass =
    'w-full p-2.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500';

  const cardClass =
    'bg-white p-6 rounded-2xl border border-slate-200 shadow-sm';

  return (
    <div className="flex flex-col md:flex-row bg-[#f8fafc] min-h-screen text-slate-800 font-sans antialiased">

      {/* Sidebar */}

      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-sm">

        <div>

          <div className="mb-8 flex items-center space-x-3 p-1">

            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-base">
              P
            </div>

            <div>
              <h1 className="text-sm font-bold text-slate-900">
                Prottoy Academy
              </h1>

              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                ERP Engine v3.0
              </p>
            </div>

          </div>

          <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">

            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              অথরাইজড সেশন রোল
            </span>

            <div className={`text-xs font-black uppercase p-2 rounded-lg border text-center ${
              role === 'admin'
                ? 'bg-red-50 text-red-600 border-red-100'
                : role === 'teacher'
                ? 'bg-amber-50 text-amber-600 border-amber-100'
                : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
              {role === 'admin'
                ? '🛡️ Super Admin'
                : role === 'teacher'
                ? '👑 Teacher'
                : '👤 Student'}
            </div>

          </div>

          <div className="mb-6 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center">

            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              লাইভ রোল Test সুইচার
            </span>

            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold">

              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setActiveTab('admin-control');
                }}
                className={`py-1 px-1.5 rounded ${
                  role === 'admin'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-500'
                }`}
              >
                Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('teacher');
                  setActiveTab('results');
                }}
                className={`py-1 px-1.5 rounded ${
                  role === 'teacher'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500'
                }`}
              >
                Teacher
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setActiveTab('student-home');
                }}
                className={`py-1 px-1.5 rounded ${
                  role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500'
                }`}
              >
                Student
              </button>

            </div>
          </div>

          <div className="space-y-1">

            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              অ্যাক্টিভ মডিউল
            </span>

            {role === 'admin' && (
              <button
                type="button"
                onClick={() => setActiveTab('admin-control')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold ${
                  activeTab === 'admin-control'
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>🛡️</span>
                <span>এডমিন কোর কন্ট্রোল</span>
              </button>
            )}

            {(role === 'admin' || role === 'teacher') && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('results')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold ${
                    activeTab === 'results'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>📊</span>
                  <span>রেজাল্ট ও মার্কস ইনপুট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('fees')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold ${
                    activeTab === 'fees'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>💳</span>
                  <span>টিউশন ফি লেজার</span>
                </button>
              </>
            )}

            {role === 'student' && (
              <button
                type="button"
                onClick={() => setActiveTab('student-home')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold ${
                  activeTab === 'student-home'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span>📚</span>
                <span>আমার ড্যাশবোর্ড</span>
              </button>
            )}

          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 font-bold py-2 rounded-lg text-xs uppercase text-center mt-6"
        >
          Portal Sign Out
        </button>

      </div>

      {/* Main Area */}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">

        <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Prottoy Academy Comprehensive ERP Management
            </h2>

            <p className="text-slate-400 text-xs mt-1">
              রোল বেসড ডাটা এক্সেস পারমিশন লজিক সচল আছে।
            </p>
          </div>

          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-xl text-xs font-bold">
            Session: 2026-2027
          </span>

        </div>

        {/* Admin Control */}

        {role === 'admin' && activeTab === 'admin-control' && (

          <div className="space-y-6">

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-red-600 mb-4">
                ➕ নতুন শিক্ষক যুক্ত করুন (Add New Teacher Account)
              </h3>

              <form
                onSubmit={handleAddTeacher}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >

                <input
                  type="text"
                  placeholder="Teacher Name"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Subject Name"
                  value={tSub}
                  onChange={(e) => setTSub(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="ID (PAMS-T-703)"
                  value={tId}
                  onChange={(e) => setTId(e.target.value)}
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold p-2.5 rounded-lg text-xs"
                >
                  Register Teacher
                </button>

              </form>

            </div>

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-blue-600 mb-4">
                ➕ নতুন শিক্ষার্থী অ্যাকাউন্ট তৈরি করুন (Register Student ID)
              </h3>

              <form
                onSubmit={handleAddStudent}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >

                <input
                  type="text"
                  placeholder="Student Name"
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Student Roll"
                  value={sRoll}
                  onChange={(e) => setSRoll(e.target.value)}
                  className={inputClass}
                />

                <input
                  type="text"
                  placeholder="Student ID (PAMS-S-103)"
                  value={sId}
                  onChange={(e) => setSId(e.target.value)}
                  className={inputClass}
                />

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-lg text-xs"
                >
                  Register Student
                </button>

              </form>

            </div>

            {/* Teacher List */}

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-slate-800 mb-4">
                👨‍🏫 Registered Teachers
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full text-xs text-left">

                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-3">Teacher ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Subject</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-slate-100">
                        <td className="p-3">{teacher.id}</td>
                        <td className="p-3 font-semibold">{teacher.name}</td>
                        <td className="p-3">{teacher.subject}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>

            {/* Student List */}

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-slate-800 mb-4">
                🎓 Registered Students
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full text-xs text-left">

                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-3">Student ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Roll</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-100">
                        <td className="p-3">{student.id}</td>
                        <td className="p-3 font-semibold">{student.name}</td>
                        <td className="p-3">{student.roll}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>

          </div>
        )}

        {/* Results Management */}

        {(role === 'admin' || role === 'teacher') && activeTab === 'results' && (

          <div className={cardClass}>

            <h3 className="text-sm font-bold text-blue-600 mb-5">
              📊 Student Result & Marks Management
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full text-xs text-left">

                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Roll</th>
                    <th className="p-3">Bangla</th>
                    <th className="p-3">English</th>
                    <th className="p-3">Math</th>
                    <th className="p-3">GPA</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {
                    const grades = [
                      calculateGrade(student.bangla),
                      calculateGrade(student.english),
                      calculateGrade(student.math)
                    ];

                    const gpa = grades.every(g => g.gpa > 0)
                      ? (grades.reduce((sum, g) => sum + g.gpa, 0) / 3).toFixed(2)
                      : '0.00';

                    return (
                      <tr key={student.id} className="border-b border-slate-100">

                        <td className="p-3 font-semibold">
                          {student.name}
                          <p className="text-slate-400 font-normal">
                            {student.id}
                          </p>
                        </td>

                        <td className="p-3">{student.roll}</td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student.bangla}
                            onChange={(e) =>
                              handleMarkChange(student.id, 'bangla', Number(e.target.value))
                            }
                            className="w-16 p-2 border rounded-lg"
                          />
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student.english}
                            onChange={(e) =>
                              handleMarkChange(student.id, 'english', Number(e.target.value))
                            }
                            className="w-16 p-2 border rounded-lg"
                          />
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student.math}
                            onChange={(e) =>
                              handleMarkChange(student.id, 'math', Number(e.target.value))
                            }
                            className="w-16 p-2 border rounded-lg"
                          />
                        </td>

                        <td className="p-3 font-bold text-blue-600">
                          {gpa}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* Fee Management */}

        {(role === 'admin' || role === 'teacher') && activeTab === 'fees' && (

          <div className={cardClass}>

            <h3 className="text-sm font-bold text-blue-600 mb-5">
              💳 Tuition Fee Management
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full text-xs text-left">

                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Total Fee</th>
                    <th className="p-3">Paid Fee</th>
                    <th className="p-3">Due Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => {

                    const due = student.totalFee - student.paidFee;

                    return (
                      <tr key={student.id} className="border-b border-slate-100">

                        <td className="p-3 font-semibold">
                          {student.name}
                          <p className="text-slate-400 font-normal">
                            {student.id}
                          </p>
                        </td>

                        <td className="p-3">
                          ৳{student.totalFee}
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="0"
                            max={student.totalFee}
                            value={student.paidFee}
                            onChange={(e) =>
                              handleFeeChange(student.id, Number(e.target.value))
                            }
                            className="w-24 p-2 border rounded-lg"
                          />
                        </td>

                        <td className="p-3 font-bold text-red-500">
                          ৳{due}
                        </td>

                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-lg font-bold ${
                            due === 0
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-50 text-red-600'
                          }`}>
                            {due === 0 ? 'Paid' : 'Due'}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* Student Dashboard */}

        {role === 'student' && activeTab === 'student-home' && (

          <div className="space-y-6">

            <div className={cardClass}>

              <h3 className="text-lg font-bold text-slate-900">
                Welcome, {currentStudentData.name}
              </h3>

              <p className="text-xs text-slate-400 mt-2">
                Student ID: {currentStudentData.id}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Roll: {currentStudentData.roll}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className={cardClass}>
                <p className="text-xs text-slate-400">Average GPA</p>
                <h3 className="text-3xl font-black text-blue-600 mt-2">
                  {studentAvgGpa}
                </h3>
              </div>

              <div className={cardClass}>
                <p className="text-xs text-slate-400">Total Tuition Fee</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">
                  ৳{currentStudentData.totalFee}
                </h3>
              </div>

              <div className={cardClass}>
                <p className="text-xs text-slate-400">Due Fee</p>
                <h3 className="text-3xl font-black text-red-500 mt-2">
                  ৳{currentStudentData.totalFee - currentStudentData.paidFee}
                </h3>
              </div>

            </div>

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-blue-600 mb-5">
                📊 My Academic Results
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full text-xs text-left">

                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Marks</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">GPA</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr className="border-b">
                      <td className="p-3">Bangla</td>
                      <td className="p-3">{currentStudentData.bangla}</td>
                      <td className="p-3">{bGrad.grade}</td>
                      <td className="p-3">{bGrad.gpa.toFixed(2)}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-3">English</td>
                      <td className="p-3">{currentStudentData.english}</td>
                      <td className="p-3">{eGrad.grade}</td>
                      <td className="p-3">{eGrad.gpa.toFixed(2)}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-3">Mathematics</td>
                      <td className="p-3">{currentStudentData.math}</td>
                      <td className="p-3">{mGrad.grade}</td>
                      <td className="p-3">{mGrad.gpa.toFixed(2)}</td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </div>

            <div className={cardClass}>

              <h3 className="text-sm font-bold text-blue-600 mb-4">
                💳 My Tuition Fee Status
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span>Total Fee</span>
                  <span className="font-bold">
                    ৳{currentStudentData.totalFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Paid Fee</span>
                  <span className="font-bold text-green-600">
                    ৳{currentStudentData.paidFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Due Fee</span>
                  <span className="font-bold text-red-600">
                    ৳{currentStudentData.totalFee - currentStudentData.paidFee}
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Footer */}

        <div className="text-center text-xs text-slate-400 mt-8 pb-4">
          © 2026 Prottoy Academy. All Rights Reserved.
        </div>

      </main>

    </div>
  );
}
