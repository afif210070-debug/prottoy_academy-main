'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [userId, setUserId] = useState<string>('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    if (userId.toLowerCase() === 'admin') {
      router.push('/dashboard?role=admin');
    } else if (userId.startsWith('017')) {
      router.push('/dashboard?role=teacher');
    } else {
      router.push(`/dashboard?role=student&id=${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans antialiased">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl shadow-xl space-y-5 w-full max-w-sm border border-slate-700">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">🛡️ Prottoy Academy Portal</h2>
          <p className="text-[11px] text-slate-400">ইউনিফাইড সিকিউরড লগইন গেটওয়ে</p>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">আপনার ইউজার আইডি (User ID)</label>
          <input 
            type="text" 
            placeholder="admin / 017... / Student ID" 
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl font-bold transition shadow-md">
          Portal Login
        </button>
      </form>
    </div>
  );
}
