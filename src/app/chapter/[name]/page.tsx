'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ChapterContent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const chapterName = typeof params.name === 'string' ? params.name : '';

  useEffect(() => {
    if (chapterName) {
      fetchChapterData();
    }
  }, [chapterName]);

  const fetchChapterData = async () => {
    const studentId = searchParams.get('studentId') || localStorage.getItem('studentId');
    const res = await fetch(`/api/chapter/${encodeURIComponent(chapterName)}?studentId=${studentId}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading chapter details...</div>;
  if (!data) return <div className="p-8 text-center">No data found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-indigo-600 font-semibold mb-6 inline-block hover:underline transition-all">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{data.chapter}</h1>
        <p className="text-slate-600 mb-8">Comprehensive breakdown of all testable concepts.</p>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subtopic</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PYQ Frequency</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.subtopics.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Ref: {s.ncertRef?.book} Ch {s.ncertRef?.chapter} Pg {s.ncertRef?.pages}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {s.status || 'Not Started'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < s.pyqFrequency ? 'bg-orange-400' : 'bg-slate-200'}`}></div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 text-sm font-bold hover:underline">Start Drill</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ChapterDeepDive = () => (
  <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
    <ChapterContent />
  </Suspense>
);

export default ChapterDeepDive;
