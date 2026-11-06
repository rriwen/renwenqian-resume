import { useMemo, useState } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Locale } from '../../i18n/translations'
import { getChatProjectImages, type ChatProjectImage } from '../../lib/chat/projectImages'

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

function ProjectImage({ image, locale }: { image: ChatProjectImage; locale: Locale }) {
  const [failed, setFailed] = useState(false)
  const caption = image.caption || image.projectTitle

  return (
    <span className="chatbot-project-image">
      {failed ? (
        <span className="chatbot-image-unavailable">
          {locale === 'zh' ? '图片暂时无法加载。' : 'This image could not be loaded.'}
        </span>
      ) : (
        <a href={image.src} target="_blank" rel="noopener noreferrer" className="chatbot-project-image-link"
          aria-label={locale === 'zh' ? `查看原图：${caption}（新窗口）` : `Open original image: ${caption} (new window)`}>
          <img src={image.src} alt={caption} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        </a>
      )}
      <span className="chatbot-project-image-caption">{caption}</span>
    </span>
  )
}

/** Render assistant replies without changing the message stored in conversation history. */
export function ChatMessageContent({ content, locale }: ChatMessageContentProps) {
  const components = useMemo<Components>(() => {
    const images = new Map(getChatProjectImages(locale).map(image => [image.src, image]))
    return {
      a: ({ href, children, node }) => {
        // A linked Markdown image already receives its own trusted original-image link.
        const link = safeLink(href)
        if (!link || (node && containsImage(node))) return <>{children}</>
        const external = /^https?:\/\//i.test(link)
        return <a href={link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>
      },
      img: ({ src }) => {
        const image = src ? images.get(src) : undefined
        if (!image) return <span className="chatbot-image-unavailable">{locale === 'zh' ? '图片暂不可用。' : 'This image is unavailable.'}</span>
        return <ProjectImage key={image.src} image={image} locale={locale} />
      },
      table: ({ children }) => (
        <div className="chatbot-table-scroll" role="region" tabIndex={0} aria-label={locale === 'zh' ? '表格，可横向滚动' : 'Table, scroll horizontally'}>
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
