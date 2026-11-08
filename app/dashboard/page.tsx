'use client';
import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Discipline = 'Engineering' | 'Science' | 'Humanities' | 'Business' | 'Medical' | 'ICT' | 'Agriculture' | 'Law';
interface TeacherRecord { id: string; name: string; subject: string; discipline: Discipline; isHead: boolean; deptName: string; }
interface StudentRecord { id: string; name: string; batch: string; department: string; totalFee: number; paidFee: number; }
interface ExamSchedule { id: string; dept: string; subject: string; date: string; time: string; room: string; }
interface NoticeItem { id: string; title: string; author: string; date: string; tag: string; }
interface EventItem { id: string; name: string; date: string; venue: string; tint: string; }

const DISCIPLINES: Discipline[] = ['Engineering', 'Science', 'Humanities', 'Business', 'Medical', 'ICT', 'Agriculture', 'Law'];
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBnDigits(i: string | number): string { return String(i).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]); }
function formatBn(a: number): string { return toBnDigits(Math.round(Number.isFinite(a) ? a : 0).toLocaleString('en-US')); }
function taka(a: number): string { return `৳ ${formatBn(a)}`; }

type IconName = 'shield' | 'users' | 'logout' | 'plus' | 'wallet' | 'cap' | 'chart';
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    shield: <path d="M12 3l7 3v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V6l7-3z" />,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20.5v-1.6A4.9 4.9 0 017.4 14h3.2a4.9 4.9 0 014.9 4.9v1.6" /></>,
    logout: <><path d="M9.5 20.5H5.5a2 2 0 01-2-2v-13a2 2 0 012-2h4" /><path d="M16 16.5l4.5-4.5L16 7.5M20.5 12H9.5" /></>,
    plus: <path d="M12 5.5v13M5.5 12h13" />,
    wallet: <><rect x="2.5" y="6" width="19" height="13" rx="2.5" /><path d="M2.5 10.5h19" /></>,
    cap: <><path d="M21.5 9L12 4.5 2.5 9 12 13.5 21.5 9z" /><path d="M6 11.4v4.6c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.6" /></>,
    chart: <path d="M3.5 3.5v17h17M7.5 15.5l3.5-4 3 2.8 4.5-5.8" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">{paths[name]}</svg>;
}

const INITIAL_NOTICES: NoticeItem[] = [{ id: '1', title: 'Final semester exam fee must be paid by 20 November.', author: 'Mohammad Asaduzzaman (CSE)', date: '08 Nov', tag: 'Urgent' }];
const INITIAL_EVENTS: EventItem[] = [
  { id: 'v1', name: 'Academic Tech Fest 2026', date: '15 November', venue: 'Auditorium-2', tint: 'border-l-blue-500' },
  { id: 'v2', name: 'Annual Sports Competition', date: '10 December', venue: 'Main Playground', tint: 'border-l-purple-500' }
];
const INITIAL_EXAMS: ExamSchedule[] = [{ id: 'E1', dept: 'CSE', subject: 'Data Structures', date: '2026-11-22', time: '10:00 AM', room: 'Room 402' }];
const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10';
const btnPrimary = 'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none';

function Sidebar({ onNavigate }: { onNavigate: (path: string) => void }) {
  const items = [{ icon: 'shield' as IconName, label: 'Admin Control', active: true }, { icon: 'users' as IconName, label: 'Faculty Registry', path: '/faculty' }, { icon: 'cap' as IconName, label: 'Student Directory' }, { icon: 'chart' as IconName, label: 'Reports & Analytics' }];
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between bg-slate-900 p-6 text-slate-300">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">P</div>
          <div><p className="text-sm font-semibold text-white">Prottoy Academy</p><p className="text-[11px] text-slate-400">ERP Engine v3.0</p></div>
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <button key={item.label} type="button" onClick={() => item.path && onNavigate(item.path)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${item.active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60'}`}><Icon name={item.icon} /> <span>{item.label}</span></button>
          ))}
        </nav>
      </div>
      <button type="button" onClick={() => onNavigate('/')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"><Icon name="logout" /> Sign Out</button>
    </aside>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: IconName }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm w-full">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-900 tabular-nums">{value}</p><p className="mt-1 text-xs text-slate-400">{sub}</p></div>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-600"><Icon name={icon} /></span>
      </div>
    </div>
  );
}

