import { createElement, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { getProjectDetail, type ProjectDetailParagraph } from '../data/projectDetails'
import { getAdjacentProjects, getProjectBySlug, getProjectTitle, projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { isGifSrc } from '../lib/isGifSrc'

const body: CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  opacity: 0.88,
}

function renderParagraphContent(para: ProjectDetailParagraph) {
  if (typeof para === 'string') return para
  return para.map((run, j) =>
    run.bold ? (
      <strong key={j} style={{ fontWeight: 700 }}>
        {run.text}
      </strong>
    ) : (
      <span key={j}>{run.text}</span>
    ),
  )
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, m } = useLanguage()
  const project = getProjectBySlug(slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxIntrinsic, setLightboxIntrinsic] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    if (project) {
      document.title = `${getProjectTitle(project, locale)} | REN WENQIAN`
    } else {
      document.title = m.home.title
    }
  }, [project, locale, m.home.title])

  useEffect(() => {
    setLightboxIndex(null)
  }, [slug])

  const galleryLen = detail?.gallery.length ?? 0

  useEffect(() => {
    setLightboxIntrinsic(null)
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i !== null && i < galleryLen - 1 ? i + 1 : i))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxIndex, galleryLen])

  if (!project || !detail) {
    return (
        <main
          className="project-detail-page"
        style={{
          minHeight: '100dvh',
          padding: 'var(--header-clearance) 2.5rem 4rem',
          width: 720,
          margin: '0 auto',
        }}
      >
        <p style={{ ...body, marginTop: '0.5rem' }}>{m.workDetail.notFound}</p>
        <Link
          to="/"
          className="project-detail-back-link"
          style={{
            display: 'inline-block',
            marginTop: '1.25rem',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {m.workDetail.back}
        </Link>
      </main>
    )
  }

  if (project.slug === 'dataagent') {
    return <DataPilotCaseStudy project={project} locale={locale} />
  }

  const adjacent = getAdjacentProjects(project.slug)
  const prevProject = adjacent.prev ?? projects[projects.length - 1]
  const nextProject = adjacent.next

  return (
    <main
      className="project-detail-page project-detail-standard-page"
      style={{
        minHeight: '100dvh',
        padding: 'var(--header-clearance) 2.5rem 4rem',
        width: 'min(900px, 100%)',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      <Link
        to="/"
        className="project-detail-back-link"
        style={{
          display: 'inline-block',
          marginBottom: '1.75rem',
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.55,
        }}
      >
        {m.workDetail.back}
      </Link>

      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: '2.25rem',
          width: '100%',
          aspectRatio: '2 / 1',
          background: '#eaeaea',
          border: '1px solid rgba(10, 10, 10, 0.04)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={project.image}
          alt=""
          loading={isGifSrc(project.image) ? 'eager' : undefined}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
      </div>

      <h1
        style={{
          margin: '0 0 1.25rem',
          fontSize: '2.35rem',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {getProjectTitle(project, locale)}
      </h1>

      <p
        style={{
          margin: '0 0 1.75rem',
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.72,
          lineHeight: 1.6,
        }}
      >
        {detail.tags.join(' · ')}
      </p>

      {detail.paragraphs.map((para, idx) => (
        <p key={idx} style={body}>
          {renderParagraphContent(para)}
        </p>
      ))}

      {detail.responsibilities ? (
        <section style={{ margin: '0 0 1rem' }}>
          <p style={{ ...body, marginBottom: '0.65rem' }}>{detail.responsibilities.intro}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.35rem',
              listStyleType: 'disc',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              opacity: 0.88,
              color: 'inherit',
            }}
          >
            {detail.responsibilities.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <strong style={{ fontWeight: 700 }}>{item.title}</strong>
                {item.body ? (
                  <>
                    {locale === 'zh' ? '：' : ': '}
                    {item.body}
                  </>
                ) : null}
                {item.nested?.length ? (
                  <ul
                    style={{
                      margin: '0.5rem 0 0',
                      paddingLeft: '1.25rem',
                      listStyleType: 'circle',
                    }}
                  >
                    {item.nested.map((sub, j) => (
                      <li key={j} style={{ marginBottom: '0.55rem' }}>
                        <strong style={{ fontWeight: 700 }}>{sub.title}</strong>
                        {locale === 'zh' ? '：' : ': '}
                        {sub.body}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {detail.afterResponsibilities?.map((para, idx) => (
        <p key={`after-resp-${idx}`} style={body}>
          {para}
        </p>
      ))}

      {detail.highlightBullets?.length ? (
        <>
          {detail.highlightBulletsIntro ? (
            <p style={{ ...body, marginBottom: '0.65rem' }}>
              <strong style={{ fontWeight: 700 }}>{detail.highlightBulletsIntro}</strong>
            </p>
          ) : null}
          {createElement(
            detail.highlightBulletsOrdered ? 'ol' : 'ul',
            {
              style: {
                margin: '0 0 1rem',
                paddingLeft: detail.highlightBulletsOrdered ? '1.5rem' : '1.2rem',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.88,
                color: 'inherit',
                listStyleType: detail.highlightBulletsOrdered ? 'decimal' : 'disc',
              },
            },
            detail.highlightBullets.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.6rem' }}>
                <strong style={{ fontWeight: 700 }}>{item.keyword}</strong>
                {locale === 'zh' ? '：' : ': '}
                {item.text}
              </li>
            )),
          )}
        </>
      ) : null}

      {detail.afterHighlightBullets ? (
        <p style={body}>{detail.afterHighlightBullets}</p>
      ) : null}

      {detail.externalUrl ? (
        <a
          href={detail.externalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            marginBottom: '2.5rem',
            fontSize: '0.95rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          {m.workDetail.viewSite}
        </a>
      ) : null}

      <section
        aria-label={m.workDetail.galleryAria}
        style={{ marginTop: detail.externalUrl ? '1.25rem' : '2.5rem' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.85rem',
          }}
        >
          {detail.gallery.map((item, idx) => (
            <figure
              key={`${item.src}-${idx}`}
              style={{
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <button
                type="button"
                aria-label={`${m.workDetail.galleryOpenFullscreenAria}: ${item.caption}`}
                onClick={() => setLightboxIndex(idx)}
                style={{
                  display: 'block',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  border: '1px solid rgba(10, 10, 10, 0.04)',
                  borderRadius: 4,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: '#eaeaea',
                  aspectRatio: '16 / 9',
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  loading={isGifSrc(item.src) ? 'eager' : undefined}
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                />
              </button>
              <figcaption
                style={{
                  fontSize: '0.78rem',
                  lineHeight: 1.55,
                  opacity: 0.5,
                  letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
                }}
              >
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {prevProject || nextProject ? (
        <nav
          aria-label={m.workDetail.projectNavAria}
          style={{
            marginTop: '120px',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(10, 10, 10, 0.1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              {prevProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: '0.68rem',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      opacity: 0.5,
                    }}
                  >
                    {m.workDetail.prevProject}
                  </p>
                  <Link
                    to={`/project/${prevProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: 'inherit',
                    }}
                  >
                    {getProjectTitle(prevProject, locale)}
                  </Link>
                </>
              ) : null}
            </div>
            <div style={{ minWidth: 0, textAlign: 'right' }}>
              {nextProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: '0.68rem',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      opacity: 0.5,
                    }}
                  >
                    {m.workDetail.nextProject}
                  </p>
                  <Link
                    to={`/project/${nextProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: 'inherit',
                    }}
                  >
                    {getProjectTitle(nextProject, locale)}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}

      {lightboxIndex !== null &&
        detail.gallery[lightboxIndex] &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={m.workDetail.galleryLightboxAria}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 220,
              background: 'rgba(255,255,255,0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label={m.contact.closeAria}
              onClick={() => setLightboxIndex(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: 'max(10px, env(safe-area-inset-right))',
                width: 44,
                height: 44,
                border: 'none',
                borderRadius: 4,
                background: 'rgba(10,10,10,0.06)',
                color: '#0a0a0a',
                fontSize: '1.35rem',
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            {galleryLen > 1 && lightboxIndex > 0 ? (
              <button
                type="button"
                aria-label={m.workDetail.galleryPrevAria}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
                }}
                style={{
                  position: 'absolute',
                  left: 'max(10px, env(safe-area-inset-left))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  border: 'none',
                  borderRadius: 4,
                  background: 'rgba(10,10,10,0.06)',
                  color: '#0a0a0a',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ‹
              </button>
            ) : null}
            {galleryLen > 1 && lightboxIndex < galleryLen - 1 ? (
              <button
                type="button"
                aria-label={m.workDetail.galleryNextAria}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => (i !== null && i < galleryLen - 1 ? i + 1 : i))
                }}
                style={{
                  position: 'absolute',
                  right: 'max(10px, env(safe-area-inset-right))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  border: 'none',
                  borderRadius: 4,
                  background: 'rgba(10,10,10,0.06)',
                  color: '#0a0a0a',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ›
              </button>
            ) : null}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: 'min(100%, calc(100vw - 3rem))',
                maxHeight: 'min(calc(100dvh - 5.5rem), 100%)',
                minHeight: 0,
              }}
            >
              <img
                key={lightboxIndex}
                src={detail.gallery[lightboxIndex].src}
                alt={detail.gallery[lightboxIndex].caption}
                loading={isGifSrc(detail.gallery[lightboxIndex].src) ? 'eager' : undefined}
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget
                  if (naturalWidth > 0 && naturalHeight > 0) {
                    setLightboxIntrinsic({ w: naturalWidth, h: naturalHeight })
                  }
                }}
                style={{
                  maxWidth: lightboxIntrinsic ? `min(100%, ${lightboxIntrinsic.w}px)` : '100%',
                  maxHeight: lightboxIntrinsic
                    ? `min(min(calc(100dvh - 8.5rem), 85dvh), ${lightboxIntrinsic.h}px)`
                    : 'min(calc(100dvh - 8.5rem), 85dvh)',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  borderRadius: 2,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                  ...(isGifSrc(detail.gallery[lightboxIndex].src)
                    ? {
                        imageRendering: 'smooth',
                      }
                    : {}),
                }}
              />
              <p
                style={{
                  margin: 0,
                  maxWidth: '42rem',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: 'rgba(10,10,10,0.58)',
                  letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
                }}
              >
                {detail.gallery[lightboxIndex].caption}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}

type DataPilotCaseStudyProps = {
  project: NonNullable<ReturnType<typeof getProjectBySlug>>
  locale: 'zh' | 'en'
}

function DataPilotCaseStudy({ project, locale }: DataPilotCaseStudyProps) {
  const isZh = locale === 'zh'
  const { prev: prevProject, next: nextProject } = getAdjacentProjects(project.slug)
  const [activePart, setActivePart] = useState<'experience' | 'growth'>('experience')
  const sections = isZh
    ? [
        {
          id: 'overview',
          index: '01',
          title: '项目概览',
          intro: '',
          body: '智能问数从技术验证进入商业化交付时，核心问题不是“能不能生成答案”，而是用户为什么不敢采纳答案。早期版本在指标口径、时间范围和执行过程上不够稳定，用户无法判断结果是否可信，出错后也缺少修正路径。作为产品体验负责人，我围绕“让 AI 结果可被信任和使用”负责问题定义、优先级判断、Agent 对话流程和跨团队落地：先把一次性答案改造成可确认、可追踪、可修正的任务，再扩展结果形态。',
          stats: ['结果采纳率 15% → 60%', '5+ 家付费客户交付'],
          images: [{ src: project.image, caption: 'DataAgent 产品入口与问数结果概览' }],
        },
        {
          id: 'goals',
          index: '02',
          title: '判断与目标',
          intro: '解决“问得准”和“结果可用”',
          body: '我的判断是，当前最优先的问题不是继续增加图表类型，而是降低用户采纳错误结果的风险。项目目标分为两层：第一层是让用户相信并修正 AI 结果，提升指标、维度、时间范围和查询结果的准确性；第二层是让结果进入真实工作流。',
          bullets: ['业务人员：用自然语言完成高频经营查询', '数据分析师：检查口径、修改参数并继续分析', '管理者：将结果用于监控、汇报和决策', '减少指标、维度和时间解析偏差', '支持不同数据展示和持续使用场景'],
          images: [{ src: '/images/datapilot-metric-layer-data.png', caption: '指标与字段信息是 Agent 理解问题的基础' }],
        },
        {
          id: 'problems',
          index: '03',
          title: '问题与优先级',
          intro: '从“查询结果不稳定”定位到具体对话节点',
          body: '通过客户反馈、失败案例和交付过程中的问题记录，我先按“理解错误、执行错误、结果不可用”分类，再拆解到 Agent 的执行链路中。用户说“看一下华东销售情况”时，系统需要同时判断销售额还是销量、华东对应哪个区域层级、默认的时间范围，以及是否需要调用特定工具或 Skill。基于问题频率、客户影响和实现成本，我优先解决直接影响结果采纳的指标口径、时间范围和执行可见性问题，再扩展低频查询和更多结果形态。',
          bullets: ['语义解析：用户表达与系统意图不一致', '指标 / 维度匹配：同一业务词存在多个口径', '时间识别：自然语言时间无法直接用于查询', '工具 / Skill 调用：选择错误、参数不完整或调用顺序不当', '结果形态：用户需要的是明细、看板还是展示大屏', '优先级判断：按问题频率、客户影响和实现成本排序'],
          images: [
            { src: '/images/datapilot-metric-layer-data.png', caption: '数据字段与指标口径' },
            { src: '/images/datapilot-metric-layer-modeling.png', caption: '指标、维度和数据关系' },
          ],
        },
        {
          id: 'conversation',
          index: '04',
          title: '工作流优化',
          intro: '把自然语言问题转化为可确认、可执行、可继续调整的任务',
          body: '我负责设计 Agent 对话主流程，并根据风险和歧义程度做取舍：低风险请求直接执行，高风险或关键参数不明确时先结构化确认；工具或 Skill 调用前检查选择和参数，调用中展示节点状态，失败后给出原因和重试方式。用户可以在执行中修改时间、筛选条件或展示方式，系统只更新变更部分并继续任务。',
          bullets: ['输入问题并识别分析目标', '解析指标、维度与时间', '按风险决定直接执行或补充确认', '校验工具 / Skill 选择、参数与调用顺序', '展示执行状态、错误原因和重试方式', '生成结果并支持中途修改后继续执行'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Agent 从问题理解到结果生成的连续执行流程' }],
        },
        {
          id: 'accuracy',
          index: '05',
          title: '准确率与应用',
          intro: '让问数结果既准确，也能进入具体工作场景',
          body: '我先整理典型失败案例，再判断问题应该通过对话确认、指标配置、解析规则还是执行校验解决。例如，“收入”匹配到多个业务指标时，Agent 展示指标定义供用户选择；“最近三个月”无法确定口径时，转换成具体日期范围并允许用户修改；工具或 Skill 调用失败时，展示执行节点、调用状态和错误原因，允许用户修改参数后继续执行。同时根据用户后续工作设计不同结果形态：明细分析使用多维表格，持续监控使用仪表盘，业务展示使用数据大屏。',
          bullets: ['语义解析：增加意图澄清与候选确认', '指标与时间：展示业务口径并转换为明确范围', '结果应用：支持多维表格、仪表盘和数据大屏', '多轮修改：只更新用户改动的参数，不重置整个任务'], related: true,
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: '串行执行中的指标确认与结果校验' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: '并行处理不同分析任务，减少等待和重复操作' },
          ],
        },
        {
          id: 'delivery',
          index: '06',
          title: '交付结果',
          intro: '将交付中的共性问题转化为标准产品能力',
          body: '在 5+ 家付费客户交付过程中，我持续收集指标口径、时间范围、结果解释和展示形式相关反馈，并区分通用问题、行业差异和个性化需求。通用问题进入产品迭代，行业差异通过配置和业务词典解决，个性化需求则结合复用价值评估。我将失败案例整理为问题优先级和验收标准，推动产品、算法、研发和交付团队统一方案，并跟进上线后的数据验证。这里的“采纳率”指用户直接使用或继续编辑 AI 结果，并将其用于实际业务的任务比例；当前为整体结果，后续仍需按客户、问题类型和结果形态拆分验证。',
          stats: ['结果采纳率 15% → 60%', '5+ 家付费客户', '从技术验证进入商业化交付'],
          images: [{ src: project.image, caption: '面向业务用户的问数与数据应用场景' }],
        },
        {
          id: 'role',
          index: '07',
          title: '后续验证',
          intro: '下一步需要继续验证不同场景下的使用效果',
          body: '当前结果主要反映整体采纳率变化，后续可以进一步拆分不同客户、问题类型和结果形态，判断哪些场景适合自动执行，哪些场景需要保留人工确认，并持续观察用户对多维表格、仪表盘和数据大屏的实际使用情况。',
          bullets: ['补充不同业务场景下的采纳率和修改率', '区分查询结果与数据应用生成的使用效果', '减少低风险问题中的确认步骤', '完善多轮对话中的上下文保留和参数修改'],
          images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: '多任务协同与结果生成场景' }],
        },
      ]
    : [
        {
          id: 'overview', index: '01', title: 'Overview', intro: '',
          body: 'DataAgent moved from technical validation toward commercial exploration. I owned the Agent conversation experience, from question input and intent recognition to confirmation and result generation across tables, dashboards, and data walls. My product judgment was to first address why users hesitated to adopt results and could not recover from errors, then expand output formats; I matched tables, dashboards, and data walls to detail analysis, monitoring, and presentation goals instead of optimizing for one-off answers.', stats: ['Adoption 15% → 60%', '5+ paid customer deliveries', 'Tables / dashboards / data walls'], images: [{ src: project.image, caption: 'DataAgent product overview' }],
        },
        {
          id: 'goals', index: '02', title: 'Decisions & goals', intro: 'Improve answer accuracy and make results usable beyond one-off answers', body: 'The product goals were to improve metric, dimension, time, and query accuracy, while supporting richer output formats for analysis, monitoring, and presentation.', bullets: ['Understand the user’s analysis goal', 'Reduce parsing and matching errors', 'Support different data-use scenarios'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric and field context' }],
        },
        {
          id: 'problems', index: '03', title: 'Problems & priorities', intro: 'Map unstable results to specific conversation nodes', body: 'I grouped customer feedback and failed cases across the Agent workflow. A request such as “show East China sales” requires the system to resolve the metric, region level, and time range, as well as whether a specific tool or Skill should be called. Any incorrect decision or call can make the final result unreliable.', bullets: ['Intent parsing', 'Metric and dimension matching', 'Time interpretation', 'Tool / Skill calling: wrong selection, incomplete parameters, or incorrect order', 'Output format selection'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric context' }, { src: '/images/datapilot-metric-layer-modeling.png', caption: 'Metric relationships' }],
        },
        {
          id: 'conversation', index: '04', title: 'Workflow optimization', intro: 'Turn natural language into a confirmable, executable, and editable task', body: 'I designed the main Agent flow and made trade-offs based on risk and ambiguity: execute low-risk requests directly, but confirm when critical parameters are unclear. Before a tool or Skill call, the system checks selection and parameters; during execution it shows node states, and after failure it explains the cause and offers retry. Users can change time, filters, or output format mid-task, with only the changed parts updated before continuing.', bullets: ['Input and intent', 'Metric, dimension, and time parsing', 'Risk-based execution or confirmation', 'Tool / Skill selection, parameter, and order checks', 'Execution states, error causes, and retry', 'Continue after mid-task edits'], images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Conversation and execution flow' }],
        },
        {
          id: 'accuracy', index: '05', title: 'Accuracy & applications', intro: 'Make results accurate and usable in real workflows', body: 'I organized failure cases and aligned the response: use confirmation for ambiguous metrics, convert natural-language time into explicit ranges, and preserve context when users revise one parameter. I also mapped output formats to user goals: tables for detail analysis, dashboards for recurring monitoring, and data walls for business presentation.', bullets: ['Intent clarification and metric definitions', 'Explicit time ranges and validation', 'Tables, dashboards, and data walls', 'Context-preserving revisions'], related: true, images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Serial execution' }, { src: '/images/datapilot-ai-parallel-execution.png', caption: 'Parallel execution' }],
        },
        {
          id: 'delivery', index: '07', title: 'Delivery results', intro: 'Turn recurring delivery issues into reusable product capabilities', body: 'Across 5+ paid customer deliveries, I categorized feedback into general product issues, industry-specific configuration, and one-off requests. General issues were fed back into the core experience and validated through subsequent delivery.', stats: ['Adoption 15% → 60%', '5+ paid customer deliveries', 'Technical validation → commercial delivery'], images: [{ src: project.image, caption: 'Business-facing query experience' }],
        },
        {
          id: 'role', index: '08', title: 'Next validation', intro: 'Continue validating performance across different use cases', body: 'The current result mainly reflects overall adoption. Next, I would break it down by customer, question type, and output format to understand which scenarios can be automated and where confirmation is still needed, while tracking actual use of tables, dashboards, and data walls.', bullets: ['Measure adoption and edit rates by scenario', 'Separate query success from application usage', 'Reduce confirmation steps for low-risk requests', 'Improve context retention across multi-turn revisions'], images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: 'Multi-task result generation' }],
        },
      ]

  const growthSections = isZh
    ? [
        {
          id: 'growth-research', index: '01', title: '市场背景', intro: '海外 SaaS 商业化仍在探索',
          body: 'AI 智能问数的产品能力已经可以交付，但面向海外 SaaS 市场的商业化还在探索。当前需要验证的不是“能不能做出结果”，而是海外用户是谁、什么场景最容易感知价值、用户如何开始试用，以及是否愿意从试用进入付费讨论。为此，我先通过竞品、用户场景和客户反馈收敛优先验证的目标用户与首个任务。',
          bullets: ['市场问题：AI Data Agent 产品定位相似，用户难以快速理解差异', '用户问题：不同角色对分析、监控、协作和交付的期待不同', '商业问题：尚无真实线上漏斗数据，需要先建立可验证假设', '调研输出：目标场景、官网叙事和首个试用任务'],
          images: [{ src: project.image, caption: '占位图：展示竞品定位、目标用户和优先验证场景的对比关系' }],
        },
        {
          id: 'growth-context', index: '02', title: '判断与策略', intro: '先验证定位和首次价值，再讨论注册与付费',
          body: '我的判断是，当前最需要验证的不是注册按钮的位置，而是用户能否在几分钟内理解产品、完成一次有效问数并看到可继续使用的结果。因此将官网作为市场验证入口，把首个任务作为价值验证节点，先降低理解和开始使用的成本，再承接注册、试用和销售沟通。首轮路径设计为“官网落地页 → 免费体验对话 → 注册获取 AI 积分 → 简单试用并生成报表等应用 → 引导付费”，每一步先让用户获得足够价值，再增加下一步转化要求。',
          bullets: ['定位取舍：用一个高频业务场景表达产品，而不是罗列全部能力', '入口取舍：让访客直接进入与场景匹配的首次任务', '注册承接：在免费对话产生兴趣后，用 AI 积分引导注册', '价值取舍：优先让用户生成报表等可复用结果', '转化取舍：在用户感知价值后再引导付费'],
          images: [{ src: project.image, caption: '占位图：展示官网叙事、产品入口和首次任务之间的承接关系' }],
        },
        {
          id: 'growth-funnel', index: '03', title: '增长链路', intro: '让每一步都回答用户“为什么继续”',
          body: '围绕不同阶段的用户意图设计触点：官网落地页负责建立认知，免费对话负责降低开始成本，注册用 AI 积分承接兴趣，简单试用帮助用户生成报表等结果应用，付费节点则承接已经被验证的使用意愿。当前漏斗主要通过 AI 模拟和方案推演进行验证，尚未形成真实线上转化结论。',
          bullets: ['落地页：用真实场景说明产品价值', '免费对话：让访客先体验问数方式', '注册激励：用 AI 积分承接继续试用', '首次价值：生成报表、仪表盘等结果应用', '付费承接：在价值被验证后引导付费'],
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: '占位图：展示首次任务中的过程反馈、结果价值和继续使用的理由' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: '占位图：展示不同用户目标对应的产品入口和结果应用路径' },
          ],
        },
        {
          id: 'growth-validation', index: '04', title: '模拟验证', intro: '在没有真实流量时，先验证路径假设而不是虚构转化结果',
          body: '我建立了从官网访问、产品启动、首个任务完成、注册到付费的漏斗框架，并通过 AI 模拟用户路径、访谈假设和客户反馈推演可能的流失原因。当前这些是商业化探索中的验证工具，不代表真实线上转化结果；后续需要接入埋点和销售数据，再判断哪些触点真正有效。',
          stats: ['AI 模拟：获客 → 首次使用 → 注册 → 付费', '商业化探索阶段', '待真实数据验证'],
          images: [{ src: project.image, caption: '占位图：展示 AI 模拟的获客、首次使用、注册和付费漏斗，以及待接入的真实数据节点' }],
        },
        {
          id: 'growth-iteration', index: '05', title: '后续验证', intro: '把模拟结论转化为真实上线后的验证计划',
          body: '增长部分目前仍处于探索阶段，尚未形成稳定的转化结论。后续按轮次推进：第一轮验证海外市场的定位和官网表达；第二轮优化产品入口、首个任务和结果反馈；第三轮在具备真实流量后验证注册和付费承接。同时结合目标用户和真实转化数据，比较产品即官网、PLG、自助试用和销售辅助等增长方式，不把 AI 模拟或页面方案直接等同于增长结果。',
          bullets: ['第一轮：验证目标用户、核心场景和官网价值表达', '第二轮：优化产品入口、首个任务引导和结果反馈', '第三轮：验证注册、试用与付费承接', '策略探索：比较产品即官网、PLG、自助试用和销售辅助', '当前状态：增长方案验证中，暂不下结论', '每轮闭环：观察指标 → 定位问题 → 调整方案 → 数据复盘'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: '占位图：展示从模拟假设到真实流量验证的后续迭代计划' }],
        },
      ]
    : [
        {
          id: 'growth-research', index: '01', title: 'Market background', intro: 'Overseas SaaS commercialization is still being explored',
          body: 'The AI analytics Q&A product is ready for delivery, but its commercialization in the overseas SaaS market is still being explored. The question is not only whether it can generate results, but who the overseas users are, which scenarios show value most clearly, how users should start a trial, and whether they will move from trial to a payment discussion. I used competitor research, user scenarios, and customer feedback to narrow the audience and first task to validate first.',
          bullets: ['Competitive review: positioning, information structure, core scenarios, and trial paths', 'User scenarios: analysis, monitoring, collaboration, and result delivery', 'Positioning decision: choose the audience and scenario to validate first', 'Research output: website content structure and first trial task'],
          images: [{ src: project.image, caption: 'Overseas competitor and use-case research' }],
        },
        {
          id: 'growth-context', index: '02', title: 'Growth strategy', intro: 'Validate positioning first, then help users reach value quickly',
          body: 'The product was preparing to explore the overseas SaaS market. As a product designer, I treated the website as part of market validation, not just a promotional page: first clarify what to communicate through competitor and use-case research, then test a path of landing page → free conversation → registration for AI credits → simple trial with reports and other outputs → payment. The priority was to reduce the effort to understand the product and reach first value before asking for the next commitment.',
          bullets: ['Competitor and use-case research: compared positioning, core scenarios, and trial patterns in products such as Hex', 'Website positioning: explain the problem and audience through one clear scenario', 'Free conversation: let visitors experience the query flow before sign-up', 'Registration incentive: use AI credits to support continued trial', 'First value: guide users to generate reports and other outputs', 'Conversion design: prompt payment after value is clear'],
          images: [{ src: project.image, caption: 'Growth journey from website entry to analytics experience' }],
        },
        {
          id: 'growth-funnel', index: '03', title: 'Growth funnel design', intro: 'Give users a reason to continue at every step',
          body: 'I designed touchpoints around intent at each stage: the landing page builds awareness, free conversation lowers the cost of starting, AI credits support registration, a simple trial helps users generate reports and other outputs, and payment captures intent after value is proven.',
          bullets: ['Landing page: explain value through real scenarios', 'Free conversation: let visitors try the query flow first', 'Registration incentive: use AI credits to continue trial', 'First value: generate reports, dashboards, and other outputs', 'Payment handoff: capture intent after value is proven'],
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: 'Process feedback and value during the first task' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: 'Result paths for different user goals' },
          ],
        },
        {
          id: 'growth-validation', index: '04', title: 'Growth validation', intro: 'Use funnel signals to find drop-off, then return to the experience',
          body: 'I established funnel signals across website visits, product starts, first-task completion, registration, and payment. Interviews, instrumentation, and customer feedback revealed why users dropped off; I then iterated entry copy, onboarding, value feedback, and payment handoff with marketing, product, and sales.',
          stats: ['Acquisition → first use → registration → payment', 'Continuous drop-off diagnosis', 'Validation with marketing, product, and sales'],
          images: [{ src: project.image, caption: 'Continuous validation from acquisition to payment' }],
        },
        {
          id: 'growth-iteration', index: '05', title: 'Later strategy and iterations', intro: 'Adjust touchpoints while validating the growth model',
          body: 'After launch, I worked in several iteration rounds. Round one validated the overseas audience and website value proposition; round two improved product entry, first-task guidance, and result feedback; round three refined registration and payment handoff. In parallel, I used audience and conversion signals to assess different growth models: making the website carry more of the product experience (product-led website), using self-serve trial and product value to drive sign-up (PLG), or combining self-serve with sales assistance. Each model was tested on a small scale before expansion.',
          bullets: ['Round one: validate audience, core scenario, and website value proposition', 'Round two: improve product entry, first-task guidance, and result feedback', 'Round three: refine registration, trial, and payment handoff', 'Strategy validation: product-led website, PLG, self-serve trial, or sales-assisted combinations', 'Repeat the loop: observe signals → locate friction → adjust the solution → review with data'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Growth iteration based on data and feedback' }],
        },
      ]

  const visibleSections = activePart === 'experience' ? sections : growthSections

  return (
    <main className="datapilot-case-page">
      <div className="datapilot-case-shell">
        <Link to="/" className="datapilot-back">{isZh ? '返回' : 'Back'}</Link>
        <header className="datapilot-case-hero">
          <h1>{isZh ? 'AI 智能问数' : 'DataAgent'}</h1>
          <p className="datapilot-hero-copy">{isZh ? 'AI 智能问数项目围绕两条并行主线展开：一条是让 AI 结果可理解、可确认、可修正，推动产品价值交付；另一条是在商业化探索阶段，通过 AI 模拟验证市场定位、首次使用和付费漏斗。' : 'DataAgent is organized around two parallel tracks: making AI results understandable, confirmable, and editable for product value delivery; and exploring market positioning, first use, and payment funnels through AI simulation.'}</p>
          <div className="datapilot-meta"><span>我的角色：产品体验负责人</span><span>产品阶段：技术验证 → 商业化交付</span><span>周期：持续迭代</span></div>
        </header>
        <div className="datapilot-part-tabs" role="tablist" aria-label={isZh ? '案例内容切换' : 'Case study sections'}>
          <button type="button" role="tab" aria-selected={activePart === 'experience'} className={activePart === 'experience' ? 'is-active' : ''} onClick={() => setActivePart('experience')}>
            {isZh ? '产品价值交付' : 'Product value delivery'}
          </button>
          <button type="button" role="tab" aria-selected={activePart === 'growth'} className={activePart === 'growth' ? 'is-active' : ''} onClick={() => setActivePart('growth')}>
            {isZh ? '市场与商业化' : 'Market & commercialization'}
          </button>
        </div>
        <div className="datapilot-case-layout">
          <article className="datapilot-case-content">
            {visibleSections.map((section) => (
              <section className="datapilot-module" id={section.id} key={section.id}>
                <div className="datapilot-module-heading"><span>{section.index}</span><h2>{section.title}</h2></div>
                {section.intro ? <h3>{section.intro}</h3> : null}
                <p>{section.body}</p>
                {'related' in section && section.related ? <p className="datapilot-related-link">{isZh ? '可观测产品孵化由交付问题延展而来，详见' : 'The observability product grew from delivery problems; see'} <Link to="/project/agentops">{isZh ? 'Agent 可观测产品' : 'Agent observability product'}</Link>。</p> : null}
                {'stats' in section && section.stats ? <div className="datapilot-stat-row">{section.stats.map((stat) => <strong key={stat}>{stat}</strong>)}</div> : null}
                {'bullets' in section && section.bullets ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                <div className={`datapilot-evidence ${section.images.length > 1 ? 'is-multi' : 'is-single'}`}>
                  {section.images.map((image) => <figure key={image.src + image.caption}><div className="datapilot-image-placeholder" role="img" aria-label={image.caption} /><figcaption>{image.caption}</figcaption></figure>)}
                </div>
              </section>
            ))}
            <nav className="datapilot-adjacent" aria-label={isZh ? '项目导航' : 'Project navigation'}>
              <div>
                {prevProject ? <><span>{isZh ? '上一个' : 'Previous'}</span><Link to={`/project/${prevProject.slug}`}>{getProjectTitle(prevProject, locale)}</Link></> : null}
              </div>
              <div className="is-next">
                {nextProject ? <><span>{isZh ? '下一个' : 'Next'}</span><Link to={`/project/${nextProject.slug}`}>{getProjectTitle(nextProject, locale)}</Link></> : null}
              </div>
            </nav>
          </article>
          <aside className="datapilot-toc" aria-label={isZh ? '案例目录' : 'Case study contents'}>
            <nav>{visibleSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
          </aside>
        </div>
      </div>
    </main>
  )
}
