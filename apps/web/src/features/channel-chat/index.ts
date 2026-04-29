import { loadChannelChat } from "./application";
import type { User } from "./domain";
import { MOCK_CHANNEL_ID, mockChannelChatRepository } from "./infrastructure";

export { ChannelChatScreen } from "./ui";
export type { ChannelChatSnapshot } from "./application";

export type CurrentChannelChatUser = {
  displayName?: string | null;
  email?: string | null;
  username?: string | null;
};

function getEmailHandle(email?: string | null) {
  return email?.split("@")[0]?.trim() || null;
}

function getDisplayName(user?: CurrentChannelChatUser) {
  return (
    user?.displayName?.trim() ||
    user?.username?.trim() ||
    getEmailHandle(user?.email) ||
    "You"
  );
}

function getHandle(user?: CurrentChannelChatUser) {
  return (
    user?.username?.trim() ||
    getEmailHandle(user?.email) ||
    getDisplayName(user)
  )
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getInitials(displayName: string) {
  const nameParts = displayName.split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "YO";
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
}

function mapClerkUserToMockUser(
  currentUser: User,
  clerkUser?: CurrentChannelChatUser,
): User {
  const displayName = getDisplayName(clerkUser);

  return {
    ...currentUser,
    displayName,
    handle: getHandle(clerkUser) || currentUser.handle,
    initials: getInitials(displayName),
  };
}

export async function getInitialChannelChat(clerkUser?: CurrentChannelChatUser) {
  const snapshot = await loadChannelChat(
    mockChannelChatRepository,
    MOCK_CHANNEL_ID,
  );

  if (!clerkUser) {
    return snapshot;
  }

  return {
    ...snapshot,
    participants: snapshot.participants.map((participant) =>
      participant.id === snapshot.currentUserId
        ? mapClerkUserToMockUser(participant, clerkUser)
        : participant,
    ),
  };
}
