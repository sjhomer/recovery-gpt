"use client"
import {useState} from "react"
import OpenAiContentPane, {Conversation, Conversations} from "./OpenAiContentPane"
import {OpenAiSidebar, OpenAiSidebarLink} from "./OpenAiSidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ConversationArchiveProps {
  files?: string[];
  loadFile: (file: string) => Promise<string>;
}

function OpenAiArchiveLayout({files, loadFile}: ConversationArchiveProps) {
  const [selectedFile, setSelectedFile] = useState("")
  const [conversations, setConversations] = useState<Conversations>([])
  const [links, setLinks] = useState<OpenAiSidebarLink[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const handleFileChange = (value: string) => {
    setSelectedFile(value)
    loadFile(value).then((file) => {
      let fileData = JSON.parse(file) as Conversations
      setConversations(fileData)
      setActiveConversation(fileData[0] || null); // <--- Set the first conversation as active

      // loop through the fileData to get the links
      let links: OpenAiSidebarLink[] = []
      fileData.forEach((conversation) => {
        const conversationLink: OpenAiSidebarLink = {
          label: conversation.title,
          url: conversation.id,
        }
        links.push(conversationLink)
      })
      setLinks(links)
    })
  }

  const handleLinkClick = (id: string) => {
    const conversation = conversations.find(conversation => conversation.id === id);
    setActiveConversation(conversation || null);
  }

  const fileSelect = <Select onValueChange={handleFileChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select a file"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Files</SelectLabel>
        {files?.map((file, index) => (
          <SelectItem key={index} value={file}>
            {file}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>

  return (
    <div className="overflow-hidden w-full h-screen relative flex z-0 bg-gray-800">
      <OpenAiSidebar selection={fileSelect} links={links} onLinkClick={handleLinkClick}/>
      <OpenAiContentPane activeConversation={activeConversation}/>
    </div>
  )
}

export default OpenAiArchiveLayout
