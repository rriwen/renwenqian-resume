import { readdir } from 'node:fs/promises'
import { createServer } from 'vite'
import { createServer as createHttpServer } from 'node:http'

// Use the project's existing Vite transformer: TS, TSX and raw Markdown glob imports work identically.
const transport = createHttpServer() // never listens on a port
const server = await createServer({
  configFile: false,
  root: process.cwd(),
  appType: 'custom',
  logLevel: 'error',
  esbuild: { jsx: 'automatic' },
  server: { middlewareMode: true, hmr: { server: transport } },
})
try {
  const files = (await readdir('tests')).filter((file) => file.endsWith('.test.ts')).sort()
  if (!files.length) throw new Error('No tests found')
  for (const file of files) await server.ssrLoadModule(`/tests/${file}`)
} finally {
  await server.close()
}
