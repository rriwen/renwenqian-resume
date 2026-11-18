import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'
import { getAdjacentProjects, getProjectBySlug, getProjectGroups, getProjectTitle, projectCategories, projects } from '../frontend/src/data/projects'
import { DATABASE_OPS_PROTOTYPE_URL, getProjectDetail } from '../frontend/src/data/projectDetails'
import { getProjectAnchors } from '../frontend/src/data/projectAnchors'
import { DATA_PILOT_DEMO_URL, getDataPilotContent } from '../frontend/src/data/projects/dataPilot'
import { getDatabaseOpsFunnel, getFunnelStageMetrics } from '../frontend/src/data/projects/databaseOps'
import { translations } from '../frontend/src/i18n/translations'
import { interviewSystemPrompts } from '../frontend/src/lib/chat/interviewPrompt'
import { buildSiteCorpus } from '../frontend/src/lib/siteCorpus'

const locales = ['zh'] as const

test('site content exposes only Chinese translations and retains complete case sections', () => {
  assert.deepEqual(Object.keys(translations), ['zh'])
  assert.deepEqual(Object.keys(interviewSystemPrompts), ['zh'])
  assert.equal(existsSync('frontend/src/content/about/en.md'), false)
  for (const project of projects) {
    assert.equal('titleEn' in project, false)
    assert.deepEqual(Object.keys(project.tags), ['zh'])
  }
  const parts = getDataPilotContent('zh').parts
  for (const part of Object.values(parts)) {
    assert.ok(part.sections.length > 0)
    assert.equal(new Set(part.sections.map(section => section.id)).size, part.sections.length)
  }
})

test('design engineering architecture shares stable identities and reaches the chat corpus', () => {
  for (const locale of locales) {
    const detail = getProjectDetail('aidesignsystem', locale)!
    const corpus = buildSiteCorpus(locale)
    const sections = detail.sections!
    const ids = sections.flatMap(({ id, legacyIds }) => [id, ...(legacyIds ?? [])])
    assert.equal(new Set(ids).size, ids.length)
    assert.ok(['design-highlights', 'project-gallery', 'connections'].every(id => ids.includes(id)))
    const architecture = sections.find(({ architecture }) => architecture)!.architecture!
    assert.equal(architecture.layers.length, 4)
    assert.ok(corpus.includes(architecture.title))
    for (const layer of architecture.layers) {
      assert.ok(corpus.includes(layer.description ? `${layer.title}: ${layer.description}` : layer.title))
      for (const node of layer.nodes) assert.ok(corpus.includes(node.description ? `${node.title}: ${node.description}` : node.title))
    }
  }
})

test('funnel details distinguish measured counts, estimated counts and step conversion', () => {
  const { stages } = getDatabaseOpsFunnel('zh')
  assert.deepEqual(stages.map(({ conversionRate }) => conversionRate), [undefined, 35.34, 65.97, 72.08])
  const firstTransition = getFunnelStageMetrics(stages, 1)
  assert.equal(firstTransition.dropOff, 1570)
  assert.equal(firstTransition.estimated, false)
  assert.equal(firstTransition.retainedRate.toFixed(2), '35.34')
  const lastTransition = getFunnelStageMetrics(stages, 3)
  assert.equal(lastTransition.dropOff, 158)
  assert.equal(lastTransition.estimated, true)
  assert.equal(lastTransition.retainedRate.toFixed(1), '16.8')
  assert.equal(getFunnelStageMetrics(stages, 0).retainedRate, 100)
})

test('case-study anchors cover actual content and retain stable section identities', () => {
  for (const project of projects.filter(({ slug }) => slug !== 'dataagent')) {
    for (const locale of locales) {
      const detail = getProjectDetail(project.slug, locale)!
      const anchors = getProjectAnchors(detail, locale)
      assert.equal(new Set(anchors.map(({ id }) => id)).size, anchors.length)
      assert.ok(anchors.every(({ title }) => title.trim()))
      assert.equal(anchors.some(({ id }) => id === 'responsibilities'), Boolean(detail.responsibilities))
      assert.equal(anchors.some(({ id }) => id === 'design-highlights'), Boolean(detail.highlightBullets?.length))
      assert.equal(anchors.some(({ id }) => id === 'project-gallery'), Boolean(detail.gallery.length))
      for (const section of detail.sections ?? []) assert.equal(anchors.some(({ id, title }) => id === section.id && title === section.title), !section.hideTitle)
      const reversed = { ...detail, sections: detail.sections?.slice().reverse() }
      assert.deepEqual(new Set(getProjectAnchors(reversed, locale).map(({ id }) => id)), new Set(anchors.map(({ id }) => id)))
    }
  }
})

