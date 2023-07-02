import React from "react";

interface AvatarProps {
  name: string;
}

const OpenAiAvatar: React.FC<AvatarProps> = ({ name }) => {
  const initials = name.charAt(0).toUpperCase();

  // Determine the background color based on the initial
  const bgColor = initials === "U" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className={`rounded-full w-12 h-12 flex items-center justify-center ${bgColor}`}>
      <span className="text-white text-2xl font-bold">{initials}</span>
    </div>
  );
};

export default OpenAiAvatar;
