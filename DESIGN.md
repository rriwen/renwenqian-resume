# DESIGN.4X 设计说明

## 项目定位

DESIGN.4X 是个人产品设计师作品集与内容站点，覆盖项目案例、个人经历和摄影内容，博客入口链接到外部 Notion。界面强调安静、克制、可扫描的编辑型排版，并支持中英文切换与浅色/深色主题。

## 技术栈

- React 18 + TypeScript
- Vite
- React Router 6
- React Markdown（关于页）
- Vercel Analytics
- CSS 自定义属性实现主题与全局视觉变量

常用命令：

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run build
npm run preview
```

## 页面与路由

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | `Home` | 个人介绍、项目筛选和产品卡片 |
| `/about` | `About` | 个人简介、工作经历、可展开的项目经历和联系方式 |
| `/photography` | `Photography` | Instagram 摄影内容 |
| `/project/:slug` | `ProjectDetail` | 项目详情、画廊和相邻项目导航 |

`frontend/src/App.tsx` 负责路由、主题状态、全局 Header/Footer、聊天与联系浮层。首页直接加载，About、项目详情和摄影页面按路由懒加载；聊天首次打开时加载。导航与页脚保留外部 Notion 博客入口。

## 组件职责

- `Header`：固定顶部导航、移动端菜单、语言切换、主题切换和聊天入口。
- `SiteFooter`：站内导航、项目入口和联系方式。
- `Home` 中的产品卡片：项目浏览与筛选。
- `components/project/`：通用详情、DataPilot 案例、画廊、图片查看器和相邻项目导航；`ProjectDetail` 负责路由与布局分派。
- `components/about/`：工作条目、项目卡片、时间线与 Markdown 行内渲染；`About` 组合这些模块。
- `components/Lanyard/`：React 入口与 3D 场景、物理模拟、纹理、几何和材质分别维护。
- `ChatbotOverlay`：按需加载 `components/chat/ChatPanel`；`useChatThread` 管会话状态，关闭浮层保留正在生成的响应。
- `ContactOverlay`：联系信息浮层。
- `hooks/useHashOverlay`：聊天与联系浮层共用的 Hash 状态、路由同步与 Escape 关闭。
- `LanguageContext`：中英文 locale 状态与翻译资源。

## 视觉系统

`frontend/src/index.css` 只负责按顺序导入样式。代码导航与运行说明见 [README.md](README.md)。

| 文件 | 职责 |
| --- | --- |
| `styles/tokens.css` | 颜色、字体、字号、间距、宽度、圆角、动效及深浅主题 |
| `styles/foundation.css` | 全局基础、页面容器、按钮、焦点、联系弹层 |
| `styles/components.css` | 按固定顺序导入 `styles/components/*.css` |
| `styles/components/` | 首页、项目、DataPilot、About、摄影、聊天、导航和页脚等各自的布局与状态 |
| `styles/prose.css` | 正文排版，包括关于页 Markdown |
| `styles/responsive.css` | 跨组件断点和减少动效偏好；组件专属规则留在各组件样式中 |

保留 tokens → foundation → components → prose → responsive 的级联顺序，以及 `components.css` 内的导入顺序。定位样式时先选对应页面/组件文件。

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

- `900px` 及以下使用折叠导航、双列项目网格和双列页脚，关于我信息独占一行。
- `700px` 及以下进入手机布局：统一 20px 页边距，首页和项目画廊单列，摄影双列。
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
- DataPilot 单一内容源：`frontend/src/data/projects/dataPilot.ts`，页面与聊天共同读取文案、链接和配图信息
- 翻译资源：`frontend/src/i18n/translations.ts`
- 摄影数据：`frontend/public/data/instagram.json`
- 关于页内容：`frontend/src/content/about/`
- 静态图片：`frontend/public/images/`

项目双语标签直接保存在 `projects.ts` 的项目记录中，不依赖清单顺序。关于页 Markdown 的 `##` / `###` 标题使用 `<!-- id: stable-id -->` 隐藏注释；同文件 ID 唯一，同义内容跨语言保持一致。改标题、移动条目时保留 ID，新增工作经历会自动展示。章节使用 `work`、`projects`、`education`、`contact`；教育内容保留在语料中，页面当前不展示。纯解析位于 `content/about/parseAboutContent.ts`，加载与缓存位于 `content/about.ts`。

### 内容与聊天接口

首页、项目详情、关于页和摄影页读取本地内容，博客由外部 Notion 承载。项目无数据库依赖。

聊天服务端入口位于根目录 `api/chat.ts`，由 Vercel 部署；前端代码位于 `frontend/`。首次配置时复制 `.env.example` 并设置 `DEEPSEEK_API_KEY`，密钥只由服务端读取。

`ChatPanel` 加载后由 `useChatThread` 生成当前语言语料；`lib/siteCorpus.ts` 汇总本地内容，`lib/deepseekChat.ts` 负责传输。`lib/chat/` 分别维护 SSE 解析、文字渐显和会话历史校验，业务文案继续放在内容层。

本地使用 `npm run dev` 时，`/api/chat` 由 Vite 中间件调用本地服务端实现。本地完整接口验证使用 `npm run dev:full`。服务端接口变更需要部署后才会影响线上接口。

图片应使用明确的 `alt` 文本（装饰图可为空），大图使用懒加载；项目详情中的媒体应保持原始比例并避免撑破容器。

## 开发约定

1. 优先复用现有组件、CSS 变量和数据层，不为单页复制一套主题规则。
2. 新增页面需要验证 320px、390px、660px、768px 和 1440px，并覆盖中英文和深浅主题。
3. 文本不能依赖固定高度；长中文、英文标题和链接都必须自然换行。
4. 交互控件提供可理解的 `aria-label`，图标按钮需要有 tooltip 或可访问名称。
5. 提交前运行 `npm test` 和 `npm run build`，确保关键行为、TypeScript 检查和生产构建通过；开发中可单独运行 `npm run typecheck`。

## 验证清单

- `/`、`/about`、`/photography` 和项目详情可直接访问，导航与页脚的博客入口可打开外部 Notion。
- 浅色/深色主题切换后文字与边框仍有足够对比度。
- HTML 和 Markdown 的正文一致：桌面 16px、手机 15px，行高均为 1.75，章节标题层级保持一致。
- 深色联系弹层、项目指标、产品 Logo 和聊天输入框聚焦状态可读。
- 移动端导航可以打开、关闭并点击跳转。
- 页面没有水平滚动，正文、标签、表格和图片不发生遮挡。
- 图片请求失败时页面仍可阅读，摄影页能显示空数据状态。
- `npm test`、`npm run typecheck` 和 `npm run build` 通过。
