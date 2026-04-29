import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const DEFAULT_ROLE = "워크스페이스 소유자";
const DEFAULT_WORKSPACE_SLUG = "monorepo-labs";

function getEmailHandle(email?: string | null) {
  return email?.split("@")[0]?.trim() || null;
}

function getDisplayName({
  displayName,
  email,
  username,
}: {
  displayName?: string;
  email?: string;
  username?: string;
}) {
  return (
    displayName?.trim() ||
    username?.trim() ||
    getEmailHandle(email) ||
    "나"
  );
}

function getHandle({
  displayName,
  email,
  username,
}: {
  displayName?: string;
  email?: string;
  username?: string;
}) {
  const handle = (
    username?.trim() ||
    getEmailHandle(email) ||
    getDisplayName({ displayName, email, username })
  )
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return handle || "user";
}

function getInitials(displayName: string) {
  const nameParts = displayName.split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return "나";
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
}

export const ensureCurrentUser = mutation({
  args: {
    workspaceSlug: v.optional(v.string()),
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("사용자 동기화를 하려면 로그인해야 합니다.");
    }

    const workspaceSlug = args.workspaceSlug ?? DEFAULT_WORKSPACE_SLUG;
    const workspace = await ctx.db
      .query("workspaces")
      .withIndex("by_slug", (q) => q.eq("slug", workspaceSlug))
      .first();

    if (!workspace) {
      throw new ConvexError("로그인 전에 기본 워크스페이스를 seed해 주세요.");
    }

    const displayName = getDisplayName(args);
    const now = new Date().toISOString();
    const userPatch = {
      externalId: identity.subject,
      displayName,
      handle: getHandle(args),
      initials: getInitials(displayName),
      role: DEFAULT_ROLE,
      status: "online" as const,
      statusLabel: "작업 중",
      accentColor: "#e11d48",
      dmUnreadCount: 0,
      updatedAt: now,
    };

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .first();

    const userId = existingUser
      ? existingUser._id
      : await ctx.db.insert("users", {
          ...userPatch,
          createdAt: now,
        });

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userPatch);
    }

    const workspaceMembership = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", workspace._id).eq("userId", userId),
      )
      .first();

    if (!workspaceMembership) {
      await ctx.db.insert("workspaceMembers", {
        workspaceId: workspace._id,
        userId,
        role: DEFAULT_ROLE,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(workspaceMembership._id, {
        role: DEFAULT_ROLE,
        updatedAt: now,
      });
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", workspace._id))
      .collect();

    for (const channel of channels) {
      const channelMembership = await ctx.db
        .query("channelMembers")
        .withIndex("by_channel_user", (q) =>
          q.eq("channelId", channel._id).eq("userId", userId),
        )
        .first();

      if (!channelMembership) {
        await ctx.db.insert("channelMembers", {
          channelId: channel._id,
          userId: userId as Id<"users">,
          createdAt: now,
          updatedAt: now,
        });
      } else {
        await ctx.db.patch(channelMembership._id, {
          updatedAt: now,
        });
      }
    }

    return userId;
  },
});
