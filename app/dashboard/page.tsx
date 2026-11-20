'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Discipline = 'Engineering' | 'Science' | 'Humanities' | 'Business' | 'Medical' | 'ICT' | 'Agriculture' | 'Law';
interface TeacherRecord { id: string; name: string; subject: string; discipline: Discipline; is_head: boolean; dept_name: string; }
interface StudentRecord { id: string; name: string; batch: string; department: string; total_fee: number; paid_fee: number; }
interface ResultRecord { id: string; student_id: string; student_name: string; semester: string; subject: string; gpa: number; grade: string; }
interface NoticeItem { id: string; title: string; author: string; date: string; tag: string; }
interface EventItem { id: string; name: string; date: string; venue: string; tint: string; }

const DISCIPLINES: Discipline[] = ['Engineering', 'Science', 'Humanities', 'Business', 'Medical', 'ICT', 'Agriculture', 'Law'];
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBnDigits = (i: string | number) => String(i).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
const taka = (a: number) => `৳ ${toBnDigits(Math.round(a || 0).toLocaleString('en-US'))}`;
const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10';
const btnPrimary = 'inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800';
function AdminView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [tName, setTName] = useState(''); const [tSub, setTSub] = useState(''); const [tId, setTId] = useState('');
  const [tDiscipline, setTDiscipline] = useState<Discipline>('ICT'); const [tDeptName, setTDeptName] = useState('');
  const [tIsHead, setTIsHead] = useState(false);

  const [sName, setSName] = useState(''); const [sBatch, setSBatch] = useState(''); const [sDept, setSDept] = useState('');
  const [sId, setSId] = useState(''); const [sFee, setSFee] = useState('12000');

  const [rStudentId, setRStudentId] = useState(''); const [rStudentName, setRStudentName] = useState('');
  const [rSemester, setRSemester] = useState(''); const [rSubject, setRSubject] = useState('');
  const [rGpa, setRGpa] = useState(''); const [rGrade, setRGrade] = useState('');

  const [noticeText, setNoticeText] = useState(''); const [noticeAuthor, setNoticeAuthor] = useState('');
  const [eventName, setEventName] = useState(''); const [eventVenue, setEventVenue] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    const [tRes, sRes, rRes, nRes, eRes] = await Promise.all([
      supabase.from('teachers').select('*'), supabase.from('students').select('*'),
      supabase.from('results').select('*'), supabase.from('notices').select('*'), supabase.from('events').select('*'),
    ]);
    if (tRes.data) setTeachers(tRes.data);
    if (sRes.data) setStudents(sRes.data);
    if (rRes.data) setResults(rRes.data);
    if (nRes.data) setNotices(nRes.data);
    if (eRes.data) setEvents(eRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAllData(); }, []);
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tSub || !tId || !tDeptName) return alert('সব ঘর পূরণ করুন');
    const newRec: TeacherRecord = { id: tId.trim(), name: tName.trim(), subject: tSub.trim(), discipline: tDiscipline, is_head: tIsHead, dept_name: tDeptName.trim() };
    const { error } = await supabase.from('teachers').insert([newRec]);
    if (error) return alert('Error: ' + error.message);
    setTeachers((prev) => [...prev, newRec]);
    setTName(''); setTSub(''); setTId(''); setTDeptName(''); setTIsHead(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sBatch || !sDept || !sId) return alert('সব ঘর পূরণ করুন');
    const newRec: StudentRecord = { id: sId.trim(), name: sName.trim(), batch: sBatch.trim(), department: sDept.trim(), total_fee: Number(sFee) || 12000, paid_fee: 0 };
    const { error } = await supabase.from('students').insert([newRec]);
    if (error) return alert('Error: ' + error.message);
    setStudents((prev) => [...prev, newRec]);
    setSName(''); setSBatch(''); setSDept(''); setSId('');
  };

  const handleFeeChange = async (id: string, value: number) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, paid_fee: value } : s)));
    await supabase.from('students').update({ paid_fee: value }).eq('id', id);
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rStudentId || !rStudentName || !rSemester || !rSubject || !rGpa || !rGrade) return alert('রেজাল্টের সব তথ্য দিন');
    const newRes: ResultRecord = { id: Date.now().toString(), student_id: rStudentId.trim(), student_name: rStudentName.trim(), semester: rSemester.trim(), subject: rSubject.trim(), gpa: Number(rGpa), grade: rGrade.trim() };
    const { error } = await supabase.from('results').insert([newRes]);
    if (error) return alert('Error: ' + error.message);
    setResults((prev) => [...prev, newRes]);
    setRStudentId(''); setRStudentName(''); setRSemester(''); setRSubject(''); setRGpa(''); setRGrade('');
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText || !noticeAuthor) return;
    const newNotice: NoticeItem = { id: Date.now().toString(), title: noticeText, author: noticeAuthor, date: 'Today', tag: 'Academic' };
    const { error } = await supabase.from('notices').insert([newNotice]);
    if (!error) setNotices([newNotice, ...notices]);
    setNoticeText(''); setNoticeAuthor('');
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !eventVenue) return;
    const newEv: EventItem = { id: Date.now().toString(), name: eventName, date: 'Upcoming', venue: eventVenue, tint: 'border-l-emerald-500' };
    const { error } = await supabase.from('events').insert([newEv]);
    if (!error) setEvents([...events, newEv]);
    setEventName(''); setEventVenue('');
  };

  const totalCollected = useMemo(() => students.reduce((sum, s) => sum + (s.paid_fee || 0), 0), [students]);
  const departmentHeads = useMemo(() => teachers.filter((t) => t.is_head), [teachers]);
  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-600">Supabase ক্লাউড থেকে ডাটা লোড হচ্ছে...</div>;

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 w-full font-sans">
      <aside className="hidden md:flex min-h-screen w-64 shrink-0 flex-col justify-between bg-slate-900 p-6 text-slate-300">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">P</div>
            <div><p className="text-sm font-semibold text-white">Prottoy Academy</p><p className="text-[11px] text-emerald-400">● Cloud Sync Active</p></div>
          </div>
          <nav className="space-y-1 text-sm">
            <button onClick={() => router.push('/dashboard?role=admin')} className="w-full text-left rounded-lg bg-slate-800 px-3 py-2.5 font-medium text-white">Admin Control</button>
            <button onClick={() => router.push('/faculty')} className="w-full text-left rounded-lg px-3 py-2.5 text-slate-400 hover:bg-slate-800/60">Faculty Registry</button>
          </nav>
        </div>
        <button onClick={() => router.push('/')} className="w-full rounded-lg border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800">Sign Out</button>
      </aside>

      <main className="flex-1 p-6 lg:p-9 overflow-y-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 bg-white p-6 rounded-xl border border-slate-200">
          <div><h2 className="text-xl font-black text-slate-900">Admin & Faculty Control Hub</h2><p className="text-emerald-600 text-xs font-semibold mt-1">✓ সব ডাটা স্থায়ীভাবে Supabase ক্লাউডে সেভ হচ্ছে</p></div>
          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-xl text-xs font-bold">Session: 2026-2027</span>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">মোট শিক্ষক</p><p className="mt-1 text-2xl font-bold">{toBnDigits(teachers.length)}</p></div>
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">মোট শিক্ষার্থী</p><p className="mt-1 text-2xl font-bold">{toBnDigits(students.length)}</p></div>
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">আদায়কৃত ফি</p><p className="mt-1 text-2xl font-bold text-emerald-600">{taka(totalCollected)}</p></div>
          <div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-xs text-slate-500">প্রকাশিত রেজাল্ট</p><p className="mt-1 text-2xl font-bold text-blue-600">{toBnDigits(results.length)}</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">Register Teacher</h2>
            <form onSubmit={handleAddTeacher} className="space-y-3">
              <input placeholder="Teacher Name" className={inputCls} value={tName} onChange={(e) => setTName(e.target.value)} />
              <input placeholder="Subject" className={inputCls} value={tSub} onChange={(e) => setTSub(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Teacher ID" className={inputCls} value={tId} onChange={(e) => setTId(e.target.value)} />
                <input placeholder="Department" className={inputCls} value={tDeptName} onChange={(e) => setTDeptName(e.target.value)} />
              </div>
              <select value={tDiscipline} onChange={(e) => setTDiscipline(e.target.value as Discipline)} className={inputCls}>
                {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={tIsHead} onChange={(e) => setTIsHead(e.target.checked)} /> Department Head</label>
              <button type="submit" className={btnPrimary}>Save Teacher</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">Register Student & Semester Fee</h2>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <input placeholder="Student Name" className={inputCls} value={sName} onChange={(e) => setSName(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Batch" className={inputCls} value={sBatch} onChange={(e) => setSBatch(e.target.value)} />
                <input placeholder="Department" className={inputCls} value={sDept} onChange={(e) => setSDept(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Student ID" className={inputCls} value={sId} onChange={(e) => setSId(e.target.value)} />
                <input type="number" placeholder="Semester Fee (৳)" className={inputCls} value={sFee} onChange={(e) => setSFee(e.target.value)} />
              </div>
              <button type="submit" className={btnPrimary}>Save Student</button>
            </form>
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <header className="border-b px-6 py-4"><h2 className="text-sm font-bold text-slate-900">💳 সেমিস্টার ফি খতিয়ান</h2></header>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr><th className="px-6 py-3 text-left">ID</th><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Dept</th><th className="px-6 py-3 text-right">Total</th><th className="px-6 py-3 text-right">Paid</th><th className="px-6 py-3 text-right">Due</th></tr>
            </thead>
            <tbody className="divide-y">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-3 font-mono text-xs">{s.id}</td><td className="px-6 py-3 font-medium">{s.name}</td><td className="px-6 py-3 text-slate-500">{s.department}</td><td className="px-6 py-3 text-right">{taka(s.total_fee)}</td>
                  <td className="px-6 py-3 text-right"><input type="number" value={s.paid_fee} onChange={(e) => handleFeeChange(s.id, Number(e.target.value) || 0)} className="w-24 rounded border px-2 py-1 text-right" /></td>
                  <td className="px-6 py-3 text-right font-bold text-rose-600">{taka(Math.max(0, s.total_fee - s.paid_fee))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">🎓 রেজাল্ট যুক্ত করুন</h2>
            <form onSubmit={handleAddResult} className="space-y-3">
              <input placeholder="Student ID" className={inputCls} value={rStudentId} onChange={(e) => setRStudentId(e.target.value)} />
              <input placeholder="Student Name" className={inputCls} value={rStudentName} onChange={(e) => setRStudentName(e.target.value)} />
              <input placeholder="Semester" className={inputCls} value={rSemester} onChange={(e) => setRSemester(e.target.value)} />
              <input placeholder="Subject" className={inputCls} value={rSubject} onChange={(e) => setRSubject(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.01" placeholder="GPA" className={inputCls} value={rGpa} onChange={(e) => setRGpa(e.target.value)} />
                <input placeholder="Grade" className={inputCls} value={rGrade} onChange={(e) => setRGrade(e.target.value)} />
              </div>
              <button type="submit" className={btnPrimary}>Publish Result</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <h2 className="mb-4 text-sm font-bold text-slate-900">📊 প্রকাশিত রেজাল্ট তালিকা</h2>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 uppercase text-slate-500">
                <tr><th className="p-3">ID</th><th className="p-3">Student</th><th className="p-3">Semester</th><th className="p-3">Subject</th><th className="p-3 text-right">GPA</th><th className="p-3 text-right">Grade</th></tr>
              </thead>
              <tbody className="divide-y">
                {results.map((r) => (
                  <tr key={r.id}><td className="p-3 font-mono">{r.student_id}</td><td className="p-3 font-bold">{r.student_name}</td><td className="p-3">{r.semester}</td><td className="p-3">{r.subject}</td><td className="p-3 text-right font-bold text-blue-600">{r.gpa}</td><td className="p-3 text-right font-black text-emerald-600">{r.grade}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold">📢 Publish Notice</h2>
            <form onSubmit={handleAddNotice} className="space-y-3">
              <input placeholder="Notice Title" className={inputCls} value={noticeText} onChange={(e) => setNoticeText(e.target.value)} />
              <input placeholder="Author Name" className={inputCls} value={noticeAuthor} onChange={(e) => setNoticeAuthor(e.target.value)} />
              <button type="submit" className={btnPrimary}>Save Notice</button>
            </form>
            <div className="space-y-2">{notices.map((n) => <div key={n.id} className="p-3 bg-amber-50 rounded-lg text-xs"><b>{n.title}</b> — {n.author}</div>)}</div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="text-sm font-bold">🎉 Add Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <input placeholder="Event Name" className={inputCls} value={eventName} onChange={(e) => setEventName(e.target.value)} />
              <input placeholder="Venue" className={inputCls} value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} />
              <button type="submit" className={btnPrimary}>Save Event</button>
            </form>
            <div className="space-y-2">{events.map((ev) => <div key={ev.id} className="p-3 bg-slate-50 rounded-lg text-xs"><b>{ev.name}</b> — 📍 {ev.venue}</div>)}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-bold text-purple-700 mb-3">👑 Department Heads (HOD)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {departmentHeads.map((h) => (
              <div key={h.id} className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-xs">
                <p className="font-black text-purple-800">{h.dept_name}</p><p className="font-bold text-slate-900">Prof. {h.name}</p><p className="text-slate-500">{h.subject} ({h.id})</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  if (searchParams.get('role') === 'admin') return <AdminView />;
  return <div className="min-h-screen flex items-center justify-center font-bold text-red-600">403 - Access Denied</div>;
}

export default function DashboardPage() {
  return <Suspense fallback={<div className="p-8">Loading...</div>}><DashboardPageContent /></Suspense>;
}
