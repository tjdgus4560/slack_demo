import type {
  Channel,
  ChannelId,
  Message,
  User,
  UserId,
  Workspace,
} from "../domain";

export type ChannelChatSnapshot = {
  workspace: Workspace;
  channel: Channel;
  channels: Channel[];
  currentUserId: UserId;
  participants: User[];
  messages: Message[];
};

export type ChannelChatRepository = {
  getChannelChat(channelId: ChannelId): Promise<ChannelChatSnapshot>;
};
