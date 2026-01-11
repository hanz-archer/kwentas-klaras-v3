import { ref, computed } from 'vue'
import { GRAPH_SECTIONS, type GraphSection } from './useGraphsPage'

export const useGraphsExport = () => {
  const isExporting = ref(false)
  const selectedGraphs = ref<Set<GraphSection>>(new Set())

  const toggleGraphSelection = (section: GraphSection) => {
    if (selectedGraphs.value.has(section)) {
      selectedGraphs.value.delete(section)
    } else {
      selectedGraphs.value.add(section)
    }
  }

  const selectAllGraphs = () => {
    selectedGraphs.value = new Set(Object.values(GRAPH_SECTIONS))
  }

  const deselectAllGraphs = () => {
    selectedGraphs.value.clear()
  }

  const exportGraph = async (section: GraphSection): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const chartElement = document.querySelector(`[data-graph-section="${section}"]`)
    if (!chartElement) {
      return
    }

    const chartInstance = (chartElement as any).__apexcharts
    if (chartInstance && typeof chartInstance.dataURI === 'function') {
      try {
        const dataURL = await chartInstance.dataURI()
        const link = document.createElement('a')
        link.download = `${section}-chart.png`
        link.href = 'imgURI' in dataURL ? dataURL.imgURI : URL.createObjectURL(dataURL.blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        if ('blob' in dataURL) {
          URL.revokeObjectURL(link.href)
        }
      } catch (error) {
        console.error(`Error exporting ${section} chart:`, error)
      }
    } else {
      const ApexCharts = (await import('apexcharts')).default
      if (ApexCharts && typeof ApexCharts.getChartByID === 'function') {
        try {
          const chart = ApexCharts.getChartByID(section)
          if (chart) {
            const dataURL = await chart.dataURI()
            const link = document.createElement('a')
            link.download = `${section}-chart.png`
            link.href = 'imgURI' in dataURL ? dataURL.imgURI : URL.createObjectURL(dataURL.blob)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            if ('blob' in dataURL) {
              URL.revokeObjectURL(link.href)
            }
          }
        } catch (error) {
          console.error(`Error exporting ${section} chart:`, error)
        }
      }
    }
  }

  const exportSelectedGraphs = async () => {
    if (selectedGraphs.value.size === 0) return

    isExporting.value = true
    try {
      for (const section of selectedGraphs.value) {
        await exportGraph(section)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } finally {
      isExporting.value = false
    }
  }

  const exportAllGraphs = async () => {
    isExporting.value = true
    try {
      const allSections = Object.values(GRAPH_SECTIONS)
      for (const section of allSections) {
        await exportGraph(section)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } finally {
      isExporting.value = false
    }
  }

  const selectedGraphsCount = computed(() => selectedGraphs.value.size)

  return {
    isExporting,
    selectedGraphs,
    selectedGraphsCount,
    toggleGraphSelection,
    selectAllGraphs,
    deselectAllGraphs,
    exportSelectedGraphs,
    exportAllGraphs,
  }
}
