import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { useLanguage } from '../i18n/LanguageContext'
import { getBlogPost, getBlogPosts } from '../lib/blog'

function getTableOfContents(content: string) {
  return content
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,4})\s+(.+?)\s*#*$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match, index) => ({
      level: match[1].length,
      title: match[2],
      id: `blog-section-${index}`,
    }))
}

function highlightCode(source: string, language?: string) {
  if (!language || language === 'plain' || language === 'text') return source

  const tokenPattern = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?(?:px|rem|%|ms)?\b|--[\w-]+|[\w-]+(?=\s*:)|[{}[\]();,:])/g
  const tokens: Array<string | JSX.Element> = []
  let cursor = 0

  for (const match of source.matchAll(tokenPattern)) {
    const value = match[0]
    const index = match.index ?? 0
    if (index > cursor) tokens.push(source.slice(cursor, index))

    let tokenClass = 'blog-token-punctuation'
    if (value.startsWith('/*') || value.startsWith('//') || value.startsWith('#')) tokenClass = 'blog-token-comment'
    else if (value.startsWith('"') || value.startsWith("'")) tokenClass = 'blog-token-string'
    else if (/^\d/.test(value)) tokenClass = 'blog-token-number'
    else if (value.startsWith('--') || /[\w-]/.test(value)) tokenClass = 'blog-token-property'

    tokens.push(<span className={tokenClass} key={`${index}-${value}`}>{value}</span>)
    cursor = index + value.length
  }

  if (cursor < source.length) tokens.push(source.slice(cursor))
  return tokens
}

function BlogCodeBlock({ children, locale }: { children?: React.ReactNode; locale: 'zh' | 'en' }) {
  const preRef = useRef<HTMLPreElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    const updateOverflow = () => setOverflowing(pre.scrollHeight > pre.clientHeight + 1)
    updateOverflow()
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(pre)
    return () => observer.disconnect()
  }, [children])

  return (
    <div className={`blog-code-block${expanded ? ' is-expanded' : ''}`}>
      <pre ref={preRef}>{children}</pre>
      {overflowing ? (
        <button type="button" className="blog-code-toggle" onClick={() => setExpanded((value) => !value)}>
          {expanded
            ? locale === 'zh' ? '收起代码' : 'Collapse code'
            : locale === 'zh' ? '展开代码' : 'Expand code'}
        </button>
      ) : null}
    </div>
  )
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { locale } = useLanguage()
  const post = getBlogPost(slug)
  const related = getBlogPosts().filter((item) => item.slug !== slug).slice(0, 3)
  const tableOfContents = post ? getTableOfContents(post.content) : []

  useEffect(() => {
    document.title = post ? `${post.title} | REN WENQIAN` : 'Blog | REN WENQIAN'
  }, [post])

  if (!post) {
    return (
      <main className="blog-not-found">
        <p>{locale === 'zh' ? '这篇文章不存在或仍在草稿中。' : 'This article is unavailable or still a draft.'}</p>
        <Link to="/blog">{locale === 'zh' ? '返回博客' : 'Back to journal'} →</Link>
      </main>
    )
  }

  return (
    <main className="blog-post-page">
      <header className="blog-post-hero">
        <div className="blog-post-heading">
          <Link to="/blog" className="blog-post-back">{locale === 'zh' ? '返回' : 'Back'}</Link>
          <h1>{post.title}</h1>
          <p className="blog-post-meta">
            <span>{post.readingMinutes} {locale === 'zh' ? '分钟阅读' : 'min read'}</span>
            <span>{post.category}</span>
          </p>
        </div>
      </header>

      <div className="blog-post-layout">
        <aside className="blog-post-sidebar">
          {tableOfContents.length > 0 ? (
            <nav className="blog-post-toc" aria-label={locale === 'zh' ? '文章目录' : 'Table of contents'}>
              <ol>
                {tableOfContents.map((item) => (
                  <li key={item.id} className={`blog-post-toc-level-${item.level}`}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </aside>

        <article className="blog-markdown">
          {(() => {
            let headingIndex = 0
            const headingId = () => tableOfContents[headingIndex++]?.id
            return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 id={headingId()}>{children}</h1>,
              h2: ({ children }) => <h2 id={headingId()}>{children}</h2>,
              h3: ({ children }) => <h3 id={headingId()}>{children}</h3>,
              h4: ({ children }) => <h4 id={headingId()}>{children}</h4>,
              code: ({ className, children }) => {
                const language = className?.match(/language-([\w-]+)/)?.[1]
                const source = String(children).replace(/\n$/, '')
                return <code className={className} data-language={language}>{highlightCode(source, language)}</code>
              },
              pre: ({ children }) => <BlogCodeBlock locale={locale}>{children}</BlogCodeBlock>,
              table: ({ children }) => (
                <div className="blog-markdown-table-wrap">
                  <table>{children}</table>
                </div>
              ),
              p: ({ node, children }) => {
                const containsImage = node?.children.some(
                  (child) => child.type === 'element' && child.tagName === 'img',
                )
                return containsImage ? <>{children}</> : <p>{children}</p>
              },
              a: ({ href, children }) => (
                <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {children}
                </a>
              ),
              img: ({ src, alt }) => (
                <figure>
                  <img src={src} alt={alt || ''} loading="lazy" />
                  {alt ? <figcaption>{alt}</figcaption> : null}
                </figure>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
            )
          })()}
        </article>
      </div>

      <footer className="blog-post-footer">
        <Link to="/blog">{locale === 'zh' ? '查看全部文章' : 'All articles'} →</Link>
      </footer>

      {related.length > 0 ? (
        <section className="blog-related" aria-labelledby="related-title">
          <h2 id="related-title">{locale === 'zh' ? '继续阅读' : 'Keep reading'}</h2>
          <div className="blog-related-grid">
            {related.map((item) => (
              <Link to={`/blog/${item.slug}`} key={item.slug}>
                {item.cover ? <img src={item.cover} alt="" /> : null}
                <p>{item.category}</p>
                <h3>{item.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