function AdminView() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [exams] = useState<ExamSchedule[]>(INITIAL_EXAMS);
  const [tName, setTName] = useState(''); const [tSub, setTSub] = useState(''); const [tId, setTId] = useState('');
  const [tDiscipline, setTDiscipline] = useState<Discipline>('ICT'); const [tDeptName, setTDeptName] = useState('');
  const [tIsHead, setTIsHead] = useState(false); const [tError, setTError] = useState('');
  const [sName, setSName] = useState(''); const [sBatch, setSBatch] = useState(''); const [sDept, setSDept] = useState('');
  const [sId, setSId] = useState(''); const [sError, setSError] = useState('');
  const [noticeText, setNoticeText] = useState(''); const [noticeAuthor, setNoticeAuthor] = useState('');
  const [eventName, setEventName] = useState(''); const [eventVenue, setEventVenue] = useState('');

  const teacherIdExists = useCallback((id: string) => teachers.some((t) => t.id.toLowerCase() === id.trim().toLowerCase()), [teachers]);
  const studentIdExists = useCallback((id: string) => students.some((s) => s.id.toLowerCase() === id.trim().toLowerCase()), [students]);
  const headExistsInDept = useCallback((dept: string) => teachers.some((t) => t.isHead && t.deptName.toLowerCase() === dept.trim().toLowerCase()), [teachers]);

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault(); setTError('');
    const name = tName.trim(); const subject = tSub.trim(); const id = tId.trim(); const dept = tDeptName.trim();
    if (!name || !subject || !id || !dept) { setTError('All fields are required.'); return; }
    if (teacherIdExists(id)) { setTError(`Teacher ID "${id}" already exists.`); return; }
    if (tIsHead && headExistsInDept(dept)) { setTError(`Department "${dept}" already has a head.`); return; }
    setTeachers((prev) => [...prev, { id, name, subject, discipline: tDiscipline, isHead: tIsHead, deptName: dept }]);
    setTName(''); setTSub(''); setTId(''); setTDeptName(''); setTIsHead(false); setTDiscipline('ICT');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault(); setSError('');
    const name = sName.trim(); const batch = sBatch.trim(); const dept = sDept.trim(); const id = sId.trim();
    if (!name || !batch || !dept || !id) { setSError('All fields are required.'); return; }
    if (studentIdExists(id)) { setSError(`Student ID "${id}" already exists.`); return; }
    setStudents((prev) => [...prev, { id, name, batch, department: dept, totalFee: 12000, paidFee: 0 }]);
    setSName(''); setSBatch(''); setSDept(''); setSId('');
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault(); if (!noticeText || !noticeAuthor) return alert('Notice fields required.');
    setNotices([{ id: Date.now().toString(), title: noticeText, author: noticeAuthor, date: '08 Nov', tag: 'Academic' }, ...notices]);
    setNoticeText(''); setNoticeAuthor('');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault(); if (!eventName || !eventVenue) return alert('Event fields required.');
    setEvents([...events, { id: Date.now().toString(), name: eventName, date: '18 Nov', venue: eventVenue, tint: 'border-l-emerald-500' }]);
    setEventName(''); setEventVenue('');
  };

  const handleFeeChange = (id: string, value: number) => setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, paidFee: value } : s)));
  const totalCollected = useMemo(() => students.reduce((sum, s) => sum + s.paidFee, 0), [students]);
  const departmentHeads = useMemo(() => teachers.filter((t) => t.isHead), [teachers]);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 w-full font-sans">
      <Sidebar onNavigate={(p) => router.push(p)} />
      <main className="flex-1 p-6 lg:p-9 overflow-y-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Admin & Faculty Control Hub</h2>
            <p className="text-slate-400 text-xs mt-1">লাইভ ইউনিভার্সিটি ইআরপি নেটওয়ার্ক সচল আছে।</p>
          </div>
          <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-xl text-xs font-bold">Session: 2026-2027</span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">📢 ডাইনামিক নোটিশ বোর্ড:</div>
            <div className="divide-y divide-amber-200/60 max-h-48 overflow-y-auto">
              {notices.map((n) => (
                <div key={n.id} className="py-2.5 flex flex-col gap-1 text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">• {n.title}</span>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium"><span>By: {n.author}</span><span>|</span><span>{n.date}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="text-slate-900 font-bold text-sm flex items-center gap-1">🎉 আপকামিং ইভেন্টস:</div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {events.map((ev) => (
                <div key={ev.id} className={`border-l-4 ${ev.tint} bg-slate-50 p-2.5 rounded-r-lg text-xs flex flex-col gap-0.5`}>
                  <span className="font-bold text-slate-800">{ev.name}</span>
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5"><span>📅 {ev.date}</span><span>📍 {ev.venue}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="মোট শিক্ষক" value={toBnDigits(teachers.length)} sub="নিবন্ধিত মেন্টরস" icon="users" />
          <StatCard label="মোট শিক্ষার্থী" value={toBnDigits(students.length)} sub="অ্যাক্টিভ প্রোফাইল" icon="cap" />
          <StatCard label="আদায়কৃত ফি" value={taka(totalCollected)} sub="টোটাল ফাইনান্স ক্যাশ লিজ" icon="wallet" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Register Teacher</h2>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Name</span><input className={inputCls} value={tName} onChange={(e) => setTName(e.target.value)} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Subject</span><input className={inputCls} value={tSub} onChange={(e) => setTSub(e.target.value)} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Teacher ID</span><input className={inputCls} value={tId} onChange={(e) => setTId(e.target.value)} /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Department</span><input className={inputCls} value={tDeptName} onChange={(e) => setTDeptName(e.target.value)} /></label>
              </div>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Discipline</span>
                <select value={tDiscipline} onChange={(e) => setTDiscipline(e.target.value as Discipline)} className={inputCls}>
                  {DISCIPLINES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={tIsHead} onChange={(e) => setTIsHead(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600" /> Department Head</label>
              {tError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">❌ {tError}</p>}
              <button type="submit" className={btnPrimary}>Register Teacher</button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Register Student</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Name</span><input className={inputCls} value={sName} onChange={(e) => setSName(e.target.value)} /></label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Batch</span><input className={inputCls} value={sBatch} onChange={(e) => setSBatch(e.target.value)} /></label>
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Department</span><input className={inputCls} value={sDept} onChange={(e) => setSDept(e.target.value)} /></label>
              </div>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Student ID</span><input className={inputCls} value={sId} onChange={(e) => setSId(e.target.value)} /></label>
              {sError && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">❌ {sError}</p>}
              <button type="submit" className={btnPrimary}>Register Student</button>
            </form>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-purple-700 mb-4">👑 ডাইনামিক ডিপার্টমেন্ট হেড (HOD) রেজিস্ট্রি কন্ট্রোল</h3>
          {departmentHeads.length === 0 ? (
            <p className="text-slate-400 text-xs italic text-center p-6 border border-dashed rounded-xl bg-slate-50/50">Currently no department heads assigned.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-purple-50 text-purple-900 font-bold uppercase"><th className="p-3 pl-4">Department</th><th className="p-3">HOD Name</th><th className="p-3 text-center">Faculty ID</th><th className="p-3 text-right pr-4">Expertise Subject</th></tr>
                </thead>
                <tbody className="divide-y text-slate-600 font-medium">
                  {departmentHeads.map((h) => (
                    <tr key={h.id} className="hover:bg-purple-50/20"><td className="p-3 pl-4 font-black text-purple-700 uppercase">{h.deptName}</td><td className="p-3 font-bold text-slate-900">Prof. {h.name}</td><td className="p-3 text-center font-mono">{h.id}</td><td className="p-3 text-right pr-4 text-slate-500">{h.subject}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <section className="mb-7 rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-100 px-6 py-5"><h2 className="text-sm font-semibold text-slate-900">Tuition Fee Management</h2></header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider">Paid</th>
                  <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">No students registered yet.</td></tr>
                ) : (
                  students.map((s) => {
                    const due = Math.max(0, s.totalFee - s.paidFee);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{s.id}</td>
                        <td className="px-6 py-3.5 font-medium text-slate-900">{s.name}</td>
                        <td className="px-6 py-3.5 text-slate-600">{s.batch}</td>
                        <td className="px-6 py-3.5 text-right tabular-nums text-slate-600">{taka(s.totalFee)}</td>
                        <td className="px-6 py-3.5 text-right">
                          <input type="number" min={0} max={s.totalFee} value={s.paidFee} onChange={(e) => handleFeeChange(s.id, Number(e.target.value) || 0)} className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-right text-sm tabular-nums focus:outline-none" />
                        </td>
                        <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-rose-600">{taka(due)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Publish Notice</h2>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Notice</span><input className={inputCls} value={noticeText} onChange={(e) => setNoticeText(e.target.value)} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Author</span><input className={inputCls} value={noticeAuthor} onChange={(e) => setNoticeAuthor(e.target.value)} /></label>
              <button type="submit" className={btnPrimary}>Publish</button>
            </form>
            <ul className="mt-5 space-y-2">
              {notices.map((n) => (
                <li key={n.id} className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm">
                  <p className="font-medium text-slate-900">{n.title}</p><p className="mt-0.5 text-xs text-slate-400">{n.author} · {n.date}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">Add Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Event name</span><input className={inputCls} value={eventName} onChange={(e) => setEventName(e.target.value)} /></label>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">Venue</span><input className={inputCls} value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} /></label>
              <button type="submit" className={btnPrimary}>Create Event</button>
            </form>
            <ul className="mt-5 space-y-2">
              {events.map((ev) => (
                <li key={ev.id} className="rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm">
                  <p className="font-medium text-slate-900">{ev.name}</p><p className="mt-0.5 text-xs text-slate-400">📍 {ev.venue} · {ev.date}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">📅 একাডেমিক এক্সাম ডিটেইলস শিডিউলার</h3>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500 font-bold uppercase"><th className="p-3 pl-4">Dept</th><th className="p-3">Subject</th><th className="p-3 text-center">Date</th><th className="p-3 text-center">Time</th><th className="p-3 text-right pr-4">Room No</th></tr>
              </thead>
              <tbody className="divide-y text-slate-600 font-medium">
                {exams.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60"><td className="p-3 pl-4 font-bold text-blue-600">{e.dept}</td><td className="p-3 font-semibold text-slate-800">{e.subject}</td><td className="p-3 text-center">{e.date}</td><td className="p-3 text-center">{e.time}</td><td className="p-3 text-right pr-4 font-mono text-emerald-600">{e.room}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <h1 className="text-4xl font-black text-red-600">403 - Access Denied ❌</h1>
      <p className="text-slate-500 text-sm mt-2 font-semibold">আপনার সেশন ভেরিফিকেশন ফেইল করেছে। অনুগ্রহ করে লগইন করুন।</p>
    </div>
  );
}

function DashboardPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  if (role === 'admin') return <AdminView />;
  return <AccessDenied />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs font-bold text-slate-400">Loading Premium Suite Panel...</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}
