// src/app/dashboard/[interviewId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Card,  Tag, List, Typography, Spin, Alert, Button } from "antd";
import { useGetInterviewHistoryQuery } from "@/lib/api/interviewApi";
// import { Card, Progress, Tag, List, Typography, Spin, Alert, Button } from "antd";
import ReactMarkdown from "react-markdown";
import {
  LightBulbIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const { Title, Paragraph, Text } = Typography;

const InterviewReportPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interviewId as string;

  // Use the generated hook to get the query result
  const { data: candidates, isLoading } = useGetInterviewHistoryQuery();

  // Find the specific candidate from the fetched list
  const candidate = candidates?.find(c => c.id === interviewId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" tip="Loading interview report..." />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Alert
          message="Interview Not Found"
          description="The requested interview report could not be found. It may have been deleted or the link is incorrect."
          type="error"
          showIcon
          action={
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          }
        />
      </div>
    );
  }

  const { finalResult, chatHistory, jobRole, completedAt } = candidate;

  if (!finalResult) {
    return <div>Report data is incomplete for this interview.</div>;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
            <Button
                type="text"
                icon={<ArrowLeftIcon className="w-5 h-5" />}
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 font-semibold hover:!bg-gray-100"
            >
                Back to Dashboard
            </Button>
        </div>

        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-2xl shadow-purple-500/10 p-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Title level={2} className="!text-gray-800 !mb-2 flex items-center gap-3"><BriefcaseIcon className="w-8 h-8 text-violet-600"/>{jobRole || "General Interview"}</Title>
                    <div className="flex items-center gap-2 text-gray-500">
                        <CalendarDaysIcon className="w-5 h-5"/>
                        <span>Completed on {new Date(completedAt!).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl">
                    <SparklesIcon className="w-8 h-8 text-violet-600" />
                    <div className="text-left">
                        <p className="text-sm text-gray-600 font-medium">Overall Score</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        {finalResult.finalScore || "N/A"}/100
                        </p>
                    </div>
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
                {chatHistory.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="prose prose-sm max-w-none text-lg font-semibold text-gray-900">
                          <ReactMarkdown>{item.q}</ReactMarkdown>
                        </div>
                        <div className="bg-gray-50/80 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-600 mb-1">Your Answer:</p>
                          <p className="text-gray-800 leading-relaxed">
                            {item.a || "No answer provided"}
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
                <Card  className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={4} className="flex items-center gap-2 !text-green-700"><HandThumbUpIcon className="w-6 h-6" />Strong Areas</Title>
                  <div className="flex flex-wrap gap-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    {finalResult.strongAreas.map((area, i) => <Tag key={i} color="success" className="text-sm p-1">{area}</Tag>)}
                  </div>
                </Card>
                <Card bordered={false} className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={4} className="flex items-center gap-2 !text-red-700"><HandThumbDownIcon className="w-6 h-6" />Weak Areas</Title>
                  <div className="flex flex-wrap gap-2">
                    {finalResult.weakAreas.map((area, i) => <Tag key={i} color="error" className="text-sm p-1">{area}</Tag>)}
                  </div>
                </Card>
                <Card bordered={false} className="!bg-white/30 !backdrop-blur-sm">
                  <Title level={3} className="flex items-center gap-2 !text-blue-700"><LightBulbIcon className="w-6 h-6" />Actionable Feedback</Title>
                  <List itemLayout="vertical" dataSource={finalResult.areasForImprovement} renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta title={<Text strong className="!text-lg">{item.area}</Text>} description={<Paragraph className="!text-gray-700">{item.suggestion}</Paragraph>} />
                        <Text strong>Recommended Resources:</Text>
                        <ul className="list-disc list-inside mt-2">
                          {item.resources.map((res, i) => (<li key={i}><a href={res.url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-800 font-medium">{res.title}</a></li>))}
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

export default InterviewReportPage;