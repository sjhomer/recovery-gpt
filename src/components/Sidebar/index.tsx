import React, {useEffect, useMemo, useState} from "react"
import {SidebarToggle} from "./SidebarToggle"
import {SidebarLink} from "./SidebarLinks"
import {getWeekNumber} from "@/lib"
import SidebarOverlay from "@/components/Sidebar/SidebarOverlay"
import SidebarContainer from "@/components/Sidebar/SidebarContainer"
import SidebarHeader from "@/components/Sidebar/SidebarHeader"
import ShareSection from "@/components/Sidebar/ShareSection"
import GroupedLinks from "@/components/Sidebar/GroupedLinks"
import Fuse from "fuse.js"
import { useDebounce } from 'usehooks-ts'

export type {SidebarLink}

interface SidebarProps {
  selection: JSX.Element;
  onLinkClick: (id: string) => void; // <-- New prop
  conversations: RecoveryGPT.Conversations;
}

export const Sidebar = ({
  selection, onLinkClick, conversations
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce

  const filteredConversations = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return conversations

    const fuse = new Fuse(conversations, {
      keys: ["title",
        {
          name: 'mapping',
          getFn: (item) => {
            // Flatten the mapping into a searchable string or array of strings
            return Object.values(item.mapping).map((mapItem) => {
              // Example: combining the message content parts
              // Adjust based on your searchable criteria
              return mapItem.message?.content?.parts?.join(' ') || '';
            });
          }
        }], // Adjust based on your data structure
    })

    const searchResults = fuse.search(debouncedSearchTerm).map(result => result.item)

    console.log("Sidebar.tsx: filteredConversations", debouncedSearchTerm, searchResults)

    return searchResults
  }, [conversations, debouncedSearchTerm])

  const onSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeLink, setActiveLink] = useState("")
  const [isOverlayVisible, setIsOverlayVisible] = useState(false) // New state

  const links: SidebarLink[] = useMemo(() => filteredConversations.map((conversation) => ({
    label: conversation.title,
    url: conversation.id,
    date: conversation.create_time,
  })), [filteredConversations])

  const groupedLinks = useMemo(() => {
    return links.reduce((groups: { [date: string]: { [week: string]: SidebarLink[] } }, link) => {
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
    }, {}) || {}
  }, [links])

  const [expandedDates, setExpandedDates] = useState<string[]>([])

  useEffect(() => {
    // Pick from the groupedLinks the first date and week, i.e. `${monthYear} ${week}`
    const firstDate = Object.keys(groupedLinks)?.reverse()?.[0]
    // Weeks happen to pool backwards, so we need to pick the last week
    const firstWeek = groupedLinks[firstDate] && Object.keys(groupedLinks[firstDate]).reverse()[0]
    setExpandedDates([`${firstDate}-${firstWeek}`])
  }, [groupedLinks])

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
    setIsOverlayVisible(!isSidebarOpen) // Toggle overlay visibility
  }

  useEffect(() => {
    // Set the first link as active when the list loads
    if (links.length > 0) {
      setActiveLink(links[0].url)
    }
  }, [links])

  console.log("Sidebar.tsx: conversations", searchTerm, filteredConversations)

  return !isSidebarOpen ? (SidebarToggle({isSidebarOpen, toggleSidebar})) : (<>
    {/* Overlay */}
    <SidebarOverlay
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    />
    <SidebarContainer isSidebarOpen={isSidebarOpen}>
      <SidebarHeader
        selection={selection}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSearchChange={onSearchChange}
      />
      <GroupedLinks
        groupedLinks={groupedLinks}
        expandedDates={expandedDates}
        toggleDate={toggleDate}
        onLinkClick={onLinkClick}
        toggleSidebar={toggleSidebar}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <ShareSection/>
    </SidebarContainer>
  </>)
}
