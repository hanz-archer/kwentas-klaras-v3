import { useUserStore } from '~/stores/userStore'
import type { User } from '~/types/user/user'
import type { UserWithPassword } from '~/types/user/userWithPassword'
import { calculateUserStats } from '~/constants/user/userStats'
import { useErrorHandler } from '../error/useErrorHandler'

export const useUsers = () => {
  const userStore = useUserStore()
  const saveError = ref<string | null>(null)

  const users = computed(() => userStore.users.value)
  const loading = computed(() => userStore.loading.value)

  const fetchUsers = async () => {
    await userStore.fetchUsers()
  }

  const handleSaveUser = async (userData: UserWithPassword, editingUser: User | null) => {
    saveError.value = null

    await useErrorHandler(async () => {
      if (editingUser && editingUser.id) {
        await userStore.updateUser(editingUser.id, userData)
      } else {
        const usernameWithoutAt = userData.username.startsWith('@') 
          ? userData.username.slice(1) 
          : userData.username

        await userStore.createUser({
          firstName: userData.firstName,
          lastName: userData.lastName,
          username: usernameWithoutAt,
          email: userData.email,
          department: userData.department,
          status: userData.status || 'Active',
          role: userData.role,
        })
      }
    }, {
      defaultMessage: 'Failed to save user',
      onError: (err: Error) => {
        saveError.value = err.message
      }
    })
  }

  const handleDeleteUser = async (userId: string) => {
    await useErrorHandler(async () => {
      await userStore.deleteUser(userId)
    }, {
      defaultMessage: 'Failed to delete user',
    })
  }

  const userStats = computed(() => {
    const totalUsers = users.value.length
    const activeUsers = users.value.filter(u => u.status === 'Active').length
    const inactiveUsers = users.value.filter(u => u.status === 'Inactive').length
    const departmentsCount = new Set(users.value.map(u => u.department)).size

    return calculateUserStats(totalUsers, activeUsers, inactiveUsers, departmentsCount)
  })

  return {
    users: readonly(users),
    loading: readonly(loading),
    saveError,
    userStats,
    fetchUsers,
    handleSaveUser,
    handleDeleteUser,
  }
}

