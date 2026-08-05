/** Centralized query keys so prefetch/invalidate always target the same cache. */
export const workspaceKeys = {
  active: (userId: string) => ['activeWorkspace', userId] as const,
  list: (userId: string) => ['workspaces', userId] as const,
  profile: (userId: string) => ['profile', userId] as const,
  connectedAccounts: (workspaceId: string) => ['connectedAccounts', workspaceId] as const,
  stats: (workspaceId: string) => ['dashboardStats', workspaceId] as const,
  upcoming: (workspaceId: string) => ['upcomingPosts', workspaceId] as const,
  failedPosts: (workspaceId: string) => ['failedPosts', workspaceId] as const,
  queueCounts: (workspaceId: string) => ['queueCounts', workspaceId] as const,
  notifications: (workspaceId: string) => ['notifications', workspaceId] as const,
};
