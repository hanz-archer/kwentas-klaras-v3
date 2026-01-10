export const useLoadingState = (loading: Ref<boolean>) => {
  const hasLoadedOnce = ref(false)

  const showLoading = computed(() => loading.value || !hasLoadedOnce.value)

  const markAsLoaded = () => {
    hasLoadedOnce.value = true
  }

  const reset = () => {
    hasLoadedOnce.value = false
  }

  return {
    hasLoadedOnce: readonly(hasLoadedOnce),
    showLoading,
    markAsLoaded,
    reset,
  }
}
