"use client"
import React, {useEffect} from "react"
import {marked} from "marked"
import hljs from "highlight.js"
import ConversationListWrapper from "./ConversationListWapper"


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

function ConversationList({conversations}: ConversationListProps) {
  useEffect(() => {
    hljs.initHighlightingOnLoad()
    hljs.highlightAll()
  }, [])

  const handleConversationClick = (conversationId: string) => {
    const conversationDiv = document.getElementById(conversationId)
    conversationDiv?.scrollIntoView({behavior: "smooth"})

    const content = conversationDiv?.querySelector(".content") as HTMLDivElement
    // check if content is type Element
    if (content instanceof Element && content.style) {
      content.style.display = content?.style.display === "none" ? "block" : "none"
    }

    const mainPanel = document.getElementById("mainPanel")
    if (mainPanel instanceof Element) {
      mainPanel.scrollTop = conversationDiv?.offsetTop ?? 0
    }
  }

  const getConversationMessages = (conversation: Conversation): Message[] => {
    const messages: Message[] = []
    let currentNode = conversation.current_node
    while (currentNode != null) {
      const node = conversation.mapping[currentNode]
      if (
        node.message &&
        node.message.content &&
        node.message.content.content_type === "text" &&
        node.message.content.parts.length > 0 &&
        node.message.content.parts[0].length > 0 &&
        node.message.author.role !== "system"
      ) {
        let author = node.message.author.role
        // if (author === "assistant") {
        //   author = "ChatGPT"
        // }
        messages.push({author, text: node.message.content.parts[0]})
      }
      currentNode = node.parent
    }
    return messages.reverse()
  }

  return (
    <ConversationListWrapper>
      <div id="root">
        {conversations?.map((conversation, i) => {
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
              <div className="content" style={{display: "none"}}>
                {messages.map((message, j) => (
                  <div
                    key={j}
                    className={`message ${/user/i.test(message.author) ? "user-message" : "assistant-message"}`}
                  >
                    <div></div>
                    <div>
                      <div className="author">{message.author}</div>
                      {marked.parse(message.text)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </ConversationListWrapper>
  )
}

export default ConversationList
