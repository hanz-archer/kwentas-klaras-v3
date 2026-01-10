export type BudgetStatus = 'pending' | 'approved' | 'rejected'

export const BUDGET_STATUS_OPTIONS: { id: string; name: string; value: BudgetStatus }[] = [
  { id: '1', name: 'Pending', value: 'pending' },
  { id: '2', name: 'Approved', value: 'approved' },
  { id: '3', name: 'Rejected', value: 'rejected' },
]

export const BUDGET_STATUS: Record<BudgetStatus, BudgetStatus> = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
}
