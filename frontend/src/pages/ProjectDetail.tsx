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
  const project = getProjectBySlug(slug === 'ai-智能问数' ? 'dataagent' : slug)
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
  const [activeSectionId, setActiveSectionId] = useState('overview')
  const sections = isZh
    ? [
        {
          id: 'overview',
          index: '01',
          title: '项目目标',
          intro: '从“生成答案”转向“让结果可信并进入工作流”',
          body: '智能问数从技术验证进入商业化交付后，产品开始关注用户为何不敢采纳答案。早期版本在指标口径和执行过程上不够稳定，用户难以判断结果是否可信，出错后也缺少修正路径。因此目标分两层：先减少指标与维度的口径偏差，让结果可确认、可追踪、可修正；再让结果进入真实工作流，支持分析、监控、汇报和决策。\n\n设计策略围绕“理解—确认—修正—使用”展开：生成前展示 Agent 对问题和业务口径的理解，只在关键歧义处询问；执行中呈现节点与状态，让结果可以回查；出现偏差时保留上下文，通过对话局部修改；结果确认后继续生成多维表格、仪表盘或数据大屏，承接后续任务。',
          bullets: ['数据分析师：检查口径、修改参数并继续分析', '业务人员：用自然语言完成高频经营查询', '管理者：将结果用于监控、汇报和决策'],
          images: [{ src: '/images/dataagent-target-users-scenarios.png', caption: '' }],
        },
        {
          id: 'accuracy',
          index: '02',
          title: '准确率优化',
          intro: '先判断错误发生在哪个节点，再选择对应方案',
          body: '准确率问题不能只归因于模型。一次问数会经过意图理解、口径匹配、工具调用和结果返回，任一节点出错都会影响最终结果。\n\n定位时，先收集用户纠正、低评分和查询失败的案例，再按相同输入重放任务。逐步对照每个节点的输入、解析结果、调用参数和最终数据，找到首次出现偏差的位置。\n\n确认错误节点后，再选择追问确认、口径选择、调用校验或结果回查等方案，避免用增加确认步骤解决所有问题。',
          bullets: ['意图理解：用户问“华东销售怎么样”，先追问要看趋势、排名还是异常，再进入分析', '指标与维度：用户输入“收入”时，同时展示营业收入、回款金额等候选定义，由用户确认口径', '工具调用：生成经营看板前校验查询与制图工具的参数和顺序，失败时直接标出异常节点', '结果校验：结果页保留“营业收入｜华东区域”等查询条件与执行记录，方便核对和回查'],
          related: true,
          images: [
            { src: '/images/datapilot-metric-layer-data.png', caption: '数据字段与指标口径' },
            { src: '/images/datapilot-metric-layer-modeling.png', caption: '指标、维度和数据关系' },
          ],
        },
        {
          id: 'conversation',
          index: '03',
          title: '工作流优化',
          intro: '让确认、执行、反馈和修正形成连续任务',
          body: '参数明确时直接执行；出现关键歧义时，在对话中插入确认卡片。卡片集中展示已识别的指标、维度和筛选条件，候选口径用单选项呈现，用户确认后从当前节点继续。\n\n执行阶段使用步骤列表展示“理解问题—匹配口径—查询数据—生成结果”。当前步骤持续显示处理中状态，已完成步骤收起，用户仍可展开查看工具与参数，减少等待时的不确定感。\n\n结果中的筛选条件和展示方式支持原位修改。提交后只重跑受影响的节点，并保留上一版结果用于对照。失败信息出现在对应步骤下方，说明原因，同时提供修改参数、重试和返回上一步三个入口。',
          bullets: ['确认卡片：集中核对指标、维度和筛选条件', '执行步骤：显示当前进度，按需展开工具与参数', '原位修正：保留上下文，只重跑受影响的节点', '结果对照：修改后保留上一版结果，方便判断变化', '错误恢复：在出错节点提供修改、重试和返回入口'],
          images: [{ src: '/images/datapilot-ai-serial-execution.png', caption: 'Agent 从问题理解到结果生成的连续执行流程' }],
        },
        {
          id: 'applications',
          index: '04',
          title: '应用扩展',
          intro: '根据后续任务选择合适的结果形态',
          body: '应用生成可预览、可撤销，因此让 Agent 先完成可逆的规划与生成，只在目标缺失或存在明显歧义时询问用户。用户负责说明应用用途和关键取舍，Agent 负责组织字段、图表和内容顺序，减少逐步确认带来的打断。\n\n选择应用类型后，Agent 自动继承问数中的数据来源、指标、维度和筛选条件，并展示这些生成依据。若无法判断使用对象、查看方式或后续任务，再用简短问题补齐信息，避免基于错误假设继续生成。\n\n用户通过自然语言提出修改后，Agent 先复述要求并说明影响范围，再局部更新受影响的模块。系统同步检查数据与图表匹配、关键指标和画布范围，并保留上一版本与撤销入口。不同应用承接的任务不同，人与 Agent 的协作问题也会随之变化。',
          applicationTypes: [
            { title: '多维表格', scene: '用户把问数结果继续生成包含字段、视图和计算规则的业务分析表，并在后续分析中持续调整。', problem: '一句“生成门店经营表”同时包含用途和结构要求，Agent 对行粒度、字段关系和计算口径的理解不可见。草案偏离预期后，用户也难以判断一句修改会影响哪些字段与视图。', solution: '先展示 Agent 对用途、数据粒度和字段关系的理解，仅追问有歧义的部分。收到“改为每个门店一行”等要求后，先返回修改摘要和影响范围，再局部更新，并保留撤销入口。', screenshot: '多维表格生成结果截图' },
            { title: '仪表盘', scene: '业务负责人把分析结果生成周期性监控页面，用于查看指标变化、发现异常并继续追查。', problem: '“关注经营异常”需要被转换成页面大纲、指标优先级和图表组合。若 Agent 直接生成完整页面，用户很难判断它是否理解了监控目标；使用“这张图”等指代修改时也容易产生歧义。', solution: '先给出页面大纲和推荐模块，再生成仪表盘。每个模块显示名称、所回答的问题和数据口径；用户按模块名称提出调整，Agent 复述修改目标后局部更新，并提供重新生成与撤销。', screenshot: '仪表盘生成结果截图' },
            { title: '数据大屏', scene: '管理者把经营分析生成用于会议、汇报或业务现场展示的大屏，需要快速传达核心结论。', problem: '“更有重点”“更适合汇报”等视觉意图缺少明确指向。Agent 可能同时改动内容、版式和色彩，扩大修改范围，甚至破坏已经确认的叙事顺序。', solution: '先用选项确认受众、屏幕比例和核心结论，再生成叙事大纲与整屏预览。为各区域命名，用户通过名称提出修改；Agent 先说明将调整的内容，只更新对应区域，并保留上一版本。', screenshot: '数据大屏生成结果截图' },
          ],
          images: [],
        },
        {
          id: 'delivery',
          index: '05',
          title: '交付结果',
          intro: '将交付中的共性问题转化为标准产品能力',
          body: '在 5+ 家付费客户交付过程中，指标口径、结果解释和展示形式相关反馈被持续收集，并区分为通用问题、行业差异和个性化需求。通用问题进入产品迭代，行业差异通过配置和业务词典解决，个性化需求结合复用价值评估。失败案例进一步转化为问题优先级和验收标准，推动产品、算法、研发和交付团队统一方案，并跟进上线后的数据验证。这里的“采纳率”指用户直接使用或继续编辑 AI 结果，并将其用于实际业务的任务比例；当前为整体结果，后续仍需按客户、问题类型和结果形态拆分验证。',
          stats: ['结果采纳率 15% → 60%', '5+ 家付费客户', '从技术验证进入商业化交付'],
          images: [{ src: project.image, caption: '面向业务用户的问数与数据应用场景' }],
        },
        {
          id: 'role',
          index: '06',
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
          id: 'growth-research', index: '01', title: '市场背景', intro: '',
          body: 'AI 智能问数的产品能力已经可以交付，但面向海外 SaaS 市场的商业化还在探索。当前需要验证的不是“能不能做出结果”，而是海外用户是谁、什么场景最容易感知价值、用户如何开始试用，以及是否愿意从试用进入付费讨论。竞品、用户场景和客户反馈被用于收敛优先验证的目标用户与首个任务。',
          bullets: ['市场问题：AI Data Agent 产品定位相似，用户难以快速理解差异', '用户问题：不同角色对分析、监控、协作和交付的期待不同', '商业问题：尚无真实线上漏斗数据，需要先建立可验证假设', '调研输出：目标场景、官网叙事和首个试用任务'],
          images: [{ src: project.image, caption: '占位图：展示竞品定位、目标用户和优先验证场景的对比关系' }],
        },
        {
          id: 'growth-context', index: '02', title: '判断与策略', intro: '先验证定位和首次价值，再讨论注册与付费',
          body: '当前最需要验证的不是注册按钮的位置，而是用户能否在几分钟内理解产品、完成一次有效问数并看到可继续使用的结果。因此将官网作为市场验证入口，把首个任务作为价值验证节点，先降低理解和开始使用的成本，再承接注册、试用和销售沟通。首轮路径设计为“官网落地页 → 免费体验对话 → 注册获取 AI 积分 → 简单试用并生成报表等应用 → 引导付费”，每一步先让用户获得足够价值，再增加下一步转化要求。',
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
          body: '从官网访问、产品启动、首个任务完成、注册到付费的漏斗框架被用于验证完整路径，并结合 AI 模拟用户路径、访谈假设和客户反馈推演可能的流失原因。当前这些是商业化探索中的验证工具，不代表真实线上转化结果；后续需要接入埋点和销售数据，再判断哪些触点真正有效。',
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

  useEffect(() => {
    const sectionIds = visibleSections.map((section) => section.id)
    const updateActiveSection = () => {
      let current = sectionIds[0]
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 120) current = id
      }
      setActiveSectionId(current)
    }

    setActiveSectionId(sectionIds[0])
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [activePart])

  return (
    <main className="datapilot-case-page">
      <div className="datapilot-case-shell">
        <Link to="/" className="datapilot-back">{isZh ? '返回' : 'Back'}</Link>
        <header className="datapilot-case-hero">
          <h1>{isZh ? 'AI 智能问数' : 'DataAgent'}</h1>
          <p className="datapilot-hero-copy">{isZh ? 'AI 智能问数是一款面向业务分析场景的自然语言数据产品。产品将业务数据、指标口径与语义知识加工为 AI 可理解的上下文，提升问数结果的准确性，并支持从查询结果继续生成报表、仪表盘等数据应用。' : 'DataAgent is a natural-language analytics product for business scenarios. It turns business data, metric definitions, and semantic knowledge into AI-readable context for more accurate answers, then supports continued creation of reports, dashboards, and other data applications.'}</p>
          <p className="datapilot-hero-copy is-secondary">{isZh ? '项目沿两条主线推进：一是让 AI 结果可理解、可确认、可修正，推动产品从技术验证走向价值交付；二是在商业化探索阶段，通过 AI 模拟验证市场定位、首次使用与付费路径。' : 'The project followed two tracks: making AI results understandable, confirmable, and editable as the product moved from technical validation to value delivery; and using AI simulation to explore market positioning, first use, and payment paths.'}</p>
          <div className="datapilot-meta"><span>角色：产品体验负责人</span><span>阶段：技术验证 → 商业化交付</span><span>周期：持续迭代</span><a className="datapilot-demo-link" href="https://dataagent-demo.vercel.app/" target="_blank" rel="noreferrer">{isZh ? '查看 Demo' : 'View demo'} ↗</a></div>
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
                {section.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {'applicationTypes' in section && section.applicationTypes ? <div className="datapilot-application-types">{section.applicationTypes.map((item) => <section key={item.title}>
                  <h4>{item.title}</h4>
                  <p><strong>用户场景</strong>{item.scene}</p>
                  <p><strong>体验问题</strong>{item.problem}</p>
                  <p><strong>解决思路</strong>{item.solution}</p>
                  <div className="datapilot-application-screenshot" role="img" aria-label={item.screenshot}><span>{item.screenshot}</span></div>
                </section>)}</div> : null}
                {'related' in section && section.related ? <p className="datapilot-related-link">{isZh ? '可观测产品孵化由交付问题延展而来，详见' : 'The observability product grew from delivery problems; see'} <Link to="/project/agentops">{isZh ? 'Agent 可观测产品' : 'Agent observability product'}</Link>。</p> : null}
                {'stats' in section && section.stats ? <div className="datapilot-stat-row">{section.stats.map((stat) => <strong key={stat}>{stat}</strong>)}</div> : null}
                {'bullets' in section && section.bullets && section.id !== 'overview' ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => {
                  const separator = section.id === 'accuracy' ? bullet.indexOf('：') : -1
                  return <li key={bullet}>{separator > -1 ? <><strong>{bullet.slice(0, separator)}</strong>{bullet.slice(separator)}</> : bullet}</li>
                })}</ul> : null}
                {section.images.length ? <div className={`datapilot-evidence ${section.images.length > 1 ? 'is-multi' : 'is-single'}`}>
                  {section.images.map((image) => <figure key={image.src + image.caption}>{image.src === '/images/dataagent-target-users-scenarios.png' ? <img className="datapilot-evidence-image" src={image.src} alt="业务人员、数据分析师和管理者的目标用户与使用场景示意图" /> : <div className="datapilot-image-placeholder" role="img" aria-label={image.caption} />}{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}
                </div> : null}
                {'bullets' in section && section.bullets && section.id === 'overview' ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
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
        </div>
      </div>
      <nav className="about-timeline-nav datapilot-anchor-nav" aria-label={isZh ? '案例目录' : 'Case study contents'}>
        <ul className="about-timeline-list">
          {visibleSections.map((section) => <li key={section.id} className="about-timeline-item about-timeline-item-section">
            <a
              href={`#${section.id}`}
              className={activeSectionId === section.id ? 'about-timeline-link active' : 'about-timeline-link'}
              aria-label={section.title}
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${section.id}`)
                setActiveSectionId(section.id)
              }}
            >
              <span className="about-timeline-tip" aria-hidden>{section.title}</span>
              <span className="about-timeline-tick" aria-hidden />
            </a>
          </li>)}
        </ul>
      </nav>
    </main>
  )
}
