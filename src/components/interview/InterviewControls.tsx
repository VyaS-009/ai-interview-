// src/components/interview/InterviewControls.tsx
"use client";

import { Statistic } from "antd";
import { useTimer } from "react-timer-hook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";

interface InterviewControlsProps {
  onTimeout: (answer: string) => void;
  disabled: boolean;
}

const InterviewControls: React.FC<InterviewControlsProps> = ({
  onTimeout,
  disabled,
}) => {
  const { questionsAndAnswers, currentQuestionIndex, interviewStatus } =
    useSelector((state: RootState) => state.interview);
  const currentQuestion = questionsAndAnswers[currentQuestionIndex];

  const expiryTimestamp =
    currentQuestion && !disabled && !currentQuestion.answer
      ? new Date(Date.now() + (currentQuestion.time || 30) * 1000) // Default to 30s if time is invalid
      : new Date();

  const { seconds, minutes, restart, pause } = useTimer({
    expiryTimestamp,
    onExpire: () => !disabled && !currentQuestion?.answer && onTimeout(""),
    autoStart: false, // Controlled manually
  });

  // Restart timer when question changes
  useEffect(() => {
    if (currentQuestion && !disabled && interviewStatus !== "completed") {
      restart(new Date(Date.now() + (currentQuestion.time || 30) * 1000));
    }

    if (disabled || currentQuestion?.answer) {
      pause();
    }
  }, [
    currentQuestionIndex,
    currentQuestion,
    disabled,
    interviewStatus,
    restart,
    pause,
  ]);

  if (
    disabled ||
    interviewStatus === "completed" ||
    !currentQuestion ||
    currentQuestion.answer
  ) {
    return null;
  }

  return (
    <div style={{ marginTop: "16px" }}>
      <Statistic.Timer
        type="countdown"
        title="Time Remaining"
        value={Date.now() + (minutes * 60 + seconds) * 1000}
        format="mm:ss"
      />
    </div>
  );
};

export default InterviewControls;
