import { ref, computed, readonly } from 'vue'
import { useReports } from './useReports'
import { REPORT_TABS, type ReportTab } from '~/constants/report/reportTabs'
import type { ProjectWithUtilization } from '~/types/report/projectReport'

export const useReportsPage = () => {
  const { projects, loading, error, stats, categorizedProjects, fetchReports, formatUtilizationRate } = useReports()
  
  const activeTab = ref<ReportTab>(REPORT_TABS.ALL)
  const selectedProjects = ref<string[]>([])
  const showExportConfirm = ref(false)

  const displayProjects = computed(() => {
    if (activeTab.value === REPORT_TABS.BELOW_50) {
      return categorizedProjects.value.below50
    }
    if (activeTab.value === REPORT_TABS.ABOVE_50) {
      return categorizedProjects.value.above50
    }
    return projects.value
  })

  const tabTitle = computed(() => {
    if (activeTab.value === REPORT_TABS.BELOW_50) {
      return 'Projects Below 50% Utilization Rate'
    }
    if (activeTab.value === REPORT_TABS.ABOVE_50) {
      return 'Projects Above 50% Utilization Rate'
    }
    return 'All Projects'
  })

  const tabDescription = computed(() => {
    if (activeTab.value === REPORT_TABS.BELOW_50) {
      return `${stats.value.countBelow50} projects with utilization rate below 50%`
    }
    if (activeTab.value === REPORT_TABS.ABOVE_50) {
      return `${stats.value.countAbove50} projects with utilization rate above 50%`
    }
    return `${stats.value.totalProjects} total projects`
  })

  const allSelected = computed(() => {
    return displayProjects.value.length > 0 && 
           displayProjects.value.every(p => p.id && selectedProjects.value.includes(p.id))
  })

  const isSelected = (projectId: string | undefined): boolean => {
    return projectId ? selectedProjects.value.includes(projectId) : false
  }

  const toggleProject = (projectId: string | undefined) => {
    if (!projectId) return
    const index = selectedProjects.value.indexOf(projectId)
    if (index > -1) {
      selectedProjects.value.splice(index, 1)
    } else {
      selectedProjects.value.push(projectId)
    }
  }

  const toggleSelectAll = () => {
    if (allSelected.value) {
      displayProjects.value.forEach(project => {
        if (project.id) {
          const index = selectedProjects.value.indexOf(project.id)
          if (index > -1) {
            selectedProjects.value.splice(index, 1)
          }
        }
      })
    } else {
      displayProjects.value.forEach(project => {
        if (project.id && !selectedProjects.value.includes(project.id)) {
          selectedProjects.value.push(project.id)
        }
      })
    }
  }

  const handleTabChange = (tab: ReportTab) => {
    activeTab.value = tab
  }

  const handleExportClick = () => {
    if (selectedProjects.value.length === 0) return
    showExportConfirm.value = true
  }

  const confirmExport = async () => {
    showExportConfirm.value = false

    try {
      const response = await $fetch<ArrayBuffer>('/api/projects/bulk-export', {
        method: 'POST',
        body: { projectIds: selectedProjects.value },
      })

      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'FDP Form 7.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      selectedProjects.value = []
    } catch (err) {
      console.error('Failed to export to Excel:', err)
    }
  }

  const cancelExport = () => {
    showExportConfirm.value = false
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    stats: readonly(stats),
    categorizedProjects: readonly(categorizedProjects),
    fetchReports,
    formatUtilizationRate,
    activeTab,
    selectedProjects,
    displayProjects,
    tabTitle,
    tabDescription,
    allSelected,
    isSelected,
    toggleProject,
    toggleSelectAll,
    handleTabChange,
    showExportConfirm: readonly(showExportConfirm),
    handleExportClick,
    confirmExport,
    cancelExport,
    REPORT_TABS,
  }
}
