import type { Ref } from 'vue'
import type { Project } from '~/types/project/project'

export const useProjectDetailActions = (
  projectId: string,
  project: Ref<Project | null>,
  loadProject: () => Promise<void>,
  loadFinancials: () => Promise<void>
) => {
  const handleMapSaved = async () => {
    await loadProject()
  }

  return {
    handleMapSaved,
  }
}
