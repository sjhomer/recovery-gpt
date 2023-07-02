import React, { useEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import ConversationListWrapper from "./ConversationListWapper";
import OpenAiUserImage from "./OpenAiUserImage"
import {OpenAiChatImage} from "./OpenAiChatImage"

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
  className: string;
}

function ConversationList({ conversations }: ConversationListProps) {
  useEffect(() => {
    hljs.initHighlightingOnLoad();
    hljs.highlightAll();
  }, []);

  const handleConversationClick = (conversationId: string) => {
    const conversationDiv = document.getElementById(conversationId);
    conversationDiv?.scrollIntoView({ behavior: "smooth" });

    // const content = conversationDiv?.querySelector(
    //   ".content"
    // ) as HTMLDivElement;
    // check if content is type Element
    // if (content instanceof Element && content.style) {
    //   content.style.display = content?.style.display === "none" ? "block" : "none";
    // }

    const mainPanel = document.getElementById("mainPanel");
    if (mainPanel instanceof Element) {
      mainPanel.scrollTop = conversationDiv?.offsetTop ?? 0;
    }
  };

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
        className: "user-message",
      };
    }
    return null;
  };

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
        className: "assistant-message",
      };
    }
    return null;
  };

  const getConversationMessages = (conversation: Conversation): RenderedMessage[] => {
    const messages: RenderedMessage[] = [];
    let currentNode = conversation.current_node;
    while (currentNode != null) {
      const node = conversation.mapping[currentNode];
      if (node.message && node.message.author.role !== "system") {
        const userMessage = renderUserMessage(node.message);
        if (userMessage) {
          messages.push(userMessage);
        }
        const assistantMessage = renderAssistantMessage(node.message);
        if (assistantMessage) {
          messages.push(assistantMessage);
        }
      }
      currentNode = node.parent;
    }
    return messages.reverse();
  };

  return (
    <ConversationListWrapper>
      <div id="root">
        {conversations?.map((conversation, i) => {
          const messages = getConversationMessages(conversation);
          return (
            <div key={i} className="conversation" id={`conversation${i}`}>
              <h4
                className="title"
                style={{ cursor: "pointer" }}
                onClick={() => handleConversationClick(`conversation${i}`)}
                data-conversation-id={`conversation${i}`}
              >
                {conversation.title}
              </h4>
              <div className="content"
                   // style={{ display: "none" }}
                >
                {messages.map((message, j) => (
                  <div
                    key={j}
                    className={`message ${message.className}`}
                  >
                    <div></div>
                    <div>
                      <div className="author">{message.author}</div>
                      <div className="message-text">
                        <div className="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
                          <div className="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
                            <div className="flex-shrink-0 flex flex-col relative items-end">
                              <div className="w-[30px]">
                                <div className="relative p-1 rounded-sm h-[30px] w-[30px] text-white flex items-center justify-center" style={{ backgroundColor: "rgb(25, 195, 125)" }}>
                                  {message.author === 'user'? <OpenAiUserImage/>: <OpenAiChatImage/>}
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow">
                              <div className="text-left leading-tight">
                                {message.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ConversationListWrapper>
  );
}

export default ConversationList;
