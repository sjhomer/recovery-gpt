import React, {useEffect, useMemo, useRef, useState} from "react"
import {SidebarToggle} from "./SidebarToggle"
import {SidebarLink} from "./SidebarLinks"
import {getWeekNumber} from "@/lib"
import SidebarOverlay from "@/components/Sidebar/SidebarOverlay"
import SidebarContainer from "@/components/Sidebar/SidebarContainer"
import SidebarHeader from "@/components/Sidebar/SidebarHeader"
import ShareSection from "@/components/Sidebar/ShareSection"
import GroupedLinks from "@/components/Sidebar/GroupedLinks"
import * as _ from "lodash-es"

export type {SidebarLink}

interface SidebarProps {
  selection: JSX.Element;
  onLinkClick: (id: string) => void; // <-- New prop
  conversations: RecoveryGPT.Conversations;
  searchKeyword: string;
  setSearchInput: (searchTerm: string) => void;
}

export const Sidebar = ({
  selection, onLinkClick, conversations, searchKeyword, setSearchInput
}: SidebarProps) => {

  const filteredConversations = useMemo(() => {
    if (!searchKeyword) return conversations

    // Clone the conversations array to avoid mutating the original data
    const clonedConversations = _.cloneDeep(conversations)

    const results = _.filter(clonedConversations, (conversation) => {
      // Check if the search term is in the title, case-insensitively
      const inTitle = conversation.title.toLowerCase().includes(searchKeyword)


      // Join the parts and check if the search term is present, case-insensitively
      const inMapping = _.some(conversation.mapping, (entry) => {
        const joinedParts = entry?.message?.content?.parts?.join(" ").toLowerCase()
        return joinedParts?.includes(searchKeyword) || false
      })

      // Include the conversation in the result if the term is found in the title or any mapping entry
      return inTitle || inMapping
    })

    return results
  }, [conversations, searchKeyword])

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeLink, setActiveLink] = useState("")
  const [isOverlayVisible, setIsOverlayVisible] = useState(false) // New state

  const links: SidebarLink[] = useMemo(() => _.sortBy(filteredConversations.map((conversation) => ({
    label: conversation.title,
    url: conversation.id,
    date: conversation.create_time,
  })), "date").reverse(), [filteredConversations])

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
    const firstDate = Object.keys(groupedLinks)?.[0]
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

  const autoClickTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Find the most recent link
    const mostRecentLink = links?.[0]

    if (mostRecentLink) {
      autoClickTimeout.current && clearTimeout(autoClickTimeout.current)
      autoClickTimeout.current = setTimeout(() => {
        onLinkClick(mostRecentLink.url)
      }, 1000) // Adjust to 2000 for a 2s delay
    }

    // Cleanup
    return () => {
      if (autoClickTimeout.current) {
        clearTimeout(autoClickTimeout.current)
      }
    }
  }, [links, onLinkClick])

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
        onSearchChange={setSearchInput}
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
