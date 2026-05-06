/** 是否为 GIF 资源路径（含查询串/哈希），用于动图展示与避免影响播放的样式 */
export function isGifSrc(src: string): boolean {
  return /\.gif(\?|#|$)/i.test(src)
}
