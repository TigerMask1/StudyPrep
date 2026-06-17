'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const [student, setStudent] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState('Initializing AI Mentor...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const start = async () => {
      try {
        const savedId = localStorage.getItem('studentId');
        let currentId = savedId;

        if (!currentId || currentId === 'undefined' || currentId === 'null') {
          setLoadingStage('Establishing identity...');
          const res = await fetch('/api/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Demo Student',
              email: `aspirant_${Date.now()}@neetmentor.ai`,
              class: 11,
              targetYear: 2027
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');
          currentId = data.student.id;
          localStorage.setItem('studentId', currentId!);
          if (isMounted) {
            setStudent(data.student);
            setPlan(data.plan);
          }
        } else {
          setLoadingStage('Loading your roadmap...');
          const res = await fetch(`/api/plan/today?studentId=${currentId}`);
          const data = await res.json();
          if (!res.ok) {
            if (res.status === 404 || res.status === 400) {
              localStorage.removeItem('studentId');
              window.location.reload();
              return;
            }
            throw new Error(data.error || 'Sync failed');
          }
          if (isMounted) {
            setPlan(data);
            setStudent({ name: 'NEET Aspirant', id: currentId });
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    start();
    return () => { isMounted = false; };
  }, []);

  const sendChat = async () => {
    if (!chatMessage || !student?.id) return;
    const studentId = student.id;
    const newHistory = [...chatHistory, { role: 'user', content: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    try {
      const res = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, message: chatMessage, history: chatHistory })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat link broken');
      setChatHistory([...newHistory, { role: 'model', content: data.response }]);
    } catch (err: any) {
      setChatHistory([...newHistory, { role: 'model', content: `Error: ${err.message}` }]);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)]"></div>
      <h2 className="text-3xl font-black tracking-tight mb-2">NEET AI</h2>
      <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] animate-pulse">{loadingStage}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-red-50 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">🛑</div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Sync Failure</h2>
        <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">{error}</p>
        <button
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 uppercase tracking-widest text-xs"
        >
          Factory Reset App
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg tracking-widest uppercase shadow-lg shadow-indigo-200">Phase {plan?.phase || '1A'}</span>
               <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-1/3"></div>
               </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]">Fuel your <br/><span className="text-indigo-600">Ambition.</span></h1>
            <p className="text-slate-400 font-bold mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.3em]">
               Daily Performance Target:
               <span className="text-indigo-600 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm">{plan?.intensity_score || 0}/10</span>
            </p>
          </div>
          <div className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Target Year</p>
                <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">NEET 2027</p>
             </div>
             <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-indigo-50">🩺</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-16">
            {/* AI Insight Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 flex items-start gap-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl shrink-0 shadow-inner group-hover:rotate-12 transition-transform duration-700">⚡</div>
                <div>
                  <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.5em] mb-4 opacity-30">Strategy Update</h4>
                  <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-bold tracking-tight">{plan?.mentor_context?.alert || 'Syllabus coverage protocol initiated.'}</p>
                </div>
              </div>
            </div>

            {/* Study Blocks */}
            <section>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                  <span className="w-4 h-14 bg-indigo-600 rounded-full shadow-xl shadow-indigo-100"></span>
                  Daily Curriculum
                </h2>
                <div className="hidden md:flex gap-3">
                   {[1,2,3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${i===1 ? 'bg-indigo-600':'bg-slate-200'}`}></div>)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {plan?.study_blocks?.length > 0 ? plan.study_blocks.map((block: any) => (
                  <div key={block.block_id} className="group relative bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700">
                    <div className="relative">
                      <div className="flex justify-between items-start mb-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50/80 px-5 py-2.5 rounded-2xl border border-indigo-100/50">{block.subject}</span>
                        <div className="flex items-center gap-2 text-slate-300 group-hover:text-indigo-400 transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                           <span className="text-[11px] font-black tracking-widest uppercase">1.5h</span>
                        </div>
                      </div>

                      <Link href={`/chapter/${encodeURIComponent(block.chapter)}`} className="block mb-8">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-[1.1]">{block.chapter}</h3>
                      </Link>

                      <div className="space-y-5 mb-12">
                        {block.topics?.map((t: any, i: number) => (
                          <div key={i} className="flex items-start gap-5 text-sm text-slate-500 font-bold leading-tight">
                            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                            {t.name}
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 group-hover:shadow-indigo-100 active:scale-[0.95]">
                        Validate Block
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full bg-white p-20 rounded-[4rem] text-center border-4 border-dashed border-slate-100">
                    <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">No active protocol detected.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Practice Slots */}
            <section>
              <h2 className="text-4xl font-black mb-12 text-slate-900 tracking-tighter flex items-center gap-5">
                <span className="w-4 h-14 bg-orange-500 rounded-full shadow-xl shadow-orange-100"></span>
                Strategic Drills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plan?.practice_slots?.map((slot: any) => (
                  <div key={slot.slot_id} className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-800 group hover:border-orange-500/50 transition-all duration-700">
                    <div className="flex justify-between items-center mb-10">
                       <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center text-3xl group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-12 transition-all duration-500">🎯</div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 opacity-50">Volume</p>
                          <p className="text-orange-400 text-lg font-black tracking-tighter">{slot.question_count} Qs</p>
                       </div>
                    </div>
                    <h4 className="font-black text-white text-lg mb-3 tracking-tight">{slot.type === 'weak_topic_drill' ? 'Error Clearance' : 'Rapid Sprint'}</h4>
                    <p className="text-[11px] text-slate-500 mb-12 truncate font-black uppercase tracking-widest opacity-40">{slot.chapter || slot.subtopic_name || 'Mixed Revision'}</p>
                    <Link href={`/test?chapter=${encodeURIComponent(slot.chapter || 'Revision')}`} className="block w-full text-center bg-orange-500 text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-950/40 active:scale-95">Initiate</Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* AI Mentor Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 space-y-12">
              <div className="bg-white p-10 md:p-12 rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col h-[850px] transition-all duration-1000">
                <div className="flex items-center gap-6 mb-16">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl shadow-indigo-100 border-8 border-white shrink-0">🤖</div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Mentor</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.3em]">Neural Link Active</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mb-12 space-y-12 pr-4 custom-scrollbar">
                  {chatHistory.length === 0 && (
                    <div className="bg-indigo-50/50 p-10 rounded-[3rem] text-slate-600 text-[13px] font-black leading-relaxed border border-indigo-50 relative">
                       <div className="absolute -top-4 -left-2 text-6xl text-indigo-100 font-serif leading-none">"</div>
                      "I've synchronized with your latest mock scores. Your organic chemistry pathways need reinforcement. How shall we begin?"
                    </div>
                  )}
                  {chatHistory.map((h, i) => (
                    <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-8 rounded-[2.5rem] text-[14px] font-bold leading-relaxed shadow-sm ${h.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                        {h.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[3rem] blur opacity-0 group-focus-within:opacity-10 transition duration-700"></div>
                  <div className="relative bg-slate-50 p-4 rounded-[3rem] border border-slate-100 flex items-center gap-4 shadow-inner">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                      placeholder="Query neural network..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-base px-8 font-black text-slate-900 placeholder:text-slate-300"
                    />
                    <button
                      onClick={sendChat}
                      className="bg-indigo-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-90"
                    >
                      <svg className="w-8 h-8 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-[#0F172A] p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group border border-slate-800">
                <div className="absolute top-0 right-0 w-80 h-84 bg-indigo-600/10 rounded-full blur-[150px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-indigo-600/20"></div>
                <h3 className="font-black mb-12 text-[11px] tracking-[0.6em] uppercase text-slate-600">Protocol Status</h3>
                <div className="space-y-12">
                  <div>
                    <div className="flex justify-between text-[11px] mb-6 font-black tracking-[0.3em]">
                      <span className="text-slate-500 uppercase">Syllabus Saturation</span>
                      <span className="text-indigo-400">12.5%</span>
                    </div>
                    <div className="w-full bg-white/5 h-5 rounded-full overflow-hidden p-1.5 shadow-inner">
                      <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_30px_rgba(99,102,241,1)] transition-all duration-[3000ms]" style={{ width: '12.5%' }}></div>
                    </div>
                  </div>
                  <div className="pt-12 border-t border-white/5">
                     <Link href="/calendar" className="group/link flex items-center justify-between text-[12px] font-black text-indigo-400 hover:text-white transition-all uppercase tracking-[0.4em]">
                        <span>Full Roadmap</span>
                        <span className="text-4xl leading-none group-hover/link:translate-x-6 transition-transform duration-700">→</span>
                     </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
