export const useYearOptions = (startYear?: number, endYear?: number) => {
  const currentYear = new Date().getFullYear()
  const start = startYear ?? currentYear - 10
  const end = endYear ?? currentYear + 10

  const years = computed(() => {
    const yearList = []
    for (let year = end; year >= start; year--) {
      yearList.push({
        id: year.toString(),
        name: year.toString(),
        value: year.toString(),
      })
    }
    return yearList
  })

  return {
    years,
  }
}
