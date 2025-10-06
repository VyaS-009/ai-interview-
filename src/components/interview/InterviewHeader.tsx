"use client";

import { Typography, Spin, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { useEffect, useRef } from "react";
import { useGenerateQuestionMutation } from "@/lib/api/interviewApi";
import { addQuestion } from "@/lib/redux/slices/interviewSlice";
import { QUESTION_SEQUENCE, TIMER_SEQUENCE } from "@/utils/constants";

const { Title } = Typography;

const InterviewHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { questionsAndAnswers, currentQuestionIndex } = useSelector(
    (state: RootState) => state.interview
  );
  const [generateQuestion, { isLoading: isQuestionLoading }] =
    useGenerateQuestionMutation();

  const currentQuestion = questionsAndAnswers[currentQuestionIndex];
  const fetchingRef = useRef<number | null>(null);

  useEffect(() => {
    // A more robust check to prevent re-fetching if a question already exists at the target index.
    const questionExists = !!questionsAndAnswers[currentQuestionIndex];

    // Use a ref to ensure we only fetch once per question index.
    // This is immune to rapid re-renders causing race conditions.
    if (
      currentQuestionIndex < QUESTION_SEQUENCE.length &&
      !questionExists &&
      !isQuestionLoading &&
      fetchingRef.current !== currentQuestionIndex
    ) {
      // Set the lock
      fetchingRef.current = currentQuestionIndex;

      const fetchQuestion = async () => {
        try {
          const response = await generateQuestion({
            difficulty: QUESTION_SEQUENCE[currentQuestionIndex],
          }).unwrap();
          dispatch(
            addQuestion({
              question: response.question,
              difficulty: QUESTION_SEQUENCE[currentQuestionIndex],
              time: TIMER_SEQUENCE[currentQuestionIndex],
            })
          );
        } catch {
          message.error("Failed to fetch question.");
        }
      };
      fetchQuestion();
    }
  }, [
    currentQuestionIndex,
    questionsAndAnswers,
    isQuestionLoading,
    generateQuestion,
    dispatch,
  ]);

  if (isQuestionLoading && !currentQuestion) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "36px",
        }}
      >
        <Spin /> <span style={{ marginLeft: 8 }}>Generating question...</span>
      </div>
    );
  }

  return (
    <Title level={4}>
      Question {currentQuestionIndex + 1} ({currentQuestion?.difficulty || ""})
      {isQuestionLoading && <Spin size="small" style={{ marginLeft: 8 }} />}
    </Title>
  );
};

export default InterviewHeader;
