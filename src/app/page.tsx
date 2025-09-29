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

export default function Home() {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.ui.currentTab);
  const interviewStatus = useSelector(
    (state: RootState) => state.interview.interviewStatus
  );

  const handleTabChange = (key: string) => {
    dispatch(setCurrentTab(key as "interviewee" | "interviewer"));
  };

  const tabItems = [
    {
      key: "interviewee",
      label: "Interview",
      children: (
        <>
          {interviewStatus === "not-started" && <ResumeUpload />}
          {interviewStatus === "collecting-info" && <InfoCollection />}
          {interviewStatus === "in-progress" && <InterviewChat />}
          {interviewStatus === "completed" && <CompletionScreen />}
        </>
      ),
    },
    {
      key: "interviewer",
      label: "Dashboard",
      children: <CandidateTable />,
    },
  ];

  return (
    <Tabs
      activeKey={currentTab}
      onChange={handleTabChange}
      centered
      items={tabItems}
    />
  );
}
