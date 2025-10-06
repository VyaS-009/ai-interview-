// src/app/page.tsx
"use client";

import { Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setCurrentTab } from "@/lib/redux/slices/uiSlice";
import ResumeUpload from "@/components/interview/ResumeUpload";
import InfoCollection from "@/components/interview/InfoCollection";
import InterviewChat from "@/components/interview/InterviewChat";
import CompletionScreen from "@/components/interview/CompletionScreen";
import CandidateTable from "@/components/dashboard/CandidateTable";
import { SparklesIcon, DocumentTextIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.ui.currentTab);
  const resumeUploadRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const interviewStatus = useSelector(
    (state: RootState) => state.interview.interviewStatus
  );

  const handleTabChange = (key: string) => {
    dispatch(setCurrentTab(key as "interviewee" | "interviewer"));
  };

  const handleGetStartedClick = () => {
    resumeUploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMoreClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabItems = [
    {
      key: "interviewee",
      label: (
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          <span>Interview</span>
        </div>
      ),
      children: (
        <>
          {interviewStatus === "not-started" && (
            <div className="min-h-screen relative overflow-hidden pt-6">
              {/* Animated gradient background */}
              <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
              <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
              
              {/* Floating gradient orbs */}
              <div className="fixed top-20 left-10 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
              <div className="fixed bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float-delayed" />

              <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg mb-6">
                    <SparklesIcon className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      AI-Powered Interview Platform
                    </span>
                  </div>
                  
                  <h1 className="text-6xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                      Welcome, User
                    </span>
                  </h1>
                  
                  <p className="text-2xl text-gray-600 mb-4">
                    How Can I <span className="font-semibold text-violet-600">Assist You Today?</span>
                  </p>
                  
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                    Start your AI-powered interview journey. Upload your resume and let our intelligent system assess your skills through personalized questions.
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <button onClick={handleGetStartedClick} className="group px-8 py-4 backdrop-blur-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5" />
                        Get Started
                      </span>
                    </button>
                    <button onClick={handleLearnMoreClick} className="px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Resume Upload Card */}
                <div className="animate-fadeIn animation-delay-200">
                  <div ref={resumeUploadRef}><ResumeUpload /></div>
                </div>

                {/* Features Grid */}
                <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 mt-16 animate-fadeIn animation-delay-400">
                  {[
                    {
                      icon: "🤖",
                      title: "AI-Powered",
                      description: "Smart questions tailored to your experience"
                    },
                    {
                      icon: "⚡",
                      title: "Real-time Evaluation",
                      description: "Instant feedback on your responses"
                    },
                    {
                      icon: "📊",
                      title: "Detailed Analytics",
                      description: "Comprehensive performance insights"
                    }
                  ].map((feature, idx) => (
                    <div key={idx} className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/50 shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {(interviewStatus === "collecting-info" ||
            interviewStatus === "in-progress" ||
            interviewStatus === "completed") && (
            <div className="max-w-5xl mx-auto px-4 py-8 pt-0">
              {interviewStatus === "collecting-info" && <InfoCollection />}
              {interviewStatus === "in-progress" && <InterviewChat />}
              {interviewStatus === "completed" && <CompletionScreen />}
            </div>
          )}
        </>
      ),
    },
    {
      key: "interviewer",
      label: (
        <div className="flex items-center gap-2 ">
          <ChartBarIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </div>
      ),
      children: (
        <div className="min-h-screen relative pt-16">
          <div className="fixed inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 animate-gradient" />
          <div className="fixed inset-0 bg-gradient-to-tl from-blue-50/50 via-transparent to-pink-50/50 animate-gradient-slow" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-0 ">
            <CandidateTable />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen relative">
      <Tabs
        activeKey={currentTab}
        onChange={handleTabChange}
        items={tabItems}
        className="modern-tabs"
        tabBarStyle={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          width: "100%",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          margin: 0,
        }}
      />
    </div>
  );
}