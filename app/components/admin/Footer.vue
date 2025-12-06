<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="px-8 py-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500">
          © {{ currentYear }} Admin Panel. All rights reserved.
        </p>
        <div class="flex items-center space-x-6">
          <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Terms</a>
          <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

