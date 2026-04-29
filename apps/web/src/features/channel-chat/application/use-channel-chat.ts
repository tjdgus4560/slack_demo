"use client";

import { useMemo, useState } from "react";
import { composeMessage } from "../domain";
import type { ChannelId } from "../domain";
import type { ChannelChatSnapshot } from "./ports";

function createClientMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}`;
}

export function useChannelChat(initialSnapshot: ChannelChatSnapshot) {
  const [messages, setMessages] = useState(initialSnapshot.messages);
  const [draft, setDraft] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<ChannelId>(
    initialSnapshot.channel.id,
  );

  const activeChannel = useMemo(
    () =>
      initialSnapshot.channels.find((channel) => channel.id === activeChannelId) ??
      initialSnapshot.channel,
    [activeChannelId, initialSnapshot.channel, initialSnapshot.channels],
  );

  const activeMessages = useMemo(
    () =>
      messages
        .filter((message) => message.channelId === activeChannel.id)
        .sort(
          (left, right) =>
            new Date(left.createdAt).getTime() -
            new Date(right.createdAt).getTime(),
        ),
    [activeChannel.id, messages],
  );

  const participantsById = useMemo(
    () =>
      new Map(
        initialSnapshot.participants.map((participant) => [
          participant.id,
          participant,
        ]),
      ),
    [initialSnapshot.participants],
  );

  const currentUser = participantsById.get(initialSnapshot.currentUserId);

  function selectChannel(channelId: ChannelId) {
    setActiveChannelId(channelId);
    setDraft("");
  }

  function sendMessage() {
    if (!currentUser) {
      return;
    }

    const message = composeMessage({
      id: createClientMessageId(),
      channelId: activeChannel.id,
      authorId: currentUser.id,
      body: draft,
      createdAt: new Date().toISOString(),
    });

    if (!message) {
      return;
    }

    setMessages((currentMessages) => [...currentMessages, message]);
    setDraft("");
  }

  return {
    activeChannelId,
    channel: activeChannel,
    channels: initialSnapshot.channels,
    currentUser,
    draft,
    messages: activeMessages,
    participantsById,
    selectChannel,
    setDraft,
    sendMessage,
    workspace: initialSnapshot.workspace,
  };
}
