import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/auth/login') {
    return
  }

  if (!to.path.startsWith('/admin')) {
    return
  }

  if (process.server) {
    const sessionToken = useCookie('session_token')
    if (!sessionToken.value) {
      return navigateTo('/auth/login', { replace: true })
    }
    return
  }

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await nextTick()
    
    if (!authStore.isAuthenticated) {
      return navigateTo('/auth/login', { replace: true })
    }
  }
})
