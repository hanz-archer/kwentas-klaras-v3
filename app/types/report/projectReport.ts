import type { Project } from '../project/project'

export interface ProjectWithUtilization extends Project {
  utilizationRate: number
  totalBudget: number
  totalAddedBudget?: number
  totalObligations: number
  totalDisbursements: number
  remainingBalance: number
}

export interface ProjectReportStats {
  averageUtilization: number
  countBelow50: number
  countAbove50: number
  totalProjects: number
}

export interface CategorizedProjects {
  below50: ProjectWithUtilization[]
  above50: ProjectWithUtilization[]
}
