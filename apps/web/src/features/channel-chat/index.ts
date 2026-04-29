import { loadChannelChat } from "./application";
import { MOCK_CHANNEL_ID, mockChannelChatRepository } from "./infrastructure";

export { ChannelChatScreen } from "./ui";
export type { ChannelChatSnapshot } from "./application";

export function getInitialChannelChat() {
  return loadChannelChat(mockChannelChatRepository, MOCK_CHANNEL_ID);
}
