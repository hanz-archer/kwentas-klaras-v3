export interface Payment {
  id?: string
  payee: string
  projectName: string
  amount: number
  status?: string
  createdAt?: Date
  approvedBy?: string
  approvedDate?: Date
  reason?: string
}
