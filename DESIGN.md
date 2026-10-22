# DESIGN.4X 设计说明

## 项目定位

DESIGN.4X 是个人产品设计师作品集与内容站点，覆盖项目案例、个人经历、博客文章和摄影内容。界面强调安静、克制、可扫描的编辑型排版，并支持中英文切换与浅色/深色主题。

## 技术栈

- React 18 + TypeScript
- Vite
- React Router 6
- React Markdown + remark-gfm
- Vercel Analytics
- CSS 自定义属性实现主题与全局视觉变量

常用命令：

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 页面与路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `Home` | 个人介绍、项目筛选和产品卡片 |
| `/about` | `About` | 个人简介、工作经历、教育经历和联系方式 |
| `/blog` | `BlogIndex` | 文章列表 |
| `/blog/:slug` | `BlogPost` | Markdown 文章、目录、相关文章 |
| `/photography` | `Photography` | Instagram 摄影内容 |
| `/project/:slug` | `ProjectDetail` | 项目详情、画廊和相邻项目导航 |

`frontend/src/App.tsx` 负责路由、主题状态、全局 Header/Footer、聊天与联系浮层。博客和摄影页面采用懒加载。

## 组件职责

- `Header`：固定顶部导航、移动端菜单、语言切换、主题切换和聊天入口。
- `SiteFooter`：站内导航、项目入口和联系方式。
- `Home` 中的产品卡片：项目浏览与筛选。
- `ChatbotOverlay`：站内 AI 对话浮层。
- `ContactOverlay`：联系信息浮层。
- `LanguageContext`：中英文 locale 状态与翻译资源。

## 视觉系统

`frontend/src/index.css` 只负责按顺序导入样式，前台和 Content Studio 共用同一套变量：

| 文件 | 职责 |
| --- | --- |
| `styles/tokens.css` | 颜色、字体、字号、间距、宽度、圆角、动效及深浅主题 |
| `styles/foundation.css` | 全局基础、页面容器、按钮、焦点、联系弹层 |
| `styles/components.css` | 页面与组件自身的布局和状态 |
| `styles/prose.css` | Markdown、发布后的 HTML、后台预览和富文本编辑器的共同排版 |
| `styles/responsive.css` | 集中管理断点和减少动效偏好 |

优先使用以下 CSS 变量，不要在页面中重复定义主题颜色：

- `--page-bg`：页面背景
- `--surface`：控件或内容表面
- `--text`：主文字
- `--muted`：次要文字
- `--rule`：非交互性分隔线
- `--control-border`：输入框和按钮边框
- `--subtle`：浅层背景
- `--accent`：焦点和强调色
- `--hover-bg`：悬停与次级选中背景
- `--danger` / `--success`：错误与成功状态
- `--header-bg` / `--overlay-bg` / `--lightbox-bg`：导航、弹层遮罩和图片查看器
- `--header-clearance`：固定 Header 下方的安全距离

所有页面、弹层、表单和正文使用 `--font-sans` 系统无衬线字体栈，代码使用 `--font-mono`，不额外加载远程字体。产品 Logo 和图片保留自身品牌表现。

| 用途 | 变量 | 默认字号 / 行高 |
| --- | --- | --- |
| 页面标题 | `--text-title` | 28px / 1.3 |
| 内容章节标题 | `--text-section` | 24px / 1.3 |
| 小标题 | `--text-xl` / `--text-lg` | 20px / 18px，行高 1.3 |
| 正文 | `--text-base` | 16px / 1.75 |
| 文章正文 | `--text-prose` | 桌面 16px，700px 及以下 15px，行高 1.75 |
| 次要信息和控件 | `--text-sm` | 14px / 1.5 |
| 标签和简短元数据 | `--text-xs` | 12px / 1.5 |

字号以 rem 定义，手机端文章正文使用 15px，标题层级不变。不要通过父元素的小字号或透明度改变正文层级；次要文字使用 `--muted`。正文容器统一使用 `.prose`，包括表格、代码、图片、列表和引用。

