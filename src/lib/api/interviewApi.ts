import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const interviewApi = createApi({
  reducerPath: "interviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    uploadResume: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/upload-resume",
        method: "POST",
        body: formData,
      }),
    }),
    generateQuestion: builder.mutation<
      { question: string },
      { difficulty: string }
    >({
      query: (body) => ({
        url: "/generate-question",
        method: "POST",
        body,
      }),
    }),
    evaluateAnswer: builder.mutation<
      { score: number; justification: string },
      { question: string; answer: string; difficulty: string }
    >({
      query: (body) => ({
        url: "/evaluate-answer",
        method: "POST",
        body,
      }),
    }),
    generateSummary: builder.mutation<
      { finalScore: number; finalSummary: string },
      { chatHistory: { q: string; a: string }[] }
    >({
      query: (body) => ({
        url: "/generate-summary",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useGenerateQuestionMutation,
  useEvaluateAnswerMutation,
  useGenerateSummaryMutation,
} = interviewApi;
