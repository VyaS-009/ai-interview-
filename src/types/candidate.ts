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
