<template>
  <div class="h-screen bg-brand-bg flex overflow-hidden">
    <AdminSidebar />
    
    <main class="flex-1 flex flex-col overflow-hidden">
      <div :class="[...animations.pageContainerClasses.value]" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-brand-bg">
        <div class="space-y-6 min-h-full flex flex-col">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-1">Check Payment</h1>
              <p class="text-sm text-gray-500">View and manage payment records</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-1 max-w-md">
                <SearchInput
                  v-model="searchQuery"
                  placeholder="Search by payee, project, or amount..."
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              v-if="!showLoading"
              v-for="(stat, index) in displayStats"
              :key="index"
              :class="[
                ...animations.statCardClasses.value,
                animations.getStaggeredDelayClass(index),
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
              :title="stat.title"
              :value="stat.value"
              :change="stat.change"
              :change-type="stat.changeType"
              :icon-bg-color="getIconBgColor(stat.color)"
              :icon-color="stat.iconColor"
            >
              <template #icon>
                <svg v-if="index === 0" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="index === 1" :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else :class="`w-6 h-6 ${stat.iconColor}`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </template>
            </StatCard>
            <div
              v-else
              v-for="n in 3"
              :key="n"
              class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
            >
              <div class="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          <section class="relative overflow-hidden rounded-2xl border border-gray-300 p-6 bg-white flex-1 min-h-[600px] flex flex-col">
            <PaymentTableSkeleton v-if="showLoading" />

            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700">{{ error }}</p>
              </div>
            </div>

            <template v-else>
              <div v-if="saveError" class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-red-700">{{ saveError }}</p>
                </div>
              </div>

              <div v-if="!showLoading && filteredPayments.length === 0" class="text-center py-12 flex-1 flex items-center justify-center">
                <div class="text-gray-400 mb-2">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p class="text-gray-600 font-medium">No payments found</p>
                <p class="text-sm text-gray-500 mt-1">Try adjusting your search criteria.</p>
              </div>

              <div v-else-if="!showLoading && filteredPayments.length > 0" class="flex-1 overflow-auto">
                <div class="rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                  <table class="w-full divide-y divide-gray-200 table-auto min-w-full">
                    <thead class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Payee
                        </th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Project
                        </th>
                        <th scope="col" class="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Amount
                        </th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                          Date
                        </th>
                        <th scope="col" class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                          Reason
                        </th>
                        <th scope="col" class="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap w-[100px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                      <tr
                        v-for="(payment, index) in filteredPayments"
                        :key="payment.id"
                        :class="[
                          'group hover:bg-blue-50/50 transition-colors duration-150',
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30',
                          ...animations.cardClasses.value,
                          animations.getStaggeredDelayClass(index, { maxItems: 20 }),
                        ]"
                      >
                        <td class="px-3 py-3">
                          <div class="flex items-center min-w-0">
                            <div class="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-2 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                              <svg class="w-3.5 h-3.5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div class="text-sm font-medium text-gray-900 truncate max-w-[120px]" :title="payment.payee">
                              {{ payment.payee }}
                            </div>
                          </div>
                        </td>
                        <td class="px-3 py-3 hidden md:table-cell">
                          <div class="text-sm">
                            <span v-if="payment.projectName && payment.projectName !== 'N/A'" class="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                              {{ payment.projectName }}
                            </span>
                            <span v-else class="text-gray-400 italic text-xs">N/A</span>
                          </div>
                        </td>
                        <td class="px-3 py-3 whitespace-nowrap text-right">
                          <div class="text-sm font-bold text-gray-900">₱{{ formatNumber(payment.amount) }}</div>
                        </td>
                        <td class="px-3 py-3 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-0.5 inline-flex text-xs font-semibold rounded-full',
                            payment.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                            payment.status === 'denied' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          ]">
                            {{ payment.status ? (payment.status.charAt(0).toUpperCase() + payment.status.slice(1)) : 'Pending' }}
                          </span>
                        </td>
                        <td class="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
                          <div class="text-xs text-gray-600">{{ formatDate(payment.createdAt) }}</div>
                        </td>
                        <td class="px-3 py-3 hidden xl:table-cell">
                          <div v-if="payment.reason" class="text-xs text-gray-700 truncate max-w-[150px]" :title="payment.reason">
                            {{ payment.reason }}
                          </div>
                          <span v-else class="text-gray-400 text-xs italic">—</span>
                        </td>
                        <td class="px-3 py-3 whitespace-nowrap w-[100px]">
                          <div v-if="payment.status === 'pending' && payment.id" class="flex items-center justify-center gap-1.5">
                            <button
                              @click="handleApprove(payment.id)"
                              :disabled="updatingId === payment.id"
                              class="flex-shrink-0 p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
                              title="Approve payment"
                            >
                              <svg v-if="updatingId !== payment.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </button>
                            <button
                              @click="handleDeny(payment.id)"
                              :disabled="updatingId === payment.id"
                              class="flex-shrink-0 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
                              title="Deny payment"
                            >
                              <svg v-if="updatingId !== payment.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </button>
                          </div>
                          <div v-else class="flex items-center justify-center">
                            <span :class="[
                              'text-xs font-medium whitespace-nowrap',
                              payment.status === 'approved' ? 'text-green-600' :
                              payment.status === 'denied' ? 'text-red-600' :
                              'text-gray-400'
                            ]">
                              {{ payment.status === 'approved' ? 'Approved' : payment.status === 'denied' ? 'Denied' : 'N/A' }}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="!showLoading && filteredPayments.length > 0" class="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div class="text-sm text-gray-600">
                  Showing <span class="font-bold text-gray-900">{{ filteredPayments.length }}</span> of <span class="font-bold text-gray-900">{{ payments.length }}</span> payments
                </div>
              </div>
            </template>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import StatCard from '~/components/ui/StatCard.vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import PaymentTableSkeleton from '~/components/skeletons/admin/check-payment/PaymentTableSkeleton.vue'
import { getIconBgColor } from '~/constants/ui/statColors'
import { useProjectFormatting } from '~/composables/project/useProjectFormatting'
import { usePaymentList } from '~/composables/payment/usePaymentList'
import { useLoadingState } from '~/composables/ui/useLoadingState'
import { usePageAnimations } from '~/composables/ui/usePageAnimations'
import '~/assets/css/paymentList.css'

const searchQuery = ref('')
const animations = usePageAnimations()
const { formatNumber, formatDate } = useProjectFormatting()

const {
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
} = usePaymentList(searchQuery)

const { showLoading, markAsLoaded } = useLoadingState(loading)

onMounted(async () => {
  await loadPayments()
  markAsLoaded()
  animations.markPageLoaded()
})
</script>
