import { Descriptions, List } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { resetInterview } from "@/lib/redux/slices/interviewSlice";
import { CheckCircleIcon, TrophyIcon, SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const CompletionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { candidateInfo, finalScore, finalSummary, questionsAndAnswers } =
    useSelector((state: RootState) => state.interview);

  const handleRestart = () => {
    dispatch(resetInterview());
  };

  if (!candidateInfo) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 space-y-8">
        {/* Success Card */}
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-12 text-center animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-float">
                <TrophyIcon className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Interview Completed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Congratulations on completing your AI interview
          </p>
          
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl mb-8">
            <SparklesIcon className="w-8 h-8 text-violet-600" />
            <div className="text-left">
              <p className="text-sm text-gray-600 font-medium">Your Final Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {finalScore || "N/A"}/10
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Start New Interview</span>
          </button>
        </div>

        {/* Summary Card */}
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn animation-delay-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            Interview Summary
          </h2>
          
          <Descriptions bordered column={2} className="interview-descriptions">
            <Descriptions.Item label={<span className="font-semibold text-gray-700">Name</span>}>
              <span className="text-gray-900 font-medium">{candidateInfo?.name || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span className="font-semibold text-gray-700">Email</span>}>
              <span className="text-gray-900">{candidateInfo?.email || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span className="font-semibold text-gray-700">Phone</span>}>
              <span className="text-gray-900">{candidateInfo?.phone || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label={<span className="font-semibold text-gray-700">Final Score</span>}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700">
                {finalScore || "N/A"}/10
              </span>
            </Descriptions.Item>
            <Descriptions.Item label={<span className="font-semibold text-gray-700">AI Summary</span>} span={2}>
              <p className="text-gray-700 leading-relaxed">{finalSummary || "N/A"}</p>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Question Breakdown */}
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn animation-delay-400">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Breakdown</h2>
          
          <div className="space-y-4">
            {questionsAndAnswers.map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900">{item.question}</h4>
                    
                    <div className="bg-gray-50/80 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                      <p className="text-gray-800 leading-relaxed">
                        {item.answer || "No answer provided"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">Score:</span>
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700">
                          {item.score ?? "N/A"}/10
                        </span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-600 italic flex-1">
                        {item.justification ?? "No justification."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;