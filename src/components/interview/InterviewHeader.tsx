"use client";

import { Typography, Spin, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
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

  useEffect(() => {
    if (
      currentQuestionIndex < QUESTION_SEQUENCE.length &&
      !questionsAndAnswers[currentQuestionIndex] &&
      !isQuestionLoading
    ) {
      generateQuestion({ difficulty: QUESTION_SEQUENCE[currentQuestionIndex] })
        .unwrap()
        .then((response) => {
          dispatch(
            addQuestion({
              question: response.question,
              difficulty: QUESTION_SEQUENCE[currentQuestionIndex],
              time: TIMER_SEQUENCE[currentQuestionIndex],
            })
          );
        })
        .catch(() => message.error("Failed to fetch question."));
    }
  }, [
    currentQuestionIndex,
    questionsAndAnswers,
    generateQuestion,
    dispatch,
    isQuestionLoading,
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
