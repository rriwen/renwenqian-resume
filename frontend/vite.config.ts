import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { handleChat } from '../api/chat'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const deepseekKey = env.DEEPSEEK_API_KEY ?? ''
  return {
    envDir: '..',
    plugins: [react(), {
      name: 'local-chat-api',
      configureServer(server) {
        server.middlewares.use('/api/chat', (req, res) => { void handleChat(req, res, deepseekKey) })
      },
    }],
    build: { outDir: '../dist', emptyOutDir: true },
  }
})
