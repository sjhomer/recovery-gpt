"use client"
import {useState} from "react"
import ConversationList, {Conversations} from "./ConversationList"
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

function ConversationArchive({files, loadFile}: ConversationArchiveProps) {
  const [selectedFile, setSelectedFile] = useState("")
  const [conversations, setConversations] = useState<Conversations>([])
  const [links, setLinks] = useState<OpenAiSidebarLink[]>([])

  const handleFileChange = (value: string) => {
    setSelectedFile(value)
    loadFile(value).then((file) => {
      let fileData = JSON.parse(file) as Conversations
      setConversations(fileData)
      // loop through the fileData to get the links
      let links: OpenAiSidebarLink[] = []
      fileData.forEach((conversation) => {
        const conversationLink: OpenAiSidebarLink = {
          label: conversation.title,
          url: `#${conversation.id}`,
        }
        links.push(conversationLink)
      })
      setLinks(links)
    })
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
      <OpenAiSidebar selection={fileSelect} links={links}/>
      <ConversationList conversations={conversations}/>
    </div>
  )
}

export default ConversationArchive
