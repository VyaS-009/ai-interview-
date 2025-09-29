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
    <AntdHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Title level={3} style={{ color: "#fff", margin: 0 }}>
        {process.env.NEXT_PUBLIC_APP_NAME}
      </Title>
      <div>
        {showStartOver && (
          <Button
            danger
            onClick={handleStartOver}
            style={{ marginRight: "8px" }}
          >
            Start Over
          </Button>
        )}
        <Button
          type={currentTab === "interviewee" ? "primary" : "default"}
          onClick={() => handleTabChange("interviewee")}
          style={{ marginRight: "8px" }}
        >
          Interview
        </Button>
        <Button
          type={currentTab === "interviewer" ? "primary" : "default"}
          onClick={() => handleTabChange("interviewer")}
        >
          Dashboard
        </Button>
      </div>
    </AntdHeader>
  );
};

export default Header;
