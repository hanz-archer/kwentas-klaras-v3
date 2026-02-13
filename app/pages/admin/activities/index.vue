<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Activities</h1>
            <p class="text-sm text-gray-500">View all project activities and updates</p>
          </div>

          <div :class="[...animations.cardClasses.value]" class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-300">
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-gray-900">All Activities</h3>
                      <p class="text-xs text-gray-500">{{ filteredActivities.length }} total activities</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                    <button
                      @click="filterType = 'all'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'all'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      All
                    </button>
                    <button
                      @click="filterType = 'created'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'created'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      Created
                    </button>
                    <button
                      @click="filterType = 'updated'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'updated'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      Updated
                    </button>
                    <button
                      @click="filterType = 'disbursement_added'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'disbursement_added'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      Disbursements
                    </button>
                    <button
                      @click="filterType = 'obligation_added'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'obligation_added'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      Obligations
                    </button>
                    <button
                      @click="filterType = 'budget_added'"
                      :disabled="loading"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        filterType === 'budget_added'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900',
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      Budgets
                    </button>
                  </div>
                  <div class="flex-1">
                    <SearchInput
                      v-model="searchQuery"
                      placeholder="Search by action, description, or project ID..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="loading" class="p-6">
              <div class="space-y-4">
                <div v-for="i in 5" :key="i" class="animate-pulse">
                  <div class="h-24 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            <div v-else-if="error" class="p-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>

            <div v-else-if="filteredActivities.length === 0" class="p-6">
              <div class="text-center py-12">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-sm font-medium text-gray-900 mb-1">No activities found</p>
                <p class="text-xs text-gray-500">
                  {{ searchQuery || filterType !== 'all' ? 'Try adjusting your search or filter criteria.' : 'Activities will appear here as projects are updated' }}
                </p>
              </div>
            </div>

            <div v-else>
              <div class="relative pl-4 pr-4 lg:pl-6 lg:pr-6 pt-4 lg:pt-6 pb-4 lg:pb-6 overflow-y-auto custom-scrollbar">
                <div class="absolute left-4 lg:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/30 to-brand-green/30 rounded-full"></div>
                <div class="space-y-6">
                  <div
                    v-for="(activity, index) in paginatedItems"
                    :key="activity.id"
                    :class="[
                      'relative pl-8',
                      animations.getStaggeredDelayClass(index, { maxItems: 50 }),
                    ]"
                    :style="{ animationDelay: `${index * 0.03}s` }"
                  >
                    <div class="absolute left-0 top-2 w-0.5 h-full bg-gradient-to-b from-brand-blue/30 to-brand-green/30"></div>
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-brand-blue/50 transition-colors">
                      <div class="space-y-2">
                        <div class="flex items-center gap-2">
                          <div class="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center border-2 border-brand-blue flex-shrink-0">
                            <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div class="flex-1">
                            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Action:</span>
                            <p class="text-sm font-bold text-gray-900 mt-1">{{ formatAction(activity.action) }}</p>
                          </div>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description:</span>
                          <p class="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{{ stripHtmlTags(activity.description || '') }}</p>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Project ID:</span>
                          <p class="text-sm text-gray-700 mt-1 font-mono">{{ activity.projectId }}</p>
                        </div>
                        <div v-if="activity.userId">
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID:</span>
                          <p class="text-sm text-gray-700 mt-1 font-mono">{{ activity.userId }}</p>
                        </div>
                        <div v-if="activity.metadata">
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Metadata:</span>
                          <p class="text-sm text-gray-700 mt-1 font-mono break-all">{{ activity.metadata }}</p>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created At:</span>
                          <p class="text-sm text-gray-700 mt-1">{{ formatDateTime(activity.createdAt) }}</p>
                        </div>
                        <div>
                          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time Ago:</span>
                          <p class="text-sm text-gray-500 mt-1">{{ formatTimeAgo(activity.createdAt) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Pagination
                v-if="!loading && !pagination.isChangingPage.value && filteredActivities.length > 0"
                :current-page="pagination.currentPage.value"
                :total-pages="pagination.totalPages.value"
                :total-items="filteredActivities.length"
                :items-per-page="pagination.itemsPerPage"
                @previous="pagination.previousPage"
                @next="pagination.nextPage"
                @go-to-page="pagination.goToPage"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { ProjectActivity } from '~/types/project/projectActivity'
import { useErrorHandler } from '~/composables/error/useErrorHandler'
import { useAuthHeaders } from '~/composables/auth/useAuthHeaders'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { usePagination } from '~/composables/ui/usePagination'
import { stripHtmlTags } from '~/utils/htmlUtils'
import Pagination from '~/components/ui/Pagination.vue'
import SearchInput from '~/components/ui/SearchInput.vue'

const activities = ref<ProjectActivity[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const animations = usePageAnimations()
const searchQuery = ref('')
const filterType = ref<'all' | 'created' | 'updated' | 'deleted' | 'restored' | 'disbursement_added' | 'obligation_added' | 'budget_added'>('all')

// Filter activities based on search query and filter type
const filteredActivities = computed(() => {
  let filtered = activities.value

  // Apply filter by action type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(activity => activity.action === filterType.value)
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(activity => {
      const action = formatAction(activity.action).toLowerCase()
      const description = stripHtmlTags(activity.description || '').toLowerCase()
      const projectId = activity.projectId.toLowerCase()
      
      return action.includes(query) || 
             description.includes(query) || 
             projectId.includes(query)
    })
  }

  return filtered
})

const pagination = usePagination(filteredActivities, 10)
const paginatedItems = computed(() => pagination.paginatedItems.value)

const formatAction = (action: string): string => {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'Invalid Date'
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

const formatTimeAgo = (date: string | Date | null | undefined): string => {
  if (!date) return 'Unknown time'
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return 'Invalid Date'
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

const fetchActivities = async () => {
  loading.value = true
  error.value = null

  await useErrorHandler(async () => {
    const headers = await useAuthHeaders()
    const response = await $fetch<{ success: boolean; activities: ProjectActivity[] }>('/api/activities', { headers })
    
    if (response.success) {
      activities.value = response.activities
    }
  }, {
    defaultMessage: 'Failed to fetch activities',
    onError: (err) => {
      error.value = err.message
    }
  })

  loading.value = false
}

onMounted(async () => {
  await fetchActivities()
  animations.markPageLoaded()
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 2px 0 0 2px;
  margin-right: 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94A3B8;
}
</style>
