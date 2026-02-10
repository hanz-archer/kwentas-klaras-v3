import { useErrorHandler } from '../error/useErrorHandler'
import { useFirebase } from '../firebase/useFirebase'
import type { PasswordResetForm } from '~/types/auth/passwordReset'

export const usePasswordReset = () => {
  const form = reactive<PasswordResetForm>({
    email: '',
  })

  const loading = ref(false)
  const success = ref(false)
  const error = ref('')
  const showSuccessModal = ref(false)
  const showErrorModal = ref(false)
  const errorMessage = ref('')

  const handleReset = async () => {
    error.value = ''
    success.value = false
    loading.value = true
    showErrorModal.value = false

    if (!form.email || !form.email.includes('@')) {
      const validationError = 'Please enter a valid email address.'
      error.value = validationError
      errorMessage.value = validationError
      showErrorModal.value = true
      loading.value = false
      return
    }

    await useErrorHandler(async () => {
      const { resetPassword } = useFirebase()
      await resetPassword(form.email)

      success.value = true
      showSuccessModal.value = true
      loading.value = false
    }, {
      defaultMessage: 'Failed to send password reset email. Please try again.',
      onError: (err) => {
        error.value = err.message
        errorMessage.value = err.message
        showErrorModal.value = true
        loading.value = false
      }
    })
  }

  const closeSuccessModal = async () => {
    showSuccessModal.value = false
    await navigateTo('/auth/login')
  }

  const closeErrorModal = () => {
    showErrorModal.value = false
  }

  return {
    form,
    loading,
    success,
    error,
    showSuccessModal,
    showErrorModal,
    errorMessage,
    handleReset,
    closeSuccessModal,
    closeErrorModal,
  }
}


