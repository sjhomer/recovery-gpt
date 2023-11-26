import React, {useCallback, useEffect, useLayoutEffect, useRef} from "react"
import hljs from "highlight.js"
import {Message} from "./Message"
import {convertUnixTimestampToDate} from "@/lib"
import * as _ from "lodash-es"

function ContentPanel({activeConversation, searchKeyword, display}: RecoveryGPT.ConversationPaneProps) {
  const ref = useRef<HTMLDivElement>(null)

  const renderMessage = useCallback(
    (message: RecoveryGPT.Message,
      role: RecoveryGPT.AuthorRole,
      authorName: string): RecoveryGPT.RenderedMessage | null => {
      if (
        message.author.role === role &&
        message.content &&
        message.content.content_type === "text" &&
        message.content.parts.length > 0 &&
        message.content.parts[0].length > 0
      ) {
        let text = message.content.parts[0]
        if(searchKeyword) {
          text = text.replace(new RegExp(_.escapeRegExp(searchKeyword), 'gi'), `<span class="highlight">$&</span>`)
        }
        return {
          author: authorName,
          text,
          create_time: message.create_time,
        }
      }
      return null
    },
    [searchKeyword]
  )

  const getConversationMessages = useCallback(
    (conversation: RecoveryGPT.Conversation): RecoveryGPT.RenderedMessage[] => {
      const messages: RecoveryGPT.RenderedMessage[] = []
      let currentNode: string | null = conversation.current_node
      while (currentNode != null) {
        const node: RecoveryGPT.MappingEntry = conversation.mapping[currentNode]
        if (node.message && node.message.author.role !== "system") {
          const userMessage = renderMessage(node.message, "user", "User")
          const assistantMessage = renderMessage(node.message, "assistant", "ChatGPT")
          userMessage && messages.unshift(userMessage)
          assistantMessage && messages.unshift(assistantMessage)
        }
        currentNode = node.parent ?? null
      }
      return messages
    },
    [renderMessage]
  )

  let messages = activeConversation && getConversationMessages(activeConversation)
  const renderedActiveConversation =
    activeConversation && <div
      key={activeConversation.id}
      className="conversation"
      id={`${activeConversation.id}`}
    >
      <div
        className="titleSection sticky top-0 bg-slate-900 py-2"
        style={{zIndex: 1}}
      >
        <h4
          className="title text-center text-2xl font-bold my-2 ml-16 md:ml-0 flex items-center gap-4 justify-center"
          style={{cursor: "pointer"}}
          data-conversation-id={`conversation${activeConversation.id}`}
        >
          <span>{activeConversation.title}</span><span className="text-base">{
          // @ts-ignore
          convertUnixTimestampToDate(messages?.[0].create_time, {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })
        }</span>
        </h4>
      </div>
      <div className="content">
        {messages?.map((message, j) => (
          <Message key={j} message={message}/>
        ))}
      </div>
    </div>

  // Scroll to top when activeConversation changes
  useEffect(() => {
    const container = ref.current
    if (container) {
      container.scrollIntoView({behavior: "smooth"})
    }
  }, [activeConversation])

  useLayoutEffect(() => {
    // If there are any code blocks missing 'hljs' classes, highlight them
    const codeBlocks = ref.current?.querySelectorAll("code:not(.hljs)")
    if (codeBlocks) {
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement)
      })
    }
  }, [activeConversation])

  return (
    <div ref={ref} className={`contentPane h-full dark:bg-gray-800 ${display ? "" : "hidden"}`}>
      {renderedActiveConversation}
    </div>
  )
}

export default ContentPanel
