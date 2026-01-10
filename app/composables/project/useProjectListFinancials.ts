import type { Project } from '~/types/project/project'
import { useProjectFinancials } from './useProjectFinancials'

export const useProjectListFinancials = (projects: Readonly<Ref<readonly Project[]>>) => {
  const projectFinancialData = ref<Map<string, {
    totalObligations: number
    remainingObligations: number
    totalDisbursements: number
    approvedDisbursements: number
    utilizationRate: number
  }>>(new Map())

  const hasFinancialData = (projectId: string) => {
    return projectFinancialData.value.has(projectId)
  }

  const loadProjectFinancialData = async (projectId: string) => {
    try {
      const financials = useProjectFinancials(projectId)
      await financials.loadFinancials()

      const project = projects.value.find(p => p.id === projectId) || null
      const utilizationRate = financials.utilizationRate.value(project)

      projectFinancialData.value.set(projectId, {
        totalObligations: financials.totalObligations.value,
        remainingObligations: financials.remainingObligations.value,
        totalDisbursements: financials.totalDisbursements.value,
        approvedDisbursements: financials.approvedDisbursements.value,
        utilizationRate
      })
    } catch (error) {
      console.error('Failed to load financial data:', error)
    }
  }

  const getProjectFinancialData = (projectId: string) => {
    return projectFinancialData.value.get(projectId) || {
      totalObligations: 0,
      remainingObligations: 0,
      totalDisbursements: 0,
      approvedDisbursements: 0,
      utilizationRate: 0
    }
  }

  const getUtilizationRate = (project: Project) => {
    const financialData = getProjectFinancialData(project.id!)
    if (financialData.utilizationRate > 0) {
      return financialData.utilizationRate
    }
    const totalBudget = project.appropriation + (project.totalAddedBudget || 0)
    if (totalBudget === 0) return 0
    return (financialData.approvedDisbursements / totalBudget) * 100
  }

  const getRemainingBalance = (project: Project) => {
    const totalBudget = project.appropriation + (project.totalAddedBudget || 0)
    const financialData = getProjectFinancialData(project.id!)
    return totalBudget - financialData.totalDisbursements
  }

  const formatUtilizationRate = (rate: number) => {
    if (rate === 0) return '0.00'
    if (rate < 0.01) {
      return rate.toFixed(4)
    }
    return rate.toFixed(2)
  }

  return {
    projectFinancialData,
    hasFinancialData,
    loadProjectFinancialData,
    getProjectFinancialData,
    getUtilizationRate,
    getRemainingBalance,
    formatUtilizationRate,
  }
}
