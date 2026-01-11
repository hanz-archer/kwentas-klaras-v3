import { useAuthStore } from '~/stores/authStore'
import { useFirebase } from '~/composables/firebase/useFirebase'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from '~/types/user/user'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  
  if (process.client) {
    const { auth } = useFirebase()
    const firebaseAuth = auth.value
    
    let isInitialCheck = true
    
    onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken()
          
          if (isInitialCheck) {
            try {
              const response = await $fetch<{ success: boolean; user: User }>('/api/auth/me', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${idToken}`
                }
              })
              
              if (response.success && response.user) {
                authStore.setUser(response.user)
                isInitialCheck = false
                return
              }
            } catch (error) {
              console.error('Failed to verify session, creating new one:', error)
            }
          }
          
          const response = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
            method: 'POST',
            body: { idToken }
          })
          
          if (response.success && response.user) {
            authStore.setUser(response.user)
          }
        } catch (error) {
          console.error('Failed to restore user session:', error)
          authStore.clearUser()
        }
      } else {
        authStore.clearUser()
      }
      
      isInitialCheck = false
    })
  }
})

