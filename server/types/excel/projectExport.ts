import type { ExcelServiceCategory } from '../../constants/excel/serviceCategories'

export interface ProjectExportData {
  id: string
  name: string
  location: string | null
  startDate: Date | null
  endDate: Date | null
  totalBudget: number
  totalDisbursements: number
  utilizationRate: number
  remarks: string | null
  category: ExcelServiceCategory
}
