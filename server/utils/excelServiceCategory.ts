import type { ExcelServiceCategory } from '../constants/excel/serviceCategories'
import { EXCEL_SERVICE_CATEGORIES } from '../constants/excel/serviceCategories'

export const categorizeService = (service: string): ExcelServiceCategory => {
  const normalizedService = service.trim().toLowerCase()
  
  if (normalizedService === 'social' || normalizedService.includes('social') || normalizedService.includes('welfare') || normalizedService.includes('health') || normalizedService.includes('education')) {
    return EXCEL_SERVICE_CATEGORIES.SOCIAL
  }
  
  if (normalizedService === 'economic' || normalizedService.includes('economic') || normalizedService.includes('business') || normalizedService.includes('commerce')) {
    return EXCEL_SERVICE_CATEGORIES.ECONOMIC
  }
  
  if (normalizedService === 'environmental' || normalizedService === 'environment' || normalizedService.includes('environmental') || normalizedService.includes('environment')) {
    return EXCEL_SERVICE_CATEGORIES.ENVIRONMENTAL
  }
  
  return EXCEL_SERVICE_CATEGORIES.GENERAL
}

export const getServiceStartRow = (category: ExcelServiceCategory): number => {
  const startRows: Record<ExcelServiceCategory, number> = {
    [EXCEL_SERVICE_CATEGORIES.GENERAL]: 12,
    [EXCEL_SERVICE_CATEGORIES.SOCIAL]: 12,
    [EXCEL_SERVICE_CATEGORIES.ECONOMIC]: 19,
    [EXCEL_SERVICE_CATEGORIES.ENVIRONMENTAL]: 19,
  }
  return startRows[category]
}
