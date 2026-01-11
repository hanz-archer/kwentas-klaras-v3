<template>
  <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-300">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 flex items-center justify-center">
            <slot name="icon">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </slot>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            <p v-if="description" class="text-xs text-gray-500">{{ description }}</p>
          </div>
        </div>
        <slot name="actions" />
      </div>
    </div>
    <div class="p-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
      <div v-else ref="chartContainerRef" :data-graph-section="props.graphSection">
        <div ref="chartRef" class="min-h-[450px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'

interface Props {
  title: string
  description?: string
  options: any
  loading?: boolean
  error?: string | null
  graphSection?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  description: '',
  graphSection: '',
})

const chartRef = ref<HTMLElement | null>(null)
const chartContainerRef = ref<HTMLElement | null>(null)
let chart: any = null
let ApexCharts: any = null

const renderChart = async () => {
  if (props.loading || props.error) return
  
  if (!process.client) return
  
  await nextTick()
  
  if (!chartRef.value) return

  if (!ApexCharts) {
    ApexCharts = (await import('apexcharts')).default
  }

  if (!ApexCharts) return

  if (chart) {
    chart.destroy()
    chart = null
  }

  const chartOptions = {
    ...props.options,
    chart: {
      ...props.options.chart,
      parentHeightOffset: 0,
      id: props.graphSection || undefined,
    },
  }

  try {
    chart = new ApexCharts(chartRef.value, chartOptions)
    await chart.render()
    if (chartContainerRef.value && props.graphSection) {
      (chartContainerRef.value as any).__apexcharts = chart
    }
  } catch (error) {
    console.error('Error rendering chart:', error)
  }
}

onMounted(async () => {
  if (process.client) {
    await nextTick()
    await renderChart()
  }
})

watch(() => [props.options, props.loading, props.error], async () => {
  if (process.client) {
    await nextTick()
    await renderChart()
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
  if (chartContainerRef.value) {
    (chartContainerRef.value as any).__apexcharts = null
  }
})

defineExpose({
  getChart: () => chart,
})
</script>
