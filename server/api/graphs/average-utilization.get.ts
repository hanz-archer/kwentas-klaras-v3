import { GraphsService } from '../../services/graphs/GraphsService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const graphsService = new GraphsService()
    const averageUtilization = await graphsService.getAverageUtilizationRate()

    return {
      success: true,
      data: { averageUtilization },
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch average utilization rate',
  })
})
