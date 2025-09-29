import { Progress } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

const ProgressIndicator: React.FC = () => {
  const currentQuestionIndex = useSelector(
    (state: RootState) => state.interview.currentQuestionIndex
  );

  return (
    <Progress
      percent={(currentQuestionIndex / 6) * 100}
      steps={6}
      size="small"
      strokeColor="#1890ff"
      style={{ marginBottom: "16px" }}
    />
  );
};

export default ProgressIndicator;
