export type DisbursementStatus = 'pending' | 'approved' | 'denied'

export const DISBURSEMENT_STATUS_OPTIONS: { id: string; name: string; value: DisbursementStatus }[] = [
  { id: '1', name: 'Pending', value: 'pending' },
  { id: '2', name: 'Approved', value: 'approved' },
  { id: '3', name: 'Denied', value: 'denied' },
]

export const DISBURSEMENT_STATUS: Record<DisbursementStatus, DisbursementStatus> = {
  pending: 'pending',
  approved: 'approved',
  denied: 'denied',
}
