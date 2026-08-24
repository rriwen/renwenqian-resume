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

  if (project.slug === 'datapilot') {
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
  const sections = isZh
    ? [
        {
          id: 'overview',
          index: '01',
          title: '项目概览',
          intro: '',
          body: '智能问数从技术验证进入商业化探索阶段，目标是让企业用户通过自然语言完成数据查询，并将结果生成多维表格、仪表盘和数据大屏。我主要负责 Agent 对话体验，设计从问题输入、意图识别、参数确认到结果生成的完整流程。',
          stats: ['采纳率 15% → 60%', '5+ 家付费客户交付'],
          images: [{ src: project.image, caption: 'DataPilot 产品入口与问数结果概览' }],
        },
        {
          id: 'goals',
          index: '02',
          title: '目标与范围',
          intro: '解决“问得准”和“结果可用”',
          body: '项目目标分为两部分：一是提升指标、维度、时间范围和查询结果的准确性；二是丰富结果应用形式，让用户可以根据场景生成多维表格、仪表盘或数据大屏，而不只是得到一次性的图表答案。',
          bullets: ['准确理解用户的分析目标', '减少指标、维度和时间解析偏差', '支持不同数据展示和持续使用场景'],
          images: [{ src: '/images/datapilot-metric-layer-data.png', caption: '指标与字段信息是 Agent 理解问题的基础' }],
        },
        {
          id: 'problems',
          index: '03',
          title: '问题拆解',
          intro: '从“查询结果不稳定”定位到具体对话节点',
          body: '通过客户反馈、失败案例和交付过程中的问题记录，我将问题拆解到 Agent 的执行链路中。用户说“看一下华东销售情况”时，系统需要同时判断销售额还是销量、华东对应哪个区域层级，以及默认的时间范围。任何一个判断出错，最终结果都可能失去参考价值。',
          bullets: ['语义解析：用户表达与系统意图不一致', '指标 / 维度匹配：同一业务词存在多个口径', '时间识别：自然语言时间无法直接用于查询', '结果形态：用户需要的是明细、看板还是展示大屏'],
          images: [
            { src: '/images/datapilot-metric-layer-data.png', caption: '数据字段与指标口径' },
            { src: '/images/datapilot-metric-layer-modeling.png', caption: '指标、维度和数据关系' },
          ],
        },
        {
          id: 'conversation',
          index: '04',
          title: 'Agent 工作流',
          intro: '把自然语言问题转化为可确认、可继续调整的任务',
          body: '我负责设计 Agent 对话主流程：问题输入后，先识别分析目标，再提取指标、维度和时间范围；当信息存在歧义时，提供结构化确认；确认后执行查询并生成对应结果。用户还可以继续通过对话修改时间、筛选条件或展示方式。',
          bullets: ['输入问题', '解析指标、维度与时间', '判断结果形态', '必要时补充确认', '生成结果并支持继续调整'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Agent 从问题理解到结果生成的连续执行流程' }],
        },
        {
          id: 'accuracy',
          index: '05',
          title: '准确率与结果应用',
          intro: '让问数结果既准确，也能进入具体工作场景',
          body: '我先整理典型失败案例，再判断问题应该通过对话确认、指标配置、解析规则还是执行校验解决。例如，“收入”匹配到多个业务指标时，Agent 展示指标定义供用户选择；“最近三个月”无法确定口径时，转换成具体日期范围并允许用户修改。同时根据用户后续工作设计不同结果形态：明细分析使用多维表格，持续监控使用仪表盘，业务展示使用数据大屏。',
          bullets: ['语义解析：增加意图澄清与候选确认', '指标与时间：展示业务口径并转换为明确范围', '结果应用：支持多维表格、仪表盘和数据大屏', '多轮修改：只更新用户改动的参数，不重置整个任务'],
          images: [
            { src: '/images/datapilot-ai-serial-execution.png', caption: '串行执行中的指标确认与结果校验' },
            { src: '/images/datapilot-ai-parallel-execution.png', caption: '并行处理不同分析任务，减少等待和重复操作' },
          ],
        },
        {
          id: 'observability',
          index: '06',
          title: '可观测产品孵化',
          intro: '从“答案不对”定位到具体执行节点',
          body: '在客户交付过程中，很多反馈只有“答案不对”或“任务太慢”，仅查看最终结果无法判断问题发生在意图识别、指标匹配、时间解析、工具调用还是 SQL 校验。我将问数任务拆解为可追踪节点，并独立规划任务追踪、节点状态、工具调用、异常定位、耗时分析和结果评估能力，后续孵化 Agent 可观测产品。',
          bullets: ['任务列表：查看成功率、失败任务和平均耗时', '任务详情：呈现完整执行时间线和节点状态', '异常定位：记录输入、输出、工具和错误原因', '结果评估：跟踪结果是否被修改和采纳'],
          images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: 'Agent 多任务执行与问题定位场景' }],
        },
        {
          id: 'delivery',
          index: '07',
          title: '客户交付与结果',
          intro: '将交付中的共性问题转化为标准产品能力',
          body: '在 5+ 家付费客户交付过程中，我持续收集指标口径、时间范围、结果解释和展示形式相关反馈，并区分通用问题、行业差异和个性化需求。通用问题进入产品迭代，行业差异通过配置和业务词典解决，个性化需求则结合复用价值评估。',
          stats: ['结果采纳率 15% → 60%', '5+ 家付费客户', '从技术验证进入商业化交付'],
          images: [{ src: project.image, caption: '面向业务用户的问数与数据应用场景' }],
        },
        {
          id: 'role',
          index: '08',
          title: '后续优化方向',
          intro: '下一步需要继续验证不同场景下的使用效果',
          body: '当前结果主要反映整体采纳率变化，后续可以进一步拆分不同客户、问题类型和结果形态，判断哪些场景适合自动执行，哪些场景需要保留人工确认，并持续观察用户对多维表格、仪表盘和数据大屏的实际使用情况。',
          bullets: ['补充不同业务场景下的采纳率和修改率', '区分查询结果与数据应用生成的使用效果', '减少低风险问题中的确认步骤', '完善多轮对话中的上下文保留和参数修改'],
          images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: '多任务协同与结果生成场景' }],
        },
      ]
    : [
        {
          id: 'overview', index: '01', title: 'Overview', intro: '',
          body: 'Datapilot moved from technical validation toward commercial exploration. I owned the Agent conversation experience, from question input and intent recognition to confirmation and result generation across tables, dashboards, and data walls.', stats: ['Adoption 15% → 60%', '5+ paid customer deliveries', 'Tables / dashboards / data walls'], images: [{ src: project.image, caption: 'DataPilot product overview' }],
        },
        {
          id: 'goals', index: '02', title: 'Goals & scope', intro: 'Improve answer accuracy and make results usable beyond one-off answers', body: 'The product goals were to improve metric, dimension, time, and query accuracy, while supporting richer output formats for analysis, monitoring, and presentation.', bullets: ['Understand the user’s analysis goal', 'Reduce parsing and matching errors', 'Support different data-use scenarios'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric and field context' }],
        },
        {
          id: 'problems', index: '03', title: 'Problem framing', intro: 'Map unstable results to specific conversation nodes', body: 'I grouped customer feedback and failed cases across the Agent workflow. A request such as “show East China sales” requires the system to resolve the metric, region level, and time range before it can produce a useful result.', bullets: ['Intent parsing', 'Metric and dimension matching', 'Time interpretation', 'Output format selection'], images: [{ src: '/images/datapilot-metric-layer-data.png', caption: 'Metric context' }, { src: '/images/datapilot-metric-layer-modeling.png', caption: 'Metric relationships' }],
        },
        {
          id: 'conversation', index: '04', title: 'Agent conversation flow', intro: 'Turn natural language into a confirmable and editable task', body: 'I designed the main conversation flow: identify the analysis goal, extract metrics, dimensions, and time, confirm only when ambiguity is meaningful, then generate and refine the result through follow-up conversation.', bullets: ['Input', 'Parse', 'Confirm', 'Generate', 'Refine'], images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Conversation and execution flow' }],
        },
        {
          id: 'accuracy', index: '05', title: 'Accuracy and result applications', intro: 'Make results accurate and usable in real workflows', body: 'I organized failure cases and aligned the response: use confirmation for ambiguous metrics, convert natural-language time into explicit ranges, and preserve context when users revise one parameter. I also mapped output formats to user goals: tables for detail analysis, dashboards for recurring monitoring, and data walls for business presentation.', bullets: ['Intent clarification and metric definitions', 'Explicit time ranges and validation', 'Tables, dashboards, and data walls', 'Context-preserving revisions'], images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Serial execution' }, { src: '/images/datapilot-ai-parallel-execution.png', caption: 'Parallel execution' }],
        },
        {
          id: 'observability', index: '06', title: 'Observability product incubation', intro: 'Trace “wrong answer” back to an execution node', body: 'During customer delivery, feedback often came as “the answer is wrong” or “the task is slow.” I decomposed the task into traceable nodes, then incubated an Agent observability product with task tracking, node states, tool calls, error diagnosis, duration analysis, and result evaluation.', bullets: ['Task list and success metrics', 'Execution timeline and node details', 'Inputs, outputs, tools, and error causes', 'Result edits and adoption signals'], images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: 'Agent execution and diagnosis' }],
        },
        {
          id: 'delivery', index: '07', title: 'Delivery & outcome', intro: 'Turn recurring delivery issues into reusable product capabilities', body: 'Across 5+ paid customer deliveries, I categorized feedback into general product issues, industry-specific configuration, and one-off requests. General issues were fed back into the core experience and validated through subsequent delivery.', stats: ['Adoption 15% → 60%', '5+ paid customer deliveries', 'Technical validation → commercial delivery'], images: [{ src: project.image, caption: 'Business-facing query experience' }],
        },
        {
          id: 'role', index: '08', title: 'What could improve', intro: 'Continue validating performance across different use cases', body: 'The current result mainly reflects overall adoption. Next, I would break it down by customer, question type, and output format to understand which scenarios can be automated and where confirmation is still needed, while tracking actual use of tables, dashboards, and data walls.', bullets: ['Measure adoption and edit rates by scenario', 'Separate query success from application usage', 'Reduce confirmation steps for low-risk requests', 'Improve context retention across multi-turn revisions'], images: [{ src: '/images/datapilot-ai-parallel-execution.png', caption: 'Multi-task result generation' }],
        },
      ]

  return (
    <main className="datapilot-case-page">
      <div className="datapilot-case-shell">
        <Link to="/" className="datapilot-back">{isZh ? '返回' : 'Back'}</Link>
        <header className="datapilot-case-hero">
          <h1>{isZh ? 'AI 智能问数' : 'AI analytics Q&A and data application experience'}</h1>
          <p className="datapilot-hero-copy">{isZh ? '围绕问数准确性和应用丰富度，设计从自然语言提问到多维表格、仪表盘和数据大屏生成的 Agent 对话流程。' : 'Designing the Agent conversation flow from natural-language questions to tables, dashboards, and data walls.'}</p>
          <div className="datapilot-meta"><span>我的角色：产品设计师</span><span>产品阶段：技术验证 → 商业化交付</span><span>周期：持续迭代</span></div>
        </header>
        <div className="datapilot-case-layout">
          <article className="datapilot-case-content">
            {sections.map((section) => (
              <section className="datapilot-module" id={section.id} key={section.id}>
                <div className="datapilot-module-heading"><span>{section.index}</span><h2>{section.title}</h2></div>
                {section.intro ? <h3>{section.intro}</h3> : null}
                <p>{section.body}</p>
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
            <nav>{sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
          </aside>
        </div>
      </div>
    </main>
  )
}
