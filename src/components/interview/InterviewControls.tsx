// src/components/interview/InterviewControls.tsx
"use client";

import { useTimer } from "react-timer-hook";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect, useRef } from "react";

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

  // Use a ref to ensure onExpire always has the latest onTimeout function
  const onTimeoutRef = useRef(onTimeout);
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const { restart, pause } = useTimer({
    // The expiryTimestamp will be set dynamically by the effect below
    expiryTimestamp: new Date(),
    onExpire: () => {
      // The ref ensures we always call the latest function from props
      onTimeoutRef.current("I ran out of time.");
    },
    autoStart: false,
  });

  // This effect is now the single source of truth for controlling the timer
  useEffect(() => {
    const shouldTimerRun =
      currentQuestion &&
      !currentQuestion.answer &&
      !disabled &&
      interviewStatus === "in-progress";

    if (shouldTimerRun) {
      // Set the correct expiry time and start the timer
      restart(new Date(Date.now() + (currentQuestion.time || 30) * 1000));
    } else {
      // If conditions are not met, ensure the timer is paused
      pause();
    }
    // restart and pause are stable and don't need to be in the dependency array
    // according to react-timer-hook documentation.
  }, [currentQuestion, disabled, interviewStatus, restart, pause]);

  return null;
};

export default InterviewControls;
