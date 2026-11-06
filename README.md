# DESIGN.4X

个人设计师作品集，包含项目案例、个人经历、摄影和 AI 对话；外部 Notion 博客入口暂时隐藏。技术栈：React 18、TypeScript、Vite、React Router、Three.js；聊天 API 部署在 Vercel，无数据库依赖。

## 开发与检查

在仓库根目录运行：

```bash
npm ci
cp .env.example .env.local # 首次配置；已有配置时保留原文件
npm run dev
```

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | Vite 开发服务；聊天接口在本地执行 |
| `npm run dev:full` | 使用另行安装的 Vercel CLI 启动前端与本地 Serverless API |
| `npm test` | 验证双语内容、稳定 ID、项目映射及聊天流解析等关键行为 |
| `npm run typecheck` | 检查前端、聊天 API 和 Vite 配置 |
| `npm run build` | 类型检查并构建到 `dist/` |
| `npm run preview` | 预览构建产物；不启动 Serverless API |

环境变量模板见 [`.env.example`](.env.example)。`DEEPSEEK_API_KEY` 只由服务端读取，用于 AI 对话。

测试运行器使用独立的 `node_modules/.vite-tests/` 缓存，可在开发服务运行时执行 `npm test`，避免覆盖开发页面正在使用的依赖缓存。

## 按任务定位代码

