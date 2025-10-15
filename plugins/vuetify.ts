import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    defaults: {
      global: {
        style: {
          fontFamily: "'Quicksand', sans-serif",
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})