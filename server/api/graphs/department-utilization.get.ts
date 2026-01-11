import { GraphsService } from '../../services/graphs/GraphsService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const graphsService = new GraphsService()
    const departmentUtilization = await graphsService.getDepartmentUtilizationRates()

    return {
      success: true,
      data: departmentUtilization,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch department utilization rates',
  })
})
