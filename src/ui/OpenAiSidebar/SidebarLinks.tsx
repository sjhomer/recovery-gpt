import {MessageSquare} from "lucide-react"
import React from "react"
import {OpenAiSidebarLink} from "@/ui/OpenAiSidebar"
import {useWindowSize} from "usehooks-ts"

interface SidebarLinksProps {
  className: string;
  links: OpenAiSidebarLink[];
  onLinkClick: (id: string) => void;
  toggleSidebar: () => void;
  activeLink: string;
  setActiveLink: (id: string) => void;
}

export const SidebarLinks = ({className, links, onLinkClick, activeLink, setActiveLink, toggleSidebar}: SidebarLinksProps) => {
  const {width, height} = useWindowSize()

  return <ol className={className}>
    {links.map((link) => {
      const clickLink = () => {
        onLinkClick(link.url)
        setActiveLink(link.url) // Set the clicked link as active
        if (width < 768) toggleSidebar()
      }
      return (
        <li
          className={`relative z-[15]`}
          data-projection-id="3"
          style={{opacity: 1, height: "auto"}}
          key={link.url}
        >
          <a
            className={`flex py-2 px-3 items-center gap-3 relative rounded-md hover:bg-gray-600 cursor-pointer break-all group ${
              link.url === activeLink ? "bg-gray-600" : "" // Add "active" class if the link is active
            }`}
            // @ts-ignore
            onClick={clickLink}
          >
            <MessageSquare className="h-4 w-4"/>
            <div className="text-ellipsis w-[200px] max-h-5 overflow-hidden break-all relative whitespace-nowrap" title={link.label}>
              {link.label}
            </div>
          </a>
        </li>
      )
    })}
  </ol>
}
