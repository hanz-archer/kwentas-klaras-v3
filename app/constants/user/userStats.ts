import type { UserStat } from '~/types/user/userStat'

export const calculateUserStats = (
  totalUsers: number,
  activeUsers: number,
  inactiveUsers: number,
  departmentsCount: number
): UserStat[] => {
  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
  const inactivePercentage = totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0

  return [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: `${totalUsers} total`,
      changeType: 'neutral',
      iconColor: 'text-brand-blue',
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      change: `${activePercentage}% of total`,
      changeType: 'positive',
      iconColor: 'text-brand-green',
      color: 'green'
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers.toString(),
      change: `${inactivePercentage}% of total`,
      changeType: 'neutral',
      iconColor: 'text-gray-900',
      color: 'gray'
    },
    {
      title: 'Departments',
      value: departmentsCount.toString(),
      change: `${departmentsCount} unique`,
      changeType: 'neutral',
      iconColor: 'text-purple-600',
      color: 'purple'
    }
  ]
}

