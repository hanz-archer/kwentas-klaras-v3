import type { ObligationStatus } from '~/constants/obligation/status'

export interface ObligationFormData {
  amount: number
  payee: string
  reason: string
  status: ObligationStatus
  approvedBy?: string
  approvedDate?: string
}
