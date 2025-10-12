import { Card,  Tag, List, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { resetInterview } from "@/lib/redux/slices/interviewSlice";
import {
  CheckCircleIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowPathIcon,
  LightBulbIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  AcademicCapIcon
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown"; 
import { useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

const CompletionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { candidateInfo, finalResult, questionsAndAnswers } = useSelector((state: RootState) => state.interview);

  const handleRestart = () => {
    dispatch(resetInterview());
  };

  if (!candidateInfo) {
    return null;
  }

  if (!finalResult) {
    return <div>Loading your detailed report...</div>;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated gradient background */}

      


      <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
      <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
      
      {/* Floating gradient orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-8">
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
          
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl">
              <SparklesIcon className="w-8 h-8 text-violet-600" />
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">Overall Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {finalResult.finalScore || "N/A"}/100
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Start New Interview</span>
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ChartBarIcon className="w-5 h-5" /> Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Question Breakdown (Left) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn animation-delay-400">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Breakdown</h2>
              <div className="space-y-6">
                {questionsAndAnswers.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="prose prose-sm max-w-none text-lg font-semibold text-gray-900">
                          <ReactMarkdown>{item.question}</ReactMarkdown>
                        </div>
                        <div className="bg-gray-50/80 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                          <p className="text-gray-800 leading-relaxed">
                            {item.answer || "No answer provided"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 pt-3 border-t border-gray-200/80">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-600">Score:</span>
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700">
                              {item.evaluation?.score ?? "N/A"}/100
                            </span>
                          </div>
                        </div>
                        {item.evaluation?.analysis && (
                          <div className="space-y-3 pt-3 border-t border-gray-200/80">
                            <div>
                              <h4 className="font-semibold text-green-700 flex items-center gap-2"><CheckBadgeIcon className="w-5 h-5" />What Went Well</h4>
                              <p className="text-sm text-gray-700 pl-7">{item.evaluation.analysis.positive_feedback}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-amber-700 flex items-center gap-2"><ExclamationTriangleIcon className="w-5 h-5" />Areas for Improvement</h4>
                              <p className="text-sm text-gray-700 pl-7">{item.evaluation.analysis.areas_for_improvement}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-700 flex items-center gap-2"><AcademicCapIcon className="w-5 h-5" />Suggested Approach</h4>
                              <p className="text-sm text-gray-700 pl-7">{item.evaluation.analysis.suggested_answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Section (Right) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn animation-delay-200">
              <Title level={2} className="!text-gray-800 !mb-2">Performance Analysis</Title>
              <Paragraph className="text-gray-600 mb-8">{finalResult.overallSummary}</Paragraph>
              <div className="space-y-6">
                <Card bordered={false} className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={4} className="flex items-center gap-2 !text-green-700">
                    <HandThumbUpIcon className="w-6 h-6" />
                    Strong Areas
                  </Title>
                  <div className="flex flex-wrap gap-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {finalResult.strongAreas.map((area, i) => <Tag key={i} color="success" className="text-sm p-1">{area}</Tag>)}
                  </div>
                </Card>
                <Card bordered={false} className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={4} className="flex items-center gap-2 !text-red-700">
                    <HandThumbDownIcon className="w-6 h-6" />
                     Weak Areas
                  </Title>
                  <div className="flex flex-wrap gap-2">
                    {finalResult.weakAreas.map((area, i) => <Tag key={i} color="error" className="text-sm p-1">{area}</Tag>)}
                  </div>
                </Card>
                <Card bordered={false} className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={3} className="flex items-center gap-2 !text-blue-700">
                    <LightBulbIcon className="w-6 h-6" />
                    Actionable Feedback
                  </Title>
                  <List
                    itemLayout="vertical"
                    dataSource={finalResult.areasForImprovement}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Text strong className="!text-lg">{item.area}</Text>}
                          description={<Paragraph className="!text-gray-700">{item.suggestion}</Paragraph>}
                        />
                        <Text strong>Recommended Resources:</Text>
                        <ul className="list-disc list-inside mt-2">
                          {item.resources.map((res, i) => (
                            <li key={i}>
                              <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-800 font-medium">
                                {res.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;


            