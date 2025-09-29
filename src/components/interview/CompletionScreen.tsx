import { Result, Button, Descriptions, Card, List, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { resetInterview } from "@/lib/redux/slices/interviewSlice";

const CompletionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { candidateInfo, finalScore, finalSummary, questionsAndAnswers } =
    useSelector((state: RootState) => state.interview);

  const handleRestart = () => {
    dispatch(resetInterview());
  };

  if (!candidateInfo) {
    return null; // Don't render if there's no candidate info
  }

  return (
    <Card>
      <Result
        status="success"
        title="Interview Completed!"
        subTitle={`Your final score: ${finalScore || "N/A"}`}
        extra={[
          <Button type="primary" key="restart" onClick={handleRestart}>
            Start New Interview
          </Button>,
        ]}
      />
      <Descriptions title="Summary" bordered>
        <Descriptions.Item label="Name" span={1}>
          {candidateInfo?.name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {candidateInfo?.email || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Phone" span={1}>
          {candidateInfo?.phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Final Score">
          {finalScore || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="AI Summary" span={3}>
          {finalSummary || "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <Typography.Title level={4} style={{ marginTop: 24 }}>
        Question Breakdown
      </Typography.Title>
      <List
        itemLayout="vertical"
        dataSource={questionsAndAnswers}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={`Question ${index + 1}: ${item.question}`}
              description={`Your Answer: ${
                item.answer || "No answer provided"
              }`}
            />
            <div>
              <strong>Score:</strong> {item.score ?? "N/A"} -{" "}
              <em>{item.justification ?? "No justification."}</em>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CompletionScreen;
