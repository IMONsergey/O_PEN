import { createHead } from '@unhead/vue/client'
import Prism from 'prismjs'
import { createApp } from 'vue'

import './app.css'

async function bootstrap() {
  // Prism language modules are side-effect scripts and expect Prism to exist globally.
  // Expose the core before loading the application chunks that contain those modules.
  ;(globalThis as typeof globalThis & { Prism: typeof Prism }).Prism = Prism

  const [{ preloadFonts }, { IS_TAURI }, { default: App }, { default: router }] = await Promise.all([
    import('@/app/editor/fonts'),
    import('@/constants'),
    import('./App.vue'),
    import('./router')
  ])

  preloadFonts()
  const head = createHead()
  createApp(App).use(router).use(head).mount('#app')

  if (!IS_TAURI) {
    void import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
      return undefined
    })
  }
}

void bootstrap().catch((error) => {
  console.error('[OpenPencil bootstrap]', error)
})
