export interface ReportStatCardConfig {
  title: string
  value: string
  change: string
  changeType: 'neutral' | 'positive' | 'negative'
  iconColor: string
  color: 'blue' | 'green' | 'red' | 'yellow'
}

export const getReportStatsCards = (
  formatUtilizationRate: (rate: number) => string,
  stats: {
    averageUtilization: number
    countAbove50: number
    countBelow50: number
    totalProjects: number
  }
): ReportStatCardConfig[] => [
  {
    title: 'Average Utilization Rate',
    value: `${formatUtilizationRate(stats.averageUtilization)}%`,
    change: `${stats.totalProjects} total projects`,
    changeType: 'neutral',
    iconColor: 'text-blue-600',
    color: 'blue',
  },
  {
    title: 'Projects Above 50%',
    value: stats.countAbove50.toString(),
    change: `${stats.countBelow50} below 50%`,
    changeType: 'positive',
    iconColor: 'text-green-600',
    color: 'green',
  },
]
