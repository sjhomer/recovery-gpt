import React, {useEffect, useMemo, useState} from "react"
import {SidebarToggle} from "@/ui/OpenAiSidebar/SidebarToggle"
import {SidebarLinks} from "@/ui/OpenAiSidebar/SidebarLinks"
import {ChevronDown, ChevronUp} from "lucide-react"
import {getWeekNumber} from "@/lib"

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

  const groupedLinks = useMemo(() => {
    return links.reduce((groups: { [date: string]: { [week: string]: OpenAiSidebarLink[] } }, link) => {
      const date = new Date(link.date * 1000)
      const monthYear = `${date.toLocaleString("default", {month: "short"})} ${date.getFullYear()}`
      const week = `${getWeekNumber(date)}`

      if (!groups[monthYear]) {
        groups[monthYear] = {}
      }

      if (!groups[monthYear][week]) {
        groups[monthYear][week] = []
      }

      groups[monthYear][week].push(link)
      return groups
    }, {})
  }, [links])

  const [expandedDates, setExpandedDates] = useState<string[]>(() => {
    // Pick from th groupedLinks the first date and week, i.e. `${monthYear} ${week}`
    const firstDate = Object.keys(groupedLinks)[0]
    // Weeks happen to pool backwards, so we need to pick the last week
    const firstWeek = Object.keys(groupedLinks[firstDate]).pop()
    return [`${firstDate}-${firstWeek}`]
  })

  const toggleDate = (date: string) => {
    setExpandedDates(prevDates => {
      if (prevDates.includes(date)) {
        return prevDates.filter(prevDate => prevDate !== date)
      } else {
        return [...prevDates, date]
      }
    })

    // Scroll the sidebar to show the selected date at the top, if we're opening it, not closing
    const dateElement = document.getElementById(`date-${date}`)
    if (dateElement && !expandedDates.includes(date)) {
      dateElement.scrollIntoView({behavior: "smooth", block: "start"})
    }
  }

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
                  {Object.entries(groupedLinks).map(([monthYear, weeks]) => {
                    return Object.entries(weeks).reverse().map(([week, links], index) => {
                      let date = `${monthYear}-${week}`
                      const isExpanded = expandedDates.includes(date)

                      return (
                        <div
                          key={`${date}-${index}`}
                             className={`${isExpanded ? "bg-gray-700" : ""} py-1 border-b-2 border-b-gray-800 hover:bg-gray-700`}
                        >
                          <div
                            id={`date-${date}`} // Unique ID for scrolling
                            className={` z-[16] overflow-hidden`}
                          >
                            <button
                              className={` ${isExpanded ? "text-white font-bold" : "text-gray-500 font-normal"}} h-9 pb-4 pt-3 px-3 text-base font-medium text-ellipsis overflow-hidden break-all uppercase w-full flex items-center justify-between  hover:text-white `}
                              onClick={() => toggleDate(date)}
                            >
                              {monthYear} &ndash; W{week} ({links.length})
                              {isExpanded ? (
                                <ChevronUp className="text-white"/>
                              ) : (
                                <ChevronDown className="text-gray-600"/>
                              )}
                            </button>
                          </div>
                          <SidebarLinks
                            className={`${
                              !isExpanded ? "-translate-x-full h-0 duration-0 overflow-hidden" : "duration-500"} transition-all `}
                            links={links}
                            onLinkClick={onLinkClick}
                            toggleSidebar={toggleSidebar}
                            activeLink={activeLink}
                            setActiveLink={setActiveLink}
                          />
                        </div>
                      )
                    })
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
