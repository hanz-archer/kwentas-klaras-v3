export const PROJECT_FILTER_TYPES = {
  ALL: 'all',
  CURRENT: 'current',
  CONTINUING: 'continuing',
} as const

export type ProjectFilterType = typeof PROJECT_FILTER_TYPES[keyof typeof PROJECT_FILTER_TYPES]

