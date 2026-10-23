import { Fragment, createElement, type ReactNode } from 'react'

export function renderMarkdownInline(text: string): ReactNode {
  const nodes: ReactNode[] = []
  let index = 0
  let key = 0

  const pushText = (value: string) => {
    if (!value) return
    nodes.push(value)
  }

  while (index < text.length) {
    const boldStart = text.indexOf('**', index)
    const linkStart = text.indexOf('[', index)

    let nextIndex = -1
    let nextKind: 'bold' | 'link' | null = null

    if (boldStart >= 0 && (linkStart < 0 || boldStart < linkStart)) {
      nextIndex = boldStart
      nextKind = 'bold'
    } else if (linkStart >= 0) {
      nextIndex = linkStart
      nextKind = 'link'
    }

    if (nextIndex < 0) {
      pushText(text.slice(index))
      break
    }

    if (nextIndex > index) {
      pushText(text.slice(index, nextIndex))
    }

    if (nextKind === 'bold') {
      const endIndex = text.indexOf('**', nextIndex + 2)
      if (endIndex < 0) {
        pushText(text.slice(nextIndex))
        break
      }
      nodes.push(createElement('strong', { key: `strong-${key++}` }, text.slice(nextIndex + 2, endIndex)))
      index = endIndex + 2
      continue
    }

    if (nextKind === 'link') {
      const labelEnd = text.indexOf(']', nextIndex + 1)
      const urlStart = labelEnd >= 0 ? text.indexOf('(', labelEnd + 1) : -1
      const urlEnd = urlStart >= 0 ? text.indexOf(')', urlStart + 1) : -1
      if (labelEnd < 0 || urlStart !== labelEnd + 1 || urlEnd < 0) {
        pushText(text.slice(nextIndex))
        break
      }

      const label = text.slice(nextIndex + 1, labelEnd)
      const href = text.slice(urlStart + 1, urlEnd)
      nodes.push(createElement('a', { key: `link-${key++}`, href }, label))
      index = urlEnd + 1
    }
  }

  return createElement(Fragment, null, ...nodes)
}
