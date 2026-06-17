'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const TestContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const simulateFailure = async () => {
    setSubmitting(true);
    const studentId = localStorage.getItem('studentId');
    const chapter = searchParams.get('chapter');

    const testResult = {
      score: 45,
      weakSubtopics: [{ id: 'BIO_11_U1_CH1_T1', name: 'The Living World - Biodiversity & Taxonomy' }]
    };

    await fetch('/api/test/submit', {
      method: 'POST',
      body: JSON.stringify({ studentId, testResult })
    });

    alert("Test submitted. Score: 45%. AI Mentor has injected weak topic drills into your plan.");
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">NEET Mock Drill</h1>
        <p className="text-slate-400 mb-8">This is a simulated test environment for {searchParams.get('chapter')}.</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl border border-slate-600 font-bold hover:bg-slate-700 transition-all"
          >
            Simulate 100% Success
          </button>
          <button
            onClick={simulateFailure}
            disabled={submitting}
            className="w-full py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
          >
            {submitting ? 'Processing...' : 'Simulate Low Score (60%)'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TestEngine = () => (
  <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Test...</div>}>
    <TestContent />
  </Suspense>
);

export default TestEngine;
