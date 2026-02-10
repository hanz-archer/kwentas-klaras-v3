<template>
  <div class="h-screen flex bg-brand-bg overflow-hidden">
    <div class="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 bg-white">
      <div class="max-w-md w-full mx-auto space-y-8">
        <h1 class="text-3xl font-extrabold text-brand-blue mb-2">Reset your password</h1>
        <p class="text-brand-green mb-8">
          Enter the email associated with your account and we'll send you a link to reset your password.
        </p>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              placeholder="you@example.com"
              required
            />
          </div>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              style="background-color: #2563EB;"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:[background-color:#22C98D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending reset link...
              </span>
              <span v-else>Send reset link</span>
            </button>
          </div>

          <div class="mt-4 text-sm text-center">
            <NuxtLink to="/auth/login" class="font-medium text-brand-green hover:text-brand-blue">
              Back to login
            </NuxtLink>
          </div>
        </form>
      </div>
    </div>

    <div class="hidden md:flex w-1/2 relative overflow-hidden">
      <div class="absolute inset-0 bg-gray-300 opacity-60 z-0"></div>
      <div class="absolute inset-0 bg-brand-blue opacity-20 z-10"></div>
      <img src="/images/loginlogo.jpg" alt="Municipality of Boljoon Logo" class="w-full h-full object-cover relative z-20" />
    </div>

    <SuccessModal
      :show="showSuccessModal"
      title="Reset link sent"
      message="If an account exists for this email, a password reset link has been sent. Please check your inbox."
      button-text="Back to login"
      :auto-close-seconds="3"
      @close="closeSuccessModal"
    />

    <ErrorModal
      :show="showErrorModal"
      title="Password reset failed"
      :message="errorMessage"
      button-text="Try Again"
      :auto-close-seconds="0"
      @close="closeErrorModal"
    />
  </div>
</template>

<script setup lang="ts">
import { usePasswordReset } from '~/composables/auth/usePasswordReset'
import SuccessModal from '~/components/ui/SuccessModal.vue'
import ErrorModal from '~/components/ui/ErrorModal.vue'

definePageMeta({
  layout: false,
})

const {
  form,
  loading,
  showSuccessModal,
  showErrorModal,
  errorMessage,
  handleReset,
  closeSuccessModal,
  closeErrorModal,
} = usePasswordReset()

const handleSubmit = async () => {
  await handleReset()
}
</script>


