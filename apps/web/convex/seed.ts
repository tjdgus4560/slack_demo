import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const workspaceSeed = {
  seedKey: "workspace-monorepo",
  slug: "monorepo-labs",
  name: "Monorepo Labs",
  initials: "ML",
  plan: "Design Partner",
  tagline: "Product, design, and engineering in one focused loop.",
  activeMembers: 18,
  unreadCount: 14,
};

const channelSeeds = [
  {
    seedKey: "channel-product-lab",
    slug: "product-lab",
    name: "product-lab",
    topic: "Launch planning, product decisions, and customer signal.",
    description:
      "A focused room for shaping launch decisions and customer signal.",
    kind: "public" as const,
    memberCount: 12,
    unreadCount: 3,
    isFavorite: true,
  },
  {
    seedKey: "channel-design-review",
    slug: "design-review",
    name: "design-review",
    topic: "Interface critique and interaction polish.",
    description: "Screens, states, copy, and design QA.",
    kind: "public" as const,
    memberCount: 8,
    unreadCount: 6,
  },
  {
    seedKey: "channel-eng-ops",
    slug: "eng-ops",
    name: "eng-ops",
    topic: "Build health, releases, and local development notes.",
    description: "Engineering operations and project hygiene.",
    kind: "public" as const,
    memberCount: 15,
    unreadCount: 0,
  },
  {
    seedKey: "channel-launch-room",
    slug: "launch-room",
    name: "launch-room",
    topic: "Private launch checklist and final approvals.",
    description: "A compact room for last-mile release calls.",
    kind: "private" as const,
    memberCount: 5,
    unreadCount: 5,
  },
];

const userSeeds = [
  {
    seedKey: "user-taejun",
    displayName: "Taejun Kim",
    handle: "taejun",
    initials: "TK",
    role: "Product Lead",
    status: "online" as const,
    statusLabel: "Reviewing scope",
    accentColor: "#7c3aed",
    dmUnreadCount: 2,
  },
  {
    seedKey: "user-mina",
    displayName: "Mina Park",
    handle: "mina",
    initials: "MP",
    role: "Product Design",
    status: "focus" as const,
    statusLabel: "Focus mode",
    accentColor: "#06b6d4",
    dmUnreadCount: 0,
  },
  {
    seedKey: "user-jun",
    displayName: "Jun Seo",
    handle: "jun",
    initials: "JS",
    role: "Frontend",
    status: "away" as const,
    statusLabel: "Back soon",
    accentColor: "#22c55e",
    dmUnreadCount: 1,
  },
  {
    seedKey: "user-hana",
    displayName: "Hana Lee",
    handle: "hana",
    initials: "HL",
    role: "Customer Ops",
    status: "online" as const,
    statusLabel: "In workspace",
    accentColor: "#f97316",
    dmUnreadCount: 0,
  },
  {
    seedKey: "user-seed-owner",
    displayName: "Seed Owner",
    handle: "seed-owner",
    initials: "SO",
    role: "Workspace Owner",
    status: "online" as const,
    statusLabel: "Building",
    accentColor: "#e11d48",
    dmUnreadCount: 0,
  },
];

