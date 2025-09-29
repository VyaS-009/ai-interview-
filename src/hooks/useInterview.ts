import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

export const useInterview = () => {
  const interviewState = useSelector((state: RootState) => state.interview);
  return {
    status: interviewState.interviewStatus,
    candidateInfo: interviewState.candidateInfo,
    questionsAndAnswers: interviewState.questionsAndAnswers,
    currentQuestionIndex: interviewState.currentQuestionIndex,
    finalScore: interviewState.finalScore,
    finalSummary: interviewState.finalSummary,
  };
};
