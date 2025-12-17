<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] backdrop-blur-[1px]"
        @click.self="onCancel"
      >
        <Transition
          enter-active-class="transform transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transform transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full mx-4 p-4 sm:p-6"
            @click.stop
          >
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
              {{ title }}
            </h3>
            <div class="text-sm text-gray-600 mb-4 sm:mb-6">
              {{ displayMessage }}
            </div>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                variant="secondary"
                size="md"
                type="button"
                @click="onCancel"
                class="flex-1 order-2 sm:order-1"
              >
                {{ cancelText }}
              </Button>
              <Button
                variant="primary"
                size="md"
                type="button"
                @click="onConfirm"
                :loading="loading"
                :disabled="loading"
                class="flex-1 order-1 sm:order-2"
              >
                <template #loading>{{ loadingText }}</template>
                {{ confirmText }}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'
import { MODAL_MESSAGES, getProjectConfirmMessage } from '~/constants/ui/modalMessages'
import { formatCurrency } from '~/utils/currency'
import type { ConfirmModalProps } from '~/types/ui/confirmModal'

const props = withDefaults(defineProps<ConfirmModalProps>(), {
  title: MODAL_MESSAGES.DEFAULT.title,
  message: MODAL_MESSAGES.DEFAULT.message,
  confirmText: MODAL_MESSAGES.DEFAULT.confirmText,
  cancelText: MODAL_MESSAGES.DEFAULT.cancelText,
  loading: false,
  loadingText: MODAL_MESSAGES.DEFAULT.loadingText,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const title = computed(() => props.title || MODAL_MESSAGES.DEFAULT.title)
const message = computed(() => props.message || MODAL_MESSAGES.DEFAULT.message)
const confirmText = computed(() => props.confirmText || MODAL_MESSAGES.DEFAULT.confirmText)
const cancelText = computed(() => props.cancelText || MODAL_MESSAGES.DEFAULT.cancelText)
const loadingText = computed(() => props.loadingText || MODAL_MESSAGES.DEFAULT.loadingText)

const formatAppropriation = (value: number): string => {
  return `₱${formatCurrency(value)}`
}

const displayMessage = computed(() => {
  if (props.projectDetails) {
    return getProjectConfirmMessage(props.projectDetails.name, props.projectDetails.appropriation)
  }
  return message.value
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  emit('cancel')
}
</script>

