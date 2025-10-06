"use client";
import { App, Layout, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setCurrentTab } from "@/lib/redux/slices/uiSlice";
import Button from "@/components/common/Button";
import { resetInterview } from "@/lib/redux/slices/interviewSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Header: AntdHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: RootState) => state.ui.currentTab);
  const interviewStatus = useSelector(
    (state: RootState) => state.interview.interviewStatus
  );
  const { modal } = App.useApp();

  const handleTabChange = (tab: "interviewee" | "interviewer") => {
    dispatch(setCurrentTab(tab));
  };

  const handleStartOver = () => {
    modal.confirm({
      title: "Are you sure you want to start over?",
      icon: <ExclamationCircleOutlined />,
      content: "All your current interview progress will be lost.",
      okText: "Yes, Start Over",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk() {
        dispatch(resetInterview());
      },
    });
  };

  const showStartOver =
    currentTab === "interviewee" &&
    (interviewStatus === "collecting-info" ||
      interviewStatus === "in-progress");

  return (
    <AntdHeader className="bg-white border-b border-gray-200 px-6 py-0 h-16 flex items-center justify-between shadow-sm">
      <Title level={3} className="text-gray-900 font-bold m-0 text-xl">
        {process.env.NEXT_PUBLIC_APP_NAME}
      </Title>
      <div className="flex items-center gap-3">
        {showStartOver && (
          <button
            onClick={handleStartOver}
            className="px-5 py-2 bg-red-50 text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
          >
            Start Over
          </button>
        )}
        <button
          onClick={() => handleTabChange("interviewee")}
          className={`px-5 py-2 font-medium rounded-lg transition-all duration-200 ${
            currentTab === "interviewee"
              ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          Interview
        </button>
        <button
          onClick={() => handleTabChange("interviewer")}
          className={`px-5 py-2 font-medium rounded-lg transition-all duration-200 ${
            currentTab === "interviewer"
              ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          Dashboard
        </button>
      </div>
    </AntdHeader>
  );
};

export default Header;