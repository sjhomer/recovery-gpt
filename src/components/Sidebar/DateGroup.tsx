import React from 'react';
import {SidebarLink, SidebarLinks} from "./SidebarLinks" // Assuming SidebarLink is a type
import { ChevronDown, ChevronUp } from "lucide-react";

interface DateGroupProps {
  monthYear: string;
  week: string;
  links: SidebarLink[];
  isExpanded: boolean;
  toggleDate: (date: string) => void;
  onLinkClick: (id: string) => void;
  toggleSidebar: () => void;
  activeLink: string;
  setActiveLink: (link: string) => void;
}

const DateGroup: React.FC<DateGroupProps> = ({
  monthYear,
  week,
  links,
  isExpanded,
  toggleDate,
  onLinkClick,
  toggleSidebar,
  activeLink,
  setActiveLink
}) => {
  const date = `${monthYear}-${week}`;

  return (
    <div className={`${isExpanded ? "bg-gray-800" : ""} hover:bg-gray-800`}>
      <div id={`date-${date}`} className="z-[16] overflow-hidden">
        <button
          className={` ${isExpanded ? "text-white font-bold" : "text-gray-500 font-normal"}} h-9 p-3 text-base font-medium text-ellipsis overflow-hidden break-all uppercase w-full flex items-center justify-between  hover:text-white `}
          onClick={() => toggleDate(date)}
        >
          {monthYear} &ndash; W{week} ({links.length})
          {isExpanded ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-gray-600" />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="duration-500 transition-all">
          {/* Assuming SidebarLinks component exists and correctly handles the props */}
          <SidebarLinks
            className={`${
              !isExpanded ? "-translate-x-full h-0 duration-0 overflow-hidden" : "duration-500"
            } transition-all `}
            links={links}
            onLinkClick={onLinkClick}
            toggleSidebar={toggleSidebar}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      )}
    </div>
  );
};

export default DateGroup;
