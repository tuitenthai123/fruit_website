import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: "Moring Fruit",
      titleTemplate: "Clone by TuiTenThai",
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
  runtimeConfig: {
    private: {
      NUXT_JWT_SECRET: process.env.NUXT_JWT_SECRET,
      NUXT_GOOGLE_CLIENT_ID: process.env.NUXT_GOOGLE_CLIENT_ID,
      NUXT_SMTP_HOST: process.env.NUXT_SMTP_HOST,
      NUXT_SMTP_PORT: process.env.NUXT_SMTP_PORT,
      NUXT_SMTP_USER: process.env.NUXT_SMTP_USER,
      NUXT_SMTP_PASS: process.env.NUXT_SMTP_PASS,
      NUXT_FROM_EMAIL: process.env.NUXT_FROM_EMAIL,
      NUXT_CLOUDINARY_CLOUD_NAME: process.env.NUXT_CLOUDINARY_CLOUD_NAME,
      NUXT_CLOUDINARY_API_KEY: process.env.NUXT_CLOUDINARY_API_KEY,
      NUXT_CLOUDINARY_API_SECRET: process.env.NUXT_CLOUDINARY_API_SECRET,
    },
    public: {
      NUXT_DOMAIN: process.env.NUXT_DOMAIN,
    }
  },

  modules: [
    'nuxt-vue3-google-signin',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },

    ['@nuxtjs/google-fonts', {
      families: {
        Quicksand: [100, 300, 400, 500, 700],
      },
      display: 'swap',
    },],
  ],

  googleSignIn: {
    clientId: process.env.NUXT_GOOGLE_CLIENT_ID,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    externals: {
      inline: [
        'vue',
        '@vue/runtime-dom',
        '@nuxt/vue-app'
      ]
    }
  }
})
