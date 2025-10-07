export interface CandidateInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  position?: string;
}

export interface Candidate {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  chatHistory: Array<{
    q: string;
    a: string;
    score: number | null;
    justification: string | null;
  }>;
  finalScore: number | null;
  finalSummary: string | null;
  completedAt: string | null;
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
    score: number | null;
    justification: string | null;
    difficulty: string;
    time: number;
  }>;
  currentQuestionIndex: number;
  finalScore: number | null;
  finalSummary: string | null;
  candidates: Candidate[];
}
