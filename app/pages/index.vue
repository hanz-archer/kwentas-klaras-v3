<template>
  <div class="w-full min-h-screen bg-white overflow-x-hidden">
    <div class="container px-4 sm:px-6 mx-auto min-h-screen flex flex-col">
      <div class="fixed top-4 right-4 z-50">
        <div class="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
          <span class="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Have an account?</span>
          <button
            @click="navigateTo('/auth/login')"
            class="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Login to Kwentas Klaras
          </button>
        </div>
      </div>
      <section class="bg-white min-h-[calc(100vh-5rem)] mt-20 flex flex-col flex-1">
        <div class="mb-8 pt-6 pb-6 border-b border-gray-300">
          <div class="flex flex-col mb-6">
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Kwentas Klaras Digital PMIS</h1>
              <p class="text-base sm:text-lg text-gray-600">Welcome to the Project Management Information System</p>
            </div>
            <div v-if="!loading && !error && filteredProjects.length > 0" class="flex items-center gap-6 mt-4">
              <div>
                <div class="text-sm text-gray-600">Next in</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-900">{{ Math.ceil(countdown) }}s</div>
              </div>
              <div>
                <div class="text-sm text-gray-600">Remaining</div>
                <div class="text-xl sm:text-2xl font-bold text-gray-900">{{ remainingProjects }}</div>
              </div>
            </div>
          </div>
          <div v-if="!loading && !error && projects.length > 0" class="space-y-3">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
              <div class="relative flex-1 sm:flex-initial min-w-[150px]">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select
                  v-model="filters.department"
                  class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">All Departments</option>
                  <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">{{ dept }}</option>
                </select>
              </div>
              <div class="relative flex-1 sm:flex-initial min-w-[150px]">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select
                  v-model="filters.year"
                  class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">All Years</option>
                  <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>
              <div class="relative flex-1 sm:flex-initial min-w-[150px]">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select
                  v-model="filters.location"
                  class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">All Locations</option>
                  <option v-for="loc in uniqueLocations" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <div class="relative flex-1 sm:flex-initial min-w-[150px]">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <select
                  v-model="filters.services"
                  class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="">All Services</option>
                  <option v-for="service in uniqueServices" :key="service" :value="service">{{ service }}</option>
                </select>
              </div>
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            </div>
            <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-600">Active filters:</span>
              <span
                v-if="filters.department"
                class="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                Department: {{ filters.department }}
                <button @click="filters.department = ''" class="hover:text-blue-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              <span
                v-if="filters.year"
                class="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                Year: {{ filters.year }}
                <button @click="filters.year = ''" class="hover:text-blue-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              <span
                v-if="filters.location"
                class="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                Location: {{ filters.location }}
                <button @click="filters.location = ''" class="hover:text-blue-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              <span
                v-if="filters.services"
                class="inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                Services: {{ filters.services }}
                <button @click="filters.services = ''" class="hover:text-blue-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-4"
          mode="out-in"
        >
          <div v-if="showLoading || !showContent" key="loader" class="w-full flex-1 flex items-center justify-center">
            <div class="text-center space-y-4 max-w-md w-full px-6">
              <div class="space-y-3">
                <h3 class="text-2xl font-bold text-gray-900">Updating Data</h3>
                <p class="text-sm text-gray-600">Please wait while we fetch the latest project information...</p>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  :style="{ width: `${progressPercentage}%`, backgroundSize: '200% 100%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-2">{{ progressPercentage }}%</p>
            </div>
          </div>

          <div v-else-if="error" key="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mx-auto max-w-2xl">
            <p class="text-red-800">{{ error }}</p>
          </div>

          <div v-else-if="filteredProjects.length === 0" key="empty" class="text-center w-full py-12 flex-1 flex items-center justify-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-lg font-medium text-gray-900 mb-1">No projects found</p>
            <p class="text-sm text-gray-500">Projects will appear here when added</p>
          </div>

          <div v-else key="content" class="w-full flex-1 relative min-h-0 overflow-hidden">
            <Transition name="fade" mode="out-in">
              <div
                v-if="currentProject"
                :key="currentIndex"
                class="carousel-item w-full h-full"
              >
                <div class="w-full h-full overflow-y-auto py-6">
                  <div class="mx-auto w-full max-w-7xl">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                      <div class="min-w-0 space-y-6">
                        <div class="min-w-0">
                          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {{ currentProject.name }}
                          </h1>
                          <h2 class="mt-2 text-lg sm:text-xl lg:text-2xl font-medium text-gray-600 break-words">
                            {{ currentProject.implementingUnit }}
                          </h2>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                          <span
                            :class="[
                              'inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base',
                              utilizationRateNumber < 20
                                ? 'text-red-800 bg-red-100'
                                : utilizationRateNumber < 50
                                  ? 'text-yellow-800 bg-yellow-100'
                                  : 'text-green-800 bg-green-100'
                            ]"
                          >
                            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                            </svg>
                            <span class="min-w-0">
                              <span v-if="utilizationRateNumber < 20">Budget Underutilized</span>
                              <span v-else-if="utilizationRateNumber < 50">Above 20% Utilization Rate</span>
                              <span v-else>Above 50% Utilization Rate</span>
                            </span>
                          </span>
                        </div>

                        <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                            <div class="flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Code</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                                  {{ currentProject.code || 'N/A' }}
                                </dd>
                              </div>
                            </div>

                            <div v-if="currentProject.location" class="flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Location</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                                  {{ currentProject.location }}
                                </dd>
                              </div>
                            </div>

                            <div v-if="currentProject.services" class="flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Services</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                                  {{ currentProject.services }}
                                </dd>
                              </div>
                            </div>

                            <div class="flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Budget</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                                  ₱{{ formatNumber(getTotalBudget(currentProject)) }}
                                </dd>
                              </div>
                            </div>

                            <div class="flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Balance</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words">
                                  ₱{{ formatNumber(getRemainingBalance(currentProject)) }}
                                </dd>
                              </div>
                            </div>

                            <div v-if="currentProject.remarks" class="sm:col-span-2 flex gap-3 min-w-0">
                              <div class="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                <svg class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                  <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                              </div>
                              <div class="min-w-0">
                                <dt class="text-xs font-medium text-gray-500">Remarks</dt>
                                <dd class="mt-1 text-sm sm:text-base font-semibold text-gray-900 break-words whitespace-pre-line">
                                  {{ currentProject.remarks }}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <div class="w-full">
                        <div class="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                          <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                            Utilization Rate:
                            <span class="ml-1 text-gray-900 whitespace-nowrap">
                              {{ clampPercentage(utilizationRateNumber).toFixed(1) }}%
                            </span>
                          </h3>
                          <div class="mx-auto w-full max-w-[28rem] lg:max-w-[32rem] aspect-square">
                            <PieChartSimple
                              :title="''"
                              :series="utilizationChartSeries"
                              :options="utilizationChartOptions"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import PieChartSimple from '~/components/ui/PieChartSimple.vue'
