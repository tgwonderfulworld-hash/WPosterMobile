/**
 * Pure, local-time calendar date helpers — the mobile analogue of WPoster Web's
 * `src/lib/calendar/dates.ts`. Web anchors grid math in UTC because it also
 * resolves a workspace timezone server-side; mobile has no server-side
 * timezone resolution (dates elsewhere in the app render in the device's own
 * local time via `useFormatter`), so these helpers use the device's local
 * calendar day consistently — same convention as the rest of the app.
 */
export type CalendarViewMode = 'month' | 'week' | 'day';

export interface CalendarGridDay {
  date: Date;
  key: string;
  dayNumber: number;
  inMonth: boolean;
}

/** Local YYYY-MM-DD key for a date (not UTC — matches the device's calendar day). */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function addWeeks(date: Date, n: number): Date {
  return addDays(date, n * 7);
}

export function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  return d;
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** First day of the week containing `date`. `weekStartsOn`: 0 = Sunday, 1 = Monday. */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 1): Date {
  const d = startOfDay(date);
  const offset = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - offset);
  return d;
}

/** 42-cell month grid (6 weeks), padded with leading/trailing days of adjacent months. */
export function getMonthGrid(monthAnchor: Date, weekStartsOn: 0 | 1 = 1): CalendarGridDay[] {
  const monthStart = startOfMonth(monthAnchor);
  const gridStart = startOfWeek(monthStart, weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i);
    return {
      date,
      key: toDateKey(date),
      dayNumber: date.getDate(),
      inMonth: date.getMonth() === monthStart.getMonth(),
    };
  });
}

/** The 7 days of the week containing `anchor`. */
export function getWeekDays(anchor: Date, weekStartsOn: 0 | 1 = 1): Date[] {
  const start = startOfWeek(anchor, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** The exact [start, end) window a view needs fetched, aligned to local midnight. */
export function getRangeForView(
  view: CalendarViewMode,
  anchor: Date,
  weekStartsOn: 0 | 1 = 1,
): { start: Date; end: Date } {
  if (view === 'day') {
    const start = startOfDay(anchor);
    return { start, end: addDays(start, 1) };
  }
  if (view === 'week') {
    const start = startOfWeek(anchor, weekStartsOn);
    return { start, end: addDays(start, 7) };
  }
  const grid = getMonthGrid(anchor, weekStartsOn);
  return { start: grid[0].date, end: addDays(grid[grid.length - 1].date, 1) };
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}
