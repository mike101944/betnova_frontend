import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// CSS
import './style.css'


import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router/index'

// Create Pinia instance
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Create Vue app
const app = createApp(App)

// Register plugins
app.use(pinia)
app.use(router)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
  
  // You can send to error tracking service here
}

// Global performance marks
if (import.meta.env.DEV) {
  app.config.performance = true
}

// Mount app
app.mount('#app')

// Service worker registration (for PWA)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.error('Service worker registration failed:', error)
    })
  })
}
