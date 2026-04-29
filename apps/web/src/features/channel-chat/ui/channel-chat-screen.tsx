"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  Show,
  useClerk,
} from "@clerk/nextjs";
import {
  AtSign,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Hash,
  Inbox,
  Lock,
  LogOut,
  MessageSquareText,
  MoreHorizontal,
  PanelRight,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Smile,
  SquarePen,
  Star,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { useChannelChat } from "../application";
import type { Channel, Message, User } from "../domain";
import type { ChannelChatSnapshot } from "../application";

function formatTime(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

function formatDateLabel(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(new Date(isoDate));
}

function getMessageDateKey(message: Message) {
  return message.createdAt.slice(0, 10);
}

function IconButton({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-zinc-100 ${className}`}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function AuthControls() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Show when="signed-out">
        <Link
          className="hidden h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-zinc-50 sm:inline-flex"
          href="/sign-in"
        >
          Log in
        </Link>
        <Link
          className="inline-flex h-8 items-center rounded-md bg-zinc-100 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-white"
          href="/sign-up"
        >
          Sign up
        </Link>
      </Show>
    </div>
  );
}

function PresenceDot({ status }: { status: User["status"] }) {
  const statusClassName = {
    away: "bg-amber-400",
    focus: "bg-cyan-400",
    offline: "bg-zinc-600",
    online: "bg-emerald-400",
  }[status];

  return (
    <span
      className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-[var(--linear-panel)] ${statusClassName}`}
    />
  );
}

function Avatar({ user }: { user?: User }) {
  return (
    <div
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
      style={{ backgroundColor: user?.accentColor ?? "#52525b" }}
    >
      {user?.initials ?? "?"}
      {user ? (
        <span className="absolute -bottom-0.5 -right-0.5">
          <PresenceDot status={user.status} />
        </span>
      ) : null}
    </div>
  );
}

function AccountMenu({ currentUser }: { currentUser?: User }) {
  const { openUserProfile, signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleManageAccount() {
    setIsOpen(false);
    openUserProfile();
  }

  async function handleSignOut() {
    setIsOpen(false);
    await signOut({ redirectUrl: "/sign-in" });
  }

  return (
    <div className="relative" ref={menuRef}>
      {isOpen ? (
        <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-md border border-white/10 bg-[var(--linear-panel-strong)] p-1 shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
          <button
            className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-zinc-50"
            onClick={handleManageAccount}
            type="button"
          >
            <UserCircle className="h-4 w-4 text-zinc-500" />
            <span className="min-w-0 flex-1 truncate">Manage account</span>
          </button>
          <button
            className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-zinc-300 transition hover:bg-white/[0.07] hover:text-zinc-50"
            onClick={() => void handleSignOut()}
            type="button"
          >
            <LogOut className="h-4 w-4 text-zinc-500" />
            <span className="min-w-0 flex-1 truncate">Sign out</span>
          </button>
        </div>
      ) : null}

      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex w-full items-center gap-3 rounded-md bg-white/[0.04] p-2 text-left transition hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        type="button"
      >
        <Avatar user={currentUser} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-100">
            {currentUser?.displayName ?? "Unknown"}
          </span>
          <span className="block truncate text-xs text-zinc-500">
            {currentUser?.statusLabel ?? "Offline"}
          </span>
        </span>
        <MoreHorizontal className="h-4 w-4 shrink-0 text-zinc-500" />
      </button>
    </div>
  );
}

function ChannelButton({
  active,
  channel,
  onSelect,
}: {
  active: boolean;
  channel: Channel;
  onSelect: (channelId: Channel["id"]) => void;
}) {
  const ChannelIcon = channel.kind === "private" ? Lock : Hash;

  return (
    <button
      aria-current={active ? "page" : undefined}
      className={`group flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition ${
        active
          ? "bg-white/[0.09] text-zinc-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
      }`}
      onClick={() => onSelect(channel.id)}
      type="button"
    >
      <ChannelIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
      {channel.unreadCount > 0 ? (
        <span
          className={`inline-flex min-w-5 justify-center rounded px-1.5 py-0.5 text-[11px] font-semibold ${
            active ? "bg-zinc-50 text-zinc-950" : "bg-violet-500 text-white"
          }`}
        >
          {channel.unreadCount}
        </span>
      ) : null}
    </button>
  );
}

function SidebarSection({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <div className="mb-2 flex h-7 items-center justify-between px-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          {title}
        </p>
        {action}
      </div>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function WorkspaceRail({ initials }: { initials: string }) {
  return (
    <aside className="hidden w-[72px] shrink-0 border-r border-white/10 bg-[#07080d] px-3 py-3 md:flex md:flex-col">
      <button
        aria-label="Open workspace"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-[0_12px_34px_rgba(124,58,237,0.32)]"
        title="Open workspace"
        type="button"
      >
        {initials}
      </button>
      <div className="mt-5 flex flex-1 flex-col items-center gap-2">
        <IconButton label="Threads">
          <MessageSquareText className="h-4 w-4" />
        </IconButton>
        <IconButton label="Inbox">
          <Inbox className="h-4 w-4" />
        </IconButton>
        <IconButton label="Activity">
          <Bell className="h-4 w-4" />
        </IconButton>
        <IconButton label="Search">
          <Search className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton label="Create">
          <Plus className="h-4 w-4" />
        </IconButton>
        <IconButton label="Settings">
          <Settings className="h-4 w-4" />
        </IconButton>
      </div>
    </aside>
  );
}

function WorkspaceSidebar({
  activeChannelId,
  channels,
  currentUser,
  directMessages,
  onSelectChannel,
  workspace,
}: {
  activeChannelId: Channel["id"];
  channels: Channel[];
  currentUser?: User;
  directMessages: User[];
  onSelectChannel: (channelId: Channel["id"]) => void;
  workspace: ChannelChatSnapshot["workspace"];
}) {
  return (
    <aside className="hidden w-[292px] shrink-0 border-r border-white/10 bg-[var(--linear-panel)] lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-4 py-3">
        <button
          className="flex h-10 w-full items-center justify-between rounded-md px-1.5 text-left transition hover:bg-white/[0.04]"
          type="button"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-zinc-50">
              {workspace.name}
            </span>
            <span className="block truncate text-xs text-zinc-500">
              {workspace.plan}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-5 grid grid-cols-2 gap-2">
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 text-sm text-zinc-300 transition hover:bg-white/[0.07]"
            type="button"
          >
            <Clock3 className="h-4 w-4 text-zinc-500" />
            Later
          </button>
          <button
            className="flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 text-sm text-zinc-300 transition hover:bg-white/[0.07]"
            type="button"
          >
            <AtSign className="h-4 w-4 text-zinc-500" />
            Mentions
          </button>
        </div>

        <SidebarSection
          action={
            <IconButton className="h-6 w-6 border-transparent bg-transparent" label="Add channel">
              <Plus className="h-3.5 w-3.5" />
            </IconButton>
          }
          title="Channels"
        >
          {channels.map((channel) => (
            <ChannelButton
              active={channel.id === activeChannelId}
              channel={channel}
              key={channel.id}
              onSelect={onSelectChannel}
            />
          ))}
        </SidebarSection>

        <div className="my-5 h-px bg-white/10" />

        <SidebarSection
          action={
            <IconButton className="h-6 w-6 border-transparent bg-transparent" label="New direct message">
              <SquarePen className="h-3.5 w-3.5" />
            </IconButton>
          }
          title="Direct messages"
        >
          {directMessages.map((user) => (
            <button
              className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm text-zinc-400 transition hover:bg-white/[0.05] hover:text-zinc-100"
              key={user.id}
              type="button"
            >
              <PresenceDot status={user.status} />
              <span className="min-w-0 flex-1 truncate">{user.displayName}</span>
              {user.dmUnreadCount > 0 ? (
                <span className="inline-flex min-w-5 justify-center rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-200">
                  {user.dmUnreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </SidebarSection>
      </div>

      <div className="border-t border-white/10 p-3">
        <AccountMenu currentUser={currentUser} />
      </div>
    </aside>
  );
}

function MessageList({
  isLoading,
  messages,
  participantsById,
}: {
  isLoading?: boolean;
  messages: Message[];
  participantsById: Map<User["id"], User>;
}) {
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex min-h-80 items-center justify-center px-6 text-center">
        <div>
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-zinc-600" />
          <p className="mt-3 text-sm font-medium text-zinc-300">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <div>
          <MessageSquareText className="mx-auto h-7 w-7 text-zinc-600" />
          <p className="mt-3 text-sm font-medium text-zinc-300">
            No messages yet.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Start the room with a short update.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading ? (
        <div className="sticky top-0 z-10 mb-3 flex justify-center">
          <div className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 bg-[var(--linear-panel-strong)] px-3 text-xs font-medium text-zinc-400 shadow-[0_12px_28px_rgba(0,0,0,0.26)]">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Loading messages...
          </div>
        </div>
      ) : null}
      <ol className="flex flex-col gap-1">
        {messages.map((message, index) => {
          const author = participantsById.get(message.authorId);
          const previousMessage = messages[index - 1];
          const showDate =
            !previousMessage ||
            getMessageDateKey(previousMessage) !== getMessageDateKey(message);

          return (
            <li key={message.id}>
              {showDate ? (
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <time
                    className="rounded-full border border-white/10 bg-[var(--linear-panel-strong)] px-3 py-1 text-xs font-medium text-zinc-400"
                    dateTime={message.createdAt}
                  >
                    {formatDateLabel(message.createdAt)}
                  </time>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              ) : null}

              <article className="group flex gap-3 rounded-md px-3 py-2.5 transition hover:bg-white/[0.035]">
                <Avatar user={author} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {author?.displayName ?? "Unknown"}
                    </h3>
                    <span className="text-xs text-zinc-500">{author?.role}</span>
                    <time className="text-xs text-zinc-600" dateTime={message.createdAt}>
                      {formatTime(message.createdAt)}
                    </time>
                    {message.isEdited ? (
                      <span className="text-xs text-zinc-600">edited</span>
                    ) : null}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-300">
                    {message.body}
                  </p>
                  {message.reactions.length > 0 || message.replyCount ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.reactions.map((reaction) => (
                      <button
                        className={`rounded-md border px-2 py-1 text-xs transition ${
                          reaction.reactedByCurrentUser
                            ? "border-violet-400/40 bg-violet-400/10 text-violet-100"
                            : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
                        }`}
                        key={`${message.id}-${reaction.label}`}
                        type="button"
                      >
                        {reaction.symbol} {reaction.count}
                      </button>
                      ))}
                      {message.replyCount ? (
                        <button
                          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-medium text-cyan-200 transition hover:bg-white/[0.06]"
                          type="button"
                        >
                          {message.replyCount} replies
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ChannelContextPanel({
  channel,
  participants,
  workspace,
}: {
  channel: Channel;
  participants: User[];
  workspace: ChannelChatSnapshot["workspace"];
}) {
  const onlineMembers = participants.filter(
    (participant) => participant.status === "online",
  );

  return (
    <aside className="hidden w-[336px] shrink-0 border-l border-white/10 bg-[var(--linear-panel)] xl:flex xl:flex-col">
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        <p className="text-sm font-semibold text-zinc-100">Details</p>
        <IconButton label="Toggle details">
          <PanelRight className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <section className="rounded-md border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                {channel.kind === "private" ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Hash className="h-3.5 w-3.5" />
                )}
                Channel
              </div>
              <h2 className="mt-2 truncate text-lg font-semibold text-zinc-50">
                {channel.name}
              </h2>
            </div>
            {channel.isFavorite ? (
              <Star className="h-4 w-4 fill-violet-300 text-violet-300" />
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {channel.description}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-zinc-500">Members</p>
              <p className="mt-1 text-xl font-semibold text-zinc-100">
                {channel.memberCount}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/20 p-3">
              <p className="text-xs text-zinc-500">Unread</p>
              <p className="mt-1 text-xl font-semibold text-zinc-100">
                {channel.unreadCount}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
            <Zap className="h-4 w-4 text-cyan-300" />
            Launch readiness
          </div>
          <div className="mt-4 space-y-3">
            {["Beta cohort", "Onboarding copy", "QA signoff"].map(
              (item) => (
                <div className="flex items-center gap-3" key={item}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-zinc-300">{item}</span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
              <Users className="h-4 w-4 text-violet-300" />
              People
            </div>
            <span className="text-xs text-zinc-500">
              {onlineMembers.length} online
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {participants.slice(0, 4).map((participant) => (
              <div className="flex items-center gap-3" key={participant.id}>
                <Avatar user={participant} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {participant.displayName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {participant.statusLabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
            Workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {workspace.tagline}
          </p>
          <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2">
            <span className="text-sm text-zinc-400">Active members</span>
            <span className="text-sm font-semibold text-zinc-100">
              {workspace.activeMembers}
            </span>
          </div>
        </section>
      </div>
    </aside>
  );
}

function Composer({
  canSendMessage,
  channelName,
  draft,
  errorMessage,
  isSending,
  onDraftChange,
  onSubmit,
  statusMessage,
}: {
  canSendMessage: boolean;
  channelName: string;
  draft: string;
  errorMessage?: string | null;
  isSending?: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  statusMessage?: string | null;
}) {
  const trimmedDraft = draft.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void onSubmit();
    }
  }

  return (
    <form
      className="shrink-0 border-t border-white/10 bg-[var(--linear-surface)] px-4 py-3 sm:px-6"
      onSubmit={handleSubmit}
    >
      <div className="mx-auto max-w-5xl rounded-md border border-white/10 bg-[#0b0d12] shadow-[0_16px_52px_rgba(0,0,0,0.35)]">
        <textarea
          className="max-h-36 min-h-16 w-full resize-none bg-transparent px-4 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600"
          id="message"
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={2}
          value={draft}
        />
        <div className="flex items-center justify-between border-t border-white/10 px-2 py-2">
          <div className="flex items-center gap-1">
            <IconButton label="Add reaction">
              <Smile className="h-4 w-4" />
            </IconButton>
            <IconButton label="Shortcuts">
              <Zap className="h-4 w-4" />
            </IconButton>
          </div>
          <button
            aria-label="Send message"
            className="inline-flex h-8 items-center justify-center rounded-md bg-zinc-100 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            disabled={!trimmedDraft || isSending || !canSendMessage}
            title="Send message"
            type="submit"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {statusMessage ? (
          <p className="border-t border-white/10 px-4 py-2 text-xs text-zinc-400">
            {statusMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="border-t border-white/10 px-4 py-2 text-xs text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function SignedOutComposer({ channelName }: { channelName: string }) {
  return (
    <div className="shrink-0 border-t border-white/10 bg-[var(--linear-surface)] px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-md border border-white/10 bg-[#0b0d12] p-4 shadow-[0_16px_52px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-zinc-100">
              <Lock className="h-4 w-4 shrink-0 text-zinc-500" />
              <span className="truncate">Sign in to join #{channelName}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              You are viewing a public preview.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              className="inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-zinc-50"
              href="/sign-in"
            >
              Log in
            </Link>
            <Link
              className="inline-flex h-8 items-center rounded-md bg-zinc-100 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-white"
              href="/sign-up"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelChatStatus({
  actions,
  message,
  title,
}: {
  actions?: ReactNode;
  message: string;
  title: string;
}) {
  return (
    <main className="flex h-dvh min-h-0 items-center justify-center bg-[var(--linear-bg)] px-6 text-zinc-100">
      <section className="w-full max-w-sm rounded-md border border-white/10 bg-[var(--linear-panel)] p-5 text-center shadow-[0_18px_42px_rgba(0,0,0,0.42)]">
        <MessageSquareText className="mx-auto h-7 w-7 text-zinc-600" />
        <h1 className="mt-3 text-sm font-semibold text-zinc-100">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{message}</p>
        {actions ? <div className="mt-4 flex justify-center gap-2">{actions}</div> : null}
      </section>
    </main>
  );
}

function StatusButton({
  children,
  onClick,
  variant = "secondary",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
        variant === "primary"
          ? "bg-zinc-100 text-zinc-950 hover:bg-white"
          : "border border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07] hover:text-zinc-50"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ChannelChatUnauthenticated() {
  return (
    <ChannelChatStatus
      actions={
        <>
          <Link
            className="inline-flex h-8 items-center rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.07] hover:text-zinc-50"
            href="/sign-in"
          >
            Log in
          </Link>
          <Link
            className="inline-flex h-8 items-center rounded-md bg-zinc-100 px-3 text-sm font-semibold text-zinc-950 transition hover:bg-white"
            href="/sign-up"
          >
            Sign up
          </Link>
        </>
      }
      message="You are signed out. Sign in to sync your Clerk account and open the Convex workspace."
      title="Authentication required"
    />
  );
}

function ShellStatusBanner({
  actions,
  message,
  tone = "loading",
}: {
  actions?: ReactNode;
  message: string;
  tone?: "loading" | "warning";
}) {
  return (
    <div
      className={`flex shrink-0 flex-col gap-2 border-b px-4 py-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
        tone === "warning"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
          : "border-white/10 bg-white/[0.035] text-zinc-400"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <RefreshCw
          className={`h-4 w-4 shrink-0 ${tone === "loading" ? "animate-spin" : ""}`}
        />
        <span className="min-w-0 truncate">{message}</span>
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
    />
  );
}

function ChannelChatBootShell({
  actions,
  message,
  tone = "loading",
}: {
  actions?: ReactNode;
  message?: string;
  tone?: "loading" | "warning";
}) {
  return (
    <main className="flex h-dvh min-h-0 overflow-hidden bg-[var(--linear-bg)] text-zinc-100">
      <aside className="hidden w-[72px] shrink-0 border-r border-white/10 bg-[#07080d] px-3 py-3 md:flex md:flex-col">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-sm font-bold text-white shadow-[0_12px_34px_rgba(124,58,237,0.32)]">
          --
        </div>
        <div className="mt-5 flex flex-1 flex-col items-center gap-2">
          <IconButton label="Threads">
            <MessageSquareText className="h-4 w-4" />
          </IconButton>
          <IconButton label="Inbox">
            <Inbox className="h-4 w-4" />
          </IconButton>
          <IconButton label="Activity">
            <Bell className="h-4 w-4" />
          </IconButton>
          <IconButton label="Search">
            <Search className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconButton label="Create">
            <Plus className="h-4 w-4" />
          </IconButton>
          <IconButton label="Settings">
            <Settings className="h-4 w-4" />
          </IconButton>
        </div>
      </aside>

      <aside className="hidden w-[292px] shrink-0 border-r border-white/10 bg-[var(--linear-panel)] lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-4 py-3">
          <div className="flex h-10 items-center justify-between rounded-md px-1.5">
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-36" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden px-3 py-4">
          <div className="mb-5 grid grid-cols-2 gap-2">
            <button
              className="flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 text-sm text-zinc-300"
              type="button"
            >
              <Clock3 className="h-4 w-4 text-zinc-500" />
              Later
            </button>
            <button
              className="flex h-9 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 text-sm text-zinc-300"
              type="button"
            >
              <AtSign className="h-4 w-4 text-zinc-500" />
              Mentions
            </button>
          </div>

          <div className="mb-2 flex h-7 items-center justify-between px-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              Channels
            </p>
            <IconButton className="h-6 w-6 border-transparent bg-transparent" label="Add channel">
              <Plus className="h-3.5 w-3.5" />
            </IconButton>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex h-8 items-center gap-2 rounded-md px-2" key={`channel-${index}`}>
                <Hash className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                <SkeletonBlock className="h-3 flex-1" />
              </div>
            ))}
          </div>

          <div className="my-5 h-px bg-white/10" />

          <div className="mb-2 flex h-7 items-center justify-between px-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              Direct messages
            </p>
            <IconButton className="h-6 w-6 border-transparent bg-transparent" label="New direct message">
              <SquarePen className="h-3.5 w-3.5" />
            </IconButton>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="flex h-8 items-center gap-2 rounded-md px-2" key={`dm-${index}`}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-600" />
                <SkeletonBlock className="h-3 flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-md bg-white/[0.04] p-2">
            <SkeletonBlock className="h-9 w-9 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-3 w-28" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
            <MoreHorizontal className="h-4 w-4 shrink-0 text-zinc-500" />
          </div>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-[var(--linear-surface)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div className="min-w-0 space-y-2">
            <SkeletonBlock className="h-3 w-24 lg:hidden" />
            <SkeletonBlock className="h-5 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <button
              className="hidden h-8 min-w-56 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-left text-sm text-zinc-500 md:flex"
              type="button"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Search workspace</span>
            </button>
            <IconButton label="Open canvas">
              <PanelRight className="h-4 w-4" />
            </IconButton>
            <IconButton label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
          </div>
        </header>

        {message ? (
          <ShellStatusBanner actions={actions} message={message} tone={tone} />
        ) : null}

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-hidden px-3 py-5 sm:px-6">
              <div className="mx-auto max-w-5xl">
                <section className="mb-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                        <Hash className="h-4 w-4 text-zinc-500" />
                        <SkeletonBlock className="h-4 w-36" />
                      </div>
                      <SkeletonBlock className="h-3 w-full max-w-md" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Users className="h-4 w-4" />
                      <SkeletonBlock className="h-3 w-8" />
                    </div>
                  </div>
                </section>

                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div className="flex gap-3 rounded-md px-3 py-2.5" key={`message-${index}`}>
                      <SkeletonBlock className="h-9 w-9 shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <SkeletonBlock className="h-4 w-28" />
                          <SkeletonBlock className="h-3 w-16" />
                        </div>
                        <SkeletonBlock className="h-3 w-full" />
                        <SkeletonBlock className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[var(--linear-surface)] px-4 py-3 sm:px-6">
              <div className="mx-auto max-w-5xl rounded-md border border-white/10 bg-[#0b0d12]">
                <div className="px-4 py-3">
                  <div className="min-h-16 text-sm leading-6 text-zinc-600">
                    Message channel
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 px-2 py-2">
                  <div className="flex gap-1">
                    <IconButton label="Add reaction">
                      <Smile className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Shortcuts">
                      <Zap className="h-4 w-4" />
                    </IconButton>
                  </div>
                  <button
                    aria-label="Send message"
                    className="inline-flex h-8 items-center justify-center rounded-md bg-zinc-800 px-3 text-sm font-semibold text-zinc-500"
                    disabled
                    title="Send message"
                    type="button"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="hidden w-[336px] shrink-0 border-l border-white/10 bg-[var(--linear-panel)] xl:flex xl:flex-col">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <p className="text-sm font-semibold text-zinc-100">Details</p>
              <IconButton label="Toggle details">
                <PanelRight className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <section className="rounded-md border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  <Hash className="h-3.5 w-3.5" />
                  Channel
                </div>
                <SkeletonBlock className="mt-3 h-5 w-36" />
                <SkeletonBlock className="mt-3 h-3 w-full" />
                <SkeletonBlock className="mt-2 h-3 w-3/4" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-white/10 bg-black/20 p-3">
                    <p className="text-xs text-zinc-500">Members</p>
                    <SkeletonBlock className="mt-2 h-6 w-10" />
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-3">
                    <p className="text-xs text-zinc-500">Unread</p>
                    <SkeletonBlock className="mt-2 h-6 w-10" />
                  </div>
                </div>
              </section>

              <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Zap className="h-4 w-4 text-cyan-300" />
                  Launch readiness
                </div>
                <div className="mt-4 space-y-3">
                  {["Beta cohort", "Onboarding copy", "QA signoff"].map((item) => (
                    <div className="flex items-center gap-3" key={item}>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span className="text-sm text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Users className="h-4 w-4 text-violet-300" />
                  People
                </div>
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="flex items-center gap-3" key={`person-${index}`}>
                      <SkeletonBlock className="h-9 w-9 shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <SkeletonBlock className="h-3 w-28" />
                        <SkeletonBlock className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Workspace
                </p>
                <SkeletonBlock className="mt-3 h-3 w-full" />
                <SkeletonBlock className="mt-2 h-3 w-3/4" />
                <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2">
                  <span className="text-sm text-zinc-400">Active members</span>
                  <SkeletonBlock className="h-4 w-10" />
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ChannelChatContent() {
  const { signOut } = useClerk();
  const {
    activeChannelId,
    canSendMessage,
    channel,
    channels,
    currentUser,
    draft,
    errorMessage,
    isInitialLoading,
    isRefreshing,
    isReady,
    isSending,
    isTimedOut,
    messages,
    participantsById,
    retryConnection,
    selectChannel,
    setDraft,
    sendMessage,
    statusMessage,
    workspace,
  } = useChannelChat();
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const participants = useMemo(
    () => Array.from(participantsById.values()),
    [participantsById],
  );

  const directMessages = useMemo(
    () =>
      participants.filter((participant) => participant.id !== currentUser?.id),
    [currentUser?.id, participants],
  );

  useEffect(() => {
    if (!channel) {
      return;
    }

    scrollAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [channel, messages.length]);

  const recoveryActions = (
    <>
      <StatusButton onClick={retryConnection} variant="primary">
        <RefreshCw className="h-4 w-4" />
        Retry
      </StatusButton>
      <StatusButton onClick={() => void signOut({ redirectUrl: "/sign-in" })}>
        <LogOut className="h-4 w-4" />
        Sign out
      </StatusButton>
    </>
  );

  const shellStatusMessage = isTimedOut
    ? (errorMessage ??
      "Convex workspace loading is taking longer than expected.")
    : isRefreshing
      ? "Loading latest workspace data..."
      : null;

  if (isInitialLoading) {
    return <ChannelChatBootShell />;
  }

  if (!isReady || !channel || !workspace) {
    return (
      <ChannelChatBootShell
        actions={recoveryActions}
        message={
          errorMessage ??
          "Seed the Convex workspace, then refresh this page to continue."
        }
        tone="warning"
      />
    );
  }

  return (
    <main className="flex h-dvh min-h-0 overflow-hidden bg-[var(--linear-bg)] text-zinc-100">
      <WorkspaceRail initials={workspace.initials} />
      <WorkspaceSidebar
        activeChannelId={activeChannelId}
        channels={channels}
        currentUser={currentUser}
        directMessages={directMessages}
        onSelectChannel={selectChannel}
        workspace={workspace}
      />

      <section className="flex min-w-0 flex-1 flex-col bg-[var(--linear-surface)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-xs text-zinc-500 lg:hidden">
              {workspace.name}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              {channel.kind === "private" ? (
                <Lock className="h-4 w-4 shrink-0 text-zinc-500" />
              ) : (
                <Hash className="h-4 w-4 shrink-0 text-zinc-500" />
              )}
              <h1 className="truncate text-sm font-semibold text-zinc-50 sm:text-base">
                {channel.name}
              </h1>
              {channel.isFavorite ? (
                <Star className="hidden h-3.5 w-3.5 fill-violet-300 text-violet-300 sm:block" />
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden h-8 min-w-56 items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-left text-sm text-zinc-500 transition hover:bg-white/[0.07] md:flex"
              type="button"
            >
              <Search className="h-4 w-4" />
              <span className="truncate">Search {workspace.name}</span>
            </button>
            <IconButton label="Open canvas">
              <PanelRight className="h-4 w-4" />
            </IconButton>
            <IconButton label="More actions">
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
            <AuthControls />
          </div>
        </header>

        {shellStatusMessage ? (
          <ShellStatusBanner
            actions={isTimedOut ? recoveryActions : undefined}
            message={shellStatusMessage}
            tone={isTimedOut ? "warning" : "loading"}
          />
        ) : null}

        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-6">
              <div className="mx-auto max-w-5xl">
                <section className="mb-5 rounded-md border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                        {channel.kind === "private" ? (
                          <Lock className="h-4 w-4 text-zinc-500" />
                        ) : (
                          <Hash className="h-4 w-4 text-zinc-500" />
                        )}
                        <span className="truncate">{channel.name}</span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {channel.topic}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Users className="h-4 w-4" />
                      {channel.memberCount}
                    </div>
                  </div>
                </section>

                <MessageList
                  isLoading={isRefreshing}
                  messages={messages}
                  participantsById={participantsById}
                />
                <div ref={scrollAnchorRef} />
              </div>
            </div>

            <Show when="signed-in">
              <Composer
                canSendMessage={canSendMessage}
                channelName={channel.name}
                draft={draft}
                errorMessage={errorMessage}
                isSending={isSending}
                onDraftChange={setDraft}
                onSubmit={sendMessage}
                statusMessage={statusMessage}
              />
            </Show>
            <Show when="signed-out">
              <SignedOutComposer channelName={channel.name} />
            </Show>
          </div>

          <ChannelContextPanel
            channel={channel}
            participants={participants}
            workspace={workspace}
          />
        </div>
      </section>
    </main>
  );
}

export function ChannelChatScreen() {
  return (
    <>
      <ClerkLoading>
        <ChannelChatBootShell />
      </ClerkLoading>
      <ClerkLoaded>
        <Show when="signed-in">
          <ChannelChatContent />
        </Show>
        <Show when="signed-out">
          <ChannelChatUnauthenticated />
        </Show>
      </ClerkLoaded>
    </>
  );
}