| 要修改的内容 | 入口 |
| --- | --- |
| 页面路由、按需加载、全局主题与浮层 | [`frontend/src/App.tsx`](frontend/src/App.tsx) |
| React 挂载、统计、样式入口 | [`frontend/src/main.tsx`](frontend/src/main.tsx)、[`frontend/src/index.css`](frontend/src/index.css) |
| 首页介绍、推荐问题与提问输入框 | [`frontend/src/pages/Home.tsx`](frontend/src/pages/Home.tsx)；首页文案读取 `translations.home`，推荐问题复用 `translations.chatbot`；点击推荐问题仅回填并聚焦输入框，Enter / 发送后在当前内容区展开聊天，Shift+Enter 换行，⌘K / Ctrl+K 聚焦；发送按钮位于输入框右下角 |
| 联系弹窗的 3D 工牌组件（首页不加载） | [`Lanyard.tsx`](frontend/src/components/Lanyard/Lanyard.tsx) 为 React 入口，由 `ContactOverlay` 打开时懒加载；通过 `renderContainerRef` 将整个弹窗作为画布，本地布局框仅确定工牌初始位置与大小；同目录 `scene.ts` 管生命周期、扩展画布和拖拽命中区域，`simulation.ts` 管物理，`textures.ts` 管纹理；保留许可证 |
| 项目名称、slug、分类、封面、顺序、双语标签 | [`frontend/src/data/projects.ts`](frontend/src/data/projects.ts) |
| 通用项目详情文案、图文章节和画廊 | [`frontend/src/data/projectDetails.ts`](frontend/src/data/projectDetails.ts)；`sections` 将章节标题、正文、可选表格与配图绑定，`subsections` 保存章节内的小标题、正文、圆点列表、可选表格与配图，页面和聊天共用 |
| DataPilot 文案、链接、配图 | [`frontend/src/data/projects/dataPilot.ts`](frontend/src/data/projects/dataPilot.ts)，页面与聊天共用 |
| 设计工程案例与分层架构图 | [`frontend/src/data/projects/designEngineering.ts`](frontend/src/data/projects/designEngineering.ts) 保存双语文案与架构数据，正文按设计资产、规则映射、项目应用组织，页面和聊天共用；[`ProjectArchitecture.tsx`](frontend/src/components/project/ProjectArchitecture.tsx) 与 [`project-architecture.css`](frontend/src/styles/components/project-architecture.css) 绘制四层架构，保留旧 `design-highlights` / `project-gallery` / `connections` 深链接 |
| 项目详情布局 | [`ProjectDetail.tsx`](frontend/src/pages/ProjectDetail.tsx) 分派；[`components/project/`](frontend/src/components/project/) 包含通用详情、DataPilot、画廊、图片查看器和共用锚点导航 |
| Text2SQL 交互原型 | [`SqlEditorPrototype.tsx`](frontend/src/pages/SqlEditorPrototype.tsx)，独立路由 `/prototype/text2sql`；[`components/sql-prototype/model.ts`](frontend/src/components/sql-prototype/model.ts) 管本地模拟逻辑，页面按需导入 [`styles/components/sql-prototype.css`](frontend/src/styles/components/sql-prototype.css)；在 Text2SQL 概述下方以 1280×720 画布等比嵌入预览（`?embed=1` 隐藏内部返回入口），也支持独立打开，按原稿还原编辑器内 AI 流程；AI 回复与 SQL 执行均为本地模拟，不访问真实数据库 |
| 数据库迁移交互漏斗 | [`data/projects/databaseOps.ts`](frontend/src/data/projects/databaseOps.ts) 保存双语数据与估算标记；[`ProjectFunnel.tsx`](frontend/src/components/project/ProjectFunnel.tsx) 提供阶段选择和数据说明，[`FunnelGraphic.tsx`](frontend/src/components/project/FunnelGraphic.tsx) 基于 Lieflat L13 模板绘制 SVG；支持阶段选择、滚入动画、减少动效、深浅主题与响应式布局；缩小数量、突出各步转化率；选型和来源见 [`docs/databaseops-chart.md`](docs/databaseops-chart.md) |
| 关于页与项目页滚动页头 | [`ReadingPageHeader.tsx`](frontend/src/components/ReadingPageHeader.tsx) 观察原始 h1，标题滚出视口后显示顶部吸附页头，DataPilot 的 `DataPilotPartMenu.tsx` 下拉菜单与顶部标题同时出现和隐藏；样式位于 `styles/components/page-header.css`，不改变正文布局或锚点位置 |
| 关于页与项目页锚点组件 | [`SectionAnchorNav.tsx`](frontend/src/components/SectionAnchorNav.tsx) 统一刻度、提示与焦点状态；项目的 Hash 和章节高亮由 `ProjectAnchorNav` 管理 |
| 关于页文案与解析 | [`content/about/*.md`](frontend/src/content/about/)、[`parseAboutContent.ts`](frontend/src/content/about/parseAboutContent.ts)；[`content/about.ts`](frontend/src/content/about.ts) 负责加载与缓存 |
| 关于页布局与时间线 | [`About.tsx`](frontend/src/pages/About.tsx) 组合 [`components/about/`](frontend/src/components/about/) 中的经历、项目卡片与时间线 |
| 外部 Notion 博客入口 | [`SiteSidebar.tsx`](frontend/src/components/SiteSidebar.tsx) 保留链接，入口暂时隐藏 |
| 一些尝试占位页 | [`frontend/src/pages/Experiments.tsx`](frontend/src/pages/Experiments.tsx)，路由 `/experiments` 可直达；展开侧栏、收起图标栏与移动端抽屉均不展示入口 |
| 摄影内容 | [`frontend/src/pages/Photography.tsx`](frontend/src/pages/Photography.tsx)、[`frontend/public/data/instagram.json`](frontend/public/data/instagram.json) |
| 分组侧栏与移动端抽屉 | [`SiteSidebar.tsx`](frontend/src/components/SiteSidebar.tsx)；[`SidebarRail.tsx`](frontend/src/components/SidebarRail.tsx) 提供收起后的图标导航与项目分类浮层；[`Header.tsx`](frontend/src/components/Header.tsx) 管理导航开关与焦点；「摄影记录」下方提供带文字的「联系我」菜单，与前一项额外间隔 16px；收起侧栏时使用对应图标入口，移动端抽屉保持相同顺序；[`PageToolbar.tsx`](frontend/src/components/PageToolbar.tsx) 在所有页面右上角提供主题按钮，仅在首页对话入口及聊天界面且存在非空历史对话时展示历史按钮，使用无边框图标 |
| 导航、联系浮层、图标 | [`frontend/src/components/`](frontend/src/components/) |
| AI 聊天界面与会话 | [`ChatbotView.tsx`](frontend/src/components/ChatbotView.tsx) 按需加载 [`ChatPanel.tsx`](frontend/src/components/chat/ChatPanel.tsx)；[`ChatStoreProvider.tsx`](frontend/src/components/chat/ChatStoreProvider.tsx) 在应用层维持共享会话状态，首页对话入口和聊天界面右上角的 [`ChatHistory.tsx`](frontend/src/components/chat/ChatHistory.tsx) 可查看、继续和删除历史；[`useChatThread.ts`](frontend/src/components/chat/useChatThread.ts) 为聊天界面连接状态与按需生成的语料；对话内容最大 720px，输入框与首页共用 [`composer.css`](frontend/src/styles/components/composer.css) |
| 聊天语料、传输与工具 | [`siteCorpus.ts`](frontend/src/lib/siteCorpus.ts) / [`deepseekChat.ts`](frontend/src/lib/deepseekChat.ts) → [`api/chat.ts`](api/chat.ts)；[`lib/chat/`](frontend/src/lib/chat/) 管 SSE 解析、文字渐显和历史校验；`chatStore.ts` 管多会话并行请求与命令队列，`conversationStorage.ts` 管本地保存与旧记录迁移，`conversationTitle.ts` 将首条问题归纳为简短主题（保留项目身份，未知主题精简提问原文） |
| 聊天系统提示词与面试回答 | [`interviewPrompt.ts`](frontend/src/lib/chat/interviewPrompt.ts) 为中英文系统提示词唯一来源，由 `translations.chatbot.systemPrompt` 引用；面向产品经理或设计师面试，回复以「嗯！」开头、轻快简洁；自我介绍约 30 秒，保持短段落，主体只讲蚂蚁集团·OceanBase，之前工作一句话；B 端通用方法储备与 `siteCorpus` 个人事实分开，不将知识当作实际经历 |
| 聊天 Markdown 与项目配图 | [`ChatMessageContent.tsx`](frontend/src/components/chat/ChatMessageContent.tsx) 渲染 assistant Markdown，保留用户原文及历史内容；[`projectImages.ts`](frontend/src/lib/chat/projectImages.ts) 提供与 `siteCorpus` 共享的现有配图清单，过滤占位与需裁剪的原稿，DataPilot 仅取 `experience`；原始 HTML 与外部图片不渲染 |
| 当前会话记忆与上下文余量 | [`lib/chat/context.ts`](frontend/src/lib/chat/context.ts) 统一预算、估算和完整轮次选择；[`ContextMeter.tsx`](frontend/src/components/chat/ContextMeter.tsx) 在发送按钮旁展示余量，样式位于 `styles/components/chatbot.css` |
| 气泡二次确认 | [`Popconfirm.tsx`](frontend/src/components/Popconfirm.tsx) 提供锚点定位、屏幕边缘避让及键盘交互，供历史对话删除使用；样式位于 `styles/components/popconfirm.css` |
| 页内聊天的 Hash 状态与路由同步 | [`frontend/src/hooks/useHashOverlay.ts`](frontend/src/hooks/useHashOverlay.ts) |
| 公共文案与固定中文界面 | [`frontend/src/i18n/translations.ts`](frontend/src/i18n/translations.ts)、[`LanguageContext.tsx`](frontend/src/i18n/LanguageContext.tsx)；界面固定使用中文，不再读取或提供语言切换，原有双语内容数据继续保留 |
| 样式与响应式 | [`styles/components.css`](frontend/src/styles/components.css) 按序导入 [`styles/components/`](frontend/src/styles/components/) 中的各页面/组件样式；跨组件断点在 `styles/responsive.css` |
| 开发服务、本地聊天接口、打包 | [`frontend/vite.config.ts`](frontend/vite.config.ts) |
| 线上 API 入口与部署 | [`api/`](api/)、[`vercel.json`](vercel.json) |
| 内容与交互回归测试 | [`tests/`](tests/)，运行器 [`scripts/test.mjs`](scripts/test.mjs) 使用 Vite 转换 TS/TSX 与 Markdown |

