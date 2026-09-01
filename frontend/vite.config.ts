import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const deepseekKey = env.VITE_DEEPSEEK_API_KEY ?? ''
  return {
    envDir: '..',
    plugins: [react()],
    build: { outDir: '../dist', emptyOutDir: true },
    server: {
      proxy: {
        '/api': {
          target: 'https://www.rriwen4x.me',
          changeOrigin: true,
          secure: true,
        },
        '/deepseek': {
          target: 'https://api.deepseek.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/deepseek/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (deepseekKey) proxyReq.setHeader('Authorization', `Bearer ${deepseekKey}`)
            })
          },
        },
      },
    },
  }
})
