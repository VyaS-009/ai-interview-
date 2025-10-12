import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Candidate, CandidateInfo, FinalResult, AnswerAnalysis } from "@/types/interview";
import { RootState } from "../redux/store";

// Define a type for the credentials
interface AuthCredentials {
  username: string;
  password: string;
}

// Define a type for the auth response
interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const interviewApi = createApi({
  reducerPath: "interviewApi",
  tagTypes: ["InterviewHistory"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Correctly get the token from the auth slice
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // --- Auth Endpoints ---
    login: builder.mutation<AuthResponse, AuthCredentials>({
      query: (credentials) => ({
        url: '/auth/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
      }),
    }),
    register: builder.mutation<{ email: string }, AuthCredentials>({
        query: (credentials) => ({
          url: '/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }),
        }),
      }),

    // --- Interview Endpoints ---
    startSession: builder.mutation<{ sessionId: string }, void>({
      query: () => ({ url: "start-session", method: "POST" }),
    }),
    saveQuestion: builder.mutation<
      void,
      { sessionId: string; question: string; answer: string; score: number; justification: string }
    >({
      query: (body) => ({ url: "/save-question", method: "POST", body }),
    }),
    saveCompletedInterview: builder.mutation<void, Candidate>({
      query: (body) => ({
        url: "/save-interview",
        method: "POST",
        body,
      }),
      invalidatesTags: ["InterviewHistory"],
    }),
    uploadResume: builder.mutation<CandidateInfo, FormData>({
      query: (formData) => ({
        url: "/upload-resume",
        method: "POST",
        body: formData,
      }),
    }),
    generateAllQuestions: builder.mutation<
      Array<{ question: string; difficulty: string }>,
      { profile: CandidateInfo | null }
    >({
      query: (body) => ({
        url: "/generate-all-questions",
        method: "POST",
        body,
      }),
    }),
    evaluateAllAnswers: builder.mutation<
      Array<{ score: number; analysis: AnswerAnalysis }>,
      Array<{ question: string; answer: string; difficulty: string }>
    >({
      query: (body) => ({
        // The body will be an array of question-answer pairs
        url: "/evaluate-all-answers",
        method: "POST",
        body,
      }),
    }),
    generateSummary: builder.mutation<
      FinalResult,
      { chatHistory: { q: string; a: string }[] }
    >({
      query: (body) => ({
        url: "/generate-summary",
        method: "POST",
        body,
      }),
    }),
    // --- New History Endpoint ---
    getInterviewHistory: builder.query<Candidate[], void>({
      query: () => "/interview-history",
      providesTags: ["InterviewHistory"],
      // Add a transformResponse to convert snake_case keys to camelCase
      transformResponse: (response: (Omit<Candidate, 'jobRole' | 'jobDescription'> & { job_role?: string; job_description?: string })[]) => {
        return response.map(candidate => ({
          ...candidate,
          jobRole: candidate.job_role || null,
          jobDescription: candidate.job_description || null,
          // Extract finalScore from the nested finalResult object for easy access on the dashboard
          finalScore: candidate.finalResult?.finalScore ?? null,
        }));
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useStartSessionMutation,
  useSaveQuestionMutation,
  useSaveCompletedInterviewMutation,
  useUploadResumeMutation,
  useGenerateAllQuestionsMutation,
  useEvaluateAllAnswersMutation,
  useGenerateSummaryMutation,
  useGetInterviewHistoryQuery,
} = interviewApi;