## 内容来源

- 当前会话的追问携带问答历史与站点资料，刷新后继续沿用该会话内容；不同会话的记忆独立。[`lib/chat/context.ts`](frontend/src/lib/chat/context.ts) 为前后端共用的预算与完整轮次选择逻辑，使用应用侧 64,000 token 预算（含 2,048 token 回复预留）与 500,000 字节请求上限，不再固定截取 99 条消息。超出容量的早期消息仍留在本地历史，但不参与当前回复；最新一轮过长时阻止请求。聊天发送按钮左侧的 [`ContextMeter.tsx`](frontend/src/components/chat/ContextMeter.tsx) 显示估算余量，计入站点资料、历史和草稿，支持悬停、聚焦或点击查看说明。这是应用预算与本地估算，不是模型标称窗口或服务商账单用量。

- 项目分类与标签来自同一条 `projects.ts` 记录，调整顺序不会错配分类或标签。`projectCategories` 定义 AI 产品、数据工具、设计工程的稳定 ID、顺序和双语名称；`getProjectGroups` 为侧栏提供统一分组。通用详情读取 `projectDetails.ts`；`dataagent` 的 DataPilot 案例统一读取 `data/projects/dataPilot.ts`，不要在页面或聊天语料中另写一份文案。
- Text2SQL 原型 `/prototype/text2sql` 按需加载，使用独立产品界面，不展示作品集导航、聊天或联系浮层；应用层会话 Provider 保持存续。原型默认按截图使用浅色，暗色切换仅作用于原型，不修改站点主题偏好。AI 回复和 SQL 执行均为本地演示；原稿中标注「待定」的结果审阅、异常反馈在原型中可体验，不作为当年最终上线或效果的证据。
- 数据库运维平台的诊断记录、设计策略、步骤条 GIF 与原型测试说明统一维护在 `projectDetails.ts`；正文片段的 `href` 同时供页面链接与聊天语料使用，原型地址由 `DATABASE_OPS_PROTOTYPE_URL` 统一定义。创建流程内嵌原型由小节 `prototypeEmbed` 定义，使用 16:9 iframe；Axure 链接参数 `c=1&sc=1` 默认隐藏播放器顶栏并按宽度缩放；`PrototypePreview.tsx` 在鼠标停留 2 秒后启用交互，光标旁显示倒计时，移出后重置；触屏点击与键盘 Enter 可直接启用。原始过程配图可通过 `imagesDisclosure` 折叠，沿用画廊与全屏预览；背景和目标表位于正文首节（`design-goals`），设计机会表以分组标题和列表还原策略内容；步骤条探索通过小节的 `comparison` 嵌入第一个设计决策，桌面左右对照、窄屏上下排列，步骤条不设独立目录刻度，保留 `stepper-design` 元素 ID 兼容旧链接。优化后的三步流程统一为「连接数据源 → 设置迁移类型 → 选择迁移对象」，对象选择分为穿梭框勾选、白屏规则配置和文件导入。小节的 `comparisonPlaceholder` 提供左旧右新、窄屏上下排列的配图占位，配图准备说明不进入聊天语料。16.8% 与 75% 均为埋点统计的任务创建完成率，分别对应优化前熟练用户、优化后新用户，时间窗口与用户群不同，不表述为直接提升幅度；关于页保持同一口径。
- 关于页读取中英文 Markdown，所有 `##` 章节和 `###` 条目都用隐藏注释声明稳定 ID：

  ```md
  ## 核心工作经历 <!-- id: work -->
  ### 高级体验设计师 <!-- id: oceanbase -->
  ```

  章节 ID 为 `work`、`projects`、`education`、`contact`；条目 ID 在同一文件中唯一，同义条目跨语言保持一致，改标题或顺序时保留 ID。新增工作条目会自动展示，项目卡片跟随 `oceanbase` 条目；教育经历在工作经历与联系方式之间展示学校、专业、学历和时间，完整教育数据继续供聊天使用。重复或缺失 ID 会报错。
