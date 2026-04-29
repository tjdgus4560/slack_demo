"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { ChannelId } from "../domain";
import type { ChannelChatSnapshot } from "./ports";

const DEFAULT_WORKSPACE_SLUG = "monorepo-labs";
const WORKSPACE_LOAD_TIMEOUT_MS = 10000;

function getErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : "문제가 발생했습니다.";

  if (
    message.includes("You must be signed in to sync a user") ||
    message.includes("Current user has not been synced yet") ||
    message.includes("사용자 동기화를 하려면 로그인해야 합니다") ||
    message.includes("현재 사용자가 아직 동기화되지 않았습니다") ||
    message.includes("users:ensureCurrentUser")
  ) {
    return "Clerk는 로드됐지만 Convex가 유효한 Clerk JWT를 받지 못했습니다. Clerk에 \"convex\" JWT 템플릿이 있고 Convex의 CLERK_JWT_ISSUER_DOMAIN이 일치하는지 확인해 주세요.";
  }

  return message;
}

export function useChannelChat() {
  const { isLoaded, isSignedIn, user } = useUser();
  const convexAuth = useConvexAuth();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const sendMessageMutation = useMutation(api.channelChat.sendMessage);
  const [activeChannelId, setActiveChannelId] = useState<ChannelId | null>(null);
  const [draft, setDraft] = useState("");
  const [syncedUserKey, setSyncedUserKey] = useState<string | null>(null);
  const [pendingUserKey, setPendingUserKey] = useState<string | null>(null);
  const [failedUserKey, setFailedUserKey] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const [timedOutWorkspaceLoadKey, setTimedOutWorkspaceLoadKey] = useState<
    string | null
  >(null);
  const [previousSnapshot, setPreviousSnapshot] =
    useState<ChannelChatSnapshot | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);
  const [sendErrorMessage, setSendErrorMessage] = useState<string | null>(null);

  const clerkUserSyncKey =
    isSignedIn && user
      ? [
          user.id,
          user.fullName ?? "",
          user.primaryEmailAddress?.emailAddress ?? "",
          user.username ?? "",
        ].join(":")
      : null;

  const isEnsuringCurrentUser =
    clerkUserSyncKey !== null && pendingUserKey === clerkUserSyncKey;
  const canQuerySnapshot =
    isLoaded && isSignedIn && convexAuth.isAuthenticated;
  const convexAuthErrorMessage =
    isLoaded &&
    isSignedIn &&
    !convexAuth.isLoading &&
    !convexAuth.isAuthenticated
      ? 'Clerk 로그인은 완료됐지만 Convex가 유효한 Clerk JWT를 받지 못했습니다. Clerk에 "convex" JWT 템플릿이 있고 Convex의 CLERK_JWT_ISSUER_DOMAIN이 일치하는지 확인해 주세요.'
      : null;

  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn ||
      !user ||
      convexAuth.isLoading ||
      !convexAuth.isAuthenticated ||
      !clerkUserSyncKey ||
      syncedUserKey === clerkUserSyncKey ||
      pendingUserKey === clerkUserSyncKey ||
      failedUserKey === clerkUserSyncKey
    ) {
      return;
    }

    let isCancelled = false;
    const currentUser = {
      workspaceSlug: DEFAULT_WORKSPACE_SLUG,
      ...(user.fullName ? { displayName: user.fullName } : {}),
      ...(user.primaryEmailAddress?.emailAddress
        ? { email: user.primaryEmailAddress.emailAddress }
        : {}),
      ...(user.username ? { username: user.username } : {}),
    };

    Promise.resolve()
      .then(async () => {
        if (isCancelled) {
          return;
        }

        setPendingUserKey(clerkUserSyncKey);
        setFailedUserKey(null);
        setSyncErrorMessage(null);
        await ensureCurrentUser(currentUser);

        if (!isCancelled) {
          setSyncedUserKey(clerkUserSyncKey);
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          setFailedUserKey(clerkUserSyncKey);
          setSyncErrorMessage(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setPendingUserKey((currentPendingUserKey) =>
            currentPendingUserKey === clerkUserSyncKey ? null : currentPendingUserKey,
          );
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [
    ensureCurrentUser,
    clerkUserSyncKey,
    convexAuth.isAuthenticated,
    convexAuth.isLoading,
    failedUserKey,
    isLoaded,
    isSignedIn,
    pendingUserKey,
    syncedUserKey,
    user,
    user?.fullName,
    user?.primaryEmailAddress?.emailAddress,
    user?.username,
  ]);

  const snapshot = useQuery(
    api.channelChat.getSnapshot,
    canQuerySnapshot
      ? {
          workspaceSlug: DEFAULT_WORKSPACE_SLUG,
          refreshKey: retryNonce,
          ...(activeChannelId ? { channelId: activeChannelId } : {}),
        }
      : "skip",
  );

  const normalizedSnapshot = snapshot as ChannelChatSnapshot | null | undefined;

  useEffect(() => {
    if (!normalizedSnapshot) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousSnapshot(normalizedSnapshot);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [normalizedSnapshot]);

  const visibleSnapshot =
    normalizedSnapshot === undefined
      ? previousSnapshot
      : normalizedSnapshot;
  const activeChannel = activeChannelId
    ? (visibleSnapshot?.channels.find(
        (channel) => channel.id === activeChannelId,
      ) ?? visibleSnapshot?.channel)
    : visibleSnapshot?.channel;

  const participantsById = useMemo(
    () =>
      new Map(
        (visibleSnapshot?.participants ?? []).map((participant) => [
          participant.id,
          participant,
        ]),
      ),
    [visibleSnapshot?.participants],
  );

  const currentUser = visibleSnapshot?.currentUserId
    ? participantsById.get(visibleSnapshot.currentUserId)
    : undefined;

  const isSnapshotLoading =
    canQuerySnapshot && normalizedSnapshot === undefined;
  const isWorkspaceLoading =
    !isLoaded || convexAuth.isLoading || isSnapshotLoading;
  const workspaceLoadKey = isWorkspaceLoading
    ? [activeChannelId ?? "", clerkUserSyncKey ?? "", retryNonce].join(":")
    : null;
  const hasWorkspaceLoadTimedOut =
    workspaceLoadKey !== null && timedOutWorkspaceLoadKey === workspaceLoadKey;
  const loadingErrorMessage = hasWorkspaceLoadTimedOut
    ? "Convex 인증 또는 워크스페이스 로딩이 예상보다 오래 걸리고 있습니다. 연결을 다시 시도하거나 로그아웃 후 다시 로그인해 주세요."
    : null;
  const isInitialLoading =
    !visibleSnapshot && isWorkspaceLoading && !hasWorkspaceLoadTimedOut;
  const isRefreshing =
    Boolean(visibleSnapshot) && isSnapshotLoading && !hasWorkspaceLoadTimedOut;
  const canShowActiveMessages =
    Boolean(activeChannel && visibleSnapshot?.channel.id === activeChannel.id);
  const syncStatusMessage = isEnsuringCurrentUser
    ? "Clerk 계정을 Convex와 동기화하는 중입니다."
    : null;

  useEffect(() => {
    if (!workspaceLoadKey) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimedOutWorkspaceLoadKey(workspaceLoadKey);
    }, WORKSPACE_LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [workspaceLoadKey]);

  function selectChannel(channelId: ChannelId) {
    setActiveChannelId(channelId);
    setDraft("");
  }

  async function sendMessage() {
    const body = draft.trim();

    if (!currentUser || !activeChannel || !body || isSending) {
      return;
    }

    setIsSending(true);
    setSendErrorMessage(null);

    try {
      await sendMessageMutation({
        channelId: activeChannel.id,
        body,
      });
      setDraft("");
    } catch (error) {
      setSendErrorMessage(getErrorMessage(error));
    } finally {
      setIsSending(false);
    }
  }

  function retryConnection() {
    setSyncedUserKey(null);
    setPendingUserKey(null);
    setFailedUserKey(null);
    setSyncErrorMessage(null);
    setSendErrorMessage(null);
    setTimedOutWorkspaceLoadKey(null);
    setRetryNonce((currentRetryNonce) => currentRetryNonce + 1);
  }

  return {
    activeChannelId: activeChannelId ?? activeChannel?.id ?? "",
    canSendMessage: Boolean(currentUser),
    channel: activeChannel,
    channels: visibleSnapshot?.channels ?? [],
    currentUser,
    draft,
    errorMessage:
      sendErrorMessage ??
      syncErrorMessage ??
      convexAuthErrorMessage ??
      loadingErrorMessage,
    isInitialLoading,
    isReady: Boolean(visibleSnapshot),
    isRefreshing,
    isSending,
    isTimedOut: hasWorkspaceLoadTimedOut,
    messages: canShowActiveMessages ? (visibleSnapshot?.messages ?? []) : [],
    participantsById,
    retryConnection,
    selectChannel,
    setDraft,
    sendMessage,
    statusMessage: syncStatusMessage,
    workspace: visibleSnapshot?.workspace,
  };
}
