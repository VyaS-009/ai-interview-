export interface CandidateInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  occupation: string | null;
  skills: string[] | null;
  experience: string | null;
  projects: string | null;
  jobRole: string | null;
  jobDescription: string | null;
}

export interface AnswerAnalysis {
  positive_feedback: string;
  areas_for_improvement: string;
  suggested_answer: string;
}

export interface Candidate {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  occupation: string | null;
  skills: string[] | null;
  experience: string | null;
  projects: string | null;
  jobRole: string | null;
  jobDescription: string | null;
  chatHistory: Array<{
    q: string;
    a: string;
    evaluation: { score: number; analysis: AnswerAnalysis } | null;
  }>;
  finalResult: FinalResult | null; // The full structured result
  finalScore: number | null; // For quick display on dashboard
  finalSummary: string | null; // For quick display on dashboard
  completedAt: string | null;
}

export interface ImprovementArea {
  area: string;
  suggestion: string;
  resources: {
    title: string;
    url: string;
  }[];
}

export interface FinalResult {
  finalScore: number;
  overallSummary: string;
  strongAreas: string[];
  weakAreas: string[];
  areasForImprovement: ImprovementArea[];
}

export interface InterviewState {
  interviewStatus:
    | "not-started"
    | "collecting-info"
    | "in-progress"
    | "completed";
  candidateId: string | null;
  candidateInfo: CandidateInfo | null;
  missingInfo: string[];
  questionsAndAnswers: Array<{
    question: string;
    answer: string | null;
    evaluation: { score: number; analysis: AnswerAnalysis } | null;
    difficulty: string;
  }>;
  currentQuestionIndex: number;
  finalResult: FinalResult | null;
  candidates: Candidate[];
  sessionId: string | null;
}
