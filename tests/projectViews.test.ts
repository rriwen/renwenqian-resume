import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getProjectBySlug, getProjectGroups, projects } from '../frontend/src/data/projects'
import { getProjectNavigationGroups, getProjectViewBySlug } from '../frontend/src/data/projectViews'

test('legacy project URL resolves to the canonical project without a duplicate navigation entry', () => {
  const before = JSON.stringify(projects)
  const view = getProjectViewBySlug('databaseops-visual')!
  const source = getProjectBySlug(view.sourceSlug)!
  assert.equal(source.slug, 'databaseops')
  assert.equal(getProjectBySlug(view.slug), undefined)
  assert.equal(getProjectViewBySlug('databaseops'), undefined)
  assert.equal(getProjectViewBySlug(undefined), undefined)

  const group = getProjectNavigationGroups().find(group => group.id === 'data-tools')!
  assert.equal(group.projects.filter(project => project.slug === source.slug).length, 1)
  assert.equal(group.projects.some(project => project.slug === view.slug), false)
  const entry = group.projects.find(project => project.slug === source.slug)!
  assert.equal(entry.slug, source.slug)
  assert.equal(entry.category, source.category)
  assert.equal(entry.image, source.image)
  assert.equal(JSON.stringify(projects), before)
  assert.equal(getProjectGroups().flatMap(group => group.projects).length, projects.length)
})

test('navigation views have unique identities and follow their source when project ordering changes', () => {
  const items = getProjectNavigationGroups([...projects].reverse()).flatMap(group => group.projects)
  assert.equal(items.length, projects.length)
  assert.equal(new Set(items.map(item => item.slug)).size, items.length)
  assert.equal(new Set(items.map(item => item.id)).size, items.length)
  const withoutSource = getProjectNavigationGroups(projects.filter(project => project.slug !== 'databaseops'))
  assert.equal(withoutSource.flatMap(group => group.projects).some(project => project.slug === 'databaseops-visual'), false)
})
