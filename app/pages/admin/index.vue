<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden transition-all duration-300">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <DashboardSkeleton v-if="isLoading" />
        <div v-else class="space-y-8 min-h-screen">
          <PageHeader
            :title="welcomeMessage"
            :description="PAGE_HEADERS.dashboard.description"
            :button-text="dashboardButtonText"
            :button-action="dashboardButtonAction"
            :stats="headerStats"
          >
            <template #icon-0="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </template>
            <template #icon-1="{ stat }">
              <svg :class="`w-5 h-5 ${getStatIconColor(stat.color)}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </template>
          </PageHeader>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <StatCard
              v-for="(stat, index) in stats"
              :key="index"
              :class="[
                ...animations.statCardClasses.value,
                animations.getStaggeredDelayClass(index),
              ]"
              :style="{ animationDelay: `${index * 0.08}s` }"
              :title="stat.title"
              :value="stat.value"
              :change="`${stat.change} from last month`"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <svg v-else-if="index === 2" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </template>
            </StatCard>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            <div class="lg:col-span-2">
              <PieChart
                :key="`chart-${averageUtilizationRate}`"
                :title="utilizationRateTitle"
                :series="chartSeries"
                :options="chartOptions"
              />
            </div>
            <div class="lg:col-span-1">
              <ActivityFeed :activities="limitedActivities" @view-all="handleViewAll" />
            </div>
          </div>
          </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import PageHeader from '~/components/ui/PageHeader.vue'
import ActivityFeed from '~/components/ui/ActivityFeed.vue'
import PieChart from '~/components/ui/PieChart.vue'
import DashboardSkeleton from '~/components/skeletons/admin/DashboardSkeleton.vue'
import { PAGE_HEADERS } from '~/constants/pages/headers'
import { getStatIconColor, getIconBgColor } from '~/constants/ui/statColors'
import { useDashboardStore } from '~/stores/dashboardStore'
import { useUtilizationRate } from '~/composables/dashboard/useUtilizationRate'
import { useUserPermissions } from '~/composables/user/useUserPermissions'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { useWelcomeMessage } from '~/composables/dashboard/useWelcomeMessage'

const dashboardStore = useDashboardStore()
const { activities, stats: dashboardStats, loading: dashboardLoading } = dashboardStore
const { chartOptions, chartSeries, averageUtilizationRate } = useUtilizationRate()
const limitedActivities = computed(() => activities.value.slice(0, 10))
const { canManageProjects } = useUserPermissions()
const animations = usePageAnimations()
const { formatNumber } = useProjectFormatting()
const { welcomeMessage } = useWelcomeMessage()

const utilizationRateTitle = computed(() => {
  const rate = dashboardStats.value?.utilizationRate || 0
  return `Utilization Rate Distribution (Avg: ${rate.toFixed(2)}%)`
})

const dashboardButtonText = computed(() => {
  return canManageProjects.value ? PAGE_HEADERS.dashboard.buttonText : undefined
})

const dashboardButtonAction = computed(() => {
  return canManageProjects.value ? () => { navigateTo('/admin/projects/add') } : undefined
})

const stats = computed(() => {
  if (!dashboardStats.value) {
    return [
      {
        title: 'Total Users',
        value: '0',
        change: '0',
        changeType: 'neutral' as const,
        iconColor: 'text-brand-blue',
        color: 'blue'
      },
      {
        title: 'Active Projects',
        value: '0',
        change: '0',
        changeType: 'neutral' as const,
        iconColor: 'text-purple-600',
        color: 'purple'
      },
      {
        title: 'Total Budget',
        value: '₱0.00',
        change: '0',
        changeType: 'neutral' as const,
        iconColor: 'text-brand-green',
        color: 'green'
      },
      {
        title: 'Total Obligations',
        value: '₱0.00',
        change: '0',
        changeType: 'neutral' as const,
        iconColor: 'text-orange-600',
        color: 'orange'
      }
    ]
  }

  return [
    {
      title: 'Total Users',
      value: dashboardStats.value.totalUsers.toString(),
      change: '0',
      changeType: 'neutral' as const,
      iconColor: 'text-brand-blue',
      color: 'blue'
    },
    {
      title: 'Active Projects',
      value: dashboardStats.value.activeProjects.toString(),
      change: '0',
      changeType: 'neutral' as const,
      iconColor: 'text-purple-600',
      color: 'purple'
    },
    {
      title: 'Total Budget',
      value: `₱${formatNumber(dashboardStats.value.totalBudget)}`,
      change: '0',
      changeType: 'neutral' as const,
      iconColor: 'text-brand-green',
      color: 'green'
    },
    {
      title: 'Total Obligations',
      value: `₱${formatNumber(dashboardStats.value.totalObligations)}`,
      change: '0',
      changeType: 'neutral' as const,
      iconColor: 'text-orange-600',
      color: 'orange'
    }
  ]
})

const headerStats = computed(() => {
  return stats.value.slice(0, 2).map((stat: typeof stats.value[0], index: number) => ({
    ...stat,
    iconIndex: index
  }))
})

const handleViewAll = () => {
  navigateTo('/admin/activities')
}

const isLoading = computed(() => {
  return dashboardLoading.value || !dashboardStats.value
})

onMounted(async () => {
  animations.markPageLoaded()
  await dashboardStore.fetchDashboard()
})
</script>

