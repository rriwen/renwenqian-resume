import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { formatBlogDate, getBlogPosts } from '../lib/blog'

export function BlogIndex() {
  const { locale } = useLanguage()
  const posts = getBlogPosts()

  useEffect(() => {
    document.title = `${locale === 'zh' ? '博客' : 'Journal'} | REN WENQIAN`
  }, [locale])

  return (
    <main className="blog-index">
      <header className="blog-index-intro">
        <h1>{locale === 'zh' ? '记录正在发生的思考' : 'Notes from work and life'}</h1>
        <p>
          {locale === 'zh'
            ? '关于产品、AI、设计实践，以及那些值得被慢慢想清楚的事。'
            : 'Writing about products, AI, design practice, and ideas worth thinking through.'}
        </p>
      </header>

      <section className="blog-list" aria-label={locale === 'zh' ? '文章列表' : 'Articles'}>
        {posts.map((post) => (
          <article className="blog-list-item" key={post.slug}>
            <Link to={`/blog/${post.slug}`} className="blog-list-link">
              <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
              <h2>{post.title}</h2>
              <p className="blog-list-type">{post.category}</p>
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}
