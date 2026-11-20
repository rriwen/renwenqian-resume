import { useCallback, useMemo, useRef, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Locale } from '../../i18n/translations'
import { getChatProjectImages, type ChatProjectImage } from '../../lib/chat/projectImages'

import { ProjectLightbox } from '../project/ProjectLightbox'

type ChatMessageContentProps = {
  content: string
  locale: Locale
}

type MarkdownNode = { type: string; tagName?: string; children?: MarkdownNode[] }

function containsImage(node: MarkdownNode): boolean {
  return node.tagName === 'img' || Boolean(node.children?.some(containsImage))
}

function safeLink(href: string | undefined): string | undefined {
  if (!href || /[\u0000-\u0020\u007f\\]/.test(href)) return undefined
  return /^(?:https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href) ? href : undefined
}

function ProjectImage({ image, locale: _locale }: { image: ChatProjectImage; locale: Locale }) {
  const [failed, setFailed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closePreview = useCallback(() => setExpanded(false), [])
  const caption = image.caption || image.projectTitle

  return (
    <span className="chatbot-project-image">
      {failed ? (
        <span className="chatbot-image-unavailable">
          {'图片暂时无法加载。'}
        </span>
      ) : (
        <button type="button" ref={triggerRef} onClick={() => setExpanded(true)} className="chatbot-project-image-link"
          aria-label={`放大查看：${caption}`}>
          <img src={image.src} alt={caption} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        </button>
      )}
      <span className="chatbot-project-image-caption">{caption}</span>
      {expanded && <ProjectLightbox items={[{ src: image.src, caption }]} index={0} onChange={() => {}} onClose={closePreview} returnFocusTo={triggerRef.current} />}
    </span>
  )
}

/** Render assistant replies without changing the message stored in conversation history. */
export function ChatMessageContent({ content, locale }: ChatMessageContentProps) {
  const components = useMemo<Components>(() => {
    const images = new Map(getChatProjectImages(locale).map(image => [image.src, image]))
    return {
      a: ({ href, children, node }) => {
        // A linked Markdown image already receives its own trusted preview button.
        const link = safeLink(href)
        if (!link || (node && containsImage(node))) return <>{children}</>
        const external = /^https?:\/\//i.test(link)
        return <a className="chatbot-link-button" href={link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>
      },
      img: ({ src }) => {
        const image = src ? images.get(src) : undefined
        if (!image) return <span className="chatbot-image-unavailable">{'图片暂不可用。'}</span>
        return <ProjectImage key={image.src} image={image} locale={locale} />
      },
      table: ({ children }) => (
        <div className="chatbot-table-scroll" role="region" tabIndex={0} aria-label={'表格，可横向滚动'}>
          <table>{children}</table>
        </div>
      ),
    }
  }, [locale])

  return (
    <div className="prose chatbot-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>{content}</ReactMarkdown>
    </div>
  )
}
