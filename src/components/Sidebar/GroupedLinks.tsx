import React from "react"
import {SidebarLink} from "./SidebarLinks" // Assuming SidebarLink is a type
import DateGroup from "./DateGroup" // Assuming DateGroup component is created

interface GroupedLinksProps {
  groupedLinks: { [date: string]: { [week: string]: SidebarLink[] } };
  expandedDates: string[];
  toggleDate: (date: string) => void;
  onLinkClick: (id: string) => void;
  toggleSidebar: () => void;
  activeLink: string;
  setActiveLink: (link: string) => void;
}

const GroupedLinks: React.FC<GroupedLinksProps> = ({
  groupedLinks,
  expandedDates,
  toggleDate,
  onLinkClick,
  toggleSidebar,
  activeLink,
  setActiveLink,
}) => (
  <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
    <div className="flex flex-col gap-1 pb-2 text-gray-100 text-sm">
      {Object.entries(groupedLinks).map(([monthYear, weeks]) => (
        Object.entries(weeks).reverse().map(([week, links], index) => {
          let date = `${monthYear}-${week}`
          const isExpanded = expandedDates.includes(date)

          return (
            <DateGroup
              key={`${date}-${index}`}
              monthYear={monthYear}
              week={week}
              links={links}
              isExpanded={isExpanded}
              toggleDate={toggleDate}
              onLinkClick={onLinkClick}
              toggleSidebar={toggleSidebar}
              activeLink={activeLink}
              setActiveLink={setActiveLink}
            />
          )
        })
      ))}
    </div>
  </div>
)

export default GroupedLinks
