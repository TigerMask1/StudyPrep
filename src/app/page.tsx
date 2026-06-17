import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg">🩺</div>
          <span className="text-xl font-black tracking-tight">NEET <span className="text-indigo-600">AI</span></span>
        </div>
        <Link href="/login" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-xl active:scale-95">
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-indigo-100">
             <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
             Next-Gen Preparation
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            Don't just study. <br/> <span className="text-indigo-600">Strategize.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg">
            The world's first autonomous AI mentor that takes complete ownership of your NEET preparation. From daily schedules to deep performance analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="/login" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-center text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95">
              Begin Your Journey
            </Link>
            <div className="flex -space-x-3 items-center px-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                   A{i}
                 </div>
               ))}
               <p className="ml-6 text-xs font-black text-slate-400 uppercase tracking-widest">Join 2,000+ Aspirants</p>
            </div>
          </div>
        </div>

        <div className="relative">
           <div className="absolute -inset-4 bg-indigo-600/10 rounded-[4rem] blur-3xl"></div>
           <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AI Mentor</p>
                       <p className="font-bold">Neural Link Ready</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-sm leading-relaxed italic">
                       "Your performance in Organic Chemistry dropped by 12%. I've adjusted your plan for the next 3 days to focus on Nucleophilic Substitution."
                    </div>
                    <div className="flex justify-between items-end pt-10">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Today's Intensity</p>
                          <div className="flex gap-1">
                             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-4 h-8 bg-indigo-500 rounded-sm"></div>)}
                             <div className="w-4 h-8 bg-white/10 rounded-sm"></div>
                             <div className="w-4 h-8 bg-white/10 rounded-sm"></div>
                          </div>
                       </div>
                       <p className="text-4xl font-black">8.0</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
           <h2 className="text-4xl font-black tracking-tight mb-20 text-center">Engineered for the <span className="text-indigo-600">Top 1%.</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: "Dynamic Planning", desc: "A live roadmap that mutates based on your test scores and school exams.", icon: "🗓️" },
                { title: "Weak Topic Intel", desc: "AI identifies precisely which subtopics are pulling your rank down.", icon: "🎯" },
                { title: "24/7 Mentor", desc: "Conceptual doubt clearance and emotional coaching, whenever you need it.", icon: "⚡" }
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all">
                  <div className="text-4xl mb-8">{f.icon}</div>
                  <h3 className="text-xl font-black mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-100 text-center">
         <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em]">NEET AI Mentor Platform © 2026-27 | Autonomous Intelligence</p>
      </footer>
    </div>
  );
}
