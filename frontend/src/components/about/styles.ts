import type { CSSProperties } from 'react'

/** 与 ProjectDetail 正文列同宽 */
export const proseColumn: CSSProperties = { maxWidth: 'var(--detail-prose-width)' }

export const bodyText: CSSProperties = {
  margin: '0 0 var(--paragraph-gap)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--project-body-text, var(--text))',
}

export const anchorTarget: CSSProperties = { scrollMarginTop: 'var(--header-clearance)' }

export const workArticleMeta: CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  color: 'var(--muted)',
  lineHeight: 'var(--leading-ui)',
  maxWidth: 'var(--detail-prose-width)',
}

export const workArticleHeader: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export const workArticleTitle: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 'var(--text-lg)',
  fontWeight: 600,
}

export const workArticleList: CSSProperties = {
  margin: 'var(--space-4) 0 0',
  paddingLeft: 'var(--space-5)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--project-body-text, var(--text))',
}

/** 与 ContactOverlay 邮件链接一致 */
export const contactLink: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
  borderBottom: '1px solid currentColor',
  paddingBottom: 2,
}

