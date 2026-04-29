import type {
  Channel,
  Message,
  User,
  UserId,
  Workspace,
} from "../domain";

export type ChannelChatSnapshot = {
  workspace: Workspace;
  channel: Channel;
  channels: Channel[];
  currentUserId?: UserId;
  participants: User[];
  messages: Message[];
};
