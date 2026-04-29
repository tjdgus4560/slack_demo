import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

function mapWorkspace(workspace: Doc<"workspaces">) {
  return {
    id: workspace._id,
    name: workspace.name,
    initials: workspace.initials,
    plan: workspace.plan,
    tagline: workspace.tagline,
    activeMembers: workspace.activeMembers,
    unreadCount: workspace.unreadCount,
  };
}

function mapChannel(channel: Doc<"channels">) {
  return {
    id: channel._id,
    name: channel.name,
    topic: channel.topic,
    description: channel.description,
    kind: channel.kind,
    memberCount: channel.memberCount,
    unreadCount: channel.unreadCount,
    isFavorite: channel.isFavorite,
  };
}

function mapUser(user: Doc<"users">) {
  return {
    id: user._id,
    displayName: user.displayName,
    handle: user.handle,
    initials: user.initials,
    role: user.role,
    status: user.status,
    statusLabel: user.statusLabel,
    accentColor: user.accentColor,
    dmUnreadCount: user.dmUnreadCount,
  };
}

function mapMessage(message: Doc<"messages">) {
  return {
    id: message._id,
    channelId: message.channelId,
    authorId: message.authorId,
    body: message.body,
    createdAt: message.createdAt,
    reactions: message.reactions,
    replyCount: message.replyCount,
    isEdited: message.isEdited,
  };
}

export const getSnapshot = query({
  args: {
    workspaceSlug: v.string(),
    channelId: v.optional(v.string()),
    refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", args.workspaceSlug))
      .first();

    if (!workspace) {
      return null;
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id))
      .collect();

    const sortedChannels = channels.sort((left, right) =>
      left.name.localeCompare(right.name),
    );

    const requestedChannelId = args.channelId
      ? ctx.db.normalizeId("channels", args.channelId)
      : null;
    const requestedChannel = requestedChannelId
      ? await ctx.db.get(requestedChannelId)
      : null;
    const activeChannel =
      requestedChannel?.workspaceId === workspace._id
        ? requestedChannel
        : sortedChannels[0];

    if (!activeChannel) {
      return null;
    }

    const identity = await ctx.auth.getUserIdentity();
    const currentUser = identity
      ? await ctx.db
          .query("users")
          .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
          .first()
      : null;

    const workspaceMembers = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id))
      .collect();

    const participants = (
      await Promise.all(
        workspaceMembers.map((member) => ctx.db.get(member.userId)),
      )
    )
      .filter((user): user is Doc<"users"> => user !== null)
      .sort((left, right) => left.displayName.localeCompare(right.displayName));

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel_createdAt", (q) =>
        q.eq("channelId", activeChannel._id),
      )
      .collect();

    return {
      workspace: mapWorkspace(workspace),
      channel: mapChannel(activeChannel),
      channels: sortedChannels.map(mapChannel),
      currentUserId: currentUser?._id,
      participants: participants.map(mapUser),
      messages: messages.map(mapMessage),
    };
  },
});

export const sendMessage = mutation({
  args: {
    channelId: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const body = args.body.trim();

    if (!body) {
      throw new ConvexError("Message body cannot be empty.");
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be signed in to send messages.");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .first();

    if (!currentUser) {
      throw new ConvexError("Current user has not been synced yet.");
    }

    const channelId = ctx.db.normalizeId("channels", args.channelId);

    if (!channelId) {
      throw new ConvexError("Unknown channel.");
    }

    const channel = await ctx.db.get(channelId);

    if (!channel) {
      throw new ConvexError("Unknown channel.");
    }

    const membership = await ctx.db
      .query("channelMembers")
      .withIndex("by_channel_user", (q) =>
        q.eq("channelId", channel._id).eq("userId", currentUser._id),
      )
      .first();

    if (!membership) {
      throw new ConvexError("You are not a member of this channel.");
    }

    await ctx.db.insert("messages", {
      channelId: channel._id,
      authorId: currentUser._id as Id<"users">,
      body,
      createdAt: new Date().toISOString(),
      reactions: [],
    });
  },
});
