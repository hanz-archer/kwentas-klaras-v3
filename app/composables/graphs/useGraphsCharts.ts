import { computed, type Ref } from 'vue'
import { useProjectFormatting } from '../project/useProjectFormatting'

export const useGraphsCharts = (
  averageUtilization: Ref<number>,
  dailyExpenses: Ref<Record<string, number>>,
  monthlyExpenses: Ref<Record<string, number>>,
  monthlyComparison: Ref<{
    months: string[]
    totalDisbursements: Record<string, number>
    totalObligations: Record<string, number>
  }>,
  departmentUtilization: Ref<Record<string, number>>,
  spentView: Ref<'daily' | 'monthly'>
) => {
  const { formatNumber } = useProjectFormatting()

  const utilizationChartOptions = computed(() => ({
    series: [averageUtilization.value],
    chart: {
      type: 'radialBar',
      background: 'transparent',
      height: 450,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1500,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '65%',
          margin: 15,
        },
        track: {
          background: '#E5E7EB',
          strokeWidth: '100%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '18px',
            fontWeight: 600,
            color: '#1F2937',
            offsetY: -15,
          },
          value: {
            show: true,
            fontSize: '36px',
            fontWeight: 700,
            color: '#2563EB',
            offsetY: 10,
            formatter: (val: number) => `${val.toFixed(2)}%`,
          },
        },
      },
    },
    colors: ['#2563EB'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#60A5FA'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Overall Utilization Rate'],
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
  }))

  const spentChartOptions = computed(() => {
    const expenses = spentView.value === 'monthly' ? monthlyExpenses.value : dailyExpenses.value
    const sortedKeys = Object.keys(expenses).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    
    let labels: string[]
    if (spentView.value === 'monthly') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      labels = sortedKeys.map(date => {
        const [year, month] = date.split('-')
        if (!month || !year) return date
        return `${monthNames[parseInt(month, 10) - 1]} ${year}`
      })
    } else {
      labels = sortedKeys
    }

    const data = sortedKeys.map(key => expenses[key])

    return {
      chart: {
        type: 'line',
        height: 450,
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500,
        },
      },
      series: [{
        name: 'Total Spent',
        data,
      }],
      xaxis: {
        categories: labels,
        title: {
          text: spentView.value === 'monthly' ? 'Months' : 'Days',
          style: {
            color: '#333',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Total Spent',
          style: {
            color: '#333',
          },
        },
        labels: {
          formatter: (val: number) => `₱${formatNumber(val || 0)}`,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 4,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number) => `₱${formatNumber(val || 0)}`,
        },
      },
      colors: ['#4bc0c0'],
    }
  })

  const comparisonChartOptions = computed(() => {
    const months = monthlyComparison.value.months
    const totalDisbursements = months.map(month => monthlyComparison.value.totalDisbursements[month] || 0)
    const totalObligations = months.map(month => monthlyComparison.value.totalObligations[month] || 0)

    return {
      chart: {
        height: 450,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: true,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500,
        },
      },
      colors: ['#008FFB', '#FF4560'],
      series: [
        {
          name: 'Total Disbursements',
          type: 'line',
          data: totalDisbursements,
        },
        {
          name: 'Total Obligations',
          type: 'line',
          data: totalObligations,
        },
      ],
      xaxis: {
        categories: months,
        title: {
          text: 'Months',
          style: {
            fontSize: '12px',
            color: '#888',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
          style: {
            fontSize: '12px',
            color: '#888',
          },
        },
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: (val: number) => `₱${formatNumber(val || 0)}`,
        },
      },
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        y: {
          formatter: (val: number) => `₱${formatNumber(val || 0)}`,
        },
      },
      markers: {
        size: 4,
        hover: {
          size: 7,
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
    }
  })

  const departmentChartOptions = computed(() => {
    const departments = Object.keys(departmentUtilization.value)
    const utilizationRates = Object.values(departmentUtilization.value)

    return {
      chart: {
        type: 'bar',
        height: 450,
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500,
        },
      },
      series: [{
        name: 'Utilization Rate',
        data: utilizationRates,
      }],
      xaxis: {
        categories: departments,
        title: {
          text: 'Departments',
          style: {
            color: '#333',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Utilization Rate (%)',
          style: {
            color: '#333',
          },
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `${value}%`,
        },
      },
      colors: ['#0047AB'],
    }
  })

  return {
    utilizationChartOptions,
    spentChartOptions,
    comparisonChartOptions,
    departmentChartOptions,
  }
}
