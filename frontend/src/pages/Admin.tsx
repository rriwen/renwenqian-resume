import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { createManagedContent, getManagedContent, saveManagedContent, slugify, type ContentKind, type ManagedContent } from '../lib/adminContent'
import { getInitialManagedContent } from '../lib/contentSeed'

const labels = { blog: '博客文章', project: '项目经历', about: '关于我' }

function Icon({ name }: { name: 'plus' | 'bold' | 'link' | 'image' | 'undo' | 'redo' | 'external' }) {
  const icons = { plus: '+', bold: 'B', link: '↗', image: '▧', undo: '↶', redo: '↷', external: '↗' }
  return <span aria-hidden="true">{icons[name]}</span>
}

export function Admin() {
  const [items, setItems] = useState<ManagedContent[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ContentKind>('project')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(true)
  const [preview, setPreview] = useState(false)
  const [notice, setNotice] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const active = items.find((item) => item.id === activeId)

  useEffect(() => {
    document.title = '内容管理 | DESIGN.4X'
  }, [])
  const login = async (event: FormEvent) => {
    event.preventDefault()
    const token = tokenInput.trim()
    if (!token) { setNotice('请输入管理密钥'); return }
    setAuthLoading(true); setNotice('')
    try {
      const databaseItems = await getManagedContent(token)
      const initial = getInitialManagedContent(databaseItems)
      setAdminToken(token); setItems(initial); setActiveId(initial.find((item) => item.kind === 'project')?.id ?? initial[0]?.id ?? null)
      if (!databaseItems.length) setNotice('现有内容已载入，保存或发布时将导入数据库')
    } catch (error) { setNotice(error instanceof Error ? error.message : '无法连接数据库') }
    finally { setAuthLoading(false) }
  }
  useEffect(() => {
    if (editorRef.current && active && editorRef.current.innerHTML !== active.content) editorRef.current.innerHTML = active.content
  }, [activeId])

  const visible = items.filter((item) => item.kind === filter && item.title.toLowerCase().includes(query.toLowerCase()))
  const update = (patch: Partial<ManagedContent>) => {
    if (!active) return
    setSaved(false)
    setItems((current) => current.map((item) => item.id === active.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item))
  }
  const persist = async (status?: 'draft' | 'published') => {
    if (!active) return
    const title = active.title.trim()
    if (!title) { setNotice('请先填写标题'); return }
    const next = items.map((item) => item.id === active.id ? { ...item, status: status ?? item.status, slug: item.slug || slugify(title), content: editorRef.current?.innerHTML || item.content, updatedAt: new Date().toISOString() } : item)
    if (!adminToken) { setNotice('缺少后台管理密钥，请刷新页面后重新输入'); return }
    try { await saveManagedContent(next, adminToken); setItems(next); setSaved(true); setNotice(status === 'published' ? '内容已发布到数据库' : '内容已保存到数据库') }
    catch (error) { setNotice(error instanceof Error ? error.message : '数据库保存失败') }
    window.setTimeout(() => setNotice(''), 2200)
  }
  const create = (kind: ContentKind) => {
    const item = createManagedContent(kind)
    setItems((current) => [item, ...current]); setActiveId(item.id); setFilter(kind); setSaved(false)
  }
  const command = (name: string, value?: string) => {
    editorRef.current?.focus(); document.execCommand(name, false, value); update({ content: editorRef.current?.innerHTML || '' })
  }
  const addLink = () => { const url = window.prompt('输入链接地址', 'https://'); if (url) command('createLink', url) }
  const insertImage = (src: string, alt = '') => command('insertHTML', `<figure><img src="${src.replace(/"/g, '&quot;')}" alt="${alt.replace(/"/g, '&quot;')}"><figcaption>${alt}</figcaption></figure><p><br></p>`)
  const addImageUrl = () => { const url = window.prompt('输入图片 URL'); if (url) insertImage(url, window.prompt('图片说明（可选）') || '') }
  const onFile = (file?: File) => {
    if (!file) return
    if (file.size > 1_500_000) { setNotice('图片请控制在 1.5MB 以内'); return }
    const reader = new FileReader(); reader.onload = () => insertImage(String(reader.result), file.name); reader.readAsDataURL(file)
  }

  if (!adminToken) return <main className="admin-login"><form onSubmit={login}><Link to="/">DESIGN.4X</Link><h1>内容工作台</h1><label>管理密钥<div className="admin-token-field"><input type={showToken ? 'text' : 'password'} value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} autoFocus autoComplete="current-password" placeholder="请输入 ADMIN_TOKEN" /><button type="button" onClick={() => setShowToken((value) => !value)} aria-label={showToken ? '隐藏管理密钥' : '显示管理密钥'}>{showToken ? '隐藏' : '显示'}</button></div></label>{notice ? <div className="admin-login-error" role="alert">{notice}</div> : null}<button type="submit" disabled={authLoading}>{authLoading ? '正在连接…' : '进入工作台'}</button></form></main>

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><Link to="/">DESIGN.4X</Link><span>CONTENT STUDIO</span></div>
        <div className="admin-create-row">
          <button onClick={() => create(filter)}><Icon name="plus" /> 新建{labels[filter]}</button>
        </div>
        <label className="admin-search"><span>搜索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索内容…" /></label>
        <nav className="admin-filters" aria-label="内容筛选">
          {([['project', '项目'], ['about', '关于'], ['blog', '博客']] as const).map(([value, text]) => <button className={filter === value ? 'is-active' : ''} onClick={() => { setFilter(value); setActiveId(items.find((item) => item.kind === value)?.id ?? null) }} key={value}>{text}<span>{items.filter((item) => item.kind === value).length}</span></button>)}
        </nav>
        <div className="admin-content-list">
          {visible.map((item) => <button key={item.id} className={activeId === item.id ? 'is-active' : ''} onClick={() => setActiveId(item.id)}><span className={`admin-status is-${item.status}`} /> <strong>{item.title || '无标题内容'}</strong><small>{labels[item.kind]} · {item.status === 'published' ? '已发布' : '草稿'}</small></button>)}
          {!visible.length ? <p>这里还没有内容。</p> : null}
        </div>
        <Link className="admin-back" to="/">← 返回网站</Link>
      </aside>

      <section className="admin-workspace">
        {!active ? <div className="admin-empty"><span>00</span><h1>建立你的内容档案</h1><p>创建一篇博客或一段项目经历，内容会保存到 PostgreSQL 数据库。</p><button onClick={() => create('blog')}>创建第一篇内容</button></div> : <>
          <header className="admin-topbar"><div><span className={`admin-status is-${active.status}`} />{saved ? '所有更改已保存' : '有未保存更改'}</div><div className="admin-actions"><button onClick={() => setPreview((value) => !value)}>{preview ? '继续编辑' : '预览'}</button><button onClick={() => persist()}>{active.status === 'published' ? '保存更改' : '保存草稿'}</button><button className="is-primary" onClick={() => persist('published')}>{active.status === 'published' ? '更新发布' : '发布'}</button></div></header>
          {notice ? <div className="admin-notice" role="status">{notice}</div> : null}
          <div className={`admin-editor-wrap${preview ? ' is-preview' : ''}`}>
            {!preview ? <div className="admin-fields">
              <div className="admin-meta-row"><label>内容类型<select value={active.kind} onChange={(event) => update({ kind: event.target.value as ContentKind, category: event.target.value === 'blog' ? '设计思考' : event.target.value === 'about' ? '关于我' : '项目经历' })}><option value="project">项目经历</option><option value="about">关于我</option><option value="blog">博客文章</option></select></label><label>分类<input value={active.category} onChange={(event) => update({ category: event.target.value })} /></label><label>访问路径<input value={active.slug} onChange={(event) => update({ slug: slugify(event.target.value) })} placeholder="自动生成" /></label></div>
              <input className="admin-title-input" value={active.title} onChange={(event) => update({ title: event.target.value })} placeholder="输入主标题" aria-label="主标题" />
              <textarea className="admin-excerpt-input" value={active.excerpt} onChange={(event) => update({ excerpt: event.target.value })} placeholder="写一段内容摘要，将展示在列表中…" />
              <label className="admin-cover-field">封面图 URL<input value={active.cover} onChange={(event) => update({ cover: event.target.value })} placeholder="/images/cover.jpg 或 https://…" /></label>
              <div className="admin-toolbar" role="toolbar" aria-label="富文本工具栏">
                <button onClick={() => command('formatBlock', 'h2')}>H2 <span>段落标题</span></button><button onClick={() => command('formatBlock', 'h3')}>H3</button><button onClick={() => command('formatBlock', 'p')}>正文</button><i />
                <button onClick={() => command('bold')} aria-label="加粗"><Icon name="bold" /></button><button onClick={addLink} aria-label="添加链接"><Icon name="link" /></button><button onClick={addImageUrl} aria-label="通过 URL 插入图片"><Icon name="image" /></button><button onClick={() => fileRef.current?.click()}>上传插图</button><i />
                <button onClick={() => command('undo')} aria-label="撤销"><Icon name="undo" /></button><button onClick={() => command('redo')} aria-label="重做"><Icon name="redo" /></button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(event) => onFile(event.target.files?.[0])} />
              </div>
              <div ref={editorRef} className="admin-rich-editor" contentEditable suppressContentEditableWarning onInput={() => update({ content: editorRef.current?.innerHTML || '' })} data-placeholder="开始写正文…" />
            </div> : <article className="admin-preview"><span>{active.category}</span><h1>{active.title || '无标题内容'}</h1>{active.excerpt ? <p className="admin-preview-excerpt">{active.excerpt}</p> : null}{active.cover ? <img className="admin-preview-cover" src={active.cover} alt="" /> : null}<div className="managed-rich-content" dangerouslySetInnerHTML={{ __html: active.content }} /><Link to={active.kind === 'blog' ? `/blog/${active.slug || slugify(active.title)}` : active.kind === 'about' ? '/about' : `/project/${active.slug || slugify(active.title)}`}>打开展示页 <Icon name="external" /></Link></article>}
          </div>
        </>}
      </section>
    </main>
  )
}
