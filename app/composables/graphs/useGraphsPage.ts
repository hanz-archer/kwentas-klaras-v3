import { ref, computed } from 'vue'

export const GRAPH_SECTIONS = {
  UTILIZATION: 'utilization',
  SPENT: 'spent',
  COMPARISON: 'comparison',
  DEPARTMENT: 'department',
} as const

export type GraphSection = typeof GRAPH_SECTIONS[keyof typeof GRAPH_SECTIONS]

export const useGraphsPage = () => {
  const activeSection = ref<GraphSection>(GRAPH_SECTIONS.UTILIZATION)
  const averageUtilization = ref<number>(0)
  const dailyExpenses = ref<Record<string, number>>({})
  const monthlyExpenses = ref<Record<string, number>>({})
  const monthlyComparison = ref<{
    months: string[]
    totalDisbursements: Record<string, number>
    totalObligations: Record<string, number>
  }>({
    months: [],
    totalDisbursements: {},
    totalObligations: {},
  })
  const departmentUtilization = ref<Record<string, number>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)
  const spentView = ref<'daily' | 'monthly'>('monthly')

  const fetchAverageUtilization = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: { averageUtilization: number } }>('/api/graphs/average-utilization')
      if (response.success) {
        averageUtilization.value = response.data.averageUtilization
      }
    } catch (err) {
      console.error('Failed to fetch average utilization:', err)
    }
  }

  const fetchDailyExpenses = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: Record<string, number> }>('/api/graphs/daily-expenses')
      if (response.success) {
        dailyExpenses.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch daily expenses:', err)
    }
  }

  const fetchMonthlyExpenses = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: Record<string, number> }>('/api/graphs/monthly-expenses')
      if (response.success) {
        monthlyExpenses.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch monthly expenses:', err)
    }
  }

  const fetchMonthlyComparison = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: { months: string[]; totalDisbursements: Record<string, number>; totalObligations: Record<string, number> } }>('/api/graphs/monthly-comparison')
      if (response.success) {
        monthlyComparison.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch monthly comparison:', err)
    }
  }

  const fetchDepartmentUtilization = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: Record<string, number> }>('/api/graphs/department-utilization')
      if (response.success) {
        departmentUtilization.value = response.data
      }
    } catch (err) {
      console.error('Failed to fetch department utilization:', err)
    }
  }

  const fetchAllData = async () => {
    loading.value = true
    error.value = null

    try {
      await Promise.all([
        fetchAverageUtilization(),
        fetchDailyExpenses(),
        fetchMonthlyExpenses(),
        fetchMonthlyComparison(),
        fetchDepartmentUtilization(),
      ])
    } catch (err) {
      error.value = 'Failed to load graphs data'
      console.error('Failed to fetch graphs data:', err)
    } finally {
      loading.value = false
    }
  }

  const showSection = (section: GraphSection) => {
    activeSection.value = section
  }

  const toggleSpentView = () => {
    spentView.value = spentView.value === 'monthly' ? 'daily' : 'monthly'
  }

  return {
    activeSection,
    averageUtilization,
    dailyExpenses,
    monthlyExpenses,
    monthlyComparison,
    departmentUtilization,
    loading,
    error,
    spentView,
    fetchAllData,
    showSection,
    toggleSpentView,
    GRAPH_SECTIONS,
  }
}
