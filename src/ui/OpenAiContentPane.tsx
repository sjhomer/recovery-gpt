import React, {useCallback, useLayoutEffect, useMemo} from "react"
import hljs from "highlight.js"
import {OpenAiMessage} from "./OpenAiMessage"

type AuthorRole = "system" | "user" | "assistant";

interface Author {
  role: AuthorRole;
  name: null;
  metadata: Record<string, unknown>;
}

interface Content {
  content_type: string;
  parts: string[];
}

interface Message {
  id: string;
  author: Author;
  create_time: number;
  update_time: number | null;
  content: Content;
  status: string;
  end_turn: boolean | null;
  weight: number;
  metadata: Record<string, unknown>;
  recipient: string;
}

type MappingEntry = {
  id: string;
  message: Message | null;
  parent: string | null;
  children: string[];
}

interface Mapping {
  [key: string]: MappingEntry;
}

export interface Conversation {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Mapping;
  moderation_results: unknown[];
  current_node: string;
  plugin_ids: null;
  id: string;
}

export type Conversations = Conversation[];

interface ConversationListProps {
  conversations: Conversations;
}

interface RenderedMessage {
  author: string;
  text: string;
}

interface ConversationPaneProps {
  activeConversation: Conversation | null;
}

function OpenAiContentPane({activeConversation}: ConversationPaneProps) {
  {
    const handleConversationClick = useCallback((conversationDiv: HTMLDivElement | null) => {
      conversationDiv?.scrollIntoView({behavior: "smooth"})
    }, [])

    const renderMessage = useCallback(
      (message: Message, role: AuthorRole, authorName: string): RenderedMessage | null => {
        if (
          message.author.role === role &&
          message.content &&
          message.content.content_type === "text" &&
          message.content.parts.length > 0 &&
          message.content.parts[0].length > 0
        ) {
          return {
            author: authorName,
            text: message.content.parts[0],
          }
        }
        return null
      },
      []
    )

    const getConversationMessages = useCallback(
      (conversation: Conversation): RenderedMessage[] => {
        const messages: RenderedMessage[] = []
        let currentNode: string | null = conversation.current_node
        while (currentNode != null) {
          const node: MappingEntry = conversation.mapping[currentNode]
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

    const renderedActiveConversation = useMemo(
      () => activeConversation && (
        <div
          key={activeConversation.id}
          className="conversation"
          id={`${activeConversation.id}`}
          ref={handleConversationClick}
        >
          <h4
            className="title text-center text-2xl font-bold mt-8"
            style={{cursor: "pointer"}}
            // @ts-ignore
            onClick={() => handleConversationClick(`conversation${activeConversation.id}`)}
            data-conversation-id={`conversation${activeConversation.id}`}
          >
            {activeConversation.title}
          </h4>
          <div className="content">
            {getConversationMessages(activeConversation).map((message, j) => (
              <OpenAiMessage key={j} message={message}/>
            ))}
          </div>
        </div>
      ),
      [activeConversation, getConversationMessages, handleConversationClick]
    )

    useLayoutEffect(() => {
      setTimeout(() => {
        hljs.highlightAll()
      }, 0)
    }, [renderedActiveConversation])

    return (
      <div className="relative flex h-full max-w-full flex-1 overflow-hidden text-white">
        <div className="flex h-full max-w-full flex-1 flex-col">
          <main className="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
            <div className="absolute right-4 top-2 z-10 hidden flex-col gap-2 md:flex"></div>
            <div className="flex-1 overflow-y-scroll">
              <div className="h-full dark:bg-gray-800">
                {renderedActiveConversation} {/* <-- Render only active conversation */}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
}

export default OpenAiContentPane
