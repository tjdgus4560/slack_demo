import type { ChannelId } from "../domain";
import type { ChannelChatRepository, ChannelChatSnapshot } from "./ports";

export async function loadChannelChat(
  repository: ChannelChatRepository,
  channelId: ChannelId,
): Promise<ChannelChatSnapshot> {
  const snapshot = await repository.getChannelChat(channelId);

  return {
    ...snapshot,
    messages: [...snapshot.messages].sort(
      (left, right) =>
        new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
    ),
  };
}
