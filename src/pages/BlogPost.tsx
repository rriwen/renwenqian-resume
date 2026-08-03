import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { useLanguage } from '../i18n/LanguageContext'
import { formatBlogDate, getBlogPost, getBlogPosts } from '../lib/blog'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const { locale } = useLanguage()
  const post = getBlogPost(slug)
  const related = getBlogPosts().filter((item) => item.slug !== slug).slice(0, 3)

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
            <span aria-hidden="true">/</span>
            <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
          </p>
          <p className="blog-kicker">{post.category}</p>
        </div>
        <figure className="blog-post-cover">
          <img src={post.cover} alt={post.coverAlt} />
        </figure>
      </header>

      <div className="blog-post-layout">
        <aside className="blog-post-author" aria-label={locale === 'zh' ? '作者' : 'Author'}>
          <img src="/images/profile.png" alt="" />
          <div>
            <strong>Ren Wenqian</strong>
            <span>{locale === 'zh' ? '产品设计师' : 'Product Designer'}</span>
          </div>
        </aside>

        <article className="blog-markdown">
          <p className="blog-post-lede">{post.excerpt}</p>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2>{children}</h2>,
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
        </article>
      </div>

      <footer className="blog-post-footer">
        <div>
          <p className="blog-kicker">{locale === 'zh' ? '写于杭州' : 'Written in Hangzhou'}</p>
          <p>{locale === 'zh' ? '谢谢你读到这里。' : 'Thanks for reading.'}</p>
        </div>
        <Link to="/blog">{locale === 'zh' ? '查看全部文章' : 'All articles'} →</Link>
      </footer>

      {related.length > 0 ? (
        <section className="blog-related" aria-labelledby="related-title">
          <h2 id="related-title">{locale === 'zh' ? '继续阅读' : 'Keep reading'}</h2>
          <div className="blog-related-grid">
            {related.map((item) => (
              <Link to={`/blog/${item.slug}`} key={item.slug}>
                <img src={item.cover} alt="" />
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
