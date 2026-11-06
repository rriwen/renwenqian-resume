import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChatMessageContent } from '../frontend/src/components/chat/ChatMessageContent'
import { getChatProjectImages } from '../frontend/src/lib/chat/projectImages'
import { buildSiteCorpus } from '../frontend/src/lib/siteCorpus'

const locales = ['zh', 'en'] as const
const render = (content: string) => renderToStaticMarkup(createElement(ChatMessageContent, { content, locale: 'zh' }))

test('chat image catalogues contain unique existing public assets with contextual captions', () => {
  const publicDirectory = resolve('frontend/public')
  for (const locale of locales) {
    const images = getChatProjectImages(locale)
    assert.ok(images.length > 0)
    assert.equal(new Set(images.map(({ src }) => src)).size, images.length)
    for (const image of images) {
      assert.match(image.src, /^\/images\//)
      const file = resolve(publicDirectory, image.src.slice(1))
      assert.ok(file.startsWith(`${publicDirectory}${sep}`), `Image escapes public directory: ${image.src}`)
      assert.ok(existsSync(file), `Missing chat image: ${image.src}`)
      assert.ok(image.caption.trim(), `Missing image context: ${image.src}`)
      assert.doesNotMatch(image.caption, /占位|待补|准备中|概念|placeholder|concept/i)
      assert.doesNotMatch(image.projectPath, /#growth-/)
    }
    assert.ok(!images.some(({ src }) => src === '/images/work-6.webp'), 'AgentOps concept image must not be offered as a project screenshot')
    for (const src of ['/images/databaseops-stepper-horizontal.gif', '/images/databaseops-stepper-vertical.gif']) {
      assert.ok(images.some((image) => image.src === src && image.caption.trim()), 'Comparison GIFs need their surrounding interaction context')
    }
  }
})

test('each language exposes its image context in the corpus and preserves shared core figures', () => {
  for (const locale of locales) {
    const images = getChatProjectImages(locale)
    for (const src of ['/images/databaseops-rule-filter-component.png', '/images/datadevelop-sql-editor.jpg']) {
      assert.ok(images.some((image) => image.src === src), `Missing shared core figure in ${locale}: ${src}`)
    }
    const corpus = buildSiteCorpus(locale)
    for (const image of images) {
      assert.ok(corpus.includes(image.src), `Image is unavailable to the model: ${image.src}`)
      assert.ok(corpus.includes(image.caption), `Image context is unavailable to the model: ${image.src}`)
      assert.ok(corpus.includes(image.projectPath), `Image source is unavailable to the model: ${image.src}`)
    }
  }
})

test('assistant Markdown renders emphasis, ordered steps, and GFM tables', () => {
  const html = render([
    '**明确目标**',
    '1. 理解任务\n2. 验证结果',
    '| 环节 | 交付 |\n| --- | --- |\n| 设计 | 组件 |',
  ].join('\n\n'))
  assert.match(html, /<strong>明确目标<\/strong>/)
  assert.match(html, /<ol>\s*<li>理解任务<\/li>\s*<li>验证结果<\/li>\s*<\/ol>/)
  assert.match(html, /<table>/)
  assert.match(html, /<th>环节<\/th>/)
  assert.match(html, /<td>组件<\/td>/)
})

test('approved project images use catalogue context and cannot become external tracking links', () => {
  const image = getChatProjectImages('zh').find(({ src }) => src === '/images/datadevelop-sql-editor.jpg')!
  assert.ok(image)
  const html = render(`[![模型编造的图注](${image.src})](https://tracker.example/click)`)
  assert.match(html, /<img\s/)
  assert.ok(html.includes(`src="${image.src}"`))
  assert.ok(html.includes(`href="${image.src}"`))
  assert.ok(html.includes(`alt="${image.caption}"`))
  assert.ok(html.includes(image.caption))
  assert.doesNotMatch(html, /模型编造的图注|tracker\.example/)
  assert.equal((html.match(/<a\s/g) ?? []).length, 1, 'An image must not create nested links')
})

test('unknown local, external, protocol-relative, and data images never render image requests', () => {
  const html = render([
    '![外部追踪](https://tracker.example/pixel.png)',
    '![跨站追踪](//tracker.example/pixel.png)',
    '![未授权路径](/images/not-in-the-project-catalogue.png)',
    '![内嵌图](data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=)',
  ].join('\n\n'))
  assert.doesNotMatch(html, /<img\b|<iframe\b|<object\b|src=|href=|tracker\.example|data:image/i)
})

test('raw HTML and executable links cannot create active markup in assistant replies', () => {
  const html = render([
    '[危险链接](javascript:alert%281%29)',
    '<script>alert("injected-script")</script>',
    '<img src="https://tracker.example/raw.png" onerror="alert(1)">',
    '<iframe src="https://tracker.example/frame"></iframe>',
    '[项目详情](/project/datadevelop)',
  ].join('\n\n'))
  assert.doesNotMatch(html, /<script\b|<img\b|<iframe\b|javascript:|onerror=|tracker\.example|injected-script/i)
  assert.match(html, /href="\/project\/datadevelop"/)
  assert.ok(html.includes('危险链接'), 'Unsafe destinations should not remove the readable link text')
})
