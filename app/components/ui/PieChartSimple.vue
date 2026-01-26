<template>
  <div v-if="title" class="bg-white rounded-xl shadow-sm border border-gray-300 animate-fade-in">
    <div class="p-4 lg:p-6 border-b border-gray-300">
      <h2 class="text-lg lg:text-xl font-bold text-brand-blue tracking-tight">{{ title }}</h2>
    </div>
    <div class="p-4 lg:p-6">
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
      </div>
      <div v-else-if="error" class="flex items-center justify-center py-12">
        <div class="text-center">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>
      </div>
      <div v-else>
        <div ref="chartRef" :class="title ? 'min-h-[350px]' : 'w-full h-full'"></div>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent"></div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
    <div v-else ref="chartRef" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'

interface Props {
  title: string
  series: number[]
  options: Record<string, unknown>
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
})

const chartRef = ref<HTMLElement | null>(null)
type ApexChartInstance = {
  render: () => unknown
  destroy: () => void
}

type ApexChartsConstructor = new (el: HTMLElement, opts: Record<string, unknown>) => ApexChartInstance

let chart: ApexChartInstance | null = null
let ApexCharts: ApexChartsConstructor | null = null

const renderChart = async () => {
  if (!chartRef.value || props.loading || props.error) return

  if (process.client && !ApexCharts) {
    const module = await import('apexcharts')
    ApexCharts = module.default as unknown as ApexChartsConstructor
  }

  if (!ApexCharts) return

  if (chart) {
    chart.destroy()
  }

  const baseChartOptions = (() => {
    const option = props.options.chart
    return typeof option === 'object' && option !== null ? (option as Record<string, unknown>) : {}
  })()

  const chartOptions: Record<string, unknown> = {
    ...props.options,
    series: props.series,
    chart: {
      ...baseChartOptions,
      parentHeightOffset: 0
    }
  }

  chart = new ApexCharts(chartRef.value, chartOptions)
  chart.render()
}

onMounted(() => {
  if (process.client) {
    renderChart()
  }
})

watch(() => [props.series, props.options, props.loading, props.error], () => {
  if (process.client) {
    renderChart()
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

