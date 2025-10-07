// src/components/interview/InterviewChat.tsx
"use client";

import { List, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import {
  addAnswer,
  setInterviewStatus,
  setFinalResult,
} from "@/lib/redux/slices/interviewSlice";
import {
  useEvaluateAnswerMutation,
  useGenerateSummaryMutation,
} from "@/lib/api/interviewApi";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import InterviewControls from "./InterviewControls";
import ProgressIndicator from "./ProgressIndicator";
import InterviewHeader from "./InterviewHeader";
import { SparklesIcon} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const {
    questionsAndAnswers,
    currentQuestionIndex,
    interviewStatus,
  } = useSelector((state: RootState) => state.interview);
  const [evaluateAnswer] = useEvaluateAnswerMutation();
  const [generateSummary, { isLoading: isSummaryLoading }] = useGenerateSummaryMutation();
  const [, { isLoading: isEvaluatingAnswer }] = useEvaluateAnswerMutation();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("InterviewChat State:", {
      questionsAndAnswers,
      currentQuestionIndex,
      interviewStatus,
    });
  }, [questionsAndAnswers, currentQuestionIndex, interviewStatus]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [questionsAndAnswers]);

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provisionalAnswer, setProvisionalAnswer] = useState<string | null>(null);

  const isChatDisabled =
    isEvaluatingAnswer ||
    isSummaryLoading ||
    isEvaluating ||
    isSubmitting ||
    !questionsAndAnswers[currentQuestionIndex] ||
    currentQuestionIndex >= 6 ||
    interviewStatus === "completed";

  const handleAnswerSubmit = async (answer: string) => {
    const currentQuestion = questionsAndAnswers[currentQuestionIndex];
    if (isSubmitting || !currentQuestion) return;

    setIsSubmitting(true);
    setProvisionalAnswer(answer);
    setIsEvaluating(true);

    if (currentQuestion) {
      try {
        const response = await evaluateAnswer({
          question: currentQuestion.question,
          answer,
          difficulty: currentQuestion.difficulty,
        }).unwrap();
        dispatch(
          addAnswer({
            answer,
            score: response.score,
            justification: response.justification,
          })
        );

        if (currentQuestionIndex >= 5) {
          try {
            const summaryResponse = await generateSummary({
              chatHistory: [
                ...questionsAndAnswers.slice(0, currentQuestionIndex),
                { ...currentQuestion, answer },
              ].map((qa) => ({ q: qa.question, a: qa.answer || "" })),
            }).unwrap();
            console.log("Summary Response:", summaryResponse);
            dispatch(
              setFinalResult({
                finalScore: summaryResponse.finalScore,
                finalSummary: summaryResponse.finalSummary,
              })
            );
            dispatch(setInterviewStatus("completed"));
          } catch (error) {
            console.error("Summary API error:", error);
            message.error("Failed to generate summary.");
          }
        }
      } catch (error) {
        console.error("Evaluate answer error:", error);
        message.error("Failed to evaluate answer.");
      } finally {
        setIsEvaluating(false);
        setProvisionalAnswer(null);
        setIsSubmitting(false);
      }
    }
  };

  if (interviewStatus === "completed") {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="mb-6 backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI Interview
                </h1>
                <p className="text-sm text-gray-600">Let`&apos;`s showcase your skills</p>
              </div>
            </div>
            <InterviewControls
              disabled={isChatDisabled}
              onTimeout={() => handleAnswerSubmit("I ran out of time.")}
            />
          </div>
          <ProgressIndicator />
          <InterviewHeader />
        </div>

        {/* Chat Container */}
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 overflow-hidden">
          {/* Messages Area */}
          <div
            ref={listRef}
            className="h-[500px] overflow-y-auto px-6 py-8 space-y-4 scrollbar-custom"
            style={{ scrollBehavior: "smooth" }}
          >
            {questionsAndAnswers.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <SparklesIcon className="w-10 h-10 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">Ready to begin?</h3>
                  <p className="text-gray-500">Your AI interviewer will ask you questions shortly</p>
                </div>
              </div>
            ) : (
              <List
                dataSource={questionsAndAnswers}
                renderItem={(item, index) => (
                  <div key={index} className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <ChatMessage message={<ReactMarkdown>{item.question}</ReactMarkdown>} isAI={true} />
                    </div>
                    {index === currentQuestionIndex && provisionalAnswer ? (
                      <ChatMessage message={provisionalAnswer} isAI={false} />
                    ) : item.answer && (
                      <ChatMessage message={item.answer} isAI={false} />
                    )}
                  </div>
                )}
              />
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/50 bg-white/20 backdrop-blur-xl p-6">
            <ChatInput onSubmit={handleAnswerSubmit} disabled={isChatDisabled} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewChat;