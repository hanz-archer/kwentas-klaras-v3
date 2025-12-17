export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
  if (isNaN(numValue)) return ''
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export const formatCurrencyInput = (value: string, currencySymbol: string = '₱'): string => {
  if (!value) return ''
  const cleaned = value.replace(/[^\d.]/g, '')
  if (!cleaned) return ''
  const parts = cleaned.split('.')
  const integerPart = parts[0] || ''
  const decimalPart = parts[1] || ''
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (decimalPart) {
    return `${currencySymbol}${formattedInteger}.${decimalPart.slice(0, 2)}`
  }
  return `${currencySymbol}${formattedInteger}`
}

export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue) return 0
  const cleaned = formattedValue.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
