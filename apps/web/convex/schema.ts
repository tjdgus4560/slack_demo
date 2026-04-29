import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const userStatus = v.union(
  v.literal("online"),
  v.literal("away"),
  v.literal("focus"),
  v.literal("offline"),
);

const channelKind = v.union(v.literal("public"), v.literal("private"));

const reaction = v.object({
  symbol: v.string(),
  label: v.string(),
  count: v.number(),
  reactedByCurrentUser: v.optional(v.boolean()),
});

export default defineSchema({
  workspaces: defineTable({
    slug: v.string(),
    name: v.string(),
    initials: v.string(),
    plan: v.string(),
    tagline: v.string(),
    activeMembers: v.number(),
    unreadCount: v.number(),
    seedKey: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_seedKey", ["seedKey"]),

  users: defineTable({
    externalId: v.optional(v.string()),
    displayName: v.string(),
    handle: v.string(),
    initials: v.string(),
    role: v.string(),
    status: userStatus,
    statusLabel: v.string(),
    accentColor: v.string(),
    dmUnreadCount: v.number(),
    seedKey: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_seedKey", ["seedKey"]),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
    seedKey: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_user", ["userId"])
    .index("by_workspace_user", ["workspaceId", "userId"])
    .index("by_seedKey", ["seedKey"]),

  channels: defineTable({
    workspaceId: v.id("workspaces"),
    slug: v.string(),
    name: v.string(),
    topic: v.string(),
    description: v.string(),
    kind: channelKind,
    memberCount: v.number(),
    unreadCount: v.number(),
    isFavorite: v.optional(v.boolean()),
    seedKey: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_slug", ["workspaceId", "slug"])
    .index("by_seedKey", ["seedKey"]),

  channelMembers: defineTable({
    channelId: v.id("channels"),
    userId: v.id("users"),
    seedKey: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_channel", ["channelId"])
    .index("by_user", ["userId"])
    .index("by_channel_user", ["channelId", "userId"])
    .index("by_seedKey", ["seedKey"]),

  messages: defineTable({
    channelId: v.id("channels"),
    authorId: v.id("users"),
    body: v.string(),
    createdAt: v.string(),
    reactions: v.array(reaction),
    replyCount: v.optional(v.number()),
    isEdited: v.optional(v.boolean()),
    seedKey: v.optional(v.string()),
  })
    .index("by_channel_createdAt", ["channelId", "createdAt"])
    .index("by_seedKey", ["seedKey"]),
});
