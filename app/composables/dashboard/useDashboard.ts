import { DASHBOARD_QUICK_ACTIONS } from '~/constants/dashboard/quickActions'
import type { QuickAction } from '~/types/ui/quickActions'
import { useErrorHandler } from '../error/useErrorHandler'
import { useAuthHeaders } from '../auth/useAuthHeaders'
import type { DashboardActivity } from '~/types/dashboard/dashboard'

const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export const useDashboard = () => {
  const activities = ref<DashboardActivity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDashboard = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const headers = await useAuthHeaders()
      const response = await $fetch<{
        success: boolean
        stats: {
          totalUsers: number
          activeProjects: number
          totalBudget: number
          totalApprovedDisbursements: number
          totalObligations: number
          utilizationRate: number
          recentActivities: Array<{
            id: string
            projectId: string
            action: string
            description: string
            createdAt: Date | string
          }>
        }
        utilizationData: Array<{
          label: string
          value: number
          color: string
        }>
      }>('/api/dashboard', { headers })

      if (response.success) {
        // Transform activities to match expected format
        activities.value = response.stats.recentActivities.map((activity) => {
          const createdAt = typeof activity.createdAt === 'string' 
            ? new Date(activity.createdAt) 
            : activity.createdAt
          
          // Format action as title
          const actionTitle = activity.action
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          return {
            title: actionTitle,
            description: activity.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
            time: formatTimeAgo(createdAt),
          }
        })
      }
    }, {
      defaultMessage: 'Failed to fetch dashboard data',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const quickActions: QuickAction[] = DASHBOARD_QUICK_ACTIONS.map((action, index) => {
    if (index === 0) {
      return { ...action, onClick: () => navigateTo('/admin/projects') }
    }
    if (index === 1) {
      return { ...action, onClick: () => navigateTo('/admin/users') }
    }
    return action
  })

  const handleViewAll = () => {
    navigateTo('/admin/activities')
  }

  const setActivities = (activitiesData: Array<{
    id: string
    projectId: string
    action: string
    description: string
    createdAt: Date | string
  }>) => {
    activities.value = activitiesData.map((activity) => {
      const createdAt = typeof activity.createdAt === 'string' 
        ? new Date(activity.createdAt) 
        : activity.createdAt
      
      const actionTitle = activity.action
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return {
        title: actionTitle,
        description: activity.description.replace(/<[^>]*>/g, ''),
        time: formatTimeAgo(createdAt),
      }
    })
  }

  return {
    activities: readonly(activities),
    loading: readonly(loading),
    error: readonly(error),
    quickActions,
    handleViewAll,
    fetchDashboard,
    setActivities,
  }
}

