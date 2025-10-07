"use client";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
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
    // Submit on Enter, allow new lines with Shift+Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = !disabled && answer.trim().length > 0;

  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* The main input container */}
      <div
        className={`group flex items-end w-full p-2.5 bg-slate-100 rounded-2xl border border-slate-200 transition-all duration-300 focus-within:bg-white focus-within:border-violet-400 focus-within:shadow-md focus-within:shadow-violet-500/10 ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <TextareaAutosize
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          maxRows={7}
          className="flex-1 w-full px-2 bg-transparent resize-none text-slate-800 placeholder-slate-400 focus:outline-none"
          style={{ fontSize: "16px", lineHeight: "1.5" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 ${
            canSubmit
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:scale-110 active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Optional: Character counter outside the input area */}
      <div className="text-xs text-slate-400 pr-3">
        {answer.length > 0 && `${answer.length} characters`}
      </div>
    </div>
  );
};

export default ChatInput;