import type { ObligationStatus } from '~/constants/obligation/status'

export interface IObligation {
  id?: string
  projectId: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: Date
  status?: ObligationStatus
  createdAt?: Date
  updatedAt?: Date
}

