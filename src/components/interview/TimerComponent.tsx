// src/components/interview/CircularTimer.tsx
"use client";

import { useState, useEffect } from "react";

interface CircularTimerProps {
  duration: number; // Duration in seconds
  onTimeout: () => void;
  disabled?: boolean;
  size?: number;
  strokeWidth?: number;
}

const CircularTimer: React.FC<CircularTimerProps> = ({
  duration,
  onTimeout,
  disabled = false,
  size = 200,
  strokeWidth = 12,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // This effect syncs the internal state with the duration prop.
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (disabled || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onTimeout();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, disabled, onTimeout]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / duration) * circumference;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const timePercentage = (timeLeft / duration) * 100;
  const strokeColorClass =
    timePercentage > 50
      ? "text-green-500"
      : timePercentage > 20
      ? "text-yellow-500"
      : "text-red-500";
      
  const pulseClass = timePercentage <= 20 && !disabled ? "animate-pulse" : "";

  return (
    <div className="relative flex flex-col items-center justify-center gap-2">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="stroke-gray-200/50"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={`stroke-current transition-all duration-500 ${strokeColorClass}`}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${pulseClass}`}>
          <span className={`text-5xl font-bold tracking-tighter ${strokeColorClass}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-gray-500">REMAINING</span>
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;