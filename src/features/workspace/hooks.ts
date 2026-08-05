/**
 * React Query hooks for the workspace/dashboard data layer. All reads hit the
 * real Supabase tables (see api.ts). Switching workspace optimistically updates
 * the active-workspace cache and invalidates workspace-scoped queries so every
 * screen refreshes for the new workspace.
 */
import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/store';

import {
  getConnectedAccountQueueCounts,
  getConnectedAccounts,
  getFailedPosts,
  getUpcomingPosts,
  getUserProfile,
  getWorkspaceNotifications,
  getWorkspaceStats,
  listWorkspaces,
  resolveActiveWorkspaceId,
  setActiveWorkspace,
} from './api';
import { workspaceKeys } from './queryKeys';

function useUserId(): string | undefined {
  return useAuthStore((s) => s.user?.id);
}

export function useActiveWorkspaceId() {
  const userId = useUserId();
  return useQuery({
    queryKey: workspaceKeys.active(userId ?? 'anon'),
    queryFn: () => resolveActiveWorkspaceId(userId!),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

export function useWorkspaces() {
  const userId = useUserId();
  return useQuery({
    queryKey: workspaceKeys.list(userId ?? 'anon'),
    queryFn: () => listWorkspaces(userId!),
    enabled: !!userId,
  });
}

export function useUserProfile() {
  const userId = useUserId();
  return useQuery({
    queryKey: workspaceKeys.profile(userId ?? 'anon'),
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
  });
}

export function useConnectedAccounts(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.connectedAccounts(workspaceId ?? 'none'),
    queryFn: () => getConnectedAccounts(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useWorkspaceStats(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.stats(workspaceId ?? 'none'),
    queryFn: () => getWorkspaceStats(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useUpcomingPosts(workspaceId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: workspaceKeys.upcoming(workspaceId ?? 'none'),
    queryFn: () => getUpcomingPosts(workspaceId!, limit),
    enabled: !!workspaceId,
  });
}

export function useFailedPosts(workspaceId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: workspaceKeys.failedPosts(workspaceId ?? 'none'),
    queryFn: () => getFailedPosts(workspaceId!, limit),
    enabled: !!workspaceId,
  });
}

export function useConnectedAccountQueueCounts(workspaceId: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.queueCounts(workspaceId ?? 'none'),
    queryFn: () => getConnectedAccountQueueCounts(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useWorkspaceNotifications(workspaceId: string | undefined) {
  const userId = useUserId();
  return useQuery({
    queryKey: workspaceKeys.notifications(workspaceId ?? 'none'),
    queryFn: () => getWorkspaceNotifications(workspaceId!, userId!),
    enabled: !!workspaceId && !!userId,
  });
}

/** Warm the dashboard caches for a workspace (used on switch / focus). */
export function prefetchWorkspaceData(client: QueryClient, workspaceId: string, userId?: string): void {
  void client.prefetchQuery({
    queryKey: workspaceKeys.connectedAccounts(workspaceId),
    queryFn: () => getConnectedAccounts(workspaceId),
  });
  void client.prefetchQuery({
    queryKey: workspaceKeys.stats(workspaceId),
    queryFn: () => getWorkspaceStats(workspaceId),
  });
  void client.prefetchQuery({
    queryKey: workspaceKeys.upcoming(workspaceId),
    queryFn: () => getUpcomingPosts(workspaceId),
  });
  void client.prefetchQuery({
    queryKey: workspaceKeys.failedPosts(workspaceId),
    queryFn: () => getFailedPosts(workspaceId),
  });
  void client.prefetchQuery({
    queryKey: workspaceKeys.queueCounts(workspaceId),
    queryFn: () => getConnectedAccountQueueCounts(workspaceId),
  });
  if (userId) {
    void client.prefetchQuery({
      queryKey: workspaceKeys.notifications(workspaceId),
      queryFn: () => getWorkspaceNotifications(workspaceId, userId),
    });
  }
}

export function useSwitchWorkspace() {
  const userId = useUserId();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => setActiveWorkspace(userId!, workspaceId),
    onMutate: async (workspaceId) => {
      if (!userId) return;
      const key = workspaceKeys.active(userId);
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<string | null>(key);
      // Optimistically flip the active workspace so dependent screens switch now.
      client.setQueryData(key, workspaceId);
      prefetchWorkspaceData(client, workspaceId, userId);
      return { previous, key };
    },
    onError: (_err, _wsId, ctx) => {
      if (ctx?.key) client.setQueryData(ctx.key, ctx.previous ?? null);
    },
    onSettled: () => {
      if (userId) void client.invalidateQueries({ queryKey: workspaceKeys.active(userId) });
    },
  });
}
