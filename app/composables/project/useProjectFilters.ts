import type { Ref } from 'vue'
import type { Project } from '~/types/project/project'
import type { ProjectFilters } from '~/types/project/projectFilters'

const matchesSearch = (project: Project, query: string): boolean => {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const fields = [
    project.name,
    project.code,
    project.implementingUnit,
    project.services,
    project.location,
    project.remarks,
  ]
  return fields.some((f) => (f ?? '').toString().toLowerCase().includes(q))
}

export const useProjectFilters = (projects: Ref<readonly Project[]>) => {
  const filters = ref<ProjectFilters>({
    department: '',
    year: '',
    location: '',
    services: '',
    searchQuery: '',
  })

  const filteredProjects = computed(() => {
    return projects.value.filter((project) => {
      if (filters.value.department && project.implementingUnit !== filters.value.department) return false
      if (filters.value.year && project.year.toString() !== filters.value.year) return false
      if (filters.value.location && project.location !== filters.value.location) return false
      if (filters.value.services && project.services !== filters.value.services) return false
      if (!matchesSearch(project, filters.value.searchQuery)) return false
      return true
    })
  })

  const uniqueDepartments = computed(() => {
    const departments = projects.value
      .map((p) => p.implementingUnit)
      .filter((d): d is string => Boolean(d))
    return Array.from(new Set(departments)).sort()
  })

  const uniqueYears = computed(() => {
    const years = projects.value.map((p) => p.year.toString())
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a))
  })

  const uniqueLocations = computed(() => {
    const locations = projects.value
      .map((p) => p.location)
      .filter((l): l is string => Boolean(l))
    return Array.from(new Set(locations)).sort()
  })

  const uniqueServices = computed(() => {
    const services = projects.value
      .map((p) => p.services)
      .filter((s): s is string => Boolean(s))
    return Array.from(new Set(services)).sort()
  })

  const resetFilters = () => {
    filters.value = {
      department: '',
      year: '',
      location: '',
      services: '',
      searchQuery: '',
    }
  }

  return {
    filters,
    filteredProjects,
    uniqueDepartments,
    uniqueYears,
    uniqueLocations,
    uniqueServices,
    resetFilters,
  }
}