test('project categories cover every project once with stable groups', () => {
  const groups = getProjectGroups()
  assert.deepEqual(groups.map(({ id, projects: items }) => [id, items.map(({ slug }) => slug)]), [
    ['ai-products', ['dataagent', 'agentops', 'text2sql', 'Memory']],
    ['data-tools', ['databaseops', 'datadevelop', 'workflow-editor']],
    ['design-systems', ['aidesignsystem', 'design-token', 'skills', 'design-md']],
  ])
  assert.equal(new Set(projectCategories.map(({ id }) => id)).size, projectCategories.length)
  const grouped = groups.flatMap((group) => group.projects)
  assert.equal(grouped.length, projects.length)
  assert.equal(new Set(grouped.map(({ slug }) => slug)).size, projects.length)
  assert.deepEqual(new Set(grouped), new Set(projects))
  for (const group of groups) {
    for (const locale of locales) assert.ok(group.label[locale].trim())
  }
  const reversed = [...projects].reverse()
  const reordered = getProjectGroups(reversed)
  assert.deepEqual(reordered.map(({ id }) => id), groups.map(({ id }) => id))
  for (const group of reordered) {
    assert.deepEqual(group.projects, reversed.filter((project) => project.category === group.id))
    for (const project of group.projects) assert.equal(project, getProjectBySlug(project.slug))
  }
})

test('project routes have unique identities and complete Chinese content', () => {
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length)
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length)
  for (const project of projects) {
    assert.equal(getProjectBySlug(project.slug), project)
    for (const locale of locales) {
      assert.ok(getProjectTitle(project, locale).trim())
      assert.ok(project.tags[locale].length)
      const detail = getProjectDetail(project.slug, locale)
      assert.ok(detail, `${project.slug}: missing ${locale} detail`)
      assert.ok(detail.paragraphs.length || detail.sections?.some(section => section.paragraphs.length), `${project.slug}: missing ${locale} copy`)
      const images = [...detail.gallery, ...(detail.sections ?? []).flatMap((section) => [
        ...section.images,
        ...(section.subsections ?? []).flatMap((part) => part.images ?? []),
      ])]
      for (const src of [project.image, ...images.map((item) => item.src)]) {
        assert.ok(src.startsWith('/images/'), `${project.slug}: unexpected asset path ${src}`)
        assert.ok(existsSync(new URL(`../frontend/public${src}`, import.meta.url)), `Missing image: ${src}`)
      }
    }
  }
})

