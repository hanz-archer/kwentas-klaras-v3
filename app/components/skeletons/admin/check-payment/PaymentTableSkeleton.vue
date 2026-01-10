<template>
  <div class="flex-1 overflow-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 sticky top-0">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Payee
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Project
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Amount
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="n in count" :key="n" class="hover:bg-gray-50 animate-pulse">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 bg-gray-200 rounded w-20"></div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-6 bg-gray-200 rounded-full w-20"></div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
              <div class="h-7 bg-gray-200 rounded w-16"></div>
              <div class="h-7 bg-gray-200 rounded w-16"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 5
})
</script>
