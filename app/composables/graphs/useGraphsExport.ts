import { ref, computed } from 'vue'
import { GRAPH_SECTIONS, type GraphSection } from './useGraphsPage'

export const useGraphsExport = () => {
  const isExporting = ref(false)
  const exportMessage = ref<string>('')
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

  const exportSelectedGraphs = async (onSuccess?: () => void) => {
    if (selectedGraphs.value.size === 0) return

    isExporting.value = true
    try {
      for (const section of selectedGraphs.value) {
        await exportGraph(section)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      if (onSuccess) {
        onSuccess()
      }
    } finally {
      isExporting.value = false
    }
  }

  const exportAllGraphs = async (showSectionFn?: (section: GraphSection) => void, onSuccess?: () => void) => {
    isExporting.value = true
    exportMessage.value = 'Generating report...'
    try {
      const allSections = Object.values(GRAPH_SECTIONS)
      const images: { dataURI: string; section: GraphSection }[] = []
      const sectionNames: Record<GraphSection, string> = {
        [GRAPH_SECTIONS.UTILIZATION]: 'Utilization Rate',
        [GRAPH_SECTIONS.SPENT]: 'Spent',
        [GRAPH_SECTIONS.COMPARISON]: 'Comparison',
        [GRAPH_SECTIONS.DEPARTMENT]: 'Department',
      }

      for (const section of allSections) {
        if (showSectionFn) {
          exportMessage.value = `Generating report... (${sectionNames[section]})`
          showSectionFn(section)
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        await new Promise(resolve => setTimeout(resolve, 200))
        const chartElement = document.querySelector(`[data-graph-section="${section}"]`)
        if (!chartElement) {
          continue
        }

        const chartInstance = (chartElement as any).__apexcharts
        if (chartInstance && typeof chartInstance.dataURI === 'function') {
          try {
            const dataURL = await chartInstance.dataURI()
            const imageUri = 'imgURI' in dataURL ? dataURL.imgURI : URL.createObjectURL(dataURL.blob)
            images.push({ dataURI: imageUri, section })
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
                const imageUri = 'imgURI' in dataURL ? dataURL.imgURI : URL.createObjectURL(dataURL.blob)
                images.push({ dataURI: imageUri, section })
              }
            } catch (error) {
              console.error(`Error exporting ${section} chart:`, error)
            }
          }
        }
      }

      exportMessage.value = 'Fetching projects data...'
      const projectsResponse = await $fetch<{ success: boolean; projects: any[] }>('/api/projects/reports')
      const projects = projectsResponse.success ? projectsResponse.projects : []

      if (images.length > 0) {
        exportMessage.value = 'Creating PDF...'
        await generatePDFReport(images, projects)
        isExporting.value = false
        exportMessage.value = ''
        if (onSuccess) {
          onSuccess()
        }
      } else {
        isExporting.value = false
        exportMessage.value = ''
      }
    } catch (error) {
      console.error('Error exporting all graphs:', error)
      isExporting.value = false
      exportMessage.value = ''
      throw error
    }
  }

  const generatePDFReport = async (images: { dataURI: string; section: GraphSection }[], projects: any[]): Promise<void> => {
    const jsPDF = (await import('jspdf')).default
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - (margin * 2)
    let yPosition = margin

    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Graphs & Analytics Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    for (const { dataURI, section } of images) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage()
        yPosition = margin
      }

      const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(sectionTitle, margin, yPosition)
      yPosition += 8

      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
          img.src = dataURI
        })

        const imgWidth = img.width
        const imgHeight = img.height
        const maxImgWidth = contentWidth
        const maxImgHeight = pageHeight - yPosition - 30
        const scale = Math.min(maxImgWidth / imgWidth, maxImgHeight / imgHeight, 1)
        const scaledWidth = imgWidth * scale
        const scaledHeight = imgHeight * scale
        const xPosition = margin + (contentWidth - scaledWidth) / 2

        pdf.addImage(dataURI, 'PNG', xPosition, yPosition, scaledWidth, scaledHeight)
        yPosition += scaledHeight + 15

        if (dataURI.startsWith('blob:')) {
          URL.revokeObjectURL(dataURI)
        }
      } catch (error) {
        console.error(`Error adding image for ${section}:`, error)
        yPosition += 20
      }
    }

    if (projects.length > 0) {
      if (yPosition > pageHeight - 80) {
        pdf.addPage()
        yPosition = margin
      }

      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Projects Summary', margin, yPosition)
      yPosition += 10

      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')

      const tableHeaders = ['Project Name', 'Location', 'Total Budget', 'Disbursements', 'Utilization %']
      const colWidths = [50, 40, 30, 30, 25]
      const colX: number[] = [
        margin,
        margin + (colWidths[0] || 0),
        margin + (colWidths[0] || 0) + (colWidths[1] || 0),
        margin + (colWidths[0] || 0) + (colWidths[1] || 0) + (colWidths[2] || 0),
        margin + (colWidths[0] || 0) + (colWidths[1] || 0) + (colWidths[2] || 0) + (colWidths[3] || 0)
      ]

      pdf.setFont('helvetica', 'bold')
      tableHeaders.forEach((header, i) => {
        const xPos = colX[i]
        if (xPos !== undefined) {
          pdf.text(header, xPos, yPosition)
        }
      })
      yPosition += 7

      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3)
      yPosition += 5

      pdf.setFont('helvetica', 'normal')
      
      for (const project of projects) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = margin
          pdf.setFont('helvetica', 'bold')
          tableHeaders.forEach((header, i) => {
            const xPos = colX[i]
            if (xPos !== undefined) {
              pdf.text(header, xPos, yPosition)
            }
          })
          yPosition += 7
          pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3)
          yPosition += 5
          pdf.setFont('helvetica', 'normal')
        }

        const name = (project.name || '').substring(0, 30)
        const location = (project.location || '').substring(0, 25)
        const totalBudget = project.totalBudget !== undefined && project.totalBudget !== null ? `PHP ${formatNumber(project.totalBudget)}` : 'PHP 0'
        const disbursements = project.totalDisbursements !== undefined && project.totalDisbursements !== null ? `PHP ${formatNumber(project.totalDisbursements)}` : 'PHP 0'
        const utilization = project.utilizationRate !== undefined && project.utilizationRate !== null ? `${project.utilizationRate.toFixed(2)}%` : '0.00%'

        const x0 = colX[0]
        const x1 = colX[1]
        const x2 = colX[2]
        const x3 = colX[3]
        const x4 = colX[4]
        
        if (x0 !== undefined) pdf.text(name, x0, yPosition)
        if (x1 !== undefined) pdf.text(location, x1, yPosition)
        if (x2 !== undefined) pdf.text(totalBudget, x2, yPosition)
        if (x3 !== undefined) pdf.text(disbursements, x3, yPosition)
        if (x4 !== undefined) pdf.text(utilization, x4, yPosition)
        yPosition += 6
      }
    }

    const fileName = `graphs-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num))
  }

  const selectedGraphsCount = computed(() => selectedGraphs.value.size)

  return {
    isExporting,
    exportMessage,
    selectedGraphs,
    selectedGraphsCount,
    toggleGraphSelection,
    selectAllGraphs,
    deselectAllGraphs,
    exportSelectedGraphs,
    exportAllGraphs,
  }
}
