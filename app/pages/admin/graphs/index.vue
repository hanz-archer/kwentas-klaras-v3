<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Graphs & Analytics</h1>
              <p class="text-sm text-gray-500">Visual insights and project analytics</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="selectAllGraphs"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Select All
              </button>
              <button
                @click="deselectAllGraphs"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Deselect All
              </button>
              <button
                @click="exportSelectedGraphs"
                :disabled="isExporting || selectedGraphsCount === 0"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isExporting ? 'Exporting...' : `Export Selected (${selectedGraphsCount})` }}
              </button>
              <button
                @click="exportAllGraphs"
                :disabled="isExporting"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isExporting ? 'Exporting...' : 'Export All' }}
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            <button
              @click="showSection(GRAPH_SECTIONS.UTILIZATION)"
              :disabled="loading"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                activeSection === GRAPH_SECTIONS.UTILIZATION
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
                loading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Utilization Rate
            </button>
            <button
              @click="showSection(GRAPH_SECTIONS.SPENT)"
              :disabled="loading"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                activeSection === GRAPH_SECTIONS.SPENT
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
                loading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Spent
            </button>
            <button
              @click="showSection(GRAPH_SECTIONS.COMPARISON)"
              :disabled="loading"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                activeSection === GRAPH_SECTIONS.COMPARISON
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
                loading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Comparisons
            </button>
            <button
              @click="showSection(GRAPH_SECTIONS.DEPARTMENT)"
              :disabled="loading"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0',
                activeSection === GRAPH_SECTIONS.DEPARTMENT
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
                loading ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Department
            </button>
          </div>

          <BaseChart
            v-if="activeSection === GRAPH_SECTIONS.UTILIZATION"
            title="Utilization Rate"
            description="Overall project utilization rate"
            :options="utilizationChartOptions"
            :loading="loading"
            :error="error"
            :graph-section="GRAPH_SECTIONS.UTILIZATION"
          >
            <template #icon>
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </template>
            <template #actions>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="selectedGraphs.has(GRAPH_SECTIONS.UTILIZATION)"
                  @change="toggleGraphSelection(GRAPH_SECTIONS.UTILIZATION)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Export</span>
              </label>
            </template>
          </BaseChart>

          <BaseChart
            v-if="activeSection === GRAPH_SECTIONS.SPENT"
            title="Spent"
            description="Total expenses over time"
            :options="spentChartOptions"
            :loading="loading"
            :error="error"
            :graph-section="GRAPH_SECTIONS.SPENT"
          >
            <template #icon>
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
            <template #actions>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="selectedGraphs.has(GRAPH_SECTIONS.SPENT)"
                    @change="toggleGraphSelection(GRAPH_SECTIONS.SPENT)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Export</span>
                </label>
                <button
                  @click="toggleSpentView"
                  class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Switch to {{ spentView === 'monthly' ? 'Daily' : 'Monthly' }} View
                </button>
              </div>
            </template>
          </BaseChart>

          <BaseChart
            v-if="activeSection === GRAPH_SECTIONS.COMPARISON"
            title="Comparison"
            description="Monthly comparison of disbursements and obligations"
            :options="comparisonChartOptions"
            :loading="loading"
            :error="error"
            :graph-section="GRAPH_SECTIONS.COMPARISON"
          >
            <template #icon>
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </template>
            <template #actions>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="selectedGraphs.has(GRAPH_SECTIONS.COMPARISON)"
                  @change="toggleGraphSelection(GRAPH_SECTIONS.COMPARISON)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Export</span>
              </label>
            </template>
          </BaseChart>

          <BaseChart
            v-if="activeSection === GRAPH_SECTIONS.DEPARTMENT"
            title="Department Utilization Rates"
            description="Average utilization rate by department"
            :options="departmentChartOptions"
            :loading="loading"
            :error="error"
            :graph-section="GRAPH_SECTIONS.DEPARTMENT"
          >
            <template #icon>
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </template>
            <template #actions>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="selectedGraphs.has(GRAPH_SECTIONS.DEPARTMENT)"
                  @change="toggleGraphSelection(GRAPH_SECTIONS.DEPARTMENT)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">Export</span>
              </label>
            </template>
          </BaseChart>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BaseChart from '~/components/charts/BaseChart.vue'
import { useGraphsPage } from '~/composables/graphs/useGraphsPage'
import { useGraphsCharts } from '~/composables/graphs/useGraphsCharts'
import { useGraphsExport } from '~/composables/graphs/useGraphsExport'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { onMounted } from 'vue'

const {
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
} = useGraphsPage()

const {
  utilizationChartOptions,
  spentChartOptions,
  comparisonChartOptions,
  departmentChartOptions,
} = useGraphsCharts(
  averageUtilization,
  dailyExpenses,
  monthlyExpenses,
  monthlyComparison,
  departmentUtilization,
  spentView
)

const {
  isExporting,
  selectedGraphs,
  selectedGraphsCount,
  toggleGraphSelection,
  selectAllGraphs,
  deselectAllGraphs,
  exportSelectedGraphs,
  exportAllGraphs,
} = useGraphsExport()

const animations = usePageAnimations()

onMounted(async () => {
  await fetchAllData()
  animations.markPageLoaded()
})
</script>
