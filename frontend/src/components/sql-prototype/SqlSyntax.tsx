const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'AS', 'ON', 'IN', 'IS',
  'NULL', 'TRUE', 'FALSE', 'DISTINCT', 'ALL', 'WITH', 'RECURSIVE', 'UNION',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'GROUP', 'BY',
  'ORDER', 'ASC', 'DESC', 'HAVING', 'LIMIT', 'OFFSET', 'CASE', 'WHEN', 'THEN',
  'ELSE', 'END', 'EXISTS', 'BETWEEN', 'LIKE', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'COUNT',
  'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'ROUND', 'CAST', 'OVER', 'PARTITION',
  'DATE', 'DATE_FORMAT', 'DATE_SUB', 'INTERVAL', 'NOW', 'CURRENT_DATE',
]);

// Consume quoted text and comments before words so their contents stay intact.
// The final alternative preserves punctuation, whitespace, and incomplete input.
const SQL_TOKENS = /--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$)|'(?:''|\\[\s\S]|[^'\\])*(?:'|$)|"(?:""|\\[\s\S]|[^"\\])*(?:"|$)|`(?:``|[^`])*(?:`|$)|[a-zA-Z_][\w$]*|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\s+|[\s\S]/g;

function tokenClass(token: string) {
  if (token.startsWith('--') || token.startsWith('/*')) {
    return 'sql-token-comment';
  }
  if (token.startsWith("'")) {
    return 'sql-token-string';
  }
  if (/^\d/.test(token)) {
    return 'sql-token-number';
  }
  if (SQL_KEYWORDS.has(token.toUpperCase())) {
    return 'sql-token-keyword';
  }
  return 'sql-token-text';
}

export function SqlSyntax({ code }: { code: string }) {
  return (
    <>
      {Array.from(code.matchAll(SQL_TOKENS), (match) => (
        <span key={match.index} className={tokenClass(match[0])}>
          {match[0]}
        </span>
      ))}
    </>
  );
}

export default SqlSyntax;
