"use client";

import { Typography, Spin } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

const { Title } = Typography;

const InterviewHeader: React.FC = () => {
  const { questionsAndAnswers, currentQuestionIndex } = useSelector(
    (state: RootState) => state.interview
  );

  const currentQuestion = questionsAndAnswers[currentQuestionIndex];

  // The main loading spinner is in InterviewChat.tsx. This is a fallback.
  if (!currentQuestion) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "36px",
        }}
      >
        <Spin /> <span style={{ marginLeft: 8 }}>Loading question...</span>
      </div>
    );
  }

  return (
    <Title level={4}>
      Question {currentQuestionIndex + 1} ({currentQuestion.difficulty})
    </Title>
  );
};

export default InterviewHeader;
