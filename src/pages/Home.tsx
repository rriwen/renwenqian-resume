import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects, type Project } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'

type ViewMode = 'stack' | 'grid'
type Props = { viewMode: ViewMode; onViewMode: (m: ViewMode) => void }

export function Home(_props: Props) {
  const { locale } = useLanguage()
  const navigate = useNavigate()
  const [category, setCategory] = useState('all')
  useEffect(() => { document.title = 'DESIGN.4x' }, [])

  const openProject = (project: Project) => navigate(`/project/${project.slug}`)
  const intro = locale === 'zh'
    ? '也可以叫我泗澄或 4X，欢迎来到我的个人网站。'
    : "Welcome to my personal site. A brief intro — I'm a product designer"
  const sub = locale === 'zh'
    ? '一直在做AI、效率、生产力工具，感谢关注。'
    : 'working on AI, productivity, and efficiency tools. Thanks for following along.'
  const categories = locale === 'zh' ? ['全部', '人工智能', '工具应用', '网页服务', '设计系统'] : ['All', 'AI', 'Tools', 'Web', 'Design systems']
  const projectCategory = [1, 1, 4, 2, 2]
  const projectSubtags = locale === 'zh' ? ['记忆插件', '数据分析', 'AgentUI', '数据库运维', '数据开发'] : ['Memory plugin', 'Analytics', 'Agent UI', 'Database ops', 'Data development']
  const selected = useMemo(() => {
    const all = projects.slice(0, 5).map((project, index) => ({ project, index }))
    if (category === 'all') return all
    const groups = [[0, 1, 2], [1, 3, 4, 5], [0, 1, 2, 3, 4, 5], [2]]
    const group = groups[Number(category) - 1] ?? []
    return all.filter((item) => group.includes(item.index))
  }, [category, categories])

  return (
    <main className="home-redesign">
      <section className="home-hero">
        <h1>{locale === 'zh' ? <>你好，我是任文倩 <span className="home-wave" aria-hidden="true">👋🏻</span></> : "Hi, I'm Ren Wenqian."}</h1>
        <p className="home-intro">{locale === 'zh' ? <>{intro}<br />我是一名产品设计师，始终专注于 AI、效率工具与生产力产品设计，感谢关注。</> : <>{intro}<br />{sub}</>}</p>
        <div className="home-hero-meta"><span>{locale === 'zh' ? '中国杭州' : 'Hangzhou, China'}</span><span>{locale === 'zh' ? '产品设计师' : 'Product designer'}</span><span>E/INFP</span></div>
      </section>

      <section className="home-work" aria-labelledby="selected-work-title">
        <div className="products-intro">
          <p className="products-desc" id="selected-work-title">
            {locale === 'zh' ? '打造用户真正需要的产品' : 'Building products users truly need'}
          </p>
          <div className="products-filters" role="tablist" aria-label={locale === 'zh' ? '产品分类' : 'Product categories'}>
            {categories.map((label, index) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={category === (index === 0 ? 'all' : String(index))}
                className={category === (index === 0 ? 'all' : String(index)) ? 'is-active' : ''}
                onClick={() => setCategory(index === 0 ? 'all' : String(index))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="products-grid">
          {selected.map(({ project, index }) => {
            const descriptions = locale === 'zh' ? [
              '面向 Agent 的长期记忆与知识管理工具，让复杂信息可以被理解、调用和持续积累。',
              '面向数据团队的智能分析与问答体验，帮助用户更快得到可信的业务洞察。',
              '将 AI 能力沉淀为可复用的设计模式，探索更高效的设计与研发协作。',
              '将设计规范、交付流程与视觉检查整合成一套团队效率工具，减少重复工作。',
              '面向复杂数据开发场景，重新梳理从建模到发布的全链路体验。',
              '通过体验诊断和协作工具，帮助团队更稳定地交付高质量产品。',
            ] : [
              'A memory and knowledge tool for Agents, making complex information easier to understand and reuse.',
              'An intelligent analytics experience that helps data teams reach trustworthy insights faster.',
              'A reusable AI design language for more efficient design and engineering collaboration.',
              'A design operations toolkit that brings standards, handoff, and visual QA into one workflow.',
              'A clearer end-to-end experience for complex data development and publishing workflows.',
              'Experience diagnostics and collaboration tools for more consistent product delivery.',
            ]
            return <article className="product-card" key={project.id}><button className="product-card-link" onClick={() => openProject(project)}><div className="product-card-media"><img src={project.image} alt="" /></div><div className="product-card-copy"><h3>{project.title}</h3><p>{descriptions[index]}</p><div className="product-tags"><span>{categories[projectCategory[index]]}</span><span>{projectSubtags[index]}</span></div></div></button></article>
          })}
        </div>
      </section>

    </main>
  )
}
