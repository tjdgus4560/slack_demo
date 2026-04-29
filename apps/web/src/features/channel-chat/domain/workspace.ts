export type WorkspaceId = string;

export type Workspace = {
  id: WorkspaceId;
  name: string;
  initials: string;
  plan: string;
  tagline: string;
  activeMembers: number;
  unreadCount: number;
};
