export const getStatIconColor = (color: string): string => {
  switch (color) {
    case 'blue':
      return 'text-brand-blue'
    case 'purple':
      return 'text-purple-600'
    case 'green':
      return 'text-brand-green'
    case 'orange':
      return 'text-orange-600'
    case 'gray':
      return 'text-gray-500'
    default:
      return 'text-gray-500'
  }
}

export const getIconBgColor = (color: string): string => {
  switch (color) {
    case 'blue':
      return 'bg-brand-blue/10'
    case 'purple':
      return 'bg-purple-100'
    case 'green':
      return 'bg-brand-green/10'
    case 'orange':
      return 'bg-orange-100'
    case 'gray':
      return 'bg-gray-100'
    default:
      return 'bg-gray-100'
  }
}

