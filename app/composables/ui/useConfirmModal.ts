import { ref } from 'vue'

export interface ConfirmModalOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
}

export const useConfirmModal = () => {
  const isOpen = ref(false)
  const loading = ref(false)
  const options = ref<ConfirmModalOptions>({})

  const open = (modalOptions?: ConfirmModalOptions) => {
    options.value = modalOptions || {}
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    loading.value = false
    options.value = {}
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  return {
    isOpen,
    loading,
    options,
    open,
    close,
    setLoading,
  }
}

