export interface SelectOption {
  id: string
  name: string
  value?: string
}

export interface SelectInputProps {
  id: string
  modelValue: string | number
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  label?: string
}

export interface SelectInputEmits {
  (e: 'update:modelValue', value: string | number): void
}
