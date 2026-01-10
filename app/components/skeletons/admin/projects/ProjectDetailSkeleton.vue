<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-48"></div>
      <div class="flex items-center gap-2">
        <div class="h-9 bg-gray-200 rounded w-20"></div>
        <div class="h-9 bg-gray-200 rounded w-32"></div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
      <div class="p-6">
        <div class="space-y-6">
          <div class="pb-6 border-b border-gray-200">
            <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div class="h-10 bg-gray-200 rounded w-96"></div>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <div class="h-3 bg-gray-200 rounded w-24 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-32"></div>
            </div>
            <div>
              <div class="h-3 bg-gray-200 rounded w-32 mb-2"></div>
              <div class="h-6 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-b border-gray-200">
      <div class="flex space-x-8">
        <div v-for="n in 6" :key="n" class="py-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-300">
            <div class="flex items-center gap-3 animate-pulse">
              <div class="w-10 h-10 bg-gray-200 rounded"></div>
              <div>
                <div class="h-6 bg-gray-200 rounded w-40 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                <div class="space-y-3 pl-6">
                  <div v-for="n in 4" :key="n" class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div class="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="h-4 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                <div class="space-y-3 pl-6">
                  <div v-for="n in 4" :key="n" class="space-y-2">
                    <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden p-6 animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div class="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden p-6 animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
      </div>

      <div class="bg-white rounded-xl border border-gray-300 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-300">
          <div class="flex items-center gap-3 animate-pulse">
            <div class="w-10 h-10 bg-gray-200 rounded"></div>
            <div>
              <div class="h-6 bg-gray-200 rounded w-56 mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="n in 8" :key="n" class="bg-gray-50 rounded-lg p-4 animate-pulse">
              <div class="h-3 bg-gray-200 rounded w-24 mb-1"></div>
              <div class="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-32"></div>
              <div class="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
