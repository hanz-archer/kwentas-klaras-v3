import type { BudgetStatus } from '~/constants/additionalBudget/status'

export interface BudgetFormData {
  amount: number
  reason: string
  status: BudgetStatus
  approvedBy?: string
  approvedDate?: string
}
