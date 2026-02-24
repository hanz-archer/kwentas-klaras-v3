<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div ref="scrollContainer" :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ pageTitle }}</h1>
              <p class="text-sm text-gray-500">{{ pageDescription }}</p>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                <button
                  @click="handleFilterChange(PROJECT_FILTER_TYPES.ALL)"
                  :disabled="filteringLoading"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.ALL
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                    filteringLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                >
                  All
                </button>
                <button
                  @click="handleFilterChange(PROJECT_FILTER_TYPES.CURRENT)"
                  :disabled="filteringLoading"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.CURRENT
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                    filteringLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :title="'Projects from ' + new Date().getFullYear() + ' or later'"
                >
                  Current Projects
              </button>
                <button
                  @click="handleFilterChange(PROJECT_FILTER_TYPES.CONTINUING)"
                  :disabled="filteringLoading"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.CONTINUING
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                    filteringLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  :title="'Projects from before ' + new Date().getFullYear()"
                >
                  Continuing Projects
                </button>
                <button
                  @click="handleFilterChange(PROJECT_FILTER_TYPES.DELETED)"
                  :disabled="filteringLoading"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    filterType === PROJECT_FILTER_TYPES.DELETED
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                    filteringLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]"
                  title="View deleted projects"
                >
                  Deleted Projects
                </button>
              </div>
              <button v-if="canManageProjects" @click="goToAddProject" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                Add Project
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              v-if="!loading"
              v-for="(stat, index) in displayStats"
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </template>
            </StatCard>
            <div
              v-else
              v-for="n in 3"
              :key="n"
              class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
            >
              <div class="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex-1 max-w-md">
              <SearchInput
                v-model="searchQuery"
                placeholder="Search project, code, department, location, services..."
              />
            </div>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white flex-1 min-h-[600px] flex flex-col">

            <ProjectsListSkeleton v-if="showLoading || (filterType === PROJECT_FILTER_TYPES.DELETED && deletedProjectsComposable.loading.value) || filteringLoading || pagination.isChangingPage.value" />

            <div v-else-if="!filteringLoading && !pagination.isChangingPage.value && filteredProjects.length === 0" class="text-center py-12 flex-1 flex items-center justify-center">
              <div class="text-gray-400 mb-2">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
              </div>
              <p class="text-gray-600 font-medium">No projects found</p>
              <p class="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
            </div>

            <TransitionGroup v-else-if="!filteringLoading && !pagination.isChangingPage.value" name="list" tag="div" class="space-y-3 flex-1">
              <div
                v-for="(project, index) in paginatedProjects"
                :key="project.id"
                :class="[
                  'animate-card-fade-in',
                  'will-change-all',
                  animations.getStaggeredDelayClass(index, { maxItems: 10 }),
                  'project-card rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200',
                  filterType === PROJECT_FILTER_TYPES.DELETED 
                    ? 'bg-white border border-gray-300 hover:border-gray-400' 
                    : 'bg-white border border-gray-200 hover:border-blue-300'
                ]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div class="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div class="flex-shrink-0">
                      <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ project.name }}</h3>
                        <span v-if="filterType === PROJECT_FILTER_TYPES.DELETED" class="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          Deleted
                        </span>
                        <span v-else-if="project.code" class="px-2 py-0.5 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-700 self-start shrink-0 whitespace-nowrap">
                          {{ project.code }}
                        </span>
                      </div>
                      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span v-if="project.implementingUnit" class="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {{ project.implementingUnit }}
                          </span>
                          <span v-if="project.location" class="text-sm text-gray-600 truncate">{{ project.location }}</span>
                        </div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <span v-if="project.year" class="text-xs text-gray-400">{{ project.year }}</span>
                          <span v-if="project.startDate || project.endDate" class="text-xs text-gray-500">
                            {{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}
                          </span>
                        </div>
                      </div>
                      <div class="mt-1 flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-bold text-gray-900">₱{{ formatNumber(project.appropriation) }}</span>
                        <span v-if="project.totalAddedBudget && project.totalAddedBudget > 0" class="text-sm font-semibold text-green-600">
                          +₱{{ formatNumber(project.totalAddedBudget) }} added
                        </span>
                      </div>
                      <div v-if="filterType !== PROJECT_FILTER_TYPES.DELETED" class="mt-4 pt-4 border-t border-gray-100">
                        <button
                          @click.stop="toggleFinancialInfo(project.id!)"
                          class="flex items-center justify-start gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors w-full text-left pl-0"
                        >
                          <svg 
                            class="w-3 h-3 transition-transform flex-shrink-0"
                            :class="{ 'rotate-90': expandedFinancialInfoId === project.id }"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                          <span>Budget & Financial Information</span>
                        </button>
                        
                        <div 
                          v-if="expandedFinancialInfoId === project.id"
                          class="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                        >
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Total Budget</p>
                            <p class="text-sm font-bold text-gray-900 break-words">₱{{ formatNumber(getTotalBudget(project)) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Added Budget</p>
                            <p class="text-sm font-bold text-gray-900 break-words">₱{{ formatNumber(project.totalAddedBudget || 0) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Remaining Balance</p>
                            <p class="text-sm font-bold break-words" :class="getRemainingBalance(project) >= 0 ? 'text-green-600' : 'text-red-600'">
                              ₱{{ formatNumber(getRemainingBalance(project)) }}
                            </p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Total Obligations</p>
                            <p class="text-sm font-bold text-gray-900 break-words">₱{{ formatNumber(getProjectFinancialData(project.id!)?.totalObligations || 0) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Remaining Obligations</p>
                            <p class="text-sm font-bold text-orange-600 break-words">₱{{ formatNumber(getProjectFinancialData(project.id!)?.remainingObligations || 0) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Total Disbursements</p>
                            <p class="text-sm font-bold text-gray-900 break-words">₱{{ formatNumber(getProjectFinancialData(project.id!)?.totalDisbursements || 0) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Approved Disbursements</p>
                            <p class="text-sm font-bold text-green-600 break-words">₱{{ formatNumber(getProjectFinancialData(project.id!)?.approvedDisbursements || 0) }}</p>
                          </div>
                          <div class="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                            <p class="text-xs font-medium text-gray-500 mb-1">Utilization Rate</p>
                            <p class="text-sm font-bold break-words" :class="getUtilizationRate(project) >= 100 ? 'text-red-600' : getUtilizationRate(project) >= 80 ? 'text-yellow-600' : 'text-green-600'">
                              {{ formatUtilizationRate(getUtilizationRate(project)) }}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                    <button v-if="filterType === PROJECT_FILTER_TYPES.DELETED && canManageProjects" @click.stop="handleRestoreClick(project)" class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Restore
                    </button>
                    <button v-else @click.stop="goToProject(project)" class="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto">
                      View Project
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <Pagination
              v-if="!loading && !filteringLoading && !pagination.isChangingPage.value && filteredProjects.length > 0"
              :current-page="pagination.currentPage.value"
              :total-pages="pagination.totalPages.value"
              :total-items="filteredProjects.length"
              :items-per-page="pagination.itemsPerPage"
              @previous="pagination.previousPage"
              @next="pagination.nextPage"
              @go-to-page="pagination.goToPage"
            />
          </section>
        </div>
      </div>
    </main>

    <div v-if="saveError" class="fixed top-4 right-4 z-[10000]">
      <ErrorMessage :message="saveError" />
    </div>

    <ConfirmModal
      :is-open="showRestoreModal"
      :title="MODAL_MESSAGES.RESTORE_PROJECT.title"
      :message="restoreModalMessage"
      :confirm-text="MODAL_MESSAGES.RESTORE_PROJECT.confirmText"
      :cancel-text="MODAL_MESSAGES.RESTORE_PROJECT.cancelText"
      :loading="restoreLoading"
      :loading-text="MODAL_MESSAGES.RESTORE_PROJECT.loadingText"
      @confirm="onConfirmRestore"
      @cancel="closeRestoreModal"
    />
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import ProjectsListSkeleton from '~/components/skeletons/admin/projects/ProjectsListSkeleton.vue'
import { MODAL_MESSAGES } from '~/constants/ui/modalMessages'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectSearch } from '~/composables/project/useProjectSearch'
import { useDeletedProjects } from '~/composables/project/useDeletedProjects'
import { useErrorHandler } from '~/composables/error/useErrorHandler'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { useProjectListActions } from '~/composables/project/useProjectListActions'
import { useProjectFinancials } from '~/composables/project/useProjectFinancials'
import type { Project } from '~/types/project/project'
import { PROJECT_FILTER_TYPES, type ProjectFilterType } from '~/constants/project/filterTypes'
import { getIconBgColor } from '~/constants/ui/statColors'
import { useUserPermissions } from '~/composables/user/useUserPermissions'
import { useLoadingState } from '~/composables/ui/useLoadingState'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { usePagination } from '~/composables/ui/usePagination'
import Pagination from '~/components/ui/Pagination.vue'

const searchQuery = ref('')
const filterType = ref<ProjectFilterType>(PROJECT_FILTER_TYPES.ALL)
const filteringLoading = ref(false)

const { projects, loading, saveError, fetchProjects, projectStats } = useProjects()
const deletedProjectsComposable = useDeletedProjects()
const { canManageProjects } = useUserPermissions()

const fetchDeletedProjects = deletedProjectsComposable.fetchDeletedProjects
const restoreProject = deletedProjectsComposable.restoreProject

const { showLoading, markAsLoaded } = useLoadingState(loading)
const animations = usePageAnimations()
const displayStats = computed(() => projectStats.value.slice(0, 3))
const { filteredProjects: searchFilteredProjects } = useProjectSearch(projects, searchQuery)
const { formatNumber, formatDate } = useProjectFormatting()

const pageTitle = computed(() => {
  if (filterType.value === PROJECT_FILTER_TYPES.CURRENT) {
    return 'Current Projects'
  }
  if (filterType.value === PROJECT_FILTER_TYPES.CONTINUING) {
    return 'Continuing Projects'
  }
  if (filterType.value === PROJECT_FILTER_TYPES.DELETED) {
    return 'Deleted Projects'
  }
  return 'All Projects'
})

const pageDescription = computed(() => {
  const currentYear = new Date().getFullYear()
  if (filterType.value === PROJECT_FILTER_TYPES.CURRENT) {
    return `Projects from ${currentYear} or later`
  }
  if (filterType.value === PROJECT_FILTER_TYPES.CONTINUING) {
    return `Projects from before ${currentYear}`
  }
  if (filterType.value === PROJECT_FILTER_TYPES.DELETED) {
    return 'View and restore deleted projects'
  }
  return 'Manage and track all projects'
})

const handleFilterChange = async (newFilterType: ProjectFilterType) => {
  if (filterType.value === newFilterType || filteringLoading.value) return

  filteringLoading.value = true
  filterType.value = newFilterType

  if (newFilterType === PROJECT_FILTER_TYPES.DELETED) {
    await fetchDeletedProjects()
  } else {
    await fetchProjects()
  }

  setTimeout(() => {
    filteringLoading.value = false
  }, 300)
}

// Manage multiple project financial instances (lazy-loaded when expanded)
// All calculations use useProjectFinancials (single source of truth)
const projectFinancialInstances = ref<Map<string, any>>(new Map())
const projectFinancialData = ref<Map<string, {
  totalObligations: number
  remainingObligations: number
  totalDisbursements: number
  approvedDisbursements: number
}>>(new Map())

const hasFinancialData = (projectId: string) => {
  return projectFinancialInstances.value.has(projectId)
}

const loadProjectFinancialData = async (projectId: string) => {
  if (hasFinancialData(projectId)) return
  
  try {
    const financials = useProjectFinancials(projectId)
    await financials.loadFinancials()
    projectFinancialInstances.value.set(projectId, financials)
    
    const project = projects.value.find(p => p.id === projectId) || null
    projectFinancialData.value.set(projectId, {
      totalObligations: financials.totalObligations.value,
      remainingObligations: financials.remainingObligations.value,
      totalDisbursements: financials.totalDisbursements.value,
      approvedDisbursements: financials.approvedDisbursements.value,
    })
  } catch (error) {
    console.error('Failed to load financial data:', error)
  }
}

const getProjectFinancialData = (projectId: string) => {
  return projectFinancialData.value.get(projectId) || {
    totalObligations: 0,
    remainingObligations: 0,
    totalDisbursements: 0,
    approvedDisbursements: 0,
  }
}

// All calculations use useProjectFinancials (single source of truth)
const getTotalBudget = (project: Project) => {
  const financials = projectFinancialInstances.value.get(project.id!)
  if (financials) {
    return financials.getTotalBudget(project)
  }
  // Use calculation logic from useProjectFinancials (single source of truth)
  const tempFinancials = useProjectFinancials(project.id!)
  return tempFinancials.getTotalBudget(project)
}

const getUtilizationRate = (project: Project) => {
  const financials = projectFinancialInstances.value.get(project.id!)
  if (financials) {
    return financials.getUtilizationRate(project)
  }
  // Fallback: Use cached data with calculation logic from useProjectFinancials
  const financialData = getProjectFinancialData(project.id!)
  const tempFinancials = useProjectFinancials(project.id!)
  const totalBudget = tempFinancials.getTotalBudget(project)
  if (totalBudget === 0) return 0
  return (financialData.approvedDisbursements / totalBudget) * 100
}

const getRemainingBalance = (project: Project) => {
  const financials = projectFinancialInstances.value.get(project.id!)
  if (financials) {
    return financials.getRemainingBalance(project)
  }
  // Fallback: Use cached data with calculation logic from useProjectFinancials
  const financialData = getProjectFinancialData(project.id!)
  const tempFinancials = useProjectFinancials(project.id!)
  const totalBudget = tempFinancials.getTotalBudget(project)
  return totalBudget - financialData.totalDisbursements
}

const formatUtilizationRate = (rate: number) => {
  const financials = projectFinancialInstances.value.values().next().value
  if (financials) {
    return financials.formatUtilizationRate(rate)
  }
  // Create temporary instance to use its formatting logic (single source of truth)
  const tempFinancials = useProjectFinancials('temp')
  return tempFinancials.formatUtilizationRate(rate)
}

const {
  expandedFinancialInfoId,
  goToProject,
  goToAddProject,
  toggleFinancialInfo: toggleFinancialInfoAction,
  setupClickOutside,
} = useProjectListActions(fetchProjects, loadProjectFinancialData)

const toggleFinancialInfo = (projectId: string) => {
  toggleFinancialInfoAction(projectId, hasFinancialData)
}

const { filteredProjects: deletedSearchFiltered } = useProjectSearch(deletedProjectsComposable.projects, searchQuery)

const filteredProjects = computed(() => {
  if (filterType.value === PROJECT_FILTER_TYPES.DELETED) {
    return deletedSearchFiltered.value
  }

  if (filterType.value === PROJECT_FILTER_TYPES.ALL) {
    return searchFilteredProjects.value
  }

  const currentYear = new Date().getFullYear()

  return searchFilteredProjects.value.filter((project) => {
    if (!project.year) return false

    if (filterType.value === PROJECT_FILTER_TYPES.CURRENT) {
      return project.year >= currentYear
    }

    if (filterType.value === PROJECT_FILTER_TYPES.CONTINUING) {
      return project.year < currentYear
    }

    return true
  })
})

const scrollContainer = ref<HTMLElement | null>(null)
const pagination = usePagination(filteredProjects, 10)
const paginatedProjects = computed(() => pagination.paginatedItems.value)

const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch(() => pagination.currentPage.value, () => {
  scrollToTop()
})

watch(filteredProjects, () => {
  pagination.reset()
})

const showRestoreModal = ref(false)
const restoreLoading = ref(false)
const projectToRestore = ref<Project | null>(null)
const restoreModalMessage = computed(() => {
  if (projectToRestore.value) {
    return `Are you sure you want to restore "${projectToRestore.value.name}"?`
  }
  return MODAL_MESSAGES.RESTORE_PROJECT.message
})

const handleRestoreClick = (project: Project) => {
  if (!project.id) return
  projectToRestore.value = project
  showRestoreModal.value = true
}

const closeRestoreModal = () => {
  showRestoreModal.value = false
  projectToRestore.value = null
}

const onConfirmRestore = async () => {
  if (!projectToRestore.value?.id) return
  
  restoreLoading.value = true
  await useErrorHandler(async () => {
    await restoreProject(projectToRestore.value!.id!)
    if (filterType.value === PROJECT_FILTER_TYPES.DELETED) {
      await fetchDeletedProjects()
    } else {
      await fetchProjects()
    }
    closeRestoreModal()
  }, {
    defaultMessage: 'Failed to restore project',
  })
  restoreLoading.value = false
}

onMounted(async () => {
  await fetchProjects()
  markAsLoaded()
  animations.markPageLoaded()
  setupClickOutside()
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
