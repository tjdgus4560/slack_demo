export type UserId = string;

export type UserStatus = "online" | "away" | "focus" | "offline";

export type User = {
  id: UserId;
  displayName: string;
  handle: string;
  initials: string;
  role: string;
  status: UserStatus;
  statusLabel: string;
  accentColor: string;
  dmUnreadCount: number;
};
