/** Shared publish-status → i18n key / badge tone maps (Dashboard + Calendar cards). */
import type { BadgeTone } from '@/components/ui';
import type { Theme } from '@/theme';

import type { Post } from './types';

export const POST_STATUS_LABEL_KEY: Record<Post['publish_status'], string> = {
  draft: 'workspace.dashboard.publishStatus.draft',
  scheduled: 'workspace.dashboard.publishStatus.scheduled',
  publishing: 'workspace.dashboard.publishStatus.processing',
  published: 'workspace.dashboard.publishStatus.published',
  failed: 'workspace.dashboard.publishStatus.failed',
};

export const POST_STATUS_TONE: Record<Post['publish_status'], BadgeTone> = {
  draft: 'neutral',
  scheduled: 'info',
  publishing: 'warning',
  published: 'success',
  failed: 'danger',
};

/** Solid dot/indicator color for a status (Month grid), matching the badge tone above. */
export function postStatusColor(theme: Theme, status: Post['publish_status']): string {
  const c = theme.colors;
  const map: Record<Post['publish_status'], string> = {
    draft: c.muted,
    scheduled: c.info,
    publishing: c.warning,
    published: c.success,
    failed: c.danger,
  };
  return map[status];
}
