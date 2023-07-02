import React, {useEffect, useMemo} from "react"
import hljs from "highlight.js"
import ConversationListWrapper from "./ConversationListWapper"
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

interface Mapping {
  [key: string]: {
    id: string;
    message: Message | null;
    parent: string | null;
    children: string[];
  };
}

interface Conversation {
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

function ConversationList({conversations}: ConversationListProps) {

  const handleConversationClick = (conversationId: string) => {
    const conversationDiv = document.getElementById(conversationId)
    conversationDiv?.scrollIntoView({behavior: "smooth"})

    const mainPanel = document.getElementById("mainPanel")
    if (mainPanel instanceof Element) {
      mainPanel.scrollTop = conversationDiv?.offsetTop ?? 0
    }
  }

  const renderUserMessage = (message: Message): RenderedMessage | null => {
    if (
      message.author.role === "user" &&
      message.content &&
      message.content.content_type === "text" &&
      message.content.parts.length > 0 &&
      message.content.parts[0].length > 0
    ) {
      return {
        author: "User",
        text: message.content.parts[0],
      }
    }
    return null
  }

  const renderAssistantMessage = (message: Message): RenderedMessage | null => {
    if (
      message.author.role === "assistant" &&
      message.content &&
      message.content.content_type === "text" &&
      message.content.parts.length > 0 &&
      message.content.parts[0].length > 0
    ) {
      return {
        author: "ChatGPT",
        text: message.content.parts[0],
      }
    }
    return null
  }

  const getConversationMessages = (conversation: Conversation): RenderedMessage[] => {
    const messages: RenderedMessage[] = []
    let currentNode = conversation.current_node
    while (currentNode != null) {
      const node = conversation.mapping[currentNode]
      if (node.message && node.message.author.role !== "system") {
        const userMessage = renderUserMessage(node.message)
        if (userMessage) {
          messages.push(userMessage)
        }
        const assistantMessage = renderAssistantMessage(node.message)
        if (assistantMessage) {
          messages.push(assistantMessage)
        }
      }
      if (node.parent != null) {
        currentNode = node.parent
      }
    }
    return messages.reverse()
  }

  const renderedConversations = useMemo(() =>
    conversations?.map((conversation, i) => {
      const messages = getConversationMessages(conversation)
      return (
        <div key={i} className="conversation" id={`conversation${i}`}>
          <h4
            className="title"
            style={{cursor: "pointer"}}
            onClick={() => handleConversationClick(`conversation${i}`)}
            data-conversation-id={`conversation${i}`}
          >
            {conversation.title}
          </h4>
          <div className="content"
            // style={{ display: "none" }}
          >
            {messages.map((message, j) =>
              <OpenAiMessage key={j} message={message}/>
            )}
          </div>
        </div>
      )

      setTimeout(()=>{
        hljs.highlightAll()
      }, 2000);
    }), [conversations, getConversationMessages])

  return (
    <ConversationListWrapper>
      <div id="root">
        {renderedConversations}
      </div>
    </ConversationListWrapper>
  )
}

export default ConversationList
