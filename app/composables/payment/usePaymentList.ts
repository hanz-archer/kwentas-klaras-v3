import { computed, ref, type Ref } from 'vue'
import { useDisbursements } from '../disbursement/useDisbursements'
import { calculatePaymentStats } from '~/constants/payment/paymentStats'
import type { Payment } from '~/types/payment/payment'

export const usePaymentList = (searchQuery: Ref<string>) => {
  const { disbursements, loading, error, fetchDisbursements, updateStatus, saveError } = useDisbursements()
  const updatingId = ref<string | null>(null)

  const payments = computed<Payment[]>(() => {
    return disbursements.value.map(disbursement => ({
      id: disbursement.id,
      payee: disbursement.payee,
      projectName: disbursement.projectName || 'N/A',
      amount: disbursement.amount,
      status: disbursement.status,
      createdAt: disbursement.createdAt,
      approvedBy: disbursement.approvedBy,
      approvedDate: disbursement.approvedDate,
      reason: disbursement.reason,
    }))
  })

  const filteredPayments = computed(() => {
    if (!searchQuery.value.trim()) {
      return payments.value
    }

    const query = searchQuery.value.toLowerCase()
    return payments.value.filter(payment => {
      return (
        payment.payee?.toLowerCase().includes(query) ||
        payment.projectName?.toLowerCase().includes(query) ||
        payment.amount?.toString().includes(query)
      )
    })
  })

  const displayStats = computed(() => calculatePaymentStats(payments.value))

  const handleApprove = async (id: string) => {
    updatingId.value = id
    try {
      await updateStatus(id, 'approved')
      await fetchDisbursements()
    } catch (err: unknown) {
      console.error('Failed to approve disbursement:', err)
    } finally {
      updatingId.value = null
    }
  }

  const handleDeny = async (id: string) => {
    updatingId.value = id
    try {
      await updateStatus(id, 'denied')
      await fetchDisbursements()
    } catch (err: unknown) {
      console.error('Failed to deny disbursement:', err)
    } finally {
      updatingId.value = null
    }
  }

  const loadPayments = async () => {
    await fetchDisbursements()
  }

  return {
    payments,
    filteredPayments,
    displayStats,
    loading,
    error,
    saveError,
    updatingId,
    handleApprove,
    handleDeny,
    loadPayments,
  }
}
