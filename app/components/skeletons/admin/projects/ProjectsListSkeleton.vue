<template>
  <div class="space-y-3 flex-1">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
    >
      <div class="flex items-center gap-6">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="flex-shrink-0">
            <div class="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="h-5 bg-gray-200 rounded w-48"></div>
              <div class="h-5 bg-gray-200 rounded w-16"></div>
            </div>
            <div class="flex items-center gap-4 flex-wrap">
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <div class="h-4 bg-gray-200 rounded w-32"></div>
              <div class="h-4 bg-gray-200 rounded w-28"></div>
              <div class="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="h-10 bg-gray-200 rounded w-28"></div>
          <div class="h-10 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 5
})
</script>
