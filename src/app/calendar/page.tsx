'use client';

import React from 'react';
import Link from 'next/link';

const RevisionCalendar = () => {
  const months = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-indigo-600 font-semibold mb-6 inline-block">← Back to Dashboard</Link>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">2-Year Preparation Roadmap</h1>
            <p className="text-slate-600">Strategic milestones from Phase 1 to Exam Day.</p>
          </div>
          <div className="flex gap-4 text-xs font-bold uppercase">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded"></div> Phase 1</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div> Phase 2</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Phase 3</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {months.map((month, i) => {
            let phaseColor = "bg-indigo-500";
            let phaseLabel = "Phase 1A: Syllabus";
            if (i >= 3 && i < 6) { phaseColor = "bg-indigo-600"; phaseLabel = "Phase 1B: Syllabus"; }
            if (i >= 6 && i < 11) { phaseColor = "bg-orange-500"; phaseLabel = "Phase 2: Revision"; }
            if (i >= 11) { phaseColor = "bg-red-500"; phaseLabel = "Phase 3: Mock Intensive"; }

            return (
              <div key={month} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className={`p-3 text-white font-bold text-center ${phaseColor}`}>
                  {month} 2026-27
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">{phaseLabel}</div>
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(30)].map((_, j) => (
                      <div key={j} className={`h-4 rounded-sm ${j % 7 === 0 ? 'bg-slate-200' : phaseColor + ' opacity-20'}`}></div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="text-xs flex justify-between">
                      <span className="text-slate-500">Target Coverage</span>
                      <span className="font-bold">12%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${phaseColor}`} style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-xl font-bold mb-4">Strategic Timeline Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-indigo-400 font-bold mb-2">Sep 30 Deadline</h3>
              <p className="text-sm text-slate-400">Absolute boundary for 100% syllabus completion. No new topics allowed after this date.</p>
            </div>
            <div>
              <h3 className="text-orange-400 font-bold mb-2">Spaced Repetition</h3>
              <p className="text-sm text-slate-400">R7, R30, and R90 cycles are auto-injected daily based on your completion velocity.</p>
            </div>
            <div>
              <h3 className="text-red-400 font-bold mb-2">The Final Sprint</h3>
              <p className="text-sm text-slate-400">March to May: 3 Full NEET Mocks per week with deep error analysis and weak topic drilling.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevisionCalendar;
