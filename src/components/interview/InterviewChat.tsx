// src/components/interview/InterviewChat.tsx
"use client";

import { message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import {
  setInterviewStatus,
  setFinalResult,
  setAllQuestions,
  setAllEvaluations,
  submitAnswer,
} from "@/lib/redux/slices/interviewSlice";
import {
  useGenerateSummaryMutation,
  useSaveCompletedInterviewMutation,
  useGenerateAllQuestionsMutation,
  useEvaluateAllAnswersMutation,
} from "@/lib/api/interviewApi";
import { useEffect, useRef, useState, useMemo } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import QuestionPanel from "./QuestionPanel";
// import InterviewStepper from "./InterviewStepper";
import ReactMarkdown from "react-markdown";

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const {
    candidateInfo,
    questionsAndAnswers,
    currentQuestionIndex,
    interviewStatus,
    // sessionId, // Get the session ID from the store
  
  } = useSelector((state: RootState) => state.interview);
  const [evaluateAllAnswers] = useEvaluateAllAnswersMutation();
  const [generateSummary] = useGenerateSummaryMutation();
  const [generateAllQuestions] = useGenerateAllQuestionsMutation();
  const [saveCompletedInterview] = useSaveCompletedInterviewMutation();

  const [isProcessing, setIsProcessing] = useState(true);

  const hasFetchedQuestions = useRef(false);

  useEffect(() => {
    // If questions are already loaded (e.g., from a page refresh), just stop loading.
    if (questionsAndAnswers.length > 0) {
      setIsProcessing(false);
      return;
    }

    // Otherwise, fetch all questions when the component mounts for an "in-progress" interview
    if (
      candidateInfo &&
      interviewStatus === "in-progress" &&
      !hasFetchedQuestions.current
    ) {
      const fetchAllQuestions = async () => {
        hasFetchedQuestions.current = true; // Mark as fetched immediately
        setIsProcessing(true);
        try {
          // SINGLE request to get all questions
          const generatedQuestions = await generateAllQuestions({ profile: candidateInfo }).unwrap();
          const allQuestions = generatedQuestions.map((q: { question: string; difficulty: string }) => ({
            question: q.question,
            difficulty: q.difficulty,
            answer: null,
            evaluation: null,
          }));
          dispatch(setAllQuestions(allQuestions));
        } catch (err) {
          console.error("Failed to generate initial questions:", err);
          message.error("Could not start the interview. Please try again.");
          hasFetchedQuestions.current = false; // Allow retry on error
        } finally {
          setIsProcessing(false);
        }
      };
      fetchAllQuestions();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewStatus, candidateInfo, questionsAndAnswers.length, generateAllQuestions]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message
    const lastAnsweredIndex = questionsAndAnswers.findIndex(qa => qa.answer === null);
    const scrollIndex = lastAnsweredIndex === -1 ? questionsAndAnswers.length - 1 : Math.max(0, lastAnsweredIndex);
    const targetElement = document.getElementById(`answer-container-${scrollIndex}`);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [questionsAndAnswers, currentQuestionIndex]);

  const isLastQuestion = useMemo(() => {
    return questionsAndAnswers.length > 0 && currentQuestionIndex === questionsAndAnswers.length - 1;
  }, [questionsAndAnswers, currentQuestionIndex]);

  const isChatDisabled = isProcessing || interviewStatus === "completed";

  const handleAnswerSubmit = (answer: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    dispatch(submitAnswer({ answer }));

    // If that was the last question, trigger final evaluation.
    // We use a timeout to allow the Redux state to update before we read it.
    if (isLastQuestion) {
      setTimeout(async () => {
        // The state is now updated with the final answer.
        const finalState = (await import("@/lib/redux/store")).store.getState().interview;

        if (!finalState.sessionId) {
          message.error("Session ID is missing. Cannot save interview results.");
          setIsProcessing(false);
          return;
        }

        try {
          // 1. Evaluate all answers in a SINGLE batch request
          const evaluationPayload = finalState.questionsAndAnswers.map(qa => ({ question: qa.question, answer: qa.answer || "No answer.", difficulty: qa.difficulty }));
          const evaluations = await evaluateAllAnswers(evaluationPayload).unwrap();

          // Dispatch the evaluations to update the Redux store
          dispatch(setAllEvaluations(evaluations));

          const evaluatedHistory = finalState.questionsAndAnswers.map((qa, i) => ({
            ...qa, // Spread the original question and answer
            evaluation: evaluations[i], // Assign the entire evaluation object
          }));

        // 2. Generate Summary
        const summaryResponse = await generateSummary({
          chatHistory: evaluatedHistory.map(h => ({ q: h.question, a: h.answer || "" })),
        }).unwrap();

        // 3. Save the entire completed interview record
        const newCandidateRecord = {
          id: finalState.sessionId,
          name: finalState.candidateInfo?.name || null,
          email: finalState.candidateInfo?.email || null,
          phone: finalState.candidateInfo?.phone || null,
          occupation: finalState.candidateInfo?.occupation || null,
          skills: finalState.candidateInfo?.skills || null,
          experience: finalState.candidateInfo?.experience || null,
          projects: finalState.candidateInfo?.projects || null,
          jobRole: finalState.candidateInfo?.jobRole || null,
          jobDescription: finalState.candidateInfo?.jobDescription || null,          
          chatHistory: evaluatedHistory.map(qa => ({
            q: qa.question,
            a: qa.answer || "",
            evaluation: qa.evaluation,
          })),
          finalResult: summaryResponse,
          finalScore: summaryResponse.finalScore,
          finalSummary: summaryResponse.overallSummary,
          completedAt: new Date().toISOString(),
        };
        await saveCompletedInterview(newCandidateRecord).unwrap();

        // 4. Update local state to show completion screen
        // The payload for setFinalResult now matches the new, detailed structure
        dispatch(setFinalResult(summaryResponse));
        dispatch(setInterviewStatus({ status: "completed" }));

        } catch (error) {
          console.error("Final evaluation/summary error:", error);
          message.error("Failed to finalize interview results.");
        } finally {
          setIsProcessing(false);
        }
      }, 0);
    } else {
      setIsProcessing(false);
    }
  };

  if (isProcessing && questionsAndAnswers.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" tip="Preparing your personalized interview..." />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen p-4 flex gap-4">
      {/* Left Panel */}
      <div className="w-1/3 h-full">
        <QuestionPanel />
      </div>

      {/* Right Panel */}
      <div className="w-2/3 h-full flex flex-col bg-white/20 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
        {/* Stepper at the top of the chat panel */}
        {/* <InterviewStepper /> */}

        <div
          ref={listRef}
          className="flex-grow overflow-y-auto px-6 py-4 space-y-6 scrollbar-custom"
        >
          {questionsAndAnswers.slice(0, currentQuestionIndex + 1).map((qa, index) => (
            <div key={index} id={`answer-container-${index}`} className="space-y-4">
              <ChatMessage message={<ReactMarkdown>{qa.question}</ReactMarkdown>} isAI={true} />
              {qa.answer && <ChatMessage message={qa.answer} isAI={false} />}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/30">
          <ChatInput onSubmit={handleAnswerSubmit} disabled={isChatDisabled} />
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;
           