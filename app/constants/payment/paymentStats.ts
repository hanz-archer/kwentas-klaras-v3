import type { PaymentStat } from '~/types/payment/paymentStat'
import type { Payment } from '~/types/payment/payment'

export const calculatePaymentStats = (payments: Payment[]): PaymentStat[] => {
  const totalPayments = payments.length
  const approvedPayments = payments.filter(p => p.status === 'approved').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length

  return [
    {
      title: 'Total Payments',
      value: totalPayments.toString(),
      change: undefined,
      changeType: 'neutral',
      iconColor: 'text-brand-blue',
      color: 'blue',
    },
    {
      title: 'Approved',
      value: approvedPayments.toString(),
      change: undefined,
      changeType: 'positive',
      iconColor: 'text-brand-green',
      color: 'green',
    },
    {
      title: 'Pending',
      value: pendingPayments.toString(),
      change: undefined,
      changeType: 'neutral',
      iconColor: 'text-yellow-600',
      color: 'yellow',
    },
  ]
}
