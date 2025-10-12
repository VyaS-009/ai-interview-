"use client";

import { Steps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const InterviewStepper = () => {
  const { currentQuestionIndex } = useSelector((state: RootState) => state.interview);
  const totalQuestions = 6;

  const items = Array.from({ length: totalQuestions }, (_, i) => ({
    key: i,
    title: `Q${i + 1}`,
  }));

  return (
    <div className="px-6 py-4 bg-white/30 backdrop-blur-sm rounded-t-3xl border-b border-white/50">
      <Steps
        current={currentQuestionIndex}
        items={items}
        labelPlacement="vertical"
        size="small"
        className="interview-stepper"
      />
    </div>
  );
};

export default InterviewStepper;