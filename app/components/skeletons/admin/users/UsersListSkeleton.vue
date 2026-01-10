<template>
  <div class="space-y-3 flex-1">
    <div
      v-for="n in count"
      :key="n"
      class="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
    >
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="flex-shrink-0">
            <div class="h-12 w-12 rounded-full bg-gray-200"></div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-3 mb-1">
              <div class="h-5 bg-gray-200 rounded w-32"></div>
              <div class="h-5 bg-gray-200 rounded w-16"></div>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <div class="h-4 bg-gray-200 rounded w-40"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <div class="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="h-9 bg-gray-200 rounded w-20"></div>
          <div class="h-9 bg-gray-200 rounded w-20"></div>
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
