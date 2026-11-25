import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseAboutContent } from '../frontend/src/content/about/parseAboutContent'
import { WorkEntry } from '../frontend/src/components/about/WorkEntry'
import { ProjectCards } from '../frontend/src/components/about/ProjectCards'
import { buildSiteCorpus } from '../frontend/src/lib/siteCorpus'
import { stripMarkdownInline } from '../frontend/src/content/about'

const sources = Object.fromEntries(['zh'].map((locale) => [
  locale,
  readFileSync(resolve(process.cwd(), `frontend/src/content/about/${locale}.md`), 'utf8'),
]))

test('chat corpus includes About project responsibilities and achievements from the shared source', () => {
  const content = parseAboutContent(sources.zh)
  const corpus = buildSiteCorpus('zh')
  for (const project of content.projects) {
    assert.ok(corpus.includes(stripMarkdownInline(project.content)), project.id)
    for (const item of [...project.responsibilities, ...project.achievements]) {
      assert.ok(corpus.includes(stripMarkdownInline(item)), project.id)
    }
  }
  assert.ok(corpus.includes('在兼容已有实现的基础上形成 Code Connect 映射方案'))
  assert.ok(!corpus.includes('团队基础交付效率提升约 200%'))
})

test('Chinese About content keeps complete content and stable work IDs', () => {
  for (const source of Object.values(sources)) {
    const content = parseAboutContent(source)
    assert.ok(content.heading)
    assert.equal(content.introParagraphs.length, 2)
    assert.deepEqual(content.work.map((work) => work.id), ['oceanbase', 'ecidi', 'leishu', 'puhuai'])
    for (const work of content.work) {
      assert.ok(work.title && work.meta && work.period && work.bullets.length)
    }
    for (const project of content.projects) {
      assert.ok(project.id && project.title && project.role && project.period && project.content)
      assert.ok(project.responsibilities.length && project.achievements.length)
    }
    assert.equal(content.education.id, 'njupt')
    assert.equal(content.education.items.length, 3)
    assert.equal(content.contact.items.length, 2)
    assert.doesNotMatch(JSON.stringify(content), /<!--/)
  }
  // These are intentionally separate localized source documents, not positional translations.
  assert.equal(parseAboutContent(sources.zh).projects.length, 4)
})

test('moving or renaming sections does not change their meaning', () => {
  for (const source of Object.values(sources)) {
    const [intro, ...sections] = source.split(/(?=^## )/m)
    const reordered = intro + sections.reverse().join('')
    const renamed = reordered.replace(/^## .+?( <!-- id: [a-z-]+ -->)$/gm, '## New section title$1')
    assert.deepEqual(parseAboutContent(renamed), parseAboutContent(source))
    assert.deepEqual(parseAboutContent(source.replace(/\n/g, '\r\n')), parseAboutContent(source))
  }
})

test('reordered and newly added work entries retain IDs, content and renderable anchors', () => {
  const sections = sources.zh.split(/(?=^## )/m)
  const workIndex = sections.findIndex((section) => section.startsWith('## ') && section.includes('<!-- id: work -->'))
  const [workHeading, ...entries] = sections[workIndex].split(/(?=^### )/m)
  const additional = '### 新经历 <!-- id: new-role -->\n\n新公司\n\n> 2027\n\n- 新职责\n\n'
  sections[workIndex] = workHeading + additional + entries.reverse().join('')
  const content = parseAboutContent(sections.join(''))
  assert.deepEqual(content.work.map((work) => work.id), ['new-role', 'puhuai', 'leishu', 'ecidi', 'oceanbase'])
  const original = parseAboutContent(sources.zh)
  for (const entry of original.work) {
    assert.deepEqual(content.work.find((work) => work.id === entry.id), entry)
  }
  const html = content.work.map((entry) => renderToStaticMarkup(createElement(WorkEntry, { entry }))).join('')
  assert.match(html, /id="work-new-role"/)
  assert.match(html, /新公司/)
  assert.doesNotMatch(html, /新职责/)
  assert.equal((html.match(/<article /g) ?? []).length, 5)
})

test('duplicate or missing IDs fail with a useful error instead of silently swapping content', () => {
  assert.throws(() => parseAboutContent(sources.zh.replace('id: ecidi', 'id: oceanbase')), /Duplicate About id: oceanbase/)
  assert.throws(() => parseAboutContent(sources.zh.replace('id: contact', 'id: work')), /Duplicate About id: work/)
  assert.throws(() => parseAboutContent(sources.zh.replace(' <!-- id: oceanbase -->', '')), /heading needs a stable id/)
  assert.throws(() => parseAboutContent(sources.zh.replace('id: work', 'id: other')), /Missing About section or article: work/)
})

test('project cards expose one stable control target per project independent of order', () => {
  const projects = parseAboutContent(sources.zh).projects.reverse()
  const html = renderToStaticMarkup(createElement(ProjectCards, { projects, locale: 'zh' }))
  const targets = [...html.matchAll(/aria-controls="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(targets).size, projects.length)
  for (const path of ['dataagent', 'aidesignsystem', 'databaseops', 'datadevelop']) {
    assert.ok(html.includes(`href="/project/${path}"`))
  }
  assert.doesNotMatch(html, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<a\s/)
  for (const project of projects) {
    const target = `about-project-${project.id}-content`
    assert.ok(targets.includes(target))
    assert.equal(html.split(`id="${target}"`).length - 1, 1)
  }
})

 test('work summaries stay separate from metadata and responsibilities', () => {
  for (const source of Object.values(sources)) {
    const fixture = source.replace(/(> (?:2021\/08 – 2026\/11|Aug 2021 – Nov 2026)\n)/, '$1\nExample work summary.\n')
    const content = parseAboutContent(fixture)
    const entry = content.work.find(work => work.id === 'oceanbase')!
    assert.ok(entry.summary)
    assert.ok(!entry.meta.includes(entry.summary))
    assert.equal(entry.bullets.length, 4)
    const html = renderToStaticMarkup(createElement(WorkEntry, { entry }))
    assert.ok(html.includes(entry.summary))
    assert.doesNotMatch(html, /AI 产品需求与场景/)
    assert.ok(content.work.find(work => work.id === 'ecidi')!.summary)
  }
})


test('About timeline summaries and current introduction remain available in chat', () => {
  const content = parseAboutContent(sources.zh)
  const corpus = buildSiteCorpus('zh')
  for (const paragraph of content.introParagraphs) assert.ok(corpus.includes(stripMarkdownInline(paragraph)))
  for (const entry of content.work) {
    assert.ok(entry.summary)
    assert.ok(corpus.includes(entry.summary))
    const html = renderToStaticMarkup(createElement(WorkEntry, { entry, projects: content.projects }))
    assert.ok(html.includes(entry.summary))
  }
  assert.ok(!content.education.summary)
})
