import { GraphsService } from '../../services/graphs/GraphsService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const graphsService = new GraphsService()
    const dailyExpenses = await graphsService.getDailyExpenses()

    return {
      success: true,
      data: dailyExpenses,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch daily expenses',
  })
})
