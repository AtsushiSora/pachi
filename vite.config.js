import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main:      'index.html',
          sim:       'sim.html',
          app:       'app.html',
          ranking:   'ranking.html',
          challenge: 'challenge.html',
          juggle:    'juggle.html',
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
