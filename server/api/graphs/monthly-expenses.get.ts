import { GraphsService } from '../../services/graphs/GraphsService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const graphsService = new GraphsService()
    const monthlyExpenses = await graphsService.getMonthlyExpenses()

    return {
      success: true,
      data: monthlyExpenses,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch monthly expenses',
  })
})
