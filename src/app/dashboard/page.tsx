'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const [student, setStudent] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem('studentId');
    if (!savedId) {
      registerDummy();
    } else {
      fetchData(savedId);
    }
  }, []);

  const registerDummy = async () => {
    const res = await fetch('/api/student/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Demo Student',
        email: `demo_${Date.now()}@example.com`,
        class: 11,
        targetYear: 2027
      })
    });
    const data = await res.json();
    localStorage.setItem('studentId', data.student.id);
    setStudent(data.student);
    setPlan(data.plan);
    setLoading(false);
  };

  const fetchData = async (id: string) => {
    const res = await fetch(`/api/plan/today?studentId=${id}`);
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  };

  const sendChat = async () => {
    if (!chatMessage) return;
    const studentId = localStorage.getItem('studentId');
    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    const res = await fetch('/api/mentor/chat', {
      method: 'POST',
      body: JSON.stringify({ studentId, message: chatMessage, history: chatHistory })
    });
    const data = await res.json();
    setChatHistory([...newHistory, { role: 'model', content: data.response }]);
  };

  if (loading) return <div className="p-8">Loading your personalized NEET plan...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Good Morning, {student?.name || 'Student'}</h1>
          <p className="text-slate-600">Phase {plan?.phase} | Intensity: {plan?.intensity_score}/10</p>
        </div>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold">
          NEET 2027 Aspirant
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <p className="text-sm text-yellow-700 font-medium">
              <span className="font-bold">AI Note:</span> {plan?.mentor_context?.alert}
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-slate-800">Today's Study Blocks</h2>
          <div className="space-y-4">
            {plan?.study_blocks?.map((block: any) => (
              <div key={block.block_id} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{block.subject}</span>
                    <h3 className="text-lg font-bold mt-2 text-slate-900">
                       <Link href={`/chapter/${encodeURIComponent(block.chapter)}`} className="hover:text-indigo-600">
                        {block.chapter}
                       </Link>
                    </h3>
                  </div>
                </div>
                <ul className="text-slate-600 text-sm mb-4">
                  {block.topics.map((t: any, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                      {t.name}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-400">Est. Time: 60 mins</span>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all">
                    Mark Done
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-10 mb-4 text-slate-800">Revision & Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan?.practice_slots?.map((slot: any) => (
              <div key={slot.slot_id} className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="font-bold text-indigo-900">{slot.type === 'weak_topic_drill' ? 'Weak Topic Fix' : 'Daily Drill'}</h4>
                <p className="text-sm text-indigo-700 mb-3">{slot.chapter || slot.subtopic_name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-500">{slot.question_count} MCQs</span>
                  <Link href={`/test?chapter=${encodeURIComponent(slot.chapter || 'Revision')}`} className="bg-white text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-200 shadow-sm">Start Test</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">AI Mentor Chat</h2>
            <div className="h-[400px] overflow-y-auto mb-4 space-y-4 pr-2">
              {chatHistory.length === 0 && (
                <p className="text-slate-400 text-sm italic">Ask me about your schedule, conceptual doubts, or NEET strategies...</p>
              )}
              {chatHistory.map((h, i) => (
                <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${h.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                    {h.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-100 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendChat}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl">
            <h3 className="font-bold mb-2 text-sm">Preparation Health</h3>
            <div className="w-full bg-slate-700 h-2 rounded-full mb-1">
              <div className="bg-green-400 h-2 rounded-full w-[12%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Syllabus Completion: 12%</p>
            <div className="mt-4 pt-4 border-t border-slate-700">
               <Link href="/calendar" className="text-xs text-indigo-400 font-bold hover:underline">View 2-Year Roadmap →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
