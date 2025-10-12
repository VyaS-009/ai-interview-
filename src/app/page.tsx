// src/app/page.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useRouter, redirect } from "next/navigation";
// import ResumeUpload from "@/components/interview/ResumeUpload";
import ProfileForm from "@/components/interview/ProfileForm";
import InterviewChat from "@/components/interview/InterviewChat";
import CompletionScreen from "@/components/interview/CompletionScreen";
import { startNewInterview, setInterviewStatus } from "@/lib/redux/slices/interviewSlice";
import { useStartSessionMutation } from "@/lib/api/interviewApi";
import { SparklesIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const resumeUploadRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [startSession] = useStartSessionMutation();
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isStarting, setIsStarting] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const interviewStatus = useSelector(
    (state: RootState) => state.interview.interviewStatus
  );

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      // This will open the login/register modal
      dispatch(setInterviewStatus({ status: 'not-started' }));
    }
  };
  
  const handleGetStartedClick = async () => {
    if (isAuthenticated) {
      setIsStarting(true);
      try {
        const { sessionId } = await startSession().unwrap();
        dispatch(startNewInterview({ sessionId }));
      } catch (error) {
        console.error("Failed to start a new session:", error);
      } finally {
        setIsStarting(false);
      }
    } else {
      // This will open the login/register modal
      dispatch(setInterviewStatus({ status: 'not-started' }));
    }
  };

  const handleLearnMoreClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative">
      {interviewStatus === "not-started" && (
        <div className="relative overflow-hidden pt-6"> <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
            {/* Hero Section */} <div className="text-center mb-16 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg mb-6">
                <SparklesIcon className="w-5 h-5 text-violet-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered Interview Platform
                </span>
              </div>
              
              <h1 className="text-6xl font-bold mb-6">
                {isAuthenticated ? (
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Welcome Back!
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Practice, Perfect, Perform
                  </span>
                )}
              </h1>
              
              <p className="text-2xl text-gray-600 mb-4">
                {isAuthenticated ? (
                  "You are logged in. Let's get started."
                ) : (
                  <>Ace Your Next <span className="font-semibold text-violet-600">Technical Interview</span></>
                )}
              </p>
              
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
                Start your AI-powered interview journey. Upload your resume and let our intelligent system assess your skills through personalized questions.
              </p>

              <div className="flex items-center justify-center gap-4">
                {isAuthenticated ? (
                  <>
                    <button onClick={handleDashboardClick} className="group px-8 py-4 backdrop-blur-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5" />
                        Go to Dashboard
                      </span>
                    </button>
                    <button 
                      onClick={handleGetStartedClick} 
                      className="px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isStarting}
                    >
                      {isStarting ? "Starting..." : "Start New Interview"}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={handleGetStartedClick} className="group px-8 py-4 backdrop-blur-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5" />
                        Get Started
                      </span>
                    </button>
                    <button onClick={handleLearnMoreClick} className="px-8 py-4 bg-white/20 backdrop-blur-xl border-2 border-white/50 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                      Learn More
                    </button>
                  </>
                )}
              </div>
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
        <div className="w-full">
          {interviewStatus === "collecting-info" && <ProfileForm />}
          {interviewStatus === "in-progress" && <InterviewChat />}
          {interviewStatus === "completed" && <CompletionScreen />}
        </div>
      )}
    </div>
  );
}