import React, {useEffect, useMemo, useState} from "react"
import {SidebarToggle} from "@/ui/OpenAiSidebar/SidebarToggle"
import {SidebarLinks} from "@/ui/OpenAiSidebar/SidebarLinks"

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

export const OpenAiSidebar = ({
  selection,
  links,
  onLinkClick
}: OpenAiSidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeLink, setActiveLink] = useState("")

  const groupedLinks = useMemo(() => links.reduce(
    (groups: { [date: string]: OpenAiSidebarLink[] }, link) => {
      const date = new Date(link.date * 1000).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(link)
      return groups
    },
    {}
  ), [links])

  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const toggleDate = (date: string) => {
    setExpandedDates(prevDates => {
      if (prevDates.includes(date)) {
        return prevDates.filter(prevDate => prevDate !== date);
      } else {
        return [...prevDates, date];
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    // Set the first link as active when the list loads
    if (links.length > 0) {
      setActiveLink(links[0].url)
    }
  }, [links])

  return !isSidebarOpen ? (
    SidebarToggle({isSidebarOpen, toggleSidebar})
  ) : (
    <div
      className={`dark flex-shrink-0 overflow-x-hidden bg-gray-900 h-full border-r-2 border-r-white ${
        isSidebarOpen ? "w-[260px]" : "w-60"
      }`}
    >
      <div className="h-full">
        <div className="flex h-full min-h-0 flex-col">
          <div className="scrollbar-trigger relative h-full w-full flex-1 items-start border-white/20">
            <h2 className="sr-only">Chat history</h2>
            <nav className="flex h-full w-full flex-col p-2" aria-label="Chat history">
              <div className="mb-1 flex flex-row gap-2 text-white">
                {selection}
                <span className="" data-state="closed">
                  <SidebarToggle isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                </span>
              </div>
              <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                <div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
                  {Object.entries(groupedLinks).map(([date, links], index) => (
                    <div key={index}>
                      <div
                        className="sticky top-0 z-[16]"
                        data-projection-id="2"
                        style={{opacity: 1}}
                      >
                        <h3
                          className="h-9 pb-4 pt-3 px-3 text-base text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-gray-900 uppercase">
                          {date}
                        </h3>
                      </div>
                      <SidebarLinks
                        links={links}
                        onLinkClick={onLinkClick}
                        toggleSidebar={toggleSidebar}
                        activeLink={activeLink}
                        setActiveLink={setActiveLink}/>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
