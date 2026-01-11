import { ProjectService } from '../../services/project/ProjectService'
import { ComputationService } from '../../services/computation/ComputationService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const projectService = new ProjectService()
    const computationService = new ComputationService()
    
    const projects = await projectService.list()
    
    const projectsWithUtilization = await Promise.all(
      projects.map(async (project) => {
        if (!project.id || !project.appropriation) {
          return {
            ...project,
            utilizationRate: 0,
            totalBudget: 0,
            totalObligations: 0,
            totalDisbursements: 0,
            remainingBalance: 0,
          }
        }

        const [utilizationRate, totalAddedBudget, totalObligations, totalDisbursements, remainingBalance] = await Promise.all([
          computationService.calculateUtilizationRate(project.id, project.appropriation),
          computationService.calculateTotalAddedBudget(project.id),
          computationService.calculateTotalObligations(project.id),
          computationService.calculateTotalDisbursements(project.id),
          computationService.calculateRemainingBalance(project.id, project.appropriation),
        ])

        const totalBudget = project.appropriation + totalAddedBudget

        return {
          ...project,
          utilizationRate,
          totalBudget,
          totalAddedBudget,
          totalObligations,
          totalDisbursements,
          remainingBalance,
        }
      })
    )

    return {
      success: true,
      projects: projectsWithUtilization,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch projects for reports',
  })
})
