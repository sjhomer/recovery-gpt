import React from "react"

interface SidebarContainerProps {
  isSidebarOpen: boolean;
  children: React.ReactNode;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({isSidebarOpen, children}) => (
  <div
    className={`flex-shrink-0 overflow-x-hidden bg-gray-900 h-full border-r-2 border-r-gray-500 ${isSidebarOpen ? "w-[260px] z-50" : "w-60"}`}
  >
    <div className="h-full">
      <div className="flex h-full min-h-0 flex-col">
        <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
          <h2 className="sr-only">Chat history</h2>
          <nav
            className="flex h-full w-full flex-col pt-2 px-2 pb-0"
            aria-label="Chat history"
          >
            {children}
          </nav>
        </div>
      </div>
    </div>
  </div>
)

export default SidebarContainer
