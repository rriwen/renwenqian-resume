type StreamChunk = { choices?: { delta?: { content?: string | null } }[]; error?: { message?: string } }

/** Parse SSE records across arbitrary UTF-8 / CRLF boundaries, releasing the reader on exit. */
export async function readChatEventStream(body: ReadableStream<Uint8Array>, onDelta: (text: string) => void) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let carry = ''
  let data: string[] = []
  let ended = false
  const dispatch = () => {
    const payload = data.join('\n')
    data = []
    if (!payload) return
    if (payload === '[DONE]') { ended = true; return }
    let chunk: StreamChunk
    try { chunk = JSON.parse(payload) as StreamChunk } catch { return }
    if (chunk?.error?.message) throw new Error(chunk.error.message)
    const text = chunk?.choices?.[0]?.delta?.content
    if (typeof text === 'string' && text) onDelta(text)
  }
  const line = (value: string) => {
    if (!value) dispatch()
    else if (value.startsWith('data:')) data.push(value.slice(5).replace(/^ /, ''))
  }
  try {
    while (!ended) {
      const { done, value } = await reader.read()
      carry += decoder.decode(value, { stream: !done })
      let newline: number
      while ((newline = carry.indexOf('\n')) !== -1 && !ended) {
        line(carry.slice(0, newline).replace(/\r$/, ''))
        carry = carry.slice(newline + 1)
      }
      if (done) {
        if (!ended) {
          if (carry) line(carry.replace(/\r$/, ''))
          dispatch()
        }
        break
      }
    }
  } finally {
    try { await reader.cancel() } catch { /* the fetch may already have aborted */ }
    reader.releaseLock()
  }
}
