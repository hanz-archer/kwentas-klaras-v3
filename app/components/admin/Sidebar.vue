<template>
  <aside class="w-64 bg-white shadow-lg flex flex-col h-full">
    <div class="p-6 flex-shrink-0">
      <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
      <p class="text-sm text-gray-500 mt-1">Dashboard</p>
    </div>
    <nav class="px-4 space-y-2 flex-1 overflow-y-auto">
      <NuxtLink to="/admin" class="flex items-center px-4 py-3 rounded-lg transition" :class="($route.path === '/admin' || $route.path === '/admin/') ? 'text-gray-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-50'">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Dashboard
      </NuxtLink>
      <NuxtLink to="/admin/users" class="flex items-center px-4 py-3 rounded-lg transition" :class="$route.path.startsWith('/admin/users') ? 'text-gray-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-50'">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        Users
      </NuxtLink>
      <NuxtLink to="/admin/projects" class="flex items-center px-4 py-3 rounded-lg transition" :class="$route.path.startsWith('/admin/projects') ? 'text-gray-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-50'">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Projects
      </NuxtLink>
      <NuxtLink to="/admin/analytics" class="flex items-center px-4 py-3 rounded-lg transition" :class="$route.path.startsWith('/admin/analytics') ? 'text-gray-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-50'">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Analytics
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="flex items-center px-4 py-3 rounded-lg transition" :class="$route.path.startsWith('/admin/settings') ? 'text-gray-700 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-50'">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </NuxtLink>
    </nav>
    <div class="p-4 border-t border-gray-200 flex-shrink-0 w-full">
      <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const handleLogout = async () => {
  await navigateTo('/auth/login')
}
</script>

