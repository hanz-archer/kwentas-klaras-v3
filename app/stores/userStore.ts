import type { User } from '~/types/user/user'
import { useDashboardStore } from './dashboardStore'
import { useAuthHeaders } from '~/composables/auth/useAuthHeaders'

export const useUserStore = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; users: User[] }>('/api/users')
      if (response.success) {
        users.value = response.users
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch users'
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: {
    firstName: string
    lastName: string
    username: string
    email: string
    department: string
    status?: 'Active' | 'Inactive'
    role?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const headers = await useAuthHeaders()

      const response = await $fetch<{ success: boolean; user: User }>('/api/users/create', {
        method: 'POST',
        headers,
        body: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: userData.username,
          email: userData.email,
          department: userData.department,
          status: userData.status,
          role: userData.role,
        },
      })

      if (response.success) {
        users.value.push(response.user)
        const dashboardStore = useDashboardStore()
        dashboardStore.refresh()
        return response.user
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string, userData: Partial<User>) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; user: User }>(`/api/users/${userId}`, {
        method: 'PUT',
        body: userData,
      })

      if (response.success) {
        const index = users.value.findIndex(u => u.id === userId)
        if (index !== -1) {
          users.value[index] = response.user
        }
        const dashboardStore = useDashboardStore()
        dashboardStore.refresh()
        return response.user
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string) => {
    loading.value = true
    error.value = null

    try {
      const headers = await useAuthHeaders()

      const response = await $fetch<{ success: boolean }>(`/api/users/${userId}`, {
        method: 'DELETE',
        headers,
      })

      if (response.success) {
        users.value = users.value.filter(u => u.id !== userId)
        const dashboardStore = useDashboardStore()
        dashboardStore.refresh()
      }
    } catch (err: any) {
      error.value = err?.message || 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

