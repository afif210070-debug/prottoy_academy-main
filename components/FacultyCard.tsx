"use client";
import Image from "next/image";
import { useState } from "react";
// অফিশিয়াল টাইপ স্কিমা ইমপোর্ট
import type { Faculty } from '@/app/faculty/page';

 function FacultyCard({ teacher }: { teacher: Faculty }) {
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
        <p className="text-sky-600 font-semibold text-sm mt-0.5">
          {teacher.designation}
        </p>
        <p className="text-slate-500 text-xs mt-1">{teacher.department}</p>

        <div className="mt-4 space-y-1.5 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-700">Education:</span>{" "}
            {teacher.education}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Subjects:</span>{" "}
            {teacher.subjects.join(", ")}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Experience:</span>{" "}
            {teacher.experience}
          </p>
        </div>

        {teacher.email && (
          <a
            href={`mailto:${teacher.email}`}
            className="mt-4 inline-block text-xs font-semibold text-sky-600 hover:text-sky-800"
          >
            Contact Faculty -&gt;
          </a>
        )}
      </div>
    </article>
  );
}
export default FacultyCard;