test('database ops sections keep image associations and complete chat content', () => {
  const zhSections = getProjectDetail('databaseops', 'zh')!.sections!
  assert.deepEqual(zhSections.map(({ id }) => id), ['design-goals', 'diagnosis', 'migration-analysis', 'design-opportunities', 'interaction', 'object-selection', 'outcomes'])
  assert.equal(new Set(zhSections.map((section) => section.id)).size, zhSections.length)
  for (const locale of locales) {
    const corpus = buildSiteCorpus(locale)
    assert.ok(corpus.includes(DATABASE_OPS_PROTOTYPE_URL))
    const detail = getProjectDetail('databaseops', locale)!
    assert.equal(detail.sections!.find(({ id }) => id === 'design-goals')!.placement, 'overview')
    const stepper = detail.sections!.find(({ id }) => id === 'interaction')!
      .subsections!.find(({ id }) => id === 'continuous-setup')!.comparison!
    assert.equal(stepper.id, 'stepper-design')
    assert.equal(getProjectAnchors(detail, locale).filter(({ id }) => id === stepper.id).length, 0)
    assert.deepEqual(stepper.options.map(({ images }) => images.map(({ src }) => src)), [
      ['/images/databaseops-stepper-horizontal.gif'], ['/images/databaseops-stepper-vertical.gif'],
    ])
    for (const text of [stepper.title, ...stepper.paragraphs, ...stepper.options.flatMap((option) => [
      option.title, ...option.paragraphs, ...option.listItems, ...option.images.map(({ caption }) => caption),
    ])]) {
      assert.ok(corpus.includes(typeof text === 'string' ? text : text.map((run) => run.text).join('')), 'Nested comparisons must remain in the chat corpus')
    }
    for (const image of stepper.options.flatMap(({ images }) => images)) {
      assert.ok(existsSync(`frontend/public${image.src}`), `Missing nested comparison image: ${image.src}`)
    }
    const diagnosis = getProjectDetail('databaseops', locale)!.sections!.find(({ id }) => id === 'diagnosis')!
    const migrationAnalysis = getProjectDetail('databaseops', locale)!.sections!.find(({ id }) => id === 'migration-analysis')!
    assert.deepEqual(diagnosis.images, [])
    assert.deepEqual(diagnosis.subsections!.find(({ id }) => id === 'journey-map')!.images?.map(({ src }) => src), ['/images/databaseops-ux-map.jpg'])
    const funnel = migrationAnalysis.subsections!.find(({ id }) => id === 'instrumentation')!.funnel!
    assert.deepEqual(funnel.stages.map(({ value, estimated }) => ({ value, estimated })), [
      { value: 2428, estimated: false }, { value: 858, estimated: false },
      { value: 566, estimated: true }, { value: 408, estimated: true },
    ])
    assert.ok(corpus.includes(funnel.title) && corpus.includes(funnel.context) && corpus.includes(funnel.legend) && corpus.includes(funnel.note))
    for (const stage of funnel.stages) {
      assert.ok(corpus.includes(`${stage.label}: ${stage.estimated ? '≈ ' : ''}${stage.value}`))
      if (stage.conversionRate !== undefined) assert.ok(corpus.includes(`${stage.conversionRate}%`))
    }
    for (const section of getProjectDetail('databaseops', locale)!.sections!) {
      const images = [...section.images, ...(section.subsections ?? []).flatMap((part) => part.images ?? [])]
      assert.ok(section.title && (section.paragraphs.length || section.subsections?.length || section.table?.rows.length))
      assert.ok(corpus.includes(section.title))
      const subsections = section.subsections ?? []
      assert.equal(new Set(subsections.map(({ id }) => id)).size, subsections.length)
      for (const subsection of subsections) {
        assert.ok(subsection.title && (subsection.paragraphs.length || subsection.listItems?.length || subsection.table?.rows.length))
        assert.ok(corpus.includes(subsection.title))
        if (subsection.comparisonPlaceholder) {
          for (const placeholder of Object.values(subsection.comparisonPlaceholder)) {
            assert.ok(!corpus.includes(placeholder.description), 'Image preparation notes must not enter the factual chat corpus')
          }
        }
      }
      for (const paragraph of [...section.paragraphs, ...subsections.flatMap((part) => [...part.paragraphs, ...(part.listItems ?? [])])]) {
        const text = typeof paragraph === 'string' ? paragraph : paragraph.map((run) => run.href ? `${run.text} (${run.href})` : run.text).join('')
        assert.ok(corpus.includes(text), `Missing ${locale} section copy: ${section.id}`)
        if (typeof paragraph !== 'string') {
          for (const run of paragraph) {
            if (run.href) {
              assert.equal(new URL(run.href).protocol, 'https:')
              assert.ok(corpus.includes(run.href))
            }
          }
        }
      }
      for (const image of images) assert.ok(corpus.includes(image.caption))
      const tables = [section.table, ...subsections.map(part => part.table)]
      for (const table of tables) {
        if (!table) continue
        assert.equal(new Set(table.rows.map(({ id }) => id)).size, table.rows.length)
        for (const column of table.columns) assert.ok(corpus.includes(column))
        const remainingSpans = Array(table.columns.length).fill(0)
        const expandedCells: string[] = Array(table.columns.length).fill('')
        for (const [rowIndex, row] of table.rows.entries()) {
          assert.equal(row.cells.length, table.columns.length)
          row.cells.forEach((cell, columnIndex) => {
            if (remainingSpans[columnIndex] > 0) {
              assert.equal(cell, null, 'Merged cells must not overlap other content')
              remainingSpans[columnIndex]--
              return
            }
            assert.notEqual(cell, null, 'Empty cells must be covered by a previous row span')
            const text = typeof cell === 'string' ? cell : cell!.text
            const rowSpan = typeof cell === 'string' ? 1 : cell!.rowSpan
            assert.ok(text && corpus.includes(text))
            assert.ok(Number.isInteger(rowSpan) && rowSpan >= 1 && rowSpan <= table.rows.length - rowIndex)
            remainingSpans[columnIndex] = rowSpan - 1
            expandedCells[columnIndex] = text
          })
          assert.ok(corpus.includes(expandedCells.join(' | ')), 'Chat must retain the metric associated with every problem row')
        }
      }
    }
  }
})

