import type { DisbursementStatus } from '~/constants/disbursement/status'

export interface IDisbursement {
  id?: string
  projectId: string
  projectName?: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: Date
  status?: DisbursementStatus
  createdAt?: Date
  updatedAt?: Date
}

