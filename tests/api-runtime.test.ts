import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

test('compiled chat handler loads in native Node ESM without Vite resolution', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'chat-runtime-'))
  try {
    await writeFile(join(directory, 'package.json'), '{"type":"module"}')
    for (const source of ['api/chat.ts', 'frontend/src/lib/chat/context.ts']) {
      const output = join(directory, source.replace(/\.ts$/, '.js'))
      await mkdir(dirname(output), { recursive: true })
      const compiled = ts.transpileModule(await readFile(source, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      })
      await writeFile(output, compiled.outputText)
    }
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import { handleChat } from './api/chat.js';
      const response = { setHeader() {}, end(body) { this.body = body; } };
      await handleChat({ method: 'GET' }, response);
      assert.equal(response.statusCode, 405);
    `], { cwd: directory, encoding: 'utf8', timeout: 10000 })
    assert.equal(result.status, 0, result.stderr || String(result.error || ''))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
