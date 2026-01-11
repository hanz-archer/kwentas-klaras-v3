export const REPORT_TABS = {
  ALL: 'all',
  BELOW_50: 'below_50',
  ABOVE_50: 'above_50',
} as const

export type ReportTab = typeof REPORT_TABS[keyof typeof REPORT_TABS]
