import type { Project } from '~/types/project/project'

export const useProjectSearch = (projects: Readonly<Ref<readonly Project[]>>, searchQuery: Ref<string>) => {
  const filteredProjects = computed(() => {
    if (!searchQuery.value.trim()) {
      return projects.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return projects.value.filter((project: Project) => {
      const fields = [
        project.name,
        project.code,
        project.implementingUnit,
        project.services,
        project.location,
        project.remarks,
      ]
      return fields.some((f) => (f ?? '').toString().toLowerCase().includes(query))
    })
  })

  return {
    filteredProjects,
  }
}