布局复用 `.page-shell` 和 `--page-gutter`：全站最大宽度 1520px，正文列最大宽度 760px，项目媒体列最大宽度 974px。间距使用 4px 基础刻度的 `--space-*`，页面顶部、底部、章节和简介间距分别使用 `--page-top`、`--page-bottom`、`--section-gap`、`--intro-gap`。

所有交互控件保留 2px 强调色键盘焦点环；输入框同时改变边框颜色。禁用状态、悬停状态和选中状态必须可区分，主题差异只在 tokens 中维护。减少动效偏好会关闭装饰动画和过渡。

## 响应式规则

- `900px` 及以下使用折叠导航、双列项目网格和双列页脚，关于我信息独占一行；文章目录移入正文顶部。
- `700px` 及以下进入手机布局：统一 20px 页边距，首页和项目画廊单列，摄影双列，后台列表改为纵向信息布局。
- `400px` 及以下将聊天入口缩为带可访问名称的图标，保留语言和主题按钮，保证 320px 屏幕不溢出。
- 移动端 Header 使用圆形菜单按钮，点击展开主导航；展开状态显示标准关闭图标。
- 移动端保留“和我聊聊”入口、语言切换和主题按钮。
- 首页产品网格移动端为单列；摄影和相关内容使用双列或单列布局。
- Footer 移动端使用导航/产品双列，关于我信息独占一行并左对齐。
- 页面和媒体必须限制在视口宽度内，代码块和 Markdown 表格允许横向滚动，禁止产生页面级横向滚动。
- 新增固定 Header 下的锚点内容时，使用 `var(--header-clearance)` 作为 `scroll-margin-top`。

## 内容与数据

- 项目基础数据：`frontend/src/data/projects.ts`
- 项目详情数据：`frontend/src/data/projectDetails.ts`
- 翻译资源：`frontend/src/i18n/translations.ts`
- 摄影数据：`frontend/public/data/instagram.json`
- 博客内容：`frontend/src/content/blog/`
- 静态图片：`frontend/public/images/`

### 内容管理数据库

已发布内容通过根目录 `api/content.ts` 从 PostgreSQL 读取，接口只支持 GET。该目录是 Vercel 强制要求的 Serverless 路由入口；其余后端工具与迁移脚本位于 `backend/`，前端代码全部位于 `frontend/`。内容不使用浏览器本地存储。配置时复制 `.env.example` 并设置：

- `POSTGRES_URL`：PostgreSQL 连接字符串，生产环境建议使用 Vercel Marketplace 中的 Neon。

公开页面只读取已发布内容，数据库不可用时使用仓库中的静态内容兜底。Admin 编辑后台已移除，内容接口不再提供草稿读取、写入或删除功能。

本地使用 `npm run dev` 时，Vite 会将 `/api` 代理到线上 API；本地完整接口验证使用 `npm run dev:full`。服务端接口变更需要部署后才会影响线上接口。

图片应使用明确的 `alt` 文本（装饰图可为空），大图使用懒加载；项目和博客详情中的媒体应保持原始比例并避免撑破容器。

## 开发约定

1. 优先复用现有组件、CSS 变量和数据层，不为单页复制一套主题规则。
2. 新增页面需要验证 320px、390px、660px、768px 和 1440px，并覆盖中英文和深浅主题。
3. 文本不能依赖固定高度；长中文、英文标题和链接都必须自然换行。
4. 交互控件提供可理解的 `aria-label`，图标按钮需要有 tooltip 或可访问名称。
5. 提交前运行 `npm run build`，确保 TypeScript 检查和 Vite 构建均通过。

## 验证清单

- `/`、`/about`、`/blog`、`/photography`、项目详情和博客详情可直接访问。
- 浅色/深色主题切换后文字与边框仍有足够对比度。
- HTML、Markdown 和富文本编辑器的正文一致：桌面 16px、手机 15px，行高均为 1.75，章节标题层级保持一致。
- 深色联系弹层、项目指标、产品 Logo 和聊天输入框聚焦状态可读。
- 移动端导航可以打开、关闭并点击跳转。
- 页面没有水平滚动，正文、标签、表格和图片不发生遮挡。
- 图片请求失败时页面仍可阅读，摄影页能显示空数据状态。
- `npm run build` 通过。
