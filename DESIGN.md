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

`src/App.tsx` 负责路由、主题状态、全局 Header/Footer、聊天与联系浮层。博客和摄影页面采用懒加载。

## 组件职责

- `Header`：固定顶部导航、移动端菜单、语言切换、主题切换和聊天入口。
- `SiteFooter`：站内导航、项目入口和联系方式。
- `ProjectGrid` / 首页产品卡片：项目浏览与筛选。
- `ChatbotOverlay`：站内 AI 对话浮层。
- `ContactOverlay`：联系信息浮层。
- `LanguageContext`：中英文 locale 状态与翻译资源。

## 视觉系统

全局样式位于 `src/index.css`。优先使用以下 CSS 变量，不要在页面中重复定义主题颜色：

- `--page-bg`：页面背景
- `--surface`：控件或内容表面
- `--text`：主文字
- `--muted`：次要文字
- `--rule`：分隔线和边框
- `--subtle`：浅层背景
- `--accent`：焦点和强调色
- `--header-clearance`：固定 Header 下方的安全距离

默认排版使用系统无衬线字体；博客正文使用 `DM Sans` 系列回退字体。标题保持紧凑，正文优先保证可读性，中文内容通常使用约 `1.7–1.9` 行高。

## 响应式规则

- `700px` 以下进入移动端布局。
- 移动端 Header 使用圆形菜单按钮，点击展开主导航；展开状态显示标准关闭图标。
- 移动端保留“和我聊聊”入口、语言切换和主题按钮。
- 首页产品网格移动端为单列；摄影和相关内容使用双列或单列布局。
- Footer 移动端使用导航/产品双列，关于我信息独占一行并左对齐。
- 页面和媒体必须限制在视口宽度内，代码块和 Markdown 表格允许横向滚动，禁止产生页面级横向滚动。
- 新增固定 Header 下的锚点内容时，使用 `var(--header-clearance)` 作为 `scroll-margin-top`。

## 内容与数据

- 项目基础数据：`src/data/projects.ts`
- 项目详情数据：`src/data/projectDetails.ts`
- 翻译资源：`src/i18n/translations.ts`
- 摄影数据：`public/data/instagram.json`
- 博客内容：`src/content/blog/`
- 静态图片：`public/images/`

图片应使用明确的 `alt` 文本（装饰图可为空），大图使用懒加载；项目和博客详情中的媒体应保持原始比例并避免撑破容器。

## 开发约定

1. 优先复用现有组件、CSS 变量和数据层，不为单页复制一套主题规则。
2. 新增页面需要同时验证桌面端和 `430px` 左右的移动端表现。
3. 文本不能依赖固定高度；长中文、英文标题和链接都必须自然换行。
4. 交互控件提供可理解的 `aria-label`，图标按钮需要有 tooltip 或可访问名称。
5. 提交前运行 `npm run build`，确保 TypeScript 检查和 Vite 构建均通过。

## 验证清单

- `/`、`/about`、`/blog`、`/photography`、项目详情和博客详情可直接访问。
- 浅色/深色主题切换后文字与边框仍有足够对比度。
- 移动端导航可以打开、关闭并点击跳转。
- 页面没有水平滚动，正文、标签、表格和图片不发生遮挡。
- 图片请求失败时页面仍可阅读，摄影页能显示空数据状态。
- `npm run build` 通过。
