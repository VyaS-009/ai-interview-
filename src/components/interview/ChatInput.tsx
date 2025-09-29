"use client";
import { Input, Button, Space } from "antd";
import { useState } from "react";

interface ChatInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, disabled }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Input.TextArea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your answer..."
        disabled={disabled}
        rows={4}
        style={{ flex: 1 }}
      />
      <Button type="primary" onClick={handleSubmit} disabled={disabled}>
        Submit
      </Button>
    </div>
  );
};

export default ChatInput;
