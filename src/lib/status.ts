// Single source of truth for app card statuses (Java-style constants "class").
// Both the content schema (src/content.config.ts) and the badge UI key off these
// values, so a new status is added in exactly one place.

export const APP_STATUSES = ['live', 'beta', 'wip', 'down', 'preparation'] as const;
export type AppStatus = (typeof APP_STATUSES)[number];

export const APP_STATUS = {
  LIVE: 'live',
  BETA: 'beta',
  WIP: 'wip',
  DOWN: 'down', // temporarily offline
  PREPARATION: 'preparation', // announced, not built yet
} as const satisfies Record<string, AppStatus>;

// Human-readable labels (for future use; the badge currently shows the raw value).
export const STATUS_LABELS: Record<AppStatus, string> = {
  live: 'Live',
  beta: 'Beta',
  wip: 'WIP',
  down: 'Down',
  preparation: 'In Preparation',
};
