import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const html = readFileSync(new URL('../frontend/index.html', import.meta.url), 'utf8')
const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)?.[1]

function applyPreferences(read: (key: string) => string | null) {
  const root = { lang: 'zh-CN', dataset: { theme: 'dark' } }
  assert.ok(bootstrap, 'Preference initialization must run before the app module')
  runInNewContext(bootstrap, { document: { documentElement: root }, localStorage: { getItem: read } })
  return root
}

test('first paint defaults to Chinese and dark even without usable storage', () => {
  assert.match(html, /<html lang="zh-CN" data-theme="dark">/)
  assert.ok(html.indexOf('<script>') < html.indexOf('type="module"'))
  for (const read of [() => null, () => 'invalid', () => { throw new Error('Storage unavailable') }]) {
    assert.deepEqual(applyPreferences(read), { lang: 'zh-CN', dataset: { theme: 'dark' } })
  }
})

test('saved themes are honored while legacy language preferences cannot change Chinese', () => {
  for (const locale of ['zh', 'en']) {
    for (const theme of ['light', 'dark']) {
      const saved: Record<string, string> = { 'as4x-locale': locale, 'as4x-theme': theme }
      assert.deepEqual(applyPreferences((key) => saved[key] ?? null), {
        lang: 'zh-CN', dataset: { theme },
      })
    }
  }
})
