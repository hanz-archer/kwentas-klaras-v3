export interface PaymentStat {
  title: string
  value: string
  change: string | undefined
  changeType: 'positive' | 'negative' | 'neutral'
  iconColor: string
  color: string
}
