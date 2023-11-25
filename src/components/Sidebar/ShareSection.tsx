import {ShareButtons} from "@/components/buttons/ShareButtons"
import React from "react"

const ShareSection: React.FC = () => (
  <div className="flex flex-col gap-0 text-white items-center border-t-2 border-t-gray-700 pt-3">
    <span className="text-sm capitalize text-gray-300">Like it? Share it! 🙌🏻</span>
    <div className="sidebarShare">
      <ShareButtons as={"icon"}/>
    </div>
  </div>
);

export default ShareSection;
