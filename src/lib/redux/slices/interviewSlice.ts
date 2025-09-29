// src/lib/redux/slices/interviewSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { InterviewState } from "@/types/interview";

const initialState: InterviewState = {
  candidateId: null,
  candidateInfo: null,
  missingInfo: [],
  interviewStatus: "not-started",
  questionsAndAnswers: [],
  currentQuestionIndex: 0,
  finalScore: null,
  finalSummary: null,
  candidates: [],
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setCandidateInfo(
      state,
      action: PayloadAction<InterviewState["candidateInfo"]>
    ) {
      state.candidateId = state.candidateId || uuidv4();
      state.candidateInfo = action.payload;
      state.missingInfo = ["name", "email", "phone"].filter(
        (field) => !action.payload?.[field as keyof typeof action.payload]
      );
      state.interviewStatus = state.missingInfo.length
        ? "collecting-info"
        : "in-progress";
    },
    updateCandidateInfo(
      state,
      action: PayloadAction<{ field: string; value: string }>
    ) {
      if (state.candidateInfo) {
        state.candidateInfo[
          action.payload.field as keyof typeof state.candidateInfo
        ] = action.payload.value;
        state.missingInfo = state.missingInfo.filter(
          (field) => field !== action.payload.field
        );
        if (!state.missingInfo.length) {
          state.interviewStatus = "in-progress";
        }
      }
    },
    addQuestion(
      state,
      action: PayloadAction<{
        question: string;
        difficulty: string;
        time: number;
      }>
    ) {
      state.questionsAndAnswers.push({
        question: action.payload.question,
        difficulty: action.payload.difficulty,
        time: action.payload.time,
        answer: null,
        score: null,
        justification: null,
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
        score: number;
        justification: string;
      }>
    ) {
      state.questionsAndAnswers[state.currentQuestionIndex] = {
        ...state.questionsAndAnswers[state.currentQuestionIndex],
        answer: action.payload.answer,
        score: action.payload.score,
        justification: action.payload.justification,
      };
      if (state.currentQuestionIndex < 5) {
        state.currentQuestionIndex += 1;
      }
    },
    setFinalResult(
      state,
      action: PayloadAction<{ finalScore: number; finalSummary: string }>
    ) {
      state.finalScore = action.payload.finalScore;
      state.finalSummary = action.payload.finalSummary;
      if (!Array.isArray(state.candidates)) {
        state.candidates = [];
      }
      state.candidates.push({
        id: state.candidateId || uuidv4(),
        name: state.candidateInfo?.name || null,
        email: state.candidateInfo?.email || null,
        phone: state.candidateInfo?.phone || null,
        chatHistory: state.questionsAndAnswers.map((qa) => ({
          q: qa.question,
          a: qa.answer || "",
          score: qa.score,
          justification: qa.justification,
        })),
        finalScore: action.payload.finalScore,
        finalSummary: action.payload.finalSummary,
        completedAt: new Date().toISOString(),
      });
    },
    setInterviewStatus(
      state,
      action: PayloadAction<InterviewState["interviewStatus"]>
    ) {
      state.interviewStatus = action.payload;
    },
    resetInterview(state) {
      state.candidateId = null;
      state.candidateInfo = null;
      state.missingInfo = [];
      state.interviewStatus = "not-started";
      state.questionsAndAnswers = [];
      state.currentQuestionIndex = 0;
      state.finalScore = null;
      state.finalSummary = null;
    },
  },
});

export const {
  setCandidateInfo,
  updateCandidateInfo,
  addQuestion,
  addProvisionalAnswer,
  addAnswer,
  setFinalResult,
  setInterviewStatus,
  resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
