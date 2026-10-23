import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { getAdjacentProjects, getProjectBySlug, getProjectTitle, projects } from '../frontend/src/data/projects'
import { getProjectDetail } from '../frontend/src/data/projectDetails'
import { DATA_PILOT_DEMO_URL, getDataPilotContent } from '../frontend/src/data/projects/dataPilot'
import { buildSiteCorpus } from '../frontend/src/lib/siteCorpus'

const locales = ['zh', 'en'] as const

test('project routes have unique identities and bilingual content', () => {
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length)
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length)
  for (const project of projects) {
    assert.equal(getProjectBySlug(project.slug), project)
    for (const locale of locales) {
      assert.ok(getProjectTitle(project, locale).trim())
      assert.ok(project.tags[locale].length)
      const detail = getProjectDetail(project.slug, locale)
      assert.ok(detail, `${project.slug}: missing ${locale} detail`)
      assert.ok(detail.paragraphs.length, `${project.slug}: missing ${locale} copy`)
      for (const src of [project.image, ...detail.gallery.map((item) => item.src)]) {
        assert.ok(src.startsWith('/images/'), `${project.slug}: unexpected asset path ${src}`)
        assert.ok(existsSync(new URL(`../frontend/public${src}`, import.meta.url)), `Missing image: ${src}`)
      }
    }
  }
})

test('reordering project cards preserves their tags and legacy routes resolve', () => {
  const reversed = [...projects].reverse()
  assert.ok(reversed.find((project) => project.slug === 'dataagent')?.tags.en.includes('Commercialization'))
  assert.ok(reversed.find((project) => project.slug === 'Memory')?.tags.zh.includes('全栈设计'))
  assert.equal(getProjectBySlug('ai-智能问数'), getProjectBySlug('dataagent'))
  assert.equal(getProjectBySlug(undefined), undefined)
  assert.equal(getProjectBySlug('missing'), undefined)
  assert.deepEqual(getAdjacentProjects('missing'), {})
  for (const [index, project] of projects.entries()) {
    assert.deepEqual(getAdjacentProjects(project.slug), { prev: projects[index - 1], next: projects[index + 1] })
  }
})

for (const locale of locales) {
  test(`DataPilot ${locale} page and chat use the same complete case study`, () => {
    const content = getDataPilotContent(locale)
    const detail = getProjectDetail('dataagent', locale)!
    const corpus = buildSiteCorpus(locale)
    assert.equal(detail.externalUrl, DATA_PILOT_DEMO_URL)
    assert.equal(content.demoUrl, DATA_PILOT_DEMO_URL)
    assert.deepEqual(detail.paragraphs, content.paragraphs)
    assert.ok(corpus.includes(DATA_PILOT_DEMO_URL))
    assert.ok(!corpus.includes('datapilot-rho-gilt.vercel.app'))
    for (const paragraph of content.paragraphs) assert.ok(corpus.includes(paragraph))
    for (const part of Object.values(content.parts)) {
      assert.ok(part.title.trim())
      assert.ok(part.sections.length)
      assert.equal(new Set(part.sections.map((section) => section.id)).size, part.sections.length)
      for (const section of part.sections) {
        assert.ok(corpus.includes(section.title), `Missing title: ${section.id}`)
        assert.ok(corpus.includes(section.body), `Missing body: ${section.id}`)
        for (const bullet of section.bullets ?? []) assert.ok(corpus.includes(bullet))
        for (const application of section.applicationTypes ?? []) {
          assert.ok(corpus.includes(application.scene))
          assert.ok(corpus.includes(application.problem))
          assert.ok(corpus.includes(application.solution))
        }
      }
    }
  })
}
