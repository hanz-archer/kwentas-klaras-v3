import { useErrorHandler } from '../error/useErrorHandler'
import type { Project } from '~/types/project/project'

export const useProjectMap = (projectId: string) => {
  const saving = ref(false)
  const error = ref<string | null>(null)
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)

  const updateGeotag = async (lat: number | null, lng: number | null) => {
    saving.value = true
    error.value = null

    await useErrorHandler(async () => {
      const response = await $fetch<{ success: boolean; project: Project }>(`/api/projects/${projectId}/geotag`, {
        method: 'PATCH',
        body: {
          latitude: lat,
          longitude: lng,
        },
      })

      if (response.success) {
        latitude.value = response.project.latitude ?? null
        longitude.value = response.project.longitude ?? null
      }
    }, {
      defaultMessage: 'Failed to update geotag',
      onError: (err) => {
        error.value = err.message
      }
    })

    saving.value = false
  }

  const loadGeotag = (lat: number | null | undefined, lng: number | null | undefined) => {
    latitude.value = lat ?? null
    longitude.value = lng ?? null
  }

  const clearGeotag = async () => {
    await updateGeotag(null, null)
  }

  return {
    latitude,
    longitude,
    saving,
    error,
    updateGeotag,
    loadGeotag,
    clearGeotag,
  }
}

