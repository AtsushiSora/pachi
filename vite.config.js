import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'import.meta.env.VITE_ENCRYPT_KEY': JSON.stringify(env.VITE_ENCRYPT_KEY)
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main:      'index.html',
          sim:       'sim.html',
          app:       'app.html',
          ranking:   'ranking.html',
          challenge: 'challenge.html',
          howto:     'howto.html',
          safety:    'safety.html',
          contact:   'contact.html',
          about:     'about.html',
          privacy:   'privacy.html',
          disclaimer:'disclaimer.html',
          offline:   'offline.html',
          notfound:  '404.html',
        }
      }
    }
  }
})