const messageSeeds = [
  {
    seedKey: "msg-001",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-taejun",
    body:
      "Can we lock today's beta narrative around faster handoffs? The customer notes keep circling back to fewer status meetings.",
    createdAt: "2026-04-29T00:12:00.000Z",
    reactions: [
      { symbol: "+1", label: "Approved", count: 4 },
      { symbol: "ship", label: "Ship it", count: 2 },
    ],
    replyCount: 3,
  },
  {
    seedKey: "msg-002",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-mina",
    body:
      "I updated the invite flow audit. Workspace naming is still the top friction point, followed by unclear channel defaults.",
    createdAt: "2026-04-29T00:14:00.000Z",
    reactions: [{ symbol: "eye", label: "Watching", count: 3 }],
  },
  {
    seedKey: "msg-003",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-jun",
    body:
      "I added a seeded demo workspace for tomorrow's review so we can walk through the path without waiting on production data.",
    createdAt: "2026-04-29T00:17:00.000Z",
    reactions: [{ symbol: "clean", label: "Clean", count: 5 }],
    isEdited: true,
  },
  {
    seedKey: "msg-004",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-hana",
    body:
      "Customer-facing copy looks neutral enough for a first prototype. I would keep the sidebar dense and let the chat remain the main object.",
    createdAt: "2026-04-29T00:21:00.000Z",
    reactions: [],
  },
  {
    seedKey: "msg-005",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-seed-owner",
    body:
      "Great. I will collect the open questions and turn them into a short decision list before the review.",
    createdAt: "2026-04-29T00:24:00.000Z",
    reactions: [{ symbol: "done", label: "Done", count: 1 }],
  },
  {
    seedKey: "msg-006",
    channelSeedKey: "channel-design-review",
    authorSeedKey: "user-mina",
    body:
      "The message hover state should stay subtle. A full card treatment makes the timeline feel too heavy.",
    createdAt: "2026-04-29T00:18:00.000Z",
    reactions: [{ symbol: "+1", label: "Approved", count: 6 }],
  },
  {
    seedKey: "msg-007",
    channelSeedKey: "channel-eng-ops",
    authorSeedKey: "user-jun",
    body:
      "Preview deploy is healthy. The only watch item is keeping release notes synced with the onboarding checklist.",
    createdAt: "2026-04-29T00:19:00.000Z",
    reactions: [],
  },
  {
    seedKey: "msg-008",
    channelSeedKey: "channel-launch-room",
    authorSeedKey: "user-taejun",
    body:
      "Please keep the launch notes private until the beta cohort list is final.",
    createdAt: "2026-04-29T00:20:00.000Z",
    reactions: [{ symbol: "lock", label: "Private", count: 2 }],
  },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const existingWorkspace = await ctx.db
      .query("workspaces")
      .withIndex("by_seedKey", (q) => q.eq("seedKey", workspaceSeed.seedKey))
      .first();

    const workspaceId = existingWorkspace
      ? existingWorkspace._id
      : await ctx.db.insert("workspaces", {
          ...workspaceSeed,
          createdAt: now,
          updatedAt: now,
        });

    if (existingWorkspace) {
      await ctx.db.patch(existingWorkspace._id, {
        ...workspaceSeed,
        updatedAt: now,
      });
    }

    const userIdsBySeedKey = new Map<string, Id<"users">>();
    for (const userSeed of userSeeds) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_seedKey", (q) => q.eq("seedKey", userSeed.seedKey))
        .first();
      const userId = existingUser
        ? existingUser._id
        : await ctx.db.insert("users", {
            ...userSeed,
            createdAt: now,
            updatedAt: now,
          });

      if (existingUser) {
        await ctx.db.patch(existingUser._id, {
          ...userSeed,
          updatedAt: now,
        });
      }

      userIdsBySeedKey.set(userSeed.seedKey, userId);

      const workspaceMemberSeedKey = `${workspaceSeed.seedKey}:${userSeed.seedKey}`;
      const existingWorkspaceMember = await ctx.db
        .query("workspaceMembers")
        .withIndex("by_seedKey", (q) => q.eq("seedKey", workspaceMemberSeedKey))
        .first();

      if (existingWorkspaceMember) {
        await ctx.db.patch(existingWorkspaceMember._id, {
          workspaceId,
          userId,
          role: userSeed.role,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("workspaceMembers", {
          workspaceId,
          userId,
          role: userSeed.role,
          seedKey: workspaceMemberSeedKey,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    const channelIdsBySeedKey = new Map<string, Id<"channels">>();
    for (const channelSeed of channelSeeds) {
      const existingChannel = await ctx.db
        .query("channels")
        .withIndex("by_seedKey", (q) => q.eq("seedKey", channelSeed.seedKey))
        .first();
      const channelId = existingChannel
        ? existingChannel._id
        : await ctx.db.insert("channels", {
            ...channelSeed,
            workspaceId,
            createdAt: now,
            updatedAt: now,
          });

      if (existingChannel) {
        await ctx.db.patch(existingChannel._id, {
          ...channelSeed,
          workspaceId,
          updatedAt: now,
        });
      }

      channelIdsBySeedKey.set(channelSeed.seedKey, channelId);

      for (const [userSeedKey, userId] of userIdsBySeedKey) {
        const channelMemberSeedKey = `${channelSeed.seedKey}:${userSeedKey}`;
        const existingChannelMember = await ctx.db
          .query("channelMembers")
          .withIndex("by_seedKey", (q) => q.eq("seedKey", channelMemberSeedKey))
          .first();

        if (existingChannelMember) {
          await ctx.db.patch(existingChannelMember._id, {
            channelId,
            userId,
            updatedAt: now,
          });
        } else {
          await ctx.db.insert("channelMembers", {
            channelId,
            userId,
            seedKey: channelMemberSeedKey,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    for (const messageSeed of messageSeeds) {
      const channelId = channelIdsBySeedKey.get(messageSeed.channelSeedKey);
      const authorId = userIdsBySeedKey.get(messageSeed.authorSeedKey);

      if (!channelId || !authorId) {
        continue;
      }

      const existingMessage = await ctx.db
        .query("messages")
        .withIndex("by_seedKey", (q) => q.eq("seedKey", messageSeed.seedKey))
        .first();

      const message = {
        channelId,
        authorId,
        body: messageSeed.body,
        createdAt: messageSeed.createdAt,
        reactions: messageSeed.reactions,
        replyCount: messageSeed.replyCount,
        isEdited: messageSeed.isEdited,
        seedKey: messageSeed.seedKey,
      };

      if (existingMessage) {
        await ctx.db.patch(existingMessage._id, message);
      } else {
        await ctx.db.insert("messages", message);
      }
    }

    return {
      workspace: workspaceId,
      users: userIdsBySeedKey.size,
      channels: channelIdsBySeedKey.size,
      messages: messageSeeds.length,
    };
  },
});
