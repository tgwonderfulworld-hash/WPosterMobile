/** Keyed by workspace + exact ISO range so every view (Month/Week/Day) caches independently. */
export const calendarKeys = {
  posts: (workspaceId: string, startIso: string, endIso: string) =>
    ['calendarPosts', workspaceId, startIso, endIso] as const,
};
