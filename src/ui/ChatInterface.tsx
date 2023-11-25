"use client"
import {useCallback, useState} from "react"
import ContentPanel from "@/components/ContentPanel"
import {Sidebar, SidebarLink} from "@/components/Sidebar"
import LoadConversation from "@/components/buttons/LoadConversation"
import SplashPage from "./SplashPage"
import {ChatLoader} from "@/components/ChatLoader"

function ChatInterface() {
  const [conversations, setConversations] = useState<RecoveryGPT.Conversations>([])
  const [links, setLinks] = useState<SidebarLink[]>([])
  const [loading, setLoading] = useState(false)
  const [activeConversation, setActiveConversation] = useState<RecoveryGPT.Conversation | null>(null)
  const [fileName, setFileName] = useState("Select 'conversions.json' files to review")
  let hasContent = conversations.length > 0

  const handleFileChange = useCallback((fileData: RecoveryGPT.Conversations) => {
    setConversations(fileData)
    setActiveConversation(fileData[0] || null)
  }, [])

  /**
   * Handles the click event of a link in the chat interface.
   * Sets the active conversation to null to show the loading state,
   * then finds the conversation with the specified id and sets it as the active conversation.
   * After a delay of 1 seconds, the loading state is set to false.
   *
   * @param id - The id of the conversation to activate.
   */
  const handleLinkClick = useCallback((id: string) => {
    setActiveConversation(null) // Set activeConversation to null to show loading state
    setLoading(true)

    const conversation = conversations.find((conversation) => conversation.id === id)

    setActiveConversation(conversation || null) // Set activeConversation to display content
    setTimeout(() => {
      setLoading(false)
    }, 1000) // Wait for 1 seconds before displaying content
  }, [conversations])

  const UploadButton =
    <LoadConversation
      handleFileChange={handleFileChange}
      fileName={fileName}
      setFileName={setFileName}
    />

  return (
    <>
      <div className="overflow-hidden w-full h-screen relative flex z-0 bg-gray-700">
        {hasContent && <Sidebar selection={UploadButton} onLinkClick={handleLinkClick} conversations={conversations}/>}
        <div className="relative flex h-full max-w-full flex-1 overflow-hidden text-white">
          <div className="flex h-full max-w-full flex-1 flex-col">
            <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
              <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex"></div>
              <div className="flex-1 overflow-y-scroll">
                {hasContent ? (<>
                  <ChatLoader display={loading}/>
                  <ContentPanel display={!loading} activeConversation={activeConversation}/>
                </>) : (
                  <SplashPage action={UploadButton}/>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatInterface
