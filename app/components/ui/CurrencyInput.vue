<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :value="displayValue"
        type="text"
        :required="required"
        :placeholder="currencyPlaceholder"
        :class="inputClasses"
        @input="e => handleCurrencyInput((e.target as HTMLInputElement).value)"
        @keydown="handleCurrencyKeydown"
        @paste="handleCurrencyPaste"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrencyInput } from '~/composables/ui/useCurrencyInput'

export interface CurrencyInputProps {
  id: string
  modelValue: number
  label?: string
  placeholder?: string
  required?: boolean
  currency?: string
  locale?: string
  precision?: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<CurrencyInputProps>(), {
  placeholder: 'Enter amount',
  required: false,
  currency: 'PHP',
  locale: 'en-US',
  precision: 2,
  min: undefined,
  max: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    PHP: '₱',
  }
  return symbols[currency] || '₱'
}

const currencySymbol = getCurrencySymbol(props.currency)

const { displayValue, handleCurrencyInput, handleCurrencyKeydown, handleCurrencyPaste } = useCurrencyInput(
  () => props.modelValue,
  (value: number) => emit('update:modelValue', value),
  currencySymbol
)

const currencyPlaceholder = computed(() => {
  return `${currencySymbol} 0.00`
})

const inputClasses = computed(() => {
  return 'block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue'
})
</script>
