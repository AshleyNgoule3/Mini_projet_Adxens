import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charge le .env a la racine du depot (partage avec docker-compose), pas un
  // .env local a frontend/. Prefixe vide : on a aussi besoin ici de
  // API_PROXY_TARGET, qui n'est volontairement pas prefixe VITE_ puisqu'il ne
  // doit jamais etre expose au bundle cote client (seul le proxy du serveur
  // de dev l'utilise).
  const env = loadEnv(mode, '..', '')
  const proxyTarget = env.API_PROXY_TARGET || 'http://localhost:8080'

  return {
    envDir: '..',
    plugins: [react()],
    server: {
      // En docker-compose, le service est lance avec --host 0.0.0.0 (voir
      // docker-compose.yml) pour etre joignable depuis l'hote.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
