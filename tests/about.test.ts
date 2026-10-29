import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parseAboutContent } from '../frontend/src/content/about/parseAboutContent'
import { WorkEntry } from '../frontend/src/components/about/WorkEntry'
import { ProjectCards } from '../frontend/src/components/about/ProjectCards'

const sources = Object.fromEntries(['zh', 'en'].map((locale) => [
  locale,
  readFileSync(resolve(process.cwd(), `frontend/src/content/about/${locale}.md`), 'utf8'),
]))

test('both About locales keep complete content and shared stable work IDs', () => {
  for (const source of Object.values(sources)) {
    const content = parseAboutContent(source)
    assert.ok(content.heading)
    assert.equal(content.introParagraphs.length, 3)
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
  assert.equal(parseAboutContent(sources.en).projects.length, 4)
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
  assert.match(html, /新职责/)
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
  for (const project of projects) {
    const target = `about-project-${project.id}-content`
    assert.ok(targets.includes(target))
    assert.equal(html.split(`id="${target}"`).length - 1, 1)
  }
})
