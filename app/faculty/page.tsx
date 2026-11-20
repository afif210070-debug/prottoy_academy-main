'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export interface Faculty {
  id: string;
  name: string;
  designation: string;
  department: string;
  discipline: string;
  education: string;
  subjects: string[];
  experience: string;
  photo: string;
  email?: string;
}

const INITIAL_FACULTY: Faculty[] = [
  {
    id: 'FAC-01',
    name: 'Mohammad Asaduzzaman',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    discipline: 'ICT',
    education: 'M.Sc. in CSE, BUET',
    subjects: ['Data Structures', 'Algorithms', 'Web Engineering'],
    experience: '8+ years',
    photo: 'https://unsplash.com',
    email: 'asad.cse@prottoy.edu.bd',
  },
  {
    id: 'FAC-02',
    name: 'Dr. Rehana Parvin',
    designation: 'Associate Professor',
    department: 'Department of Agronomy',
    discipline: 'Agriculture',
    education: 'Ph.D. in Agronomy, BAU',
    subjects: ['Crop Production', 'Soil Science'],
    experience: '12+ years',
    photo: 'https://unsplash.com',
    email: 'rehana.agro@prottoy.edu.bd',
  },
];

const ADDITIONAL_FACULTY: Faculty[] = [
  {
    id: 'FAC-03',
    name: 'Barrister Tanvir Ahmed',
    designation: 'Part-time Lecturer',
    department: 'Department of Law',
    discipline: 'Law',
    education: 'LL.M., University of London',
    subjects: ['Constitutional Law', 'Criminal Procedure'],
    experience: '5+ years',
    photo: 'https://unsplash.com',
    email: 'tanvir.law@prottoy.edu.bd',
  },
];

const FULL_FACULTY_LIST: Faculty[] = [...INITIAL_FACULTY, ...ADDITIONAL_FACULTY];
const DISCIPLINE_FILTERS = ['All', 'ICT', 'Agriculture', 'Law'] as const;

/* ------------------------------------------------------------------ */
/* Inline Faculty Card Component                                      */
/* ------------------------------------------------------------------ */
function LocalFacultyCard({ teacher }: { teacher: Faculty }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {imgError ? (
          <span className="text-6xl text-slate-400">👨‍🏫</span>
        ) : (
          <Image
            src={teacher.photo}
            alt={teacher.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
        <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {teacher.discipline}
        </span>
      </div>

      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-900">{teacher.name}</h2>
        <p className="text-sky-600 font-semibold text-sm mt-0.5">{teacher.designation}</p>
        <p className="text-slate-500 text-xs mt-1">{teacher.department}</p>

        <div className="mt-4 space-y-1.5 text-sm text-slate-600">
          <p><span className="font-semibold text-slate-700">Education:</span> {teacher.education}</p>
          <p><span className="font-semibold text-slate-700">Subjects:</span> {teacher.subjects.join(', ')}</p>
          <p><span className="font-semibold text-slate-700">Experience:</span> {teacher.experience}</p>
        </div>

        {teacher.email && (
          <a href={`mailto:${teacher.email}`} className="mt-4 inline-block text-xs font-semibold text-sky-600 hover:text-sky-800">
            Contact Faculty -&gt;
          </a>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main Faculty Page                                                  */
/* ------------------------------------------------------------------ */
export default function FacultyPage() {
  const router = useRouter();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');

  const filteredFaculty = useMemo(() => {
    if (selectedDiscipline === 'All') return FULL_FACULTY_LIST;
    return FULL_FACULTY_LIST.filter((t) => t.discipline === selectedDiscipline);
  }, [selectedDiscipline]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-slate-900 px-6 py-6 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Verified Faculty Portal</h1>
            <p className="mt-1 text-xs text-slate-400">Registered and verified teachers</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard?role=admin')}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            ← Back Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-400">Discipline filter:</span>
          {DISCIPLINE_FILTERS.map((discipline) => (
            <button
              key={discipline}
              type="button"
              onClick={() => setSelectedDiscipline(discipline)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                selectedDiscipline === discipline ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {discipline === 'All' ? 'All Teachers' : discipline}
            </button>
          ))}
        </div>

        {filteredFaculty.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">No faculty found in this discipline.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFaculty.map((faculty) => (
              <LocalFacultyCard key={faculty.id} teacher={faculty} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
