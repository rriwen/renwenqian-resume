import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  createManagedContent,
  deleteManagedContent,
  getManagedContent,
  saveManagedContent,
  slugify,
  type ContentKind,
  type ManagedContent,
} from "../lib/adminContent";
import { getInitialManagedContent } from "../lib/contentSeed";
import { RichTextEditor } from "../components/RichTextEditor";
import { CoverImageUploader } from "../components/CoverImageUploader";

function Icon({
  name,
}: {
  name: "plus" | "bold" | "link" | "image" | "undo" | "redo" | "external";
}) {
  const icons = {
    plus: "+",
    bold: "B",
    link: "↗",
    image: "▧",
    undo: "↶",
    redo: "↷",
    external: "↗",
  };
  return <span aria-hidden="true">{icons[name]}</span>;
}

export function Admin() {
  const [items, setItems] = useState<ManagedContent[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const filter: ContentKind = "blog";
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [view, setView] = useState<"list" | "editor">("list");
  const active = items.find((item) => item.id === activeId);

  useEffect(() => {
    document.title = "内容管理 | DESIGN.4X";
  }, []);
  const login = async (event: FormEvent) => {
    event.preventDefault();
    const token = tokenInput.trim();
    if (!token) {
      setNotice("请输入管理密钥");
      return;
    }
    setAuthLoading(true);
    setNotice("");
    try {
      const databaseItems = await getManagedContent(token, "blog");
      const initial = getInitialManagedContent(databaseItems);
      setAdminToken(token);
      setItems(initial);
      setActiveId(initial[0]?.id ?? null);
      if (!databaseItems.length)
        setNotice("现有内容已载入，保存或发布时将导入数据库");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "无法连接数据库");
    } finally {
      setAuthLoading(false);
    }
  };
  const visible = items
    .filter(
      (item) =>
        item.kind === filter &&
        item.title.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const update = (patch: Partial<ManagedContent>) => {
    if (!active) return;
    setSaved(false);
    setItems((current) =>
      current.map((item) =>
        item.id === active.id
          ? { ...item, ...patch, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  };
  const persist = async (status?: "draft" | "published") => {
    if (!active) return;
    const title = active.title.trim();
    if (!title) {
      setNotice("请先填写标题");
      return;
    }
    const next = items.map((item) =>
      item.id === active.id
        ? {
            ...item,
            status: status ?? item.status,
            slug: slugify(title),
            content: item.content,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );
    if (!adminToken) {
      setNotice("缺少后台管理密钥，请刷新页面后重新输入");
      return;
    }
    try {
      await saveManagedContent(next, adminToken);
      setItems(next);
      setSaved(true);
      setNotice(
        status === "published" ? "内容已发布到数据库" : "内容已保存到数据库",
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "数据库保存失败");
    }
    window.setTimeout(() => setNotice(""), 2200);
  };
  const create = (kind: ContentKind) => {
    const item = {
      ...createManagedContent(kind),
      sortOrder: items.filter((content) => content.kind === kind).length,
    };
    setItems((current) => [item, ...current]);
    setActiveId(item.id);
    setSaved(false);
    setPreview(false);
    setView("editor");
  };
  const edit = (item: ManagedContent) => {
    setActiveId(item.id);
    setSaved(true);
    setPreview(false);
    setView("editor");
  };
  const remove = async (item: ManagedContent) => {
    if (
      !window.confirm(
        `确定删除「${item.title || "无标题内容"}」吗？此操作无法撤销。`,
      )
    )
      return;
    try {
      await deleteManagedContent(item.id, adminToken);
      setItems((current) =>
        current.filter((content) => content.id !== item.id),
      );
      setNotice("内容已删除");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "删除失败");
    }
    window.setTimeout(() => setNotice(""), 2200);
  };
  const move = async (item: ManagedContent, direction: -1 | 1) => {
    if (query) return;
    const ordered = items
      .filter((content) => content.kind === filter)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const index = ordered.findIndex((content) => content.id === item.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ordered.length) return;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    const positions = new Map(
      ordered.map((content, position) => [content.id, position]),
    );
    const next = items.map((content) =>
      positions.has(content.id)
        ? { ...content, sortOrder: positions.get(content.id)! }
        : content,
    );
    setItems(next);
    setNotice("正在保存排序…");
    try {
      await saveManagedContent(next, adminToken);
      setNotice("排序已保存，前台展示顺序已更新");
    } catch (error) {
      setItems(items);
      setNotice(error instanceof Error ? error.message : "排序保存失败");
    }
    window.setTimeout(() => setNotice(""), 2200);
  };

  if (!adminToken)
    return (
      <main className="admin-login">
        <form onSubmit={login}>
          <Link to="/">DESIGN.4X</Link>
          <h1>内容工作台</h1>
          <label>
            管理密钥
            <div className="admin-token-field">
              <input
                type={showToken ? "text" : "password"}
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                autoFocus
                autoComplete="current-password"
                placeholder="请输入 ADMIN_TOKEN"
              />
              <button
                type="button"
                onClick={() => setShowToken((value) => !value)}
                aria-label={showToken ? "隐藏管理密钥" : "显示管理密钥"}
              >
                {showToken ? "隐藏" : "显示"}
              </button>
            </div>
          </label>
          {notice ? (
            <div className="admin-login-error" role="alert">
              {notice}
            </div>
          ) : null}
          <button type="submit" disabled={authLoading}>
            {authLoading ? "正在连接…" : "进入工作台"}
          </button>
        </form>
      </main>
    );

  const openModule = () => {
    setQuery("");
    setPreview(false);
    setView("list");
  };

  return (
    <main className="admin-v2">
      <header className="admin-v2-header">
        <Link to="/" className="admin-v2-brand">
          DESIGN.4X
        </Link>
        <nav aria-label="后台模块">
          <button className="is-active" onClick={openModule}>博客</button>
        </nav>
        <Link to="/" className="admin-v2-site-link">
          查看网站 ↗
        </Link>
      </header>
      {notice ? (
        <div className="admin-notice" role="status">
          {notice}
        </div>
      ) : null}
      {view === "list" ? (
        <section className="admin-list-page">
          <header>
            <div>
              <p>博客文章</p>
              <h3>博客管理</h3>
            </div>
            <button onClick={() => create(filter)}>
              <Icon name="plus" /> 新建文章
            </button>
          </header>
          <div className="admin-list-tools">
            <label>
              搜索
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="输入标题搜索…"
              />
            </label>
            <span>
              {query ? "清除搜索后可调整排序 · " : "使用箭头调整前台顺序 · "}共{" "}
              {visible.length} 条内容
            </span>
          </div>
          <div className="admin-table">
            <div className="admin-table-head">
              <span>标题</span>
              <span>分类</span>
              <span>状态</span>
              <span>更新时间</span>
              <span>排序与操作</span>
            </div>
            {visible.map((item, index) => (
              <article key={item.id}>
                <button
                  className="admin-table-title"
                  onClick={() => edit(item)}
                >
                  <strong>{item.title || "无标题内容"}</strong>
                  <small>/{item.slug}</small>
                </button>
                <span>{item.category}</span>
                <span>
                  <i className={`admin-status is-${item.status}`} />{" "}
                  {item.status === "published" ? "已发布" : "草稿"}
                </span>
                <time>
                  {new Date(item.updatedAt).toLocaleDateString("zh-CN")}
                </time>
                <div>
                  <button
                    className="admin-sort-button"
                    disabled={Boolean(query) || index === 0}
                    onClick={() => move(item, -1)}
                    aria-label={`上移 ${item.title}`}
                  >
                    ↑
                  </button>
                  <button
                    className="admin-sort-button"
                    disabled={Boolean(query) || index === visible.length - 1}
                    onClick={() => move(item, 1)}
                    aria-label={`下移 ${item.title}`}
                  >
                    ↓
                  </button>
                  <button onClick={() => edit(item)}>编辑</button>
                  <button className="is-danger" onClick={() => remove(item)}>
                    删除
                  </button>
                </div>
              </article>
            ))}
            {!visible.length ? (
              <div className="admin-list-empty">暂无内容，点击右上角新建。</div>
            ) : null}
          </div>
        </section>
      ) : active ? (
        <section className="admin-workspace admin-v2-editor">
          <header className="admin-topbar">
            <button
              className="admin-editor-back"
              onClick={() =>
                active.kind === "about" ? openModule() : setView("list")
              }
            >
              ← 返回列表
            </button>
            <div>
              <span className={`admin-status is-${active.status}`} />
              {saved ? "所有更改已保存" : "有未保存更改"}
            </div>
            <div className="admin-actions">
              <button onClick={() => void persist()}>
                {active.status === "published" ? "保存更改" : "保存草稿"}
              </button>
              <button className="is-primary" onClick={() => void persist("published")}>
                {active.status === "published" ? "更新发布" : "发布"}
              </button>
            </div>
          </header>
          <div className={`admin-editor-wrap${preview ? " is-preview" : ""}`}>
            {!preview ? (
              <div className="admin-fields">
                <div className="admin-meta-row">
                  <label>
                    分类
                    <input
                      value={active.category}
                      onChange={(event) =>
                        update({ category: event.target.value })
                      }
                    />
                  </label>
                </div>
                <input
                  className="admin-title-input"
                  value={active.title}
                  onChange={(event) =>
                    update({
                      title: event.target.value,
                      slug: slugify(event.target.value),
                    })
                  }
                  placeholder="输入主标题"
                />
                {active.kind !== "about" ? (
                  <label className="admin-cover-field">
                    封面图
                    <CoverImageUploader
                      value={active.cover}
                      onChange={(cover) => update({ cover })}
                      onNotice={(message) => {
                        setNotice(message);
                        window.setTimeout(() => setNotice(""), 2200);
                      }}
                    />
                  </label>
                ) : null}
                <RichTextEditor
                  key={active.id}
                  content={active.content}
                  onChange={(content) => update({ content })}
                  onNotice={(message) => {
                    setNotice(message);
                    window.setTimeout(() => setNotice(""), 2200);
                  }}
                />
              </div>
            ) : (
              <article className="admin-preview">
                <span>{active.category}</span>
                <h1>{active.title}</h1>
                <p className="admin-preview-excerpt">{active.excerpt}</p>
                <div
                  className="managed-rich-content"
                  dangerouslySetInnerHTML={{ __html: active.content }}
                />
              </article>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
