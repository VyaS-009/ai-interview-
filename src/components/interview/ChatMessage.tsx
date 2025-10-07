// import { Avatar } from "antd";
import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

interface ChatMessageProps {
  message: React.ReactNode;
  isAI: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isAI }) => {
  return (
    <div
      className={`flex items-start gap-3 w-full animate-fadeIn ${
        isAI ? "justify-start" : "justify-end"
      }`}
    >
      {isAI && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <RobotOutlined className="text-white text-lg" />
          </div>
        </div>
      )}
      
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
          isAI
            ? "bg-white/30 backdrop-blur-sm border border-gray-200/50 text-gray-800"
            : "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-purple-500/30"
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap m-0">
          {message}
        </p>
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UserOutlined className="text-white text-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;