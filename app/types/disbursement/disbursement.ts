export interface IDisbursement {
  id?: string
  projectId: string
  projectName?: string
  amount: number
  reason: string
  payee: string
  approvedBy?: string
  approvedDate?: Date
  status?: 'pending' | 'approved' | 'denied'
  createdAt?: Date
  updatedAt?: Date
}

