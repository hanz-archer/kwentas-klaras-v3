import type { Project } from '~/types/project/project'
import type { CreateBudgetFn, CreateObligationFn, CreateDisbursementFn } from '~/types/project/projectListActions'
import type { BudgetStatus } from '~/constants/additionalBudget/status'
import type { ObligationStatus } from '~/constants/obligation/status'

export const useProjectListActions = (
  fetchProjects: () => Promise<void>,
  loadProjectFinancialData: (projectId: string) => Promise<void>
) => {
  const router = useRouter()
  const openDropdownId = ref<string | null>(null)
  const isBudgetModalOpen = ref(false)
  const isObligationModalOpen = ref(false)
  const isDisbursementModalOpen = ref(false)
  const selectedProjectId = ref('')
  const expandedFinancialInfoId = ref<string | null>(null)

  const goToProject = (project: Project) => {
    closeDropdown(project.id!)
    router.push(`/admin/projects/${project.id}`)
  }

  const goToAddProject = () => {
    router.push('/admin/projects/add')
  }

  const toggleDropdown = (projectId: string) => {
    openDropdownId.value = openDropdownId.value === projectId ? null : projectId
  }

  const closeDropdown = (projectId: string) => {
    if (openDropdownId.value === projectId) {
      openDropdownId.value = null
    }
  }

  const openAddBudgetModal = (project: Project) => {
    selectedProjectId.value = project.id!
    isBudgetModalOpen.value = true
    openDropdownId.value = null
  }

  const closeBudgetModal = () => {
    isBudgetModalOpen.value = false
    selectedProjectId.value = ''
  }

  const openAddObligationModal = (project: Project) => {
    selectedProjectId.value = project.id!
    isObligationModalOpen.value = true
    openDropdownId.value = null
  }

  const closeObligationModal = () => {
    isObligationModalOpen.value = false
    selectedProjectId.value = ''
  }

  const openAddDisbursementModal = (project: Project) => {
    selectedProjectId.value = project.id!
    isDisbursementModalOpen.value = true
    openDropdownId.value = null
  }

  const closeDisbursementModal = () => {
    isDisbursementModalOpen.value = false
    selectedProjectId.value = ''
  }

  const toggleFinancialInfo = async (projectId: string, hasFinancialData: (id: string) => boolean) => {
    if (expandedFinancialInfoId.value === projectId) {
      expandedFinancialInfoId.value = null
    } else {
      expandedFinancialInfoId.value = projectId
      if (!hasFinancialData(projectId)) {
        await loadProjectFinancialData(projectId)
      }
    }
  }

  const handleSaveBudget = async (budgetData: {
    projectId: string
    amount: number
    reason: string
    approvedBy?: string
    approvedDate?: string
    status?: string
  }, createBudget: CreateBudgetFn) => {
    try {
      await createBudget({
        projectId: budgetData.projectId,
        amount: budgetData.amount,
        reason: budgetData.reason,
        approvedBy: budgetData.approvedBy,
        approvedDate: budgetData.approvedDate ? new Date(budgetData.approvedDate) : undefined,
        status: budgetData.status as BudgetStatus | undefined,
      })
      closeBudgetModal()
      await fetchProjects()
      if (expandedFinancialInfoId.value === budgetData.projectId) {
        await loadProjectFinancialData(budgetData.projectId)
      }
    } catch (error) {
      console.error('Failed to save budget:', error)
    }
  }

  const handleSaveObligation = async (obligationData: {
    projectId: string
    amount: number
    reason: string
    payee: string
    approvedBy?: string
    approvedDate?: string
    status?: string
  }, createObligation: CreateObligationFn) => {
    try {
      await createObligation({
        projectId: obligationData.projectId,
        amount: obligationData.amount,
        reason: obligationData.reason,
        payee: obligationData.payee,
        approvedBy: obligationData.approvedBy,
        approvedDate: obligationData.approvedDate ? new Date(obligationData.approvedDate) : undefined,
        status: obligationData.status as ObligationStatus | undefined,
      })
      closeObligationModal()
      await fetchProjects()
      if (expandedFinancialInfoId.value === obligationData.projectId) {
        await loadProjectFinancialData(obligationData.projectId)
      }
    } catch (error) {
      console.error('Failed to save obligation:', error)
    }
  }

  const handleSaveDisbursement = async (disbursementData: {
    projectId: string
    amount: number
    reason: string
    payee: string
    approvedBy?: string
    approvedDate?: string
  }, createDisbursement: CreateDisbursementFn) => {
    try {
      await createDisbursement({
        projectId: disbursementData.projectId,
        amount: disbursementData.amount,
        reason: disbursementData.reason,
        payee: disbursementData.payee,
        approvedBy: disbursementData.approvedBy,
        approvedDate: disbursementData.approvedDate ? new Date(disbursementData.approvedDate) : undefined,
      })
      closeDisbursementModal()
      await fetchProjects()
      if (expandedFinancialInfoId.value === disbursementData.projectId) {
        await loadProjectFinancialData(disbursementData.projectId)
      }
    } catch (error) {
      console.error('Failed to save disbursement:', error)
    }
  }

  const setupClickOutside = () => {
    const handleClickOutside = () => {
      if (openDropdownId.value) {
        openDropdownId.value = null
      }
    }
    document.addEventListener('click', handleClickOutside)
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
  }

  return {
    openDropdownId: readonly(openDropdownId),
    isBudgetModalOpen,
    isObligationModalOpen,
    isDisbursementModalOpen,
    selectedProjectId: readonly(selectedProjectId),
    expandedFinancialInfoId: readonly(expandedFinancialInfoId),
    goToProject,
    goToAddProject,
    toggleDropdown,
    closeDropdown,
    openAddBudgetModal,
    closeBudgetModal,
    openAddObligationModal,
    closeObligationModal,
    openAddDisbursementModal,
    closeDisbursementModal,
    toggleFinancialInfo,
    handleSaveBudget,
    handleSaveObligation,
    handleSaveDisbursement,
    setupClickOutside,
  }
}
