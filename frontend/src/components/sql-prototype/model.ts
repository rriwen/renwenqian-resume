export type SqlCommand = 'generate' | 'debug' | 'rewrite' | 'format'
export type SqlRange = { start: number; end: number }

export const SQL_COMMANDS: { id: SqlCommand; label: string; description: string; prompt: string }[] = [
  { id: 'generate', label: 'SQL 生成', description: '用自然语言描述查询需求', prompt: '查询消费金额最高的 10 位客户' },
  { id: 'debug', label: 'SQL 纠错', description: '检查所选 SQL 的常见拼写错误', prompt: '检查这段 SQL 并修复语法错误' },
  { id: 'rewrite', label: 'SQL 改写', description: '调整查询并保留原有逻辑', prompt: '保留原有查询，限制返回 10 条结果' },
  { id: 'format', label: 'SQL 格式化', description: '整理缩进与关键字大小写', prompt: '格式化这段 SQL，让它更易阅读' },
]

export const INITIAL_SQL = `-- 查询最近创建的客户
SELECT id, name, city, created_at
FROM customers
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;

`

export type Proposal = {
  source: string
  range: SqlRange
  before: string
  after: string
  command: SqlCommand
  kind: 'sql' | 'explanation'
}

type Token = { text: string; kind: 'word' | 'space' | 'literal' | 'comment' | 'symbol' }

// Keep strings, quoted identifiers, and comments opaque. This is a local prototype
// formatter, not a SQL parser or a database connection.
function tokenize(sql: string): Token[] {
  const parts = sql.match(/'(?:''|\\[\s\S]|[^'\\])*'?|"(?:""|\\[\s\S]|[^"\\])*"?|`(?:``|[^`])*`?|--[^\n]*|#[^\n]*|\/\*[\s\S]*?(?:\*\/|$)|[A-Za-z_][\w$]*|\s+|[^]/g) ?? []
  return parts.map((text) => ({
    text,
    kind: /^\s/.test(text) ? 'space'
      : /^(?:--|#|\/\*)/.test(text) ? 'comment'
        : /^['"`]/.test(text) ? 'literal'
          : /^[A-Za-z_]/.test(text) ? 'word' : 'symbol',
  }))
}

const KEYWORDS = new Set('SELECT DISTINCT FROM WHERE AND OR NOT AS ON JOIN LEFT RIGHT INNER OUTER FULL CROSS GROUP BY ORDER ASC DESC HAVING LIMIT OFFSET UNION ALL INSERT INTO VALUES UPDATE SET DELETE IS NULL IN LIKE BETWEEN EXISTS CASE WHEN THEN ELSE END COUNT SUM AVG MIN MAX NOW DATE_SUB INTERVAL DAY'.split(' '))
const CLAUSES = new Set('SELECT FROM WHERE GROUP ORDER HAVING LIMIT OFFSET UNION LEFT RIGHT INNER FULL CROSS'.split(' '))

export function formatSql(sql: string): string {
  let output = ''
  let spacing = false
  let depth = 0
  let previousWord = ''
  const newline = () => { output = output.trimEnd(); if (output) output += '\n'; spacing = false }

  for (const token of tokenize(sql)) {
    if (token.kind === 'space') { spacing = true; continue }
    const upper = token.text.toUpperCase()
    const text = token.kind === 'word' && KEYWORDS.has(upper) ? upper : token.text

    if (token.kind === 'word' && depth === 0 && (
      CLAUSES.has(upper) || (upper === 'JOIN' && !/^(LEFT|RIGHT|INNER|OUTER|FULL|CROSS)$/.test(previousWord))
    )) newline()
    if (token.kind === 'word' && depth === 0 && /^(AND|OR)$/.test(upper)) { newline(); output += '  ' }
    if (spacing && output && !/\s$/.test(output) && !/^[,;)]$/.test(text)) output += ' '
    output += text
    spacing = false
    if (token.kind === 'comment' && /^(--|#)/.test(text)) { output += '\n'; previousWord = ''; continue }
    if (token.kind === 'symbol') {
      if (text === '(') depth++
      if (text === ')') depth = Math.max(0, depth - 1)
      if (text === ';') newline()
    }
    if (token.kind === 'word') previousWord = upper
  }
  return output.trim()
}

function normalizeRange(source: string, range: SqlRange): SqlRange {
  const clamp = (value: number) => Math.max(0, Math.min(source.length, Number.isFinite(value) ? Math.trunc(value) : 0))
  const start = clamp(range.start)
  const end = clamp(range.end)
  return { start: Math.min(start, end), end: Math.max(start, end) }
}

export function getLineRange(source: string, position: number): SqlRange {
  const cursor = normalizeRange(source, { start: position, end: position }).start
  const start = cursor === 0 ? 0 : source.lastIndexOf('\n', cursor - 1) + 1
  const nextLine = source.indexOf('\n', cursor)
  return { start, end: nextLine === -1 ? source.length : nextLine }
}

function generateExample(prompt: string): string {
  if (/消费|最高|最多|top|排名|前\s*10/i.test(prompt)) {
    return `SELECT c.id, c.name, SUM(o.amount) AS total_amount
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.id
WHERE o.status = 'completed'
GROUP BY c.id, c.name
ORDER BY total_amount DESC
LIMIT 10;`
  }
  if (/统计|聚合|销售|每天|每日|总额|count|sum/i.test(prompt)) {
    return `SELECT DATE(created_at) AS order_date,
       COUNT(*) AS order_count,
       SUM(amount) AS total_amount
FROM orders
WHERE status = 'completed'
GROUP BY DATE(created_at)
ORDER BY order_date DESC
LIMIT 30;`
  }
  if (/订单|orders?/i.test(prompt)) {
    return `SELECT id, customer_id, amount, status, created_at
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY created_at DESC
LIMIT 20;`
  }
  return `SELECT id, name, city, created_at
FROM customers
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;`
}

function correctExample(sql: string): string {
  const corrections: Record<string, string> = { SELEC: 'SELECT', SELCET: 'SELECT', SLECT: 'SELECT', FORM: 'FROM', WHER: 'WHERE' }
  const corrected = tokenize(sql).map((token) => token.kind === 'word'
    ? corrections[token.text.toUpperCase()] ?? token.text : token.text).join('')
  return formatSql(corrected)
}

function rewriteExample(sql: string, prompt: string): string {
  const formatted = formatSql(sql)
  const requestedLimit = prompt.match(/(?:限制|返回|前|limit)\s*(\d{1,4})/i)?.[1]
  const tokens = tokenize(formatted)
  const meaningful = tokens.filter((token) => token.kind !== 'space' && token.kind !== 'comment')
  // Only demonstrate a row limit on a single SELECT. Unknown custom statements
  // retain their content; the mock never invents a replacement schema for them.
  if (!requestedLimit || meaningful[0]?.text.toUpperCase() !== 'SELECT'
    || meaningful.some((token, index) => token.text === ';' && index !== meaningful.length - 1)) return formatted
  let depth = 0
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].text === '(') depth++
    if (tokens[i].text === ')') depth--
    if (depth === 0 && tokens[i].kind === 'word' && tokens[i].text === 'LIMIT') {
      let valueIndex = i + 1
      while (tokens[valueIndex]?.kind === 'space') valueIndex++
      let numberEnd = valueIndex
      while (tokens[numberEnd]?.kind === 'symbol' && /^\d$/.test(tokens[numberEnd].text)) numberEnd++
      if (numberEnd === valueIndex) return formatted
      tokens.splice(valueIndex, numberEnd - valueIndex, { kind: 'symbol', text: requestedLimit })
      return tokens.map((token) => token.text).join('')
    }
  }
  // Avoid attaching a clause after a trailing comment or to an ambiguous query.
  if (tokens.some((token) => token.kind === 'comment') || meaningful.some((token) => token.text === 'UNION')) return formatted
  return `${formatted.replace(/;\s*$/, '')}\nLIMIT ${requestedLimit};`
}

