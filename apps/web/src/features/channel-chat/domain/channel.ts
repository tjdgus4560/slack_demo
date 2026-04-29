export type ChannelId = string;

export type ChannelKind = "public" | "private";

export type Channel = {
  id: ChannelId;
  name: string;
  topic: string;
  description: string;
  kind: ChannelKind;
  memberCount: number;
  unreadCount: number;
  isFavorite?: boolean;
};
