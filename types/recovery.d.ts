declare namespace RecoveryGPT {

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
    create_time?: number;
  }

  interface ConversationPaneProps {
    activeConversation: Conversation | null;
  }

}
