'use client';

import React, { useState } from 'react';

const Dashboard = () => {
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);

  const planAtom = {
    date: "2025-06-15",
    phase: "1A",
    intensity_score: 7,
    available_hours: 9.0,
    study_blocks: [
      {
        block_id: "BLK_001",
        subject: "Biology",
        chapter: "Cell Cycle and Cell Division",
        time: "07:00 - 09:30",
        topics: ["Meiosis — Prophase I substages"]
      },
      {
        block_id: "BLK_002",
        subject: "Chemistry",
        chapter: "Equilibrium",
        time: "10:00 - 11:30",
        topics: ["Buffer solutions"]
      }
    ]
  };

  const toggleBlock = (id: string) => {
    setCompletedBlocks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Good Morning, Student</h1>
        <p className="text-slate-600">Day 76 of Phase {planAtom.phase} | Intensity: {planAtom.intensity_score}/10</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Today's Schedule</h2>
          <div className="space-y-4">
            {planAtom.study_blocks.map(block => (
              <div key={block.block_id} className={`p-6 rounded-xl border transition-all ${completedBlocks.includes(block.block_id) ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{block.subject}</span>
                    <h3 className="text-lg font-bold mt-2 text-slate-900">{block.chapter}</h3>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{block.time}</span>
                </div>
                <ul className="text-slate-600 text-sm mb-4">
                  {block.topics.map((t, i) => <li key={i}>• {t}</li>)}
                </ul>
                <button
                  onClick={() => toggleBlock(block.block_id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${completedBlocks.includes(block.block_id) ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {completedBlocks.includes(block.block_id) ? '✓ Completed' : 'Mark as Done'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">AI Mentor</h2>
          <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100 italic text-slate-700">
            "You have a high-intensity day today. Focus on Meiosis Prophase I — it's a frequent NEET topic. I've added extra practice for it tomorrow."
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Ask anything..." className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
