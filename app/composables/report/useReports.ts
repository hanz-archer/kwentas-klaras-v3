import { ref, computed, readonly } from 'vue'
import { useErrorHandler } from '../error/useErrorHandler'
import type { ProjectWithUtilization, ProjectReportStats, CategorizedProjects } from '~/types/report/projectReport'
import { useProjectFormatting } from '../project/useProjectFormatting'

export const useReports = () => {
  const projects = ref<ProjectWithUtilization[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { formatNumber } = useProjectFormatting()

  const fetchReports = async () => {
    loading.value = true
    error.value = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; projects: ProjectWithUtilization[] }>('/api/projects/reports')
      if (response.success) {
        projects.value = response.projects.filter(p => p.utilizationRate !== null && p.utilizationRate !== undefined)
      }
    }, {
      defaultMessage: 'Failed to fetch reports',
      onError: (err) => {
        error.value = err.message
      }
    })

    loading.value = false
  }

  const stats = computed<ProjectReportStats>(() => {
    const validProjects = projects.value.filter(p => p.utilizationRate !== null && p.utilizationRate !== undefined)
    const totalProjects = validProjects.length

    if (totalProjects === 0) {
      return {
        averageUtilization: 0,
        countBelow50: 0,
        countAbove50: 0,
        totalProjects: 0,
      }
    }

    const totalUtilization = validProjects.reduce((sum, p) => sum + p.utilizationRate, 0)
    const averageUtilization = totalUtilization / totalProjects

    const below50 = validProjects.filter(p => p.utilizationRate < 50)
    const above50 = validProjects.filter(p => p.utilizationRate >= 50)

    return {
      averageUtilization,
      countBelow50: below50.length,
      countAbove50: above50.length,
      totalProjects,
    }
  })

  const categorizedProjects = computed<CategorizedProjects>(() => {
    const validProjects = projects.value.filter(p => p.utilizationRate !== null && p.utilizationRate !== undefined)
    
    return {
      below50: validProjects.filter(p => p.utilizationRate < 50),
      above50: validProjects.filter(p => p.utilizationRate >= 50),
    }
  })

  const formatUtilizationRate = (rate: number): string => {
    if (rate === 0) return '0.00'
    return rate.toFixed(2)
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    stats,
    categorizedProjects,
    fetchReports,
    formatUtilizationRate,
    formatNumber,
  }
}
