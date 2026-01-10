<template>
  <div class="space-y-8 min-h-screen">
    <div class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div class="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      <div class="flex gap-6">
        <div class="h-16 bg-gray-200 rounded w-32"></div>
        <div class="h-16 bg-gray-200 rounded w-32"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
      <div
        v-for="n in 4"
        :key="n"
        class="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
      >
        <div class="h-4 bg-gray-200 rounded w-24 mb-4"></div>
        <div class="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
      <div class="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>
      <div class="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div class="space-y-4">
          <div v-for="n in 5" :key="n" class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-gray-200"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
