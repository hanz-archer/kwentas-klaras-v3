import { GraphsService } from '../../services/graphs/GraphsService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const graphsService = new GraphsService()
    const comparison = await graphsService.getMonthlyComparison()

    return {
      success: true,
      data: comparison,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch monthly comparison',
  })
})