import { useProjects } from '~/composables/project/useProjects'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { useProjectCarousel } from '~/composables/project/useProjectCarousel'
import { useProjectFilters } from '~/composables/project/useProjectFilters'
import { useProjectFinancials } from '~/composables/project/useProjectFinancials'
import { useLoadingState } from '~/composables/ui/useLoadingState'
import '~/assets/css/projectCarousel.css'

definePageMeta({
  layout: false,
})

const { projects, loading, error, fetchProjects } = useProjects()
const { formatNumber } = useProjectFormatting()

const { filters, filteredProjects, uniqueDepartments, uniqueYears, uniqueLocations, uniqueServices, resetFilters } = useProjectFilters(projects)

const { currentIndex, currentProject, countdown, remainingProjects, startAutoPlay, stopAutoPlay } = useProjectCarousel(filteredProjects)

const currentProjectId = computed<string | null>(() => currentProject.value?.id ?? null)
const {
  loadFinancials,
  getTotalBudget,
  getRemainingBalance,
  getUtilizationRate,
} = useProjectFinancials(currentProjectId)

const { showLoading, markAsLoaded } = useLoadingState(loading)
const showContent = ref(false)
const progressPercentage = ref(0)

watch(filteredProjects, (newProjects) => {
  if (newProjects.length > 1) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
})

watch(currentProjectId, async (id) => {
  if (!id) return
  await loadFinancials()
}, { immediate: true })

const animateProgressBar = (duration: number) => {
  progressPercentage.value = 0
  const startTime = Date.now()
  const interval = 16
  
  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min((elapsed / duration) * 100, 100)
    progressPercentage.value = Math.round(progress)
    
    if (progress < 100) {
      setTimeout(updateProgress, interval)
    } else {
      progressPercentage.value = 100
    }
  }
  
  updateProgress()
}

onMounted(async () => {
  const startTime = Date.now()
  
  const minDelay = 3000
  const maxDelay = 1000
  const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
  
  animateProgressBar(randomDelay)
  
  await fetchProjects()
  
  const elapsedTime = Date.now() - startTime
  const remainingDelay = Math.max(0, randomDelay - elapsedTime)
  
  if (remainingDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingDelay))
  }
  
  progressPercentage.value = 100
  showContent.value = true
  markAsLoaded()
  if (filteredProjects.value.length > 1) {
    startAutoPlay()
  }
})

onBeforeUnmount(() => {
  stopAutoPlay()
})

const utilizationRateNumber = computed<number>(() => {
  return getUtilizationRate(currentProject.value)
})

const clampPercentage = (value: number): number => {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(value, 100))
}

const utilizationChartSeries = computed<number[]>(() => {
  const rate = clampPercentage(utilizationRateNumber.value)
  return [rate, 100 - rate]
})

type PieChartOptions = Record<string, unknown>
const utilizationChartOptions = computed<PieChartOptions>(() => {
  const utilizationRate = clampPercentage(utilizationRateNumber.value)

  return {
    chart: {
      type: 'donut',
      // Use a numeric height; the container is sized via Tailwind.
      // (Percent heights can cause ApexCharts layout issues.)
      height: 350,
      animations: {
        enabled: true,
        easing: 'cubicBezier(0.4, 0, 0.2, 1)',
        speed: 1400,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 550,
        },
      },
      background: 'transparent',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    labels: ['Utilized Budget', 'Remaining Budget'],
    colors: ['#10B981', '#3B82F6'],
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '18px',
      fontWeight: 600,
      markers: {
        width: 14,
        height: 14,
        radius: 7,
      },
      itemMargin: {
        horizontal: 15,
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: false,
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Utilization Rate',
              fontSize: '24px',
              fontWeight: 700,
              color: '#1E293B',
              formatter: () => `${utilizationRate.toFixed(1)}%`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: { height: 320 },
          legend: { fontSize: '14px' },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: { fontSize: '20px' },
                },
              },
            },
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          legend: { fontSize: '12px' },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  total: { fontSize: '18px' },
                },
              },
            },
          },
        },
      },
    ],
    // Avoid confusing "100% remaining" slice labels when utilization is 0%
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
  }
})

const hasActiveFilters = computed(() => {
  return Boolean(filters.value.department || filters.value.year || filters.value.location || filters.value.services)
})
</script>