export function createProposal(source: string, range: SqlRange, command: SqlCommand, prompt: string, noResult = false): Proposal {
  const target = normalizeRange(source, range)
  const before = source.slice(target.start, target.end)
  const kind = noResult || (command !== 'generate' && !before.trim()) ? 'explanation' : 'sql'
  let after: string
  if (noResult) {
    after = '/*\n暂时无法生成 SQL：现有信息不足以确定字段或关联关系。\n请补充表名、字段和查询条件后重试。\n*/'
  } else if (kind === 'explanation') {
    after = '/* 请先选中需要处理的 SQL，再使用此指令。 */'
  } else {
    after = command === 'generate' ? generateExample(prompt)
      : command === 'debug' ? correctExample(before)
        : command === 'rewrite' ? rewriteExample(before, prompt) : formatSql(before)
  }
  return { source, range: target, before, after, command, kind }
}

export function applyProposal(current: string, proposal: Proposal): string | null {
  if (current !== proposal.source) return null
  return current.slice(0, proposal.range.start) + proposal.after + current.slice(proposal.range.end)
}

export function buildDiff(before: string, after: string): { kind: 'same' | 'removed' | 'added'; text: string }[] {
  const oldLines = before ? before.split('\n') : []
  const newLines = after ? after.split('\n') : []
  // Bound memory for pasted documents; the fallback still reconstructs both sides.
  if (oldLines.length * newLines.length > 250_000) {
    return [...oldLines.map((text) => ({ kind: 'removed' as const, text })), ...newLines.map((text) => ({ kind: 'added' as const, text }))]
  }
  const lengths = Array.from({ length: oldLines.length + 1 }, () => new Uint32Array(newLines.length + 1))
  for (let i = oldLines.length - 1; i >= 0; i--) {
    for (let j = newLines.length - 1; j >= 0; j--) {
      lengths[i][j] = oldLines[i] === newLines[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1])
    }
  }
  const diff: ReturnType<typeof buildDiff> = []
  let i = 0
  let j = 0
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      diff.push({ kind: 'same', text: oldLines[i++] }); j++
    } else if (i < oldLines.length && (j === newLines.length || lengths[i + 1][j] >= lengths[i][j + 1])) {
      diff.push({ kind: 'removed', text: oldLines[i++] })
    } else {
      diff.push({ kind: 'added', text: newLines[j++] })
    }
  }
  return diff
}
