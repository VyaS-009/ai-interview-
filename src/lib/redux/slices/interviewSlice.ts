// src/lib/redux/slices/interviewSlice.ts
import { createSlice, PayloadAction, WritableDraft } from "@reduxjs/toolkit";
import { clearUserSession } from "./authSlice";
import { v4 as uuidv4 } from "uuid";
import { InterviewState, CandidateInfo, FinalResult, AnswerAnalysis } from "@/types/interview";

// The `candidates` array will now hold the history of all completed interviews.
const initialState: InterviewState = {
  candidateId: null,
  candidateInfo: null,
  missingInfo: [],
  interviewStatus: "not-started",
  questionsAndAnswers: [],
  currentQuestionIndex: 0,
  finalResult: null,
  candidates: [],
  sessionId: null
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    startNewInterview(state, action: PayloadAction<{ sessionId: string }>) {
      // Reset active interview state but keep history
      const candidatesHistory = state.candidates;
      Object.assign(state, initialState, { candidates: candidatesHistory });
      state.sessionId = action.payload.sessionId;
      state.interviewStatus = "collecting-info";
    },
    setCandidateInfo(
      state,
      action: PayloadAction<CandidateInfo>
    ) {
      // Always go to the profile form after resume upload
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
      state.interviewStatus = "collecting-info";
    },
    // New reducer to set the session ID for the current interview
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
      state.candidateId = action.payload; // Keep candidateId in sync for history
    },
    setAllQuestions(state, action: PayloadAction<
      Array<WritableDraft<InterviewState["questionsAndAnswers"][0]>>
    >) {
      state.questionsAndAnswers = action.payload;
    },
    submitAnswer(state, action: PayloadAction<{ answer: string }>) {
      state.questionsAndAnswers[state.currentQuestionIndex].answer = action.payload.answer;
      state.currentQuestionIndex += 1;
    },
    setAllEvaluations(state, action: PayloadAction<Array<{ score: number; analysis: AnswerAnalysis }>>) {
      const evaluations = action.payload;
      state.questionsAndAnswers = state.questionsAndAnswers.map((qa, index) => ({
        ...qa,
        evaluation: evaluations[index],
      }));
    },
    addQuestion(
      state,
      action: PayloadAction<{
        question: string;
        difficulty: string;
      }>
    ) {
      state.questionsAndAnswers.push({
        question: action.payload.question,
        difficulty: action.payload.difficulty,
        answer: null,
        evaluation: null,
      });
    },
    addProvisionalAnswer(state, action: PayloadAction<{ answer: string }>) {
      if (state.questionsAndAnswers[state.currentQuestionIndex]) {
        state.questionsAndAnswers[state.currentQuestionIndex].answer =
          action.payload.answer;
      }
    },
    addAnswer(
      state,
      action: PayloadAction<{
        answer: string;
        evaluation: { score: number; analysis: AnswerAnalysis };
      }>
    ) {
      state.questionsAndAnswers[state.currentQuestionIndex] = {
        ...state.questionsAndAnswers[state.currentQuestionIndex],
        answer: action.payload.answer,
        evaluation: action.payload.evaluation,
      };
      if (state.currentQuestionIndex < 5) {
        state.currentQuestionIndex += 1;
      }
    },
    setFinalResult(state, action: PayloadAction<FinalResult>) {
      state.finalResult = action.payload;

      if (!Array.isArray(state.candidates)) {
        state.candidates = [];
      }
      state.candidates.push({
        id: state.candidateId || uuidv4(),
        name: state.candidateInfo?.name || null,
        email: state.candidateInfo?.email || null,
        phone: state.candidateInfo?.phone || null,
        occupation: state.candidateInfo?.occupation || null,
        skills: state.candidateInfo?.skills || null,
        experience: state.candidateInfo?.experience || null,
        projects: state.candidateInfo?.projects || null,
        jobRole: state.candidateInfo?.jobRole || null,
        jobDescription: state.candidateInfo?.jobDescription || null,
        chatHistory: state.questionsAndAnswers.map((qa) => ({
          q: qa.question,
          a: qa.answer || "",
          evaluation: qa.evaluation,
        })),
        finalResult: state.finalResult,
        finalScore: state.finalResult.finalScore,
        finalSummary: state.finalResult.overallSummary, // Storing the main summary for dashboard previews
        completedAt: new Date().toISOString(),
      });
    },
    setInterviewStatus(
      state,
      action: PayloadAction<{ status: InterviewState["interviewStatus"], info?: CandidateInfo }>
    ) {
      state.interviewStatus = action.payload.status;
      if (action.payload.info) {
        state.candidateInfo = { ...state.candidateInfo, ...action.payload.info };
      }
    },
    // This now resets only the *active* interview, preserving the candidates history.
    resetInterview: (state) => {
      // Preserve the candidates history
      const candidatesHistory = state.candidates;
      // Reset the rest of the state to its initial values
      Object.assign(state, initialState, {
        // Restore the candidates history
        candidates: candidatesHistory,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearUserSession, () => {
      // This is a hard reset for logout.
      return initialState;
    });
  },
});

export const {
  startNewInterview,
  setCandidateInfo,
  setAllQuestions,
  setAllEvaluations,
  submitAnswer,
  setSessionId,
  addQuestion,
  addProvisionalAnswer,
  addAnswer,
  setFinalResult,
  setInterviewStatus,
  resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