- 博客由外部 Notion 承载，侧栏保留链接但暂时隐藏入口；顶部导航不展示博客入口，项目不再提供站内博客页面。
- 聊天语料由本地项目、About 与翻译资源汇总，见 `buildSiteCorpus`。首次打开聊天时加载 `ChatPanel` 并生成当前语言语料；通过侧栏或站点标志离开聊天后保留会话和进行中的流式响应。首页提问、新建和历史选择操作由 `App` 按有序命令转交并消费一次；问题绑定所属会话，已有回复进行中时排队等待。不同会话可以并行生成，停止按钮只影响当前会话并保留已显示文本。聊天界面不展示返回按钮，历史入口仅在首页对话入口与聊天界面且存在非空历史对话时于右上角展示，列表支持查看、续聊和单条删除，删除前通过锚定移除按钮的 `Popconfirm` 气泡确认；删除当前聊天后返回首页，删除其他记录保留当前页面和对话，删除生成中的记录会取消其请求及队列。删除失败保留原记录供重试，同源标签页通过存储事件同步删除。历史按会话保存在版本化 `localStorage` 中，流式内容每 500ms 最多保存一次，结束、停止或离开页面立即保存；首次发送才进入历史。标题通过本地规则将首条提问归纳为主题，已有记录读取时同样归纳，不额外请求模型、不修改消息内容或历史排序。旧 `sessionStorage` 单会话成功迁移后移除旧副本，刷新恢复内容但不自动重发中断请求；存储失败时保留内存聊天并提示未保存。
- 联系弹窗由 `App` 的页面内状态控制，打开和关闭均不修改 URL 或浏览器历史，保留原页面的锚点、聊天状态和滚动位置；支持确认按钮、遮罩与 Escape 关闭，实际切换路由后自动关闭。
- 摄影读取本地 JSON 快照和图片；维护流程见 [`docs/instagram-sync.md`](docs/instagram-sync.md)。

