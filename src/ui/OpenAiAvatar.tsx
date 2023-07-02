import React from "react";
import {OpenAiChatImage} from "@/ui/OpenAiChatImage"

interface AvatarProps {
  name: string;
}

const OpenAiAvatar: React.FC<AvatarProps> = ({ name }) => {
  const isUser = /user/i.test(name) ? "U" : null

  // Determine the background color based on the initial
  const bgColor = isUser ? "bg-blue-500" : "bg-green-500";

  return (
    <div className={`rounded-full w-12 h-12 flex items-center justify-center ${bgColor} mt-4`}>
      <span className="text-white text-2xl font-bold">{isUser? 'U': <OpenAiChatImage/>}</span>
    </div>
  );
};

export default OpenAiAvatar;
