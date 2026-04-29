import type { Channel, Message, User, Workspace } from "../domain";
import type {
  ChannelChatRepository,
  ChannelChatSnapshot,
} from "../application";

export const MOCK_CHANNEL_ID = "channel-product-lab";

const mockWorkspace: Workspace = {
  id: "workspace-monorepo",
  name: "Monorepo Labs",
  initials: "ML",
  plan: "Design Partner",
  tagline: "Product, design, and engineering in one focused loop.",
  activeMembers: 18,
  unreadCount: 14,
};

const mockChannels: Channel[] = [
  {
    id: MOCK_CHANNEL_ID,
    name: "product-lab",
    topic: "Launch planning, product decisions, and customer signal.",
    description:
      "A focused room for shaping launch decisions and customer signal.",
    kind: "public",
    memberCount: 12,
    unreadCount: 3,
    isFavorite: true,
  },
  {
    id: "channel-design-review",
    name: "design-review",
    topic: "Interface critique and interaction polish.",
    description: "Screens, states, copy, and design QA.",
    kind: "public",
    memberCount: 8,
    unreadCount: 6,
  },
  {
    id: "channel-eng-ops",
    name: "eng-ops",
    topic: "Build health, releases, and local development notes.",
    description: "Engineering operations and project hygiene.",
    kind: "public",
    memberCount: 15,
    unreadCount: 0,
  },
  {
    id: "channel-launch-room",
    name: "launch-room",
    topic: "Private launch checklist and final approvals.",
    description: "A compact room for last-mile release calls.",
    kind: "private",
    memberCount: 5,
    unreadCount: 5,
  },
];

const mockUsers: User[] = [
  {
    id: "user-taejun",
    displayName: "Taejun Kim",
    handle: "taejun",
    initials: "TK",
    role: "Product Lead",
    status: "online",
    statusLabel: "Reviewing scope",
    accentColor: "#7c3aed",
    dmUnreadCount: 2,
  },
  {
    id: "user-mina",
    displayName: "Mina Park",
    handle: "mina",
    initials: "MP",
    role: "Product Design",
    status: "focus",
    statusLabel: "Focus mode",
    accentColor: "#06b6d4",
    dmUnreadCount: 0,
  },
  {
    id: "user-jun",
    displayName: "Jun Seo",
    handle: "jun",
    initials: "JS",
    role: "Frontend",
    status: "away",
    statusLabel: "Back soon",
    accentColor: "#22c55e",
    dmUnreadCount: 1,
  },
  {
    id: "user-hana",
    displayName: "Hana Lee",
    handle: "hana",
    initials: "HL",
    role: "Customer Ops",
    status: "online",
    statusLabel: "In workspace",
    accentColor: "#f97316",
    dmUnreadCount: 0,
  },
  {
    id: "user-you",
    displayName: "You",
    handle: "you",
    initials: "YO",
    role: "Workspace Owner",
    status: "online",
    statusLabel: "Building",
    accentColor: "#e11d48",
    dmUnreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "msg-001",
    channelId: MOCK_CHANNEL_ID,
    authorId: "user-taejun",
    body:
      "Can we lock today's beta narrative around faster handoffs? The customer notes keep circling back to fewer status meetings.",
    createdAt: "2026-04-29T00:12:00.000Z",
    reactions: [
      { symbol: "+1", label: "Approved", count: 4, reactedByCurrentUser: true },
      { symbol: "ship", label: "Ship it", count: 2 },
    ],
    replyCount: 3,
  },
  {
    id: "msg-002",
    channelId: MOCK_CHANNEL_ID,
    authorId: "user-mina",
    body:
      "I updated the invite flow audit. Workspace naming is still the top friction point, followed by unclear channel defaults.",
    createdAt: "2026-04-29T00:14:00.000Z",
    reactions: [{ symbol: "eye", label: "Watching", count: 3 }],
  },
  {
    id: "msg-003",
    channelId: MOCK_CHANNEL_ID,
    authorId: "user-jun",
    body:
      "I added a seeded demo workspace for tomorrow's review so we can walk through the path without waiting on production data.",
    createdAt: "2026-04-29T00:17:00.000Z",
    reactions: [{ symbol: "clean", label: "Clean", count: 5 }],
    isEdited: true,
  },
  {
    id: "msg-004",
    channelId: MOCK_CHANNEL_ID,
    authorId: "user-hana",
    body:
      "Customer-facing copy looks neutral enough for a first prototype. I would keep the sidebar dense and let the chat remain the main object.",
    createdAt: "2026-04-29T00:21:00.000Z",
    reactions: [],
  },
  {
    id: "msg-005",
    channelId: MOCK_CHANNEL_ID,
    authorId: "user-you",
    body:
      "Great. I will collect the open questions and turn them into a short decision list before the review.",
    createdAt: "2026-04-29T00:24:00.000Z",
    reactions: [{ symbol: "done", label: "Done", count: 1 }],
  },
  {
    id: "msg-006",
    channelId: "channel-design-review",
    authorId: "user-mina",
    body:
      "The message hover state should stay subtle. A full card treatment makes the timeline feel too heavy.",
    createdAt: "2026-04-29T00:18:00.000Z",
    reactions: [{ symbol: "+1", label: "Approved", count: 6 }],
  },
  {
    id: "msg-007",
    channelId: "channel-eng-ops",
    authorId: "user-jun",
    body:
      "Preview deploy is healthy. The only watch item is keeping release notes synced with the onboarding checklist.",
    createdAt: "2026-04-29T00:19:00.000Z",
    reactions: [],
  },
  {
    id: "msg-008",
    channelId: "channel-launch-room",
    authorId: "user-taejun",
    body:
      "Please keep the launch notes private until the beta cohort list is final.",
    createdAt: "2026-04-29T00:20:00.000Z",
    reactions: [{ symbol: "lock", label: "Private", count: 2 }],
  },
];

function cloneSnapshot(channelId: string): ChannelChatSnapshot {
  const activeChannel =
    mockChannels.find((channel) => channel.id === channelId) ?? mockChannels[0];

  return {
    workspace: { ...mockWorkspace },
    channel: { ...activeChannel },
    channels: mockChannels.map((channel) => ({ ...channel })),
    currentUserId: "user-you",
    participants: mockUsers.map((user) => ({ ...user })),
    messages: mockMessages.map((message) => ({
      ...message,
      reactions: message.reactions.map((reaction) => ({ ...reaction })),
    })),
  };
}

export const mockChannelChatRepository: ChannelChatRepository = {
  async getChannelChat(channelId) {
    if (!mockChannels.some((channel) => channel.id === channelId)) {
      throw new Error(`Unknown mock channel: ${channelId}`);
    }

    return cloneSnapshot(channelId);
  },
};