网站固定使用中文，不再提供中英文切换，忽略旧语言偏好；首次访问默认暗色，手动选择的主题在本地保存，刷新后沿用。主题在首屏绘制前初始化。桌面端（>900px）使用 256px 可收起的固定分组侧栏，收起后保留 72px 图标栏，顶部默认显示 4x，悬停或键盘聚焦切换展开图标，可重新展开；项目合并为单个图标，悬停或点击展示分类与项目名称，其他图标显示菜单名；900px 及以下使用带焦点管理的导航抽屉。右侧正文使用页面滚动，布局按可用内容宽度适配；侧栏列出全部六个项目，全站不再展示页脚。关于我 / Resume 入口继续使用 `/about`，保留原有内容及章节 ID。侧栏「新对话 / New chat」创建空白会话并返回首页 `/`，不终止其他会话；DESIGN.4x 返回首页 `/`。一级导航使用 圆角线性图标，分类内项目不重复添加图标。

所有项目详情采用 AI 智能问数的阅读结构：顶部项目概述、图文内容章节、共用 `ProjectAnchorNav`；不展示返回或相邻项目导航。通用项目锚点由 `data/projectAnchors.ts` 根据已有内容生成，保留已有章节 ID；支持带 Hash 的直达链接、刷新、前进后退和当前章节高亮。960px 以上复用关于页的 `SectionAnchorNav` 右侧刻度、位置和间距；取消竖向分割线、缩小刻度间距并上移，悬停或键盘聚焦放大刻度，960px 以下隐藏锚点导航。

首页展示个人介绍、提问输入框与推荐问题，按可用高度布局，短屏自然滚动，不展示或加载 3D 工牌；项目入口集中在侧栏，首页不展示项目列表。推荐问题使用带边框的胶囊按钮，不展示悬停箭头；移动端以 12px 字号横向单行排列，超出后可横向滚动，中文简介以较小字号保持单行，菜单按钮右侧显示 DESIGN.4x 首页链接。首页直接加载；About（关于我）、项目详情、摄影和一些尝试按路由懒加载。样式始终按 tokens → foundation → components → prose → responsive 顺序加载，拆分组件样式时保留 `components.css` 的导入顺序。

## 快速搜索

先按上表缩小范围，再搜索符号或 class，避免一次性读取大型页面、样式文件或图片目录：

```bash
rg --files frontend/src api tests
rg -n 'getDataPilotContent|DATA_PILOT_DEMO_URL' frontend/src/data/projects frontend/src/components/project
rg -n 'home-hero' frontend/src/pages/Home.tsx frontend/src/styles/components/home.css
rg -n 'buildSiteCorpus|sendDeepseekChatStream' frontend/src/lib api
```

`dist/`、`node_modules/`、`.vercel/` 和 `tmp/` 已被 Git 忽略。`output/` 保存独立交付物；它与 `frontend/public/` 中的同名文件不一定相同，不用于代码检索。删除图片前还需检查 Markdown、JSON、动态路径及外部链接的引用。

视觉规范见 [`DESIGN.md`](DESIGN.md)。修改后运行 `npm test` 和 `npm run build`；开发中可单独运行 `npm run typecheck`。涉及界面时再检查相关页面的中文、深浅主题和移动端表现。


保留的 DeepSeek 标志素材（当前界面不展示）使用[官方品牌素材 ICON.svg](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/_logo%20svg/ICON.svg)，保存在 `frontend/public/images/deepseek-logo.svg`；[品牌素材使用规范](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/_logo%20svg/guidelines.md)。

- 设计工程为直接进入 `/project/aidesignsystem` 的一级导航，不显示二级菜单；桌面、移动端抽屉和收起侧栏保持一致。原 Design Token、Skills、DESIGN.md 路由与内容保留，但不再作为导航菜单展示。

- 项目导航使用 `navigationTitle` 覆盖菜单名称（AI 智能问数），`hiddenFromNavigation` 隐藏入口但保留详情路由（Agent 记忆插件）。Text2SQL（`/project/text2sql`）依据早期交互稿整理双语案例，内容保存在 `projectDetails.ts`，原稿 `public/images/text2sql-interaction-design.png` 默认折叠；项目已上线，个人职责为产品界面设计，原稿标注「待定」的结果审阅与异常反馈仍按方案探索描述，不推断最终落地或效果指标。任务流编辑器（`/project/workflow-editor`）依据原始设计文章整理双语案例，内容同样保存在 `projectDetails.ts`，原文配图默认折叠。

