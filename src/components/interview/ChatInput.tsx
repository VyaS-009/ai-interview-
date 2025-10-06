"use client";
import { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, disabled }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim() && !disabled) {
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
    <div className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here..."
          disabled={disabled}
          rows={3}
          className={`w-full px-5 py-4 bg-white/20 backdrop-blur-sm border-2 rounded-2xl resize-none text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
            disabled
              ? "border-gray-200 cursor-not-allowed opacity-50"
              : "border-gray-200/50 hover:border-violet-300/50 focus:border-violet-400 focus:ring-violet-400/20"
          }`}
          style={{ fontSize: "15px", lineHeight: "1.6" }}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {answer.length > 0 && `${answer.length} characters`}
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={disabled || !answer.trim()}
        className={`group relative px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 overflow-hidden ${
          disabled || !answer.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span>Send</span>
          <PaperAirplaneIcon className="w-5 h-5" />
        </span>
        {!disabled && answer.trim() && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>
    </div>
  );
};

export default ChatInput;