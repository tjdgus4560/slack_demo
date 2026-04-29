import type { ChannelId } from "./channel";
import type { UserId } from "./user";

export type MessageId = string;

export type MessageReaction = {
  symbol: string;
  label: string;
  count: number;
  reactedByCurrentUser?: boolean;
};

export type Message = {
  id: MessageId;
  channelId: ChannelId;
  authorId: UserId;
  body: string;
  createdAt: string;
  reactions: MessageReaction[];
  replyCount?: number;
  isEdited?: boolean;
};

export type ComposeMessageInput = {
  id: MessageId;
  channelId: ChannelId;
  authorId: UserId;
  body: string;
  createdAt: string;
  reactions?: MessageReaction[];
};

export function composeMessage(input: ComposeMessageInput): Message | null {
  const body = input.body.trim();

  if (!body) {
    return null;
  }

  return {
    ...input,
    body,
    reactions: input.reactions ?? [],
  };
}
