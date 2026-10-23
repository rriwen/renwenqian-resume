import { createElement, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { type ProjectDetailBlock, type ProjectDetailParagraph } from '../../data/projectDetails'
import { getProjectTitle, type Project } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import { isGifSrc } from '../../lib/isGifSrc'
import { ProjectGallery } from './ProjectGallery'
import { ProjectNavigation } from './ProjectNavigation'

const body: CSSProperties = {
  margin: '0 0 var(--paragraph-gap)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text)',
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

type Props = { project: Project; detail: ProjectDetailBlock }

export function StandardProjectDetail({ project, detail }: Props) {
  const { locale, m } = useLanguage()
  return (
    <main
      className="page-shell project-detail-page project-detail-standard-page"
    >
      <Link
        to="/"
        className="back-link project-detail-back-link"
      >
        {m.workDetail.back}
      </Link>

      <div className="project-detail-cover">
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

      <h1 className="page-title">
        {getProjectTitle(project, locale)}
      </h1>

      <p
        style={{
          margin: '0 0 var(--space-8)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: 'var(--muted)',
          lineHeight: 'var(--leading-ui)',
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
        <section style={{ margin: '0 0 var(--space-4)' }}>
          <p style={{ ...body, marginBottom: 'var(--space-3)' }}>{detail.responsibilities.intro}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 'var(--space-6)',
              listStyleType: 'disc',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-body)',
              color: 'var(--text)',
            }}
          >
            {detail.responsibilities.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 'var(--space-4)' }}>
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
                      margin: 'var(--space-2) 0 0',
                      paddingLeft: 'var(--space-5)',
                      listStyleType: 'circle',
                    }}
                  >
                    {item.nested.map((sub, j) => (
                      <li key={j} style={{ marginBottom: 'var(--space-2)' }}>
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
            <p style={{ ...body, marginBottom: 'var(--space-3)' }}>
              <strong style={{ fontWeight: 700 }}>{detail.highlightBulletsIntro}</strong>
            </p>
          ) : null}
          {createElement(
            detail.highlightBulletsOrdered ? 'ol' : 'ul',
            {
              style: {
                margin: '0 0 var(--space-4)',
                paddingLeft: detail.highlightBulletsOrdered ? 'var(--space-6)' : 'var(--space-5)',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-body)',
                color: 'var(--text)',
                listStyleType: detail.highlightBulletsOrdered ? 'decimal' : 'disc',
              },
            },
            detail.highlightBullets.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>
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
            marginTop: 'var(--space-2)',
            marginBottom: 'var(--space-10)',
            fontSize: 'var(--text-base)',
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

      <ProjectGallery items={detail.gallery} />
      <ProjectNavigation slug={project.slug} />
    </main>
  )
}