test('reordering project cards preserves their tags and legacy routes resolve', () => {
  const reversed = [...projects].reverse()
  assert.ok(reversed.find((project) => project.slug === 'dataagent')?.tags.zh.includes('商业化'))
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
    assert.ok(corpus.includes(content.lead))
    for (const paragraph of content.paragraphs) assert.ok(!corpus.includes(paragraph), 'Hidden legacy introductions must not override current page content')
    for (const part of Object.values(content.parts)) {
      for (const section of part.sections) {
        if (section.group) assert.ok(corpus.includes(section.group.title))
        for (const image of section.images) {
          if (/占位图|placeholder/i.test(image.caption)) assert.ok(!corpus.includes(image.caption))
        }
      }
    }
    for (const part of Object.values(content.parts)) {
      assert.ok(part.title.trim())
      assert.ok(part.sections.length)
      assert.equal(new Set(part.sections.map((section) => section.id)).size, part.sections.length)
      for (const section of part.sections) {
        if (section.continuationOf) {
          const parent = part.sections.find(item => item.id === section.continuationOf)
          assert.ok(parent && corpus.includes(parent.title), `Missing parent: ${section.id}`)
          assert.ok(part.sections.indexOf(parent) < part.sections.indexOf(section))
        } else if (section.groupIntro) {
          assert.ok(section.group && corpus.includes(section.group.title), `Missing group: ${section.id}`)
          assert.ok(!corpus.includes(`###### ${section.title}`), `Intro must not create a subsection: ${section.id}`)
        } else assert.ok(corpus.includes(section.title), `Missing title: ${section.id}`)
        assert.ok(corpus.includes(section.body), `Missing body: ${section.id}`)
        if (section.afterTable) assert.ok(corpus.includes(section.afterTable))
        for (const row of section.table?.rows ?? []) {
          for (const cell of row.cells) {
            if (cell !== null) assert.ok(corpus.includes(typeof cell === 'string' ? cell : cell.text), `Missing table content: ${section.id}`)
          }
        }
        for (const step of section.steps ?? []) {
          assert.ok(corpus.includes(`${step.title}: ${step.detail}`), `Missing analysis step: ${section.id}`)
        }
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


test('DataPilot experience keeps product proposals and outcomes explicit', () => {
  const zh = getDataPilotContent('zh').parts.experience.sections
  assert.ok(zh.find(({ id }) => id === 'continuous-analysis-example')!.dialogue!.visual.note.includes('不代表已验证'))
  assert.ok(zh.find(({ id }) => id === 'accuracy')!.body.includes('AgentOps Demo'))
  assert.deepEqual(zh.filter(section => section.group?.id === 'agent-troubleshooting' && !section.groupIntro && !section.dialogueExtension).map(section => section.tabLabel), ['结果准确性', '执行异常', '执行耗时'])
  assert.ok(zh.find(({ id }) => id === 'role')!.body.includes('15% 逐步提升到 60%'))
  assert.ok(zh.find(({ id }) => id === 'role')!.bullets!.some(text => text.includes('用户发布应用数 / 创建应用数')))
  assert.ok(!zh.some(({ id }) => id === 'delivery'))
  assert.ok(!zh.some(section => section.id === 'design-collaboration'))
  assert.ok(buildSiteCorpus('zh').includes('https://design-md-reader-4x.vercel.app/'))
  assert.deepEqual(zh.filter(section => section.group?.id === 'qa-experience').map(section => section.id), ['qa-overview', 'qa-entry', 'qa-execution', 'qa-result'])
  assert.ok(zh.findIndex(section => section.id === 'qa-result') < zh.findIndex(section => section.id === 'continuous-analysis-example'))
  assert.deepEqual(zh.filter(section => section.group?.id === 'continuous-dialogue').map(section => section.id), ['continuous-analysis-example', 'conversation', 'report-editing', 'continuous-analysis-validation'])
  assert.deepEqual(zh.find(section => section.id === 'continuous-analysis-validation')!.legacyIds, ['applications'])
  const reportEditing = zh.find(section => section.id === 'report-editing')!
  assert.ok(reportEditing.dialogue!.decisions.some(item => `${item.title}${item.body}`.includes('回滚')))
  assert.ok(reportEditing.dialogue!.visual.note.includes('交互方案'))
  assert.deepEqual(zh.filter(section => section.group?.id === 'continuous-dialogue' && !section.groupIntro).map(section => section.tabLabel), ['连续追问', '修改应用', '使用应用'])
  assert.ok(!zh.filter(section => section.group?.id === 'continuous-dialogue').some(section => section.body.includes('指代')))
  assert.deepEqual(zh.filter(section => section.group?.id === 'agent-troubleshooting').map(section => section.id), ['agent-troubleshooting-overview', 'agent-replay', 'agent-evidence', 'agent-latency', 'accuracy'])
  for (const locale of ['zh'] as const) {
    const sections = getDataPilotContent(locale).parts.experience.sections
    const corpus = buildSiteCorpus(locale)
    assert.equal(sections.filter((section) => section.designPlaceholder).length, 7)
    for (const section of sections) {
      if (section.designPlaceholder) assert.ok(!corpus.includes(section.designPlaceholder), 'Editorial image briefs must not become chat facts')
      if (section.qaExperience) {
        assert.ok(corpus.includes(section.body), 'QA prose must reach chat in full')
        if (section.qaExperience.materialBrief) assert.ok(!corpus.includes(section.qaExperience.materialBrief), 'Preparation notes must not become chat facts')
        for (const decision of section.qaExperience.decisions) assert.ok(corpus.includes(decision.body))
        if (section.qaExperience.bridge) assert.ok(corpus.includes(section.qaExperience.bridge))
        const mockup = section.qaExperience.mockup
        assert.ok(!corpus.includes(mockup.label), 'Mock interface labels must not enter personal facts')
        if (mockup.kind === 'result') assert.ok(!corpus.includes(mockup.prompt), 'Simulated chart findings must not enter personal facts')
      }
      if (section.dialogue) {
        assert.ok(corpus.includes(section.body), 'Dialogue scenarios must reach chat')
        if (section.dialogue.tradeoff) assert.ok(corpus.includes(section.dialogue.tradeoff), 'Design challenges must reach chat')
        assert.ok(corpus.includes(section.dialogue.visual.note), 'Interaction proposal boundaries must reach the shared corpus')
        for (const decision of section.dialogue.decisions) assert.ok(corpus.includes(decision.body))
        for (const frame of section.dialogue.visual.frames) {
          assert.ok(corpus.includes(frame.prompt))
          assert.ok(corpus.includes(frame.response))
          for (const field of frame.fields) assert.ok(corpus.includes(field.value))
        }
      }
      for (const lane of section.diagram?.lanes ?? []) {
        for (const step of lane.steps) assert.ok(corpus.includes(step.response ?? step.title), 'Diagram content must reach the shared corpus')
      }
    }
  }
  for (const sections of [zh]) {
    const results = sections.find(({ id }) => id === 'role')!
    assert.ok(results.body.includes('15%') && results.body.includes('60%'))
  }
})
