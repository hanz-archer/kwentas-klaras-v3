// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
  ],

  runtimeConfig: {
    databaseUrl: process.env.MONGODB_URI,
    appUrl: process.env.APP_URL,
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL,
    brevoSenderName: process.env.BREVO_SENDER_NAME,
    firebasePrivateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebaseClientId: process.env.FIREBASE_CLIENT_ID,
    firebaseAuthUri: process.env.FIREBASE_AUTH_URI,
    firebaseTokenUri: process.env.FIREBASE_TOKEN_URI,
    public: {
      appUrl: process.env.APP_URL,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('apexcharts') || id.includes('vue3-apexcharts')) {
                return 'apexcharts'
              }
              if (id.includes('leaflet') || id.includes('@vue-leaflet')) {
                return 'leaflet'
              }
              if (id.includes('firebase')) {
                return 'firebase'
              }
              if (id.includes('exceljs') || id.includes('xlsx')) {
                return 'excel'
              }
              if (id.includes('jspdf')) {
                return 'pdf'
              }
              if (id.includes('@nuxt/ui') || id.includes('@headlessui')) {
                return 'ui'
              }
              if (id.includes('vue') && !id.includes('node_modules/vue/')) {
                return 'vue-vendor'
              }
            }
          },
        },
      },
    },
  },

  nitro: {
    preset: 'vercel',
    externals: {
      inline: [
        'better-sqlite3',
      ],
    },
    routeRules: {
      '/api/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        },
        cors: false,
      },
      '/**': {
        headers: process.env.NODE_ENV === 'production' ? {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        } : {},
      },
    },
    experimental: {
      wasm: true,
    },
    compressPublicAssets: true,
    minify: true,
    sourceMap: false,
  },

  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/jpeg',
          href: '/images/boljoonlogo.jpg',
        },
      ],
    },
  },
})