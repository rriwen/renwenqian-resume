import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'

/** The containing media frame must be positioned and reserve its own aspect ratio. */
export function LoadingImage({ src, className = '', style, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const image = useRef<HTMLImageElement>(null)
  const [result, setResult] = useState<{ src: string | undefined; failed: boolean } | null>(null)
  const settled = result?.src === src
  useEffect(() => {
    if (image.current?.complete) setResult({ src, failed: !image.current.naturalWidth })
  }, [src])
  return <>
    <img {...props} ref={image} src={src} className={`${className} media-image${settled ? ' is-ready' : ''}`}
      style={{ ...style, minHeight: (!settled || result?.failed) && style?.position !== 'absolute' ? 160 : style?.minHeight }}
      onLoad={() => setResult({ src, failed: false })} onError={() => setResult({ src, failed: true })} />
    {!settled && <span className="media-loading" role="status" aria-label="图片加载中"><span className="media-loading-dot" aria-hidden="true" /></span>}
    {settled && result?.failed && <span className="media-load-error" role="status">图片暂时无法加载</span>}
  </>
}
