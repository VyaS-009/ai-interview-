// src/components/interview/InterviewChat.tsx
"use client";

import { Card, List, Spin, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import {
  addAnswer,
  addProvisionalAnswer,
  setInterviewStatus,
  setFinalResult,
} from "@/lib/redux/slices/interviewSlice";
import {
  useEvaluateAnswerMutation,
  useGenerateSummaryMutation,
  useGenerateQuestionMutation,
} from "@/lib/api/interviewApi";
import { useEffect, useRef, useState } from "react";
import InterviewHeader from "./InterviewHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import InterviewControls from "./InterviewControls";
import ProgressIndicator from "./ProgressIndicator";

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const {
    questionsAndAnswers,
    currentQuestionIndex,
    candidateInfo,
    interviewStatus,
    candidates,
  } = useSelector((state: RootState) => state.interview);
  const [evaluateAnswer] = useEvaluateAnswerMutation();
  const [generateSummary, { isLoading: isSummaryLoading }] =
    useGenerateSummaryMutation();
  const { isLoading: isQuestionLoading, isFetching: isQuestionFetching } =
    useGenerateQuestionMutation({
      selectFromResult: ({ isLoading }) => ({ isLoading }),
    });
  const listRef = useRef<HTMLDivElement>(null);

  // Debug state
  useEffect(() => {
    console.log("InterviewChat State:", {
      questionsAndAnswers,
      currentQuestionIndex,
      interviewStatus,
      candidates,
    });
  }, [questionsAndAnswers, currentQuestionIndex, interviewStatus, candidates]);

  // Scroll to the bottom of the chat list
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [questionsAndAnswers]);

  const [isEvaluating, setIsEvaluating] = useState(false);

  const isChatDisabled =
    isQuestionLoading ||
    isQuestionFetching ||
    isSummaryLoading ||
    isEvaluating ||
    !questionsAndAnswers[currentQuestionIndex] ||
    currentQuestionIndex >= 6 ||
    interviewStatus === "completed";

  const handleAnswerSubmit = async (answer: string) => {
    const currentQuestion = questionsAndAnswers[currentQuestionIndex];
    if (isChatDisabled || !currentQuestion) return;

    dispatch(addProvisionalAnswer({ answer }));
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

        // Check if the interview is complete
        if (currentQuestionIndex >= 5) {
          try {
            const summaryResponse = await generateSummary({
              chatHistory: [
                ...questionsAndAnswers.slice(0, currentQuestionIndex),
                { ...currentQuestion, answer },
              ].map((qa) => ({ q: qa.question, a: qa.answer || "" })),
              candidateInfo: candidateInfo,
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
      }
    }
  };

  if (interviewStatus === "completed") {
    return null;
  }

  return (
    <Card>
      <ProgressIndicator />
      <InterviewHeader />
      <div
        ref={listRef}
        style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "16px" }}
      >
        <List
          dataSource={questionsAndAnswers}
          renderItem={(item, index) => (
            <div key={index}>
              <ChatMessage message={item.question} isAI={true} />
              {item.answer && (
                <ChatMessage message={item.answer} isAI={false} />
              )}
            </div>
          )}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "80%" }}>
          <ChatInput onSubmit={handleAnswerSubmit} disabled={isChatDisabled} />
          <InterviewControls
            key={currentQuestionIndex}
            disabled={isChatDisabled}
            onTimeout={() => handleAnswerSubmit("I ran out of time.")}
          />
        </div>
      </div>
    </Card>
  );
};

export default InterviewChat;
