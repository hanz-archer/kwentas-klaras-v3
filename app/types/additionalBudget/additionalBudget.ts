import type { BudgetStatus } from '~/constants/additionalBudget/status'

export interface IAdditionalBudget {
  id?: string
  projectId: string
  amount: number
  reason: string
  approvedBy?: string
  approvedDate?: Date | string
  status?: BudgetStatus
  createdAt?: Date | string
  updatedAt?: Date | string
}

