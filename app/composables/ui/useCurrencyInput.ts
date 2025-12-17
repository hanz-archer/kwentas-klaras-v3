import { ref, watch } from 'vue'
import { formatCurrencyInput, parseCurrencyValue } from '~/utils/currency'

export function useCurrencyInput(
  modelValue: () => number | undefined | null,
  emit: (value: number) => void,
  currencySymbol: string = '₱'
) {
  const displayValue = ref<string>('')

  const updateDisplayValue = (value: number | undefined | null) => {
    if (!value && value !== 0) {
      displayValue.value = ''
      return
    }
    const stringValue = String(value)
    displayValue.value = formatCurrencyInput(stringValue, currencySymbol)
  }

  watch(
    () => modelValue(),
    (newValue) => {
      const currentNumeric = parseCurrencyValue(displayValue.value)
      const modelNumeric = typeof newValue === 'number' ? newValue : newValue ? parseFloat(String(newValue)) : 0

      if (Math.abs(currentNumeric - modelNumeric) > 0.0001) {
        updateDisplayValue(newValue)
      }
    },
    { immediate: true }
  )

  const handleCurrencyInput = (value: string) => {
    const formatted = formatCurrencyInput(value, currencySymbol)
    displayValue.value = formatted
    const numericValue = parseCurrencyValue(formatted)
    emit(numericValue === 0 && formatted === '' ? 0 : numericValue)
  }

  const handleCurrencyKeydown = (event: KeyboardEvent) => {
    const key = event.key
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ]

    if (allowedKeys.includes(key)) {
      return
    }

    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
        return
      }
    }

    const isNumber = key >= '0' && key <= '9'
    const isDecimal = key === '.' && !displayValue.value.includes('.')

    if (!isNumber && !isDecimal) {
      event.preventDefault()
    }
  }

  const handleCurrencyPaste = (event: ClipboardEvent) => {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    const cleaned = pastedText.replace(/[^\d.]/g, '')
    if (cleaned) {
      const currentValue = displayValue.value.replace(/,/g, '').replace(/[^\d.]/g, '')
      const newValue = currentValue + cleaned
      handleCurrencyInput(newValue)
    }
  }

  return {
    displayValue,
    handleCurrencyInput,
    handleCurrencyKeydown,
    handleCurrencyPaste,
  }
}

