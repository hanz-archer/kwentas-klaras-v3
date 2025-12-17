import { formatCurrency } from '~/utils/currency'

export const MODAL_MESSAGES = {
  CREATE_PROJECT: {
    title: 'Create Project',
    message: 'Are you sure you want to create this project? Please review all the information before confirming.',
    confirmText: 'Create Project',
    cancelText: 'Cancel',
    loadingText: 'Creating...',
  },
  DEFAULT: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loadingText: 'Processing...',
  },
} as const

export const getProjectConfirmMessage = (projectName?: string, appropriation?: number): string => {
  const formatAppropriation = (value: number): string => {
    return `₱${formatCurrency(value)}`
  }

  if (projectName && appropriation !== undefined) {
    return `Are you sure you want to create "${projectName}" with Appropriation of ${formatAppropriation(appropriation)}?`
  }
  if (projectName) {
    return `Are you sure you want to create "${projectName}"?`
  }
  if (appropriation !== undefined) {
    return `Are you sure you want to create this project with Appropriation of ${formatAppropriation(appropriation)}?`
  }
  return MODAL_MESSAGES.CREATE_PROJECT.message
}

