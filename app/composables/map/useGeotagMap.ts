import { ref, computed } from 'vue'
import type { LocationInfo, GeotagMapOptions } from '~/types/map/geotagMap'
import type { Project } from '~/types/project/project'

export const useGeotagMap = (options: GeotagMapOptions = {}) => {
  const currentLatitude = ref<number | null>(options.initialLatitude ?? null)
  const currentLongitude = ref<number | null>(options.initialLongitude ?? null)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const locationInfo = ref<LocationInfo>({
    barangay: null,
    municipality: null,
    loading: false,
    error: null,
  })

  const hasLocation = computed(() => {
    return currentLatitude.value !== null && currentLongitude.value !== null
  })

  const reverseGeocode = async (lat: number, lng: number) => {
    locationInfo.value.loading = true
    locationInfo.value.error = null
    locationInfo.value.barangay = null
    locationInfo.value.municipality = null

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'KwentasKlaras/1.0',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch location data')
      }

      const data = await response.json()

      if (data && data.address) {
        const address = data.address
        locationInfo.value.barangay = address.village || address.neighbourhood || address.suburb || null
        locationInfo.value.municipality = address.city || address.town || address.municipality || null
      }
    } catch (err: unknown) {
      locationInfo.value.error = 'Unable to identify location'
      console.error('Reverse geocoding error:', err)
    } finally {
      locationInfo.value.loading = false
    }
  }

  const geocodeLocation = async (locationName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ', Philippines')}&limit=1`,
        {
          headers: {
            'User-Agent': 'KwentasKlaras/1.0',
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        }
      }
      return null
    } catch (err) {
      console.error('Geocoding error:', err)
      return null
    }
  }

  const getDefaultIcon = (L: { icon: (options: { iconUrl: string; iconRetinaUrl: string; shadowUrl: string; iconSize: [number, number]; iconAnchor: [number, number]; popupAnchor: [number, number]; shadowSize: [number, number] }) => unknown }) => {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }

  const saveLocation = async (lat: number, lng: number) => {
    if (!options.projectId) return { success: false }

    saving.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; project: Project }>(`/api/projects/${options.projectId}/geotag`, {
        method: 'PATCH',
        body: {
          latitude: lat,
          longitude: lng,
        },
      })

      if (response.success) {
        currentLatitude.value = lat
        currentLongitude.value = lng
      }

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save location'
      error.value = errorMessage
      return { success: false }
    } finally {
      saving.value = false
    }
  }

  const clearLocation = async () => {
    if (!options.projectId) {
      currentLatitude.value = null
      currentLongitude.value = null
      locationInfo.value = {
        barangay: null,
        municipality: null,
        loading: false,
        error: null,
      }
      return { success: true }
    }

    saving.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; project: Project }>(`/api/projects/${options.projectId}/geotag`, {
        method: 'PATCH',
        body: {
          latitude: null,
          longitude: null,
        },
      })

      if (response.success) {
        currentLatitude.value = null
        currentLongitude.value = null
        locationInfo.value = {
          barangay: null,
          municipality: null,
          loading: false,
          error: null,
        }
      }

      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear location'
      error.value = errorMessage
      return { success: false }
    } finally {
      saving.value = false
    }
  }

  const setCoordinates = (lat: number | null, lng: number | null) => {
    currentLatitude.value = lat
    currentLongitude.value = lng
  }

  const getDefaultCenter = () => {
    return {
      lat: 9.6289,
      lng: 123.4800,
      zoom: 12,
    }
  }

  return {
    currentLatitude,
    currentLongitude,
    saving,
    error,
    locationInfo,
    hasLocation,
    reverseGeocode,
    geocodeLocation,
    getDefaultIcon,
    saveLocation,
    clearLocation,
    setCoordinates,
    getDefaultCenter,
  }
}
