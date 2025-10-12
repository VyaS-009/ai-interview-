"use client";

// import { Steps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import ReactMarkdown from 'react-markdown';

// const getStatus = (index: number, currentIndex: number) => {
//   if (index < currentIndex) return 'finish';
//   if (index === currentIndex) return 'process';
//   return 'wait';
// };

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'text-emerald-500';
    case 'medium':
      return 'text-yellow-500';
    case 'hard':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};

const QuestionPanel = () => {
  const { questionsAndAnswers, currentQuestionIndex } = useSelector((state: RootState) => state.interview);

  const getStepStatus = (index: number) => {
    if (index < currentQuestionIndex) return 'finish';
    if (index === currentQuestionIndex) return 'process';
    return 'wait';
  };

  return (
    <div className="h-full bg-white/10 backdrop-blur-sm rounded-2xl border border-white/50 p-6 overflow-y-auto scrollbar-custom">
      {questionsAndAnswers.map((qa, index) => {
        const status = getStepStatus(index);
        const isBlurred = index > currentQuestionIndex;

        return (
          <div key={index} className="relative flex items-start gap-6 not-last:pb-8">
            {/* Number Chain Stepper */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  status === 'process' ? 'bg-violet-500 border-violet-600 text-white' :
                  status === 'finish' ? 'bg-emerald-500 border-emerald-600 text-white' :
                  'bg-white/30 border-gray-400/50 text-gray-500'
                }`}
              >
                <span className="font-bold">{index + 1}</span>
              </div>
            </div>

            {/* Question Content */}
            <div className={`flex-1 prose prose-sm max-w-none p-4 rounded-lg transition-all duration-300 ${isBlurred ? 'blur-sm opacity-40' : 'bg-white/20'}`}>
              <h3 className={`!mt-0 !mb-2 ${getDifficultyColor(qa.difficulty)}`}>Question {index + 1}: {qa.difficulty}</h3>
              <ReactMarkdown>{qa.question}</ReactMarkdown>
            </div>

            {/* Connector Line (absolutely positioned) */}
            {index < questionsAndAnswers.length - 1 && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-400/30" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionPanel;