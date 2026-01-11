<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Project Reports</h1>
            <p class="text-sm text-gray-500">Overview of project utilization and financial health</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <StatCard
              v-for="(stat, index) in statsCards"
              :key="index"
              :class="[
                ...animations.statCardClasses.value,
                animations.getStaggeredDelayClass(index),
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </template>
            </StatCard>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
              <button
                @click="handleTabChange(REPORT_TABS.ALL)"
                :disabled="loading"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === REPORT_TABS.ALL
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                All
              </button>
              <button
                @click="handleTabChange(REPORT_TABS.BELOW_50)"
                :disabled="loading"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === REPORT_TABS.BELOW_50
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                Below 50%
              </button>
              <button
                @click="handleTabChange(REPORT_TABS.ABOVE_50)"
                :disabled="loading"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === REPORT_TABS.ABOVE_50
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900',
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                Above 50%
              </button>
            </div>
            <button
              v-if="!loading"
              @click="handleExportClick"
              :disabled="selectedProjects.length === 0"
              :class="[
                'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm whitespace-nowrap',
                selectedProjects.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Selected {{ selectedProjects.length > 0 ? `(${selectedProjects.length})` : '' }}
            </button>
          </div>

          <div :class="[...animations.cardClasses.value]" class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-300">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ tabTitle }}</h3>
                    <p class="text-xs text-gray-500">{{ tabDescription }}</p>
                  </div>
                </div>
              </div>
            </div>

            <ReportsTableSkeleton v-if="loading" />

            <div v-else-if="error" class="p-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>

            <div v-else-if="displayProjects.length === 0" class="p-6">
              <div class="text-center py-12">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">No projects found</p>
                <p class="text-xs text-gray-500">No projects match the selected filter</p>
              </div>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        :checked="allSelected"
                        @change="toggleSelectAll"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project Name</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Implementing Unit</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Budget</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Utilization Rate</th>
                    <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(project, index) in displayProjects"
                    :key="project.id"
                    :class="[
                      'hover:bg-gray-50 transition-colors',
                      animations.getStaggeredDelayClass(index, { maxItems: 20 }),
                    ]"
                    :style="{ animationDelay: `${index * 0.03}s` }"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        :checked="isSelected(project.id)"
                        @change="toggleProject(project.id!)"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ project.name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ project.code || 'N/A' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ project.implementingUnit || 'N/A' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ project.location || 'N/A' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-gray-900">₱{{ formatNumber(project.totalBudget) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-bold" :class="project.utilizationRate < 50 ? 'text-red-600' : 'text-green-600'">
                        {{ formatUtilizationRate(project.utilizationRate) }}%
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-semibold rounded-full',
                          project.utilizationRate < 50 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ project.utilizationRate < 50 ? 'Below 50%' : 'Above 50%' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <ConfirmModal
      :is-open="showExportConfirm"
      title="Export to FDP Form 7"
      message="This will download the selected projects as FDP Form 7 - 20% Development Fund Utilization. Do you want to continue?"
      confirm-text="Export"
      cancel-text="Cancel"
      @confirm="confirmExport"
      @cancel="cancelExport"
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import ReportsTableSkeleton from '~/components/skeletons/admin/reports/ReportsTableSkeleton.vue'
import { useReportsPage } from '~/composables/report/useReportsPage'
import { getReportStatsCards } from '~/constants/report/reportStats'
import { getIconBgColor } from '~/constants/ui/statColors'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { computed, onMounted } from 'vue'

const {
  loading,
  error,
  stats,
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
  showExportConfirm,
  handleExportClick,
  confirmExport,
  cancelExport,
  REPORT_TABS,
} = useReportsPage()

const { formatNumber } = useProjectFormatting()
const animations = usePageAnimations()

const statsCards = computed(() => getReportStatsCards(formatUtilizationRate, stats.value))

onMounted(async () => {
  await fetchReports()
  animations.markPageLoaded()
})
</script>
