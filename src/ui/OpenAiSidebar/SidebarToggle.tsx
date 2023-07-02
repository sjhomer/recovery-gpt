import React from "react"

export const SidebarToggle: React.FC<{isSidebarOpen:boolean, toggleSidebar: ()=>void}> = ({isSidebarOpen,toggleSidebar}) => {
  return <a
    className={isSidebarOpen ? "bg-gray-900 flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-11 flex-shrink-0 items-center justify-center" : "bg-gray-900 fixed top-2 left-2 flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-900/90 h-11 w-11 flex-shrink-0 items-center justify-center z-[999]"}
    onClick={toggleSidebar}>
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
    </svg>
    <span className="sr-only">Hide sidebar</span>
  </a>
}
