import { ProjectActivityService } from '../../services/project/ProjectActivityService'
import { withErrorHandler } from '../../utils/errorHandler'

export default defineEventHandler(async (event) => {
  return await withErrorHandler(async () => {
    const activityService = new ProjectActivityService()
    const activities = await activityService.findAll()

    return {
      success: true,
      activities,
    }
  }, {
    defaultStatusCode: 500,
    defaultMessage: 'Failed to fetch activities',
  })
})
