export type ObligationStatus = 'pending' | 'approved' | 'rejected'

export const OBLIGATION_STATUS_OPTIONS: { id: string; name: string; value: ObligationStatus }[] = [
  { id: '1', name: 'Pending', value: 'pending' },
  { id: '2', name: 'Approved', value: 'approved' },
  { id: '3', name: 'Rejected', value: 'rejected' },
]

export const OBLIGATION_STATUS: Record<ObligationStatus, ObligationStatus> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
}
