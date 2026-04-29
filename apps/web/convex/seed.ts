import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const workspaceSeed = {
  seedKey: "workspace-monorepo",
  slug: "monorepo-labs",
  name: "모노레포 랩스",
  initials: "ML",
  plan: "디자인 파트너",
  tagline: "제품, 디자인, 엔지니어링이 하나의 흐름으로 움직이는 워크스페이스입니다.",
  activeMembers: 18,
  unreadCount: 14,
};

const channelSeeds = [
  {
    seedKey: "channel-product-lab",
    slug: "product-lab",
    name: "제품-랩",
    topic: "출시 계획, 제품 의사결정, 고객 신호를 함께 정리합니다.",
    description:
      "출시 방향과 고객 신호를 집중적으로 다루는 공간입니다.",
    kind: "public" as const,
    memberCount: 12,
    unreadCount: 3,
    isFavorite: true,
  },
  {
    seedKey: "channel-design-review",
    slug: "design-review",
    name: "디자인-리뷰",
    topic: "인터페이스 리뷰와 상호작용 완성도를 점검합니다.",
    description: "화면, 상태, 문구, 디자인 QA를 함께 검토합니다.",
    kind: "public" as const,
    memberCount: 8,
    unreadCount: 6,
  },
  {
    seedKey: "channel-eng-ops",
    slug: "eng-ops",
    name: "엔지니어링-운영",
    topic: "빌드 상태, 릴리스, 로컬 개발 메모를 공유합니다.",
    description: "엔지니어링 운영과 프로젝트 위생을 관리합니다.",
    kind: "public" as const,
    memberCount: 15,
    unreadCount: 0,
  },
  {
    seedKey: "channel-launch-room",
    slug: "launch-room",
    name: "출시-룸",
    topic: "비공개 출시 체크리스트와 최종 승인을 관리합니다.",
    description: "막바지 릴리스 결정을 빠르게 정리하는 비공개 공간입니다.",
    kind: "private" as const,
    memberCount: 5,
    unreadCount: 5,
  },
];

const userSeeds = [
  {
    seedKey: "user-taejun",
    displayName: "김태준",
    handle: "taejun",
    initials: "김태",
    role: "제품 리드",
    status: "online" as const,
    statusLabel: "범위 검토 중",
    accentColor: "#7c3aed",
    dmUnreadCount: 2,
  },
  {
    seedKey: "user-mina",
    displayName: "박미나",
    handle: "mina",
    initials: "박미",
    role: "프로덕트 디자인",
    status: "focus" as const,
    statusLabel: "집중 모드",
    accentColor: "#06b6d4",
    dmUnreadCount: 0,
  },
  {
    seedKey: "user-jun",
    displayName: "서준",
    handle: "jun",
    initials: "서준",
    role: "프론트엔드",
    status: "away" as const,
    statusLabel: "곧 돌아옵니다",
    accentColor: "#22c55e",
    dmUnreadCount: 1,
  },
  {
    seedKey: "user-hana",
    displayName: "이하나",
    handle: "hana",
    initials: "이하",
    role: "고객 운영",
    status: "online" as const,
    statusLabel: "워크스페이스에 있음",
    accentColor: "#f97316",
    dmUnreadCount: 0,
  },
  {
    seedKey: "user-seed-owner",
    displayName: "시드 관리자",
    handle: "seed-owner",
    initials: "시드",
    role: "워크스페이스 소유자",
    status: "online" as const,
    statusLabel: "작업 중",
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
      "오늘 베타 내러티브를 더 빠른 인수인계에 맞춰 확정할 수 있을까요? 고객 메모가 계속 상태 회의를 줄이고 싶다는 쪽으로 모이고 있어요.",
    createdAt: "2026-04-29T00:12:00.000Z",
    reactions: [
      { symbol: "+1", label: "승인", count: 4 },
      { symbol: "ship", label: "출시하자", count: 2 },
    ],
    replyCount: 3,
  },
  {
    seedKey: "msg-002",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-mina",
    body:
      "초대 플로우 점검 내용을 업데이트했습니다. 워크스페이스 이름 지정이 여전히 가장 큰 마찰 지점이고, 그다음은 기본 채널 설정이 불명확한 부분입니다.",
    createdAt: "2026-04-29T00:14:00.000Z",
    reactions: [{ symbol: "eye", label: "확인 중", count: 3 }],
  },
  {
    seedKey: "msg-003",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-jun",
    body:
      "내일 리뷰를 위해 seed된 데모 워크스페이스를 추가했습니다. production 데이터를 기다리지 않고 전체 흐름을 같이 볼 수 있어요.",
    createdAt: "2026-04-29T00:17:00.000Z",
    reactions: [{ symbol: "clean", label: "깔끔함", count: 5 }],
    isEdited: true,
  },
  {
    seedKey: "msg-004",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-hana",
    body:
      "고객용 문구는 첫 프로토타입 기준으로 충분히 중립적으로 보입니다. 사이드바는 촘촘하게 유지하고, 대화 영역이 중심이 되게 두면 좋겠습니다.",
    createdAt: "2026-04-29T00:21:00.000Z",
    reactions: [],
  },
  {
    seedKey: "msg-005",
    channelSeedKey: "channel-product-lab",
    authorSeedKey: "user-seed-owner",
    body:
      "좋습니다. 열려 있는 질문을 모아서 리뷰 전까지 짧은 의사결정 목록으로 정리하겠습니다.",
    createdAt: "2026-04-29T00:24:00.000Z",
    reactions: [{ symbol: "done", label: "완료", count: 1 }],
  },
  {
    seedKey: "msg-006",
    channelSeedKey: "channel-design-review",
    authorSeedKey: "user-mina",
    body:
      "메시지 마우스 오버 상태는 은은하게 유지하는 편이 좋겠습니다. 전체 카드처럼 보이면 타임라인이 너무 무거워집니다.",
    createdAt: "2026-04-29T00:18:00.000Z",
    reactions: [{ symbol: "+1", label: "승인", count: 6 }],
  },
  {
    seedKey: "msg-007",
    channelSeedKey: "channel-eng-ops",
    authorSeedKey: "user-jun",
    body:
      "Preview 배포는 정상입니다. 남은 체크 포인트는 릴리스 노트와 온보딩 체크리스트를 계속 맞춰 두는 것입니다.",
    createdAt: "2026-04-29T00:19:00.000Z",
    reactions: [],
  },
  {
    seedKey: "msg-008",
    channelSeedKey: "channel-launch-room",
    authorSeedKey: "user-taejun",
    body:
      "베타 그룹 목록이 확정될 때까지 출시 노트는 비공개로 유지해 주세요.",
    createdAt: "2026-04-29T00:20:00.000Z",
    reactions: [{ symbol: "lock", label: "비공개", count: 2 }],
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
