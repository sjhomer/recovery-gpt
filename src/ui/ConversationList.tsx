import React, {useCallback, useEffect, useLayoutEffect, useMemo} from "react"
import hljs from "highlight.js";
import ConversationListWrapper from "./ConversationListWapper";
import { OpenAiMessage } from "./OpenAiMessage";
// import InfiniteScroll from 'react-infinite-scroll-component';

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

function ConversationList({ conversations }: ConversationListProps) {
  const handleConversationClick = useCallback((conversationDiv: HTMLDivElement | null) => {
    conversationDiv?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
        };
      }
      return null;
    },
    []
  );

  const getConversationMessages = useCallback(
    (conversation: Conversation): RenderedMessage[] => {
      const messages: RenderedMessage[] = [];
      let currentNode: string | null = conversation.current_node;
      while (currentNode != null) {
        const node: MappingEntry = conversation.mapping[currentNode];
        if (node.message && node.message.author.role !== "system") {
          const userMessage = renderMessage(node.message, "user", "User");
          const assistantMessage = renderMessage(node.message, "assistant", "ChatGPT");
          userMessage && messages.unshift(userMessage);
          assistantMessage && messages.unshift(assistantMessage);
        }
        currentNode = node.parent ?? null;
      }
      return messages;
    },
    [renderMessage]
  );

  const renderedConversations = useMemo(
    () =>
      conversations?.map((conversation, i) => {
        const messages = getConversationMessages(conversation);

        return (
          <div
            key={i}
            className="conversation"
            id={`conversation${i}`}
            ref={handleConversationClick}
          >
            <h4
              className="title text-center text-2xl font-bold mt-4"
              style={{ cursor: "pointer" }}
              // @ts-ignore
              onClick={() => handleConversationClick(`conversation${i}`)}
              data-conversation-id={`conversation${i}`}
            >
              {conversation.title}
            </h4>
            <div className="content">
              {messages.map((message, j) => (
                <OpenAiMessage key={j} message={message} />
              ))}
            </div>
          </div>
        );
      }),
    [conversations, getConversationMessages, handleConversationClick]
  );

  useLayoutEffect(() => {
    setTimeout(() => {
      hljs.highlightAll();
    }, 5000);
  }, [renderedConversations]);

  return (
    <ConversationListWrapper>
      {/*<InfiniteScroll*/}
      {/*  dataLength={conversations.length}*/}
      {/*  next={fetchMoreData} // you should implement this function to fetch more data when user scroll reaches the end*/}
      {/*  hasMore={true} // this should be updated based on your API pagination status*/}
      {/*  loader={<h4>Loading...</h4>} // you can customize this loader*/}
      {/*>*/}
        <div>{renderedConversations}</div>
      {/*</InfiniteScroll>*/}
    </ConversationListWrapper>
  );
}

export default ConversationList;
