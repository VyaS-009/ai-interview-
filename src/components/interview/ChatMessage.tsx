import { Card, Space, Avatar } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";

interface ChatMessageProps {
  message: string;
  isAI: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAI }) => {
  return (
    <Space
      direction="horizontal"
      style={{
        justifyContent: isAI ? "flex-start" : "flex-end",
        width: "100%",
        marginBottom: "8px",
      }}
    >
      {isAI && <Avatar icon={<RobotOutlined />} />}
      <Card
        size="small"
        style={{
          maxWidth: "70%",
          background: isAI ? "#f0f0f0" : "#1890ff",
          color: isAI ? "#000" : "#fff",
        }}
      >
        {message}
      </Card>
      {!isAI && <Avatar icon={<UserOutlined />} />}
    </Space>
  );
};

export default ChatMessage;
