"use client"
import React, {useState} from "react"
import OpenAiContentPane, {Conversation, Conversations} from "./OpenAiContentPane"
import {OpenAiSidebar, OpenAiSidebarLink} from "./OpenAiSidebar"
import LoadConversation from "@/ui/LoadConversation"
import SplashPage from "@/ui/SplashPage"

interface ConversationArchiveProps {
  files?: string[];
  loadFile: (file: string) => Promise<string>;
}

function OpenAiArchiveLayout({files, loadFile}: ConversationArchiveProps) {
  const [conversations, setConversations] = useState<Conversations>([])
  const [links, setLinks] = useState<OpenAiSidebarLink[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [fileName, setFileName] = useState("Select a file")

  const handleFileChange = (fileData: Conversations) => {
    setConversations(fileData)
    setActiveConversation(fileData[0] || null) // <--- Set the first conversation as active

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
  }

  const handleLinkClick = (id: string) => {
    const conversation = conversations.find(conversation => conversation.id === id)
    setActiveConversation(conversation || null)
  }

  const UploadButton =
    <LoadConversation
      handleFileChange={handleFileChange}
      fileName={fileName}
      setFileName={setFileName}
    />

  return (
    <div className="overflow-hidden w-full h-screen relative flex z-0 bg-gray-700">
      {conversations.length && <OpenAiSidebar selection={UploadButton} links={links} onLinkClick={handleLinkClick}/>}
      <div className="relative flex h-full max-w-full flex-1 overflow-hidden text-white">
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
            <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex"></div>
            <div className="flex-1 overflow-y-scroll">
              {conversations.length ? <OpenAiContentPane activeConversation={activeConversation}/> :
                <SplashPage action={UploadButton}/>}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default OpenAiArchiveLayout
