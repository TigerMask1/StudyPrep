export interface PhaseTemplate {
  name: string;
  startOffsetMonths: number;
  endOffsetMonths: number;
  goal: string;
  dailyQuestionTarget: number;
}

export const PHASES: Record<string, PhaseTemplate> = {
  '1A': {
    name: 'Syllabus Completion (Class 11)',
    startOffsetMonths: 0,
    endOffsetMonths: 3,
    goal: 'Complete Class 11 Syllabus',
    dailyQuestionTarget: 40
  },
  '1B': {
    name: 'Syllabus Completion (Class 12)',
    startOffsetMonths: 3,
    endOffsetMonths: 6,
    goal: 'Complete Class 12 Syllabus',
    dailyQuestionTarget: 40
  },
  '2': {
    name: 'Revision + Consolidation',
    startOffsetMonths: 6,
    endOffsetMonths: 11,
    goal: '3+ Revision Cycles',
    dailyQuestionTarget: 75
  },
  '3': {
    name: 'Mock Intensive',
    startOffsetMonths: 11,
    endOffsetMonths: 14,
    goal: 'Full Mocks + Speed Drilling',
    dailyQuestionTarget: 180
  }
};

export const SUBJECT_WEIGHTS = {
  Biology: 0.45,
  Physics: 0.28,
  Chemistry: 0.27
};

export const REVISION_CYCLES = {
  R1: { day: 0, type: 'recap', minutes: 15 },
  R7: { day: 7, type: 'drill', minutes: 30, questions: 20 },
  R30: { day: 30, type: 'mini_test', minutes: 60 },
  R90: { day: 90, type: 'unit_test', minutes: 120 }
};

export const templateEngine = {
  getCurrentPhase(startDate: Date, currentDate: Date = new Date()): string {
    const diffMonths = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (diffMonths < 3) return '1A';
    if (diffMonths < 6) return '1B';
    if (diffMonths < 11) return '2';
    return '3';
  },

  getIntensityScore(newTopicsCount: number, revisionCount: number, questionCount: number): number {
    const score = (newTopicsCount * 2) + (revisionCount * 1) + (questionCount / 20);
    return Math.min(10, Math.ceil(score));
  }
};
