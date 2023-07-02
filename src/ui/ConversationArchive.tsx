"use client"
import {useState} from "react"
import ConversationList, {Conversations} from "./ConversationList"
import {OpenAiSidebar, OpenAiSidebarLink} from "./OpenAiSidebar"

interface ConversationArchiveProps {
  files?: string[];
  loadFile: (file: string) => Promise<string>;
}

function ConversationArchive({files, loadFile}: ConversationArchiveProps) {
  const [selectedFile, setSelectedFile] = useState("")
  const [conversations, setConversations] = useState<Conversations>([])
  const [links, setLinks] = useState<OpenAiSidebarLink[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFile(event.target.value)
    loadFile(event.target.value).then((file) => {
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

  return (<>
      <div style={{position: "fixed", bottom: "10px", right: "10px"}}>
        <select value={selectedFile} onChange={handleFileChange}>
          <option value="">Select a file</option>
          {files?.map((file, index) => (
            <option key={index} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>
      {selectedFile && <div className="overflow-hidden w-full h-full relative flex z-0">
        <OpenAiSidebar file={selectedFile} links={links}/>
        <ConversationList conversations={conversations}/>
      </div>}
    </>
  )
}

export default ConversationArchive
