import test from 'node:test'
import assert from 'node:assert/strict'
import { applyProposal, buildDiff, createProposal, formatSql, getLineRange } from '../frontend/src/components/sql-prototype/model'

test('SQL proposals apply only to the selected range and reject stale documents', () => {
  const first = 'SELECT id FROM customers;\n'
  const selected = 'select name from customers where city = \'上海\';'
  const last = '\nSELECT id FROM orders;'
  const source = first + selected + last
  const proposal = createProposal(source, { start: first.length, end: first.length + selected.length }, 'format', '')
  assert.equal(proposal.before, selected)
  assert.equal(applyProposal(source, proposal), first + proposal.after + last)
  assert.equal(applyProposal(source + '\n-- edited while generating', proposal), null)
})

test('SQL generation inserts into an empty line without replacing adjacent statements', () => {
  const first = 'SELECT id FROM customers;\n'
  const last = '\nSELECT id FROM orders;'
  const source = first + last
  const range = getLineRange(source, first.length)
  assert.deepEqual(range, { start: first.length, end: first.length })
  const proposal = createProposal(source, range, 'generate', '查询最近的订单')
  assert.match(proposal.after, /FROM orders/)
  assert.equal(applyProposal(source, proposal), first + proposal.after + last)
  assert.deepEqual(getLineRange(source, 0), { start: 0, end: first.length - 1 })
})

test('SQL formatting preserves quoted literals, identifiers and comments', () => {
  const sql = "select 'from where; it''s fine' as label, `order` from customers -- keep from WHERE\nwhere note = 'a\\'b' and detail = 'line 1\nline 2' /* keep select\n  from */;"
  const formatted = formatSql(sql)
  for (const protectedText of ["'from where; it''s fine'", '`order`', '-- keep from WHERE', "'a\\'b'", "'line 1\nline 2'", '/* keep select\n  from */']) {
    assert.ok(formatted.includes(protectedText), protectedText)
  }
  assert.ok(formatted.includes('-- keep from WHERE\nWHERE'))
  assert.match(formatted, /^SELECT/)
})

test('SQL mock corrections and rewrites preserve unknown tables and quoted content', () => {
  const source = "selcet id, 'form' as label form custom_records where id > 0 limit 25;"
  const range = { start: 0, end: source.length }
  const corrected = createProposal(source, range, 'debug', '')
  assert.match(corrected.after, /^SELECT id, 'form' AS label\nFROM custom_records/)
  const rewritten = createProposal(corrected.after, { start: 0, end: corrected.after.length }, 'rewrite', '限制返回 10 条结果')
  assert.match(rewritten.after, /FROM custom_records/)
  assert.match(rewritten.after, /LIMIT 10;/)
  const explanation = createProposal(source, range, 'generate', '', true)
  assert.equal(explanation.kind, 'explanation')
  assert.match(explanation.after, /^\/\*[\s\S]*\*\/$/)
})

test('SQL line diffs reconstruct both documents, including blank and repeated lines', () => {
  const cases = [
    ['SELECT id\nFROM customers\nWHERE id > 0;', 'SELECT name\nFROM customers\nWHERE id > 1;'],
    ['a\n\nb\na\n', 'a\nb\n\na\n'],
    ['', 'SELECT 1;'], ['SELECT 1;', ''], ['', ''],
    [Array(502).fill('old').join('\n'), Array(502).fill('new').join('\n')],
  ]
  for (const [before, after] of cases) {
    const diff = buildDiff(before, after)
    assert.equal(diff.filter((line) => line.kind !== 'added').map((line) => line.text).join('\n'), before)
    assert.equal(diff.filter((line) => line.kind !== 'removed').map((line) => line.text).join('\n'), after)
  }
})
