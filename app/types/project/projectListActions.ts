import type { IAdditionalBudget } from '~/types/additionalBudget/additionalBudget'
import type { IObligation } from '~/types/obligation/obligation'
import type { IDisbursement } from '~/types/disbursement/disbursement'
import type { BudgetStatus } from '~/constants/additionalBudget/status'
import type { ObligationStatus } from '~/constants/obligation/status'

export type BudgetCreateData = {
  projectId: string
  amount: number
  reason: string
  approvedBy?: string
  approvedDate?: Date
  status?: BudgetStatus
}

export type ObligationCreateData = {
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: Date
  status?: ObligationStatus
}

export type DisbursementCreateData = {
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: Date
}

export type CreateBudgetFn = (data: BudgetCreateData) => Promise<IAdditionalBudget | undefined>
export type CreateObligationFn = (data: ObligationCreateData) => Promise<IObligation | undefined>
export type CreateDisbursementFn = (data: DisbursementCreateData) => Promise<IDisbursement | undefined>
