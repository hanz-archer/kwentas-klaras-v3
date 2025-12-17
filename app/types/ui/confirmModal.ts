export interface ProjectDetails {
  name?: string
  appropriation?: number
}

export interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  loadingText?: string
  projectDetails?: ProjectDetails
}

