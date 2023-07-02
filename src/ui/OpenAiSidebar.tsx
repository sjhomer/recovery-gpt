import React, {useState} from "react"

export interface OpenAiSidebarLink {
  label: string;
  url: string;
  date: number;
}

interface OpenAiSidebarProps {
  selection: JSX.Element;
  links: OpenAiSidebarLink[];
  onLinkClick: (id: string) => void; // <-- New prop
}

export const OpenAiSidebar = ({selection, links, onLinkClick}: OpenAiSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const groupedLinks = links.reduce((groups: {[date:string]:OpenAiSidebarLink[]}, link) => {
    const date = new Date(link.date * 1000).toDateString(); // Convert timestamp to milliseconds and get the date string
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(link);
    return groups;
  }, {});

  let sidebarToggle = <a
    className={isSidebarOpen ? "bg-gray-900 flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 h-11 w-11 flex-shrink-0 items-center justify-center" : "bg-gray-900 fixed top-4 left-4 flex p-3 gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-900/90 h-11 w-11 flex-shrink-0 items-center justify-center z-[999]"}
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

  return !isSidebarOpen ? (
    sidebarToggle
  ) : (
    <div className={`dark flex-shrink-0 overflow-x-hidden bg-gray-900 h-full border-r-2 border-r-white ${isSidebarOpen ? "w-[260px]" : "w-60"}`}>
      <div className="h-full">
        <div className="flex h-full min-h-0 flex-col">
          <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
            <h2 className="sr-only">Chat history</h2>
            <nav className="flex h-full w-full flex-col p-2" aria-label="Chat history">
              <div className="mb-1 flex flex-row gap-2 text-white">
                {selection}
                <span className="" data-state="closed">
                  {sidebarToggle}
                </span>
              </div>
              <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                  {Object.entries(groupedLinks).map(([date, links], index) => (
                    <div key={index}>
                      <div className="sticky top-0 z-[16]" data-projection-id="2" style={{ opacity: 1 }}>
                        <h3 className="h-9 pb-2 pt-3 px-3 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-gray-900 uppercase">
                          {date}
                        </h3>
                      </div>
                      <ol>
                        {links.map((link, linkIndex) => (
                          <li
                            className="relative z-[15]"
                            data-projection-id="3"
                            style={{ opacity: 1, height: "auto" }}
                            key={linkIndex}
                          >
                            <a
                              className="flex py-1 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all )} )} hover:pr-4 bg-gray-900 group"
                              // @ts-ignore
                              onClick={() => onLinkClick(link.url)}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
