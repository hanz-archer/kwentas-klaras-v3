<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="year-picker-wrapper">
      <VueDatePicker
        :id="id"
        v-model="yearValue"
        year-picker
        :required="required"
        :placeholder="placeholder"
        auto-apply
        :year-range="[minYear, maxYear]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export interface YearPickerProps {
  id: string
  modelValue: string | number | null
  label?: string
  placeholder?: string
  required?: boolean
  minYear?: number
  maxYear?: number
}

const props = withDefaults(defineProps<YearPickerProps>(), {
  placeholder: 'Select year',
  required: false,
  minYear: 2000,
  maxYear: 2100,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const yearValue = computed({
  get: () => {
    if (!props.modelValue) return null
    const year = typeof props.modelValue === 'string' ? parseInt(props.modelValue) : props.modelValue
    return isNaN(year) ? null : year
  },
  set: (value: number | null) => {
    emit('update:modelValue', value ? value.toString() : '')
  }
})

</script>

<style scoped>
.year-picker-wrapper :deep(.dp__input_wrap) {
  position: relative;
}

.year-picker-wrapper :deep(.dp__input) {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.5rem;
  color: rgb(17 24 39);
}

.year-picker-wrapper :deep(.dp__input:focus) {
  outline: none;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: rgb(37 99 235);
  border-color: rgb(37 99 235);
}

.year-picker-wrapper :deep(.dp__input_icon) {
  left: 0.1rem;
  color: rgb(156 163 175);
}

.year-picker-wrapper :deep(.dp__input_icon svg) {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
