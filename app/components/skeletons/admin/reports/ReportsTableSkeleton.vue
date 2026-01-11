<template>
  <div class="p-6">
    <div class="space-y-3">
      <div
        v-for="n in count"
        :key="n"
        class="animate-pulse border-b border-gray-200 pb-3"
      >
        <div class="flex items-center gap-4">
          <div class="w-4 h-4 bg-gray-200 rounded"></div>
          <div class="flex-1 grid grid-cols-7 gap-4">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
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
