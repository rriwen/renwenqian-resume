# 项目工作指南

## 先定位，再读取

- 先读根目录 `README.md` 的任务索引；视觉改动再读 `DESIGN.md`。
- 源码集中在 `frontend/src/`、`api/`。先 `rg --files`，再按符号或 class 搜索，按需读取命中附近内容。
- 默认跳过 `node_modules/`、`dist/`、`.vercel/`、`tmp/`、`output/` 和图片/PDF；不要为了解项目而读取 `.env*` 中的真实配置，变量说明看 `.env.example`。
- 组件已按 `components/project/`、`components/about/`、`components/chat/`、`components/Lanyard/` 分域，组件样式在 `styles/components/`；先按任务选目录，再搜索函数、选择器或项目 slug。

## 结构与内容边界

- 视觉版首屏展板的 `MeshGradientBackground.tsx` 使用 Paper Shaders Mesh Gradient，配色与动画参数对齐 OceanBase DataPilot 官网首屏；配色复用 `--showcase-ice` / `--showcase-sky` / `--showcase-blue` / `--showcase-lavender`，不添加鼠标交互。Paper Shaders 许可与 NOTICE 位于 `public/licenses/paper-shaders/`，原 `Iridescence.LICENSE.md` 也保留；离屏和后台暂停、减少动态效果冻结及静态渐变回退。首屏图注隐藏，放大预览保留说明；图片无可见边框与阴影。视觉版顶部使用全站 `--page-top`。

- `App.tsx`：路由、主题和全局浮层；`PageToolbar` 在所有页面右上角提供主题按钮，仅在首页对话入口和聊天界面且存在非空历史对话时提供历史按钮；「联系我」使用圆角按钮，位于 `PageToolbar` 主题按钮右侧，侧栏、收起栏与移动抽屉不再重复展示入口；`Header` 管理侧栏开关、移动端菜单与焦点，`SiteSidebar` 提供桌面固定目录、移动端抽屉，`SidebarRail` 提供桌面收起后的图标导航与项目分类浮层，正文继续使用页面滚动；首页直接加载，About、项目详情、摄影和一些尝试按路由懒加载。`pages/` 组合页面，`components/` 按功能拆分 UI。
- `data/projects.ts`：项目清单、稳定 slug、category 与双语标签；分类和标签属于项目记录，不能按数组位置另行关联。`projectCategories` 与 `getProjectGroups` 统一分类的顺序、双语名称和分组，供侧栏使用；分类顺序为 AI 产品、数据工具、设计工程，数据工具内数据库运维平台在数据库开发工具之前。`data/projectDetails.ts`：通用双语详情，`sections` 将章节标题、正文、可选表格与配图绑定，`subsections` 保存章节内的小标题、正文、圆点列表、可选表格与配图，页面和聊天共用；章节 ID 跨语言一致；小节的 `comparisonPlaceholder` 保存前后对比配图占位，桌面左旧右新、窄屏上下排列，准备说明不进入聊天语料。`data/projects/dataPilot.ts`：DataPilot 文案、链接与配图的唯一来源，详情页与聊天共用。
- `data/projectViews.ts` 维护同一项目的独立展示入口。数据库运维视觉版 `/project/databaseops-visual` 为旧地址别名，重定向到正式地址 `/project/databaseops`，读取同一项目详情内容。`getProjectNavigationGroups` 使用项目正式地址且不再增加别名入口，展开侧栏、收起栏和移动抽屉共用；独立视图不加入 `projects` 清单，不重复进入聊天语料。`components/project/DatabaseOpsVisualCaseStudy.tsx` 按需加载并导入作用域内的 `styles/components/databaseops-visual.css`；`data/projects/databaseOpsVisual.ts` 仅保存双语展示文案、图注和素材入口，正文、表格与证据继续读取原详情。`public/images/databaseops-visual-source-setup.jpg` 为现有原型的真实截图。视觉版采用展板大图、图文并排与交互细节拆解，保留原型、步骤条 GIF 和图片全屏预览，支持深浅主题与移动端；验证指标继续区分 16.8% 与 75% 的不同用户群和时间窗口。
- `content/about/*.md`：关于页双语内容；`content/about/parseAboutContent.ts`：纯解析；`content/about.ts`：加载与缓存。每个 `##` / `###` 标题须有 `<!-- id: stable-id -->`，同文件 ID 唯一、同义条目跨语言一致；改标题或顺序保留 ID。章节 ID 固定为 `work`、`projects`、`education`、`contact`。
- DataPilot 的 POC 以海尔生产场景为主案例，围绕场景范围、指标口径、连续演示任务、业务评价与阶段交付展开，统一维护在 `data/projects/dataPilot.ts`。保留首节 `poc-validation`，新增章节使用跨语言一致的 `poc-haier-*` ID；以原生表格和四步流程图展示，表格复用 `components/project/DetailTable.tsx`，专用布局在 `DataPilotPocSection.tsx`；`table` 与 `steps` 同步进入聊天语料，不嵌入 PPT 截图。区分演示应用、验证要求与实际效果，不将页面业务指标写为设计成果。
- 关于页与项目详情的刻度导航共用 `components/SectionAnchorNav.tsx`，仅 960px 及以上展示右侧刻度，窄屏隐藏；项目的 Hash 与章节高亮由 `components/project/ProjectAnchorNav.tsx` 管理；通用目录由 `data/projectAnchors.ts` 按实际内容生成，保留双语稳定 ID。详情不展示返回和相邻项目入口；Hash 跳转、刷新和浏览器历史需保持可用，DataPilot 深链接可切换到对应内容分组；正文 tab 原地切换并更新首节 Hash，不触发滚动，刷新与浏览器前进后退仍恢复锚点定位；`ReadingPageHeader` 顶部标题出现时同步展示 `DataPilotPartMenu` 下拉菜单，支持当前项标记、键盘与点击外部关闭，切换使用目标分组首节 Hash，保留刷新及前进后退。
- `components/about/WorkEntry.tsx` 按 ID 保留特殊布局，项目卡片跟随 `oceanbase`，经历用循环展示。教育经历在工作经历与联系方式之间展示学校、专业、学历和时间，复用 Markdown 数据并加入目录；完整教育文案仍供聊天使用。
- `components/Lanyard/` 由联系弹窗打开时懒加载，展示可拖拽工牌动画，关闭时释放场景，首页不引用；加载期间由 `ContactOverlay` 显示轻量静态工牌占位，纹理就绪并完成首帧绘制后通过 `onReady` 切换至 3D，WebGL 不可用时保留静态预览；`renderContainerRef` 指定整个弹窗为画布，本地布局框仅确定初始位置与大小，不限制拖拽范围。`Lanyard.tsx` 是 React 入口，`scene.ts` 管创建与清理，`simulation.ts` 管物理；纹理、几何、材质和配置分别维护。
- 博客由外部 Notion 承载，链接保留在 `components/SiteSidebar.tsx` 但入口暂时隐藏，顶部导航也不展示；无站内博客或数据库内容接口。
- 「一些尝试」使用 `/experiments` 路由，`pages/Experiments.tsx` 按需加载，暂时仅展示标题和「内容准备中。」；原路由可直达，展开侧栏、收起图标栏与移动端抽屉均不展示入口。
- `ChatbotView.tsx` 首次打开时懒加载 `components/chat/ChatPanel.tsx`；`ChatStoreProvider.tsx` 在应用层持有唯一的会话状态及生命周期，供历史入口与聊天界面共享；`useChatThread.ts` 连接该状态与按需生成的语料，`lib/chat/chatStore.ts` 管按会话隔离的并行请求、草稿和问题队列，`conversationStorage.ts` 管版本化 localStorage 保存及旧 sessionStorage 迁移；`conversationTitle.ts` 本地归纳首条提问的主题标题，新旧记录共用，保留项目名称、消息内容和历史排序。切换会话或页面不终止生成；停止只影响当前回复并保留已显示文本；停止标记作为消息元数据持久保存，在对话流对应位置显示「已终止」，不作为消息正文发送给模型。聊天界面不展示返回按钮，仅在首页对话入口和聊天界面右上角展示 `ChatHistory.tsx`，提供查看、续聊和单条删除，删除前通过 `components/Popconfirm.tsx` 气泡二次确认，浮层使用原生顶层避免被滚动列表裁切；支持取消、Escape、点击外部关闭与焦点恢复；删除当前聊天返回首页，其他记录删除不改变当前页面，生成中的记录删除时取消请求和队列；存储删除失败保留记录，同源标签页同步删除；首次发送才进入历史，刷新不自动重发中断请求；空白对话统一返回首页，不再渲染单独欢迎页。首页输入、新建和历史选择经 `App` 以唯一 ID 的有序命令转交 `ChatPanel`；首页输入保留当前路由，消费时绑定会话且等待该会话已有回复结束，不能因懒加载、StrictMode 或重开对话重复发送。`hooks/useHashOverlay.ts` 管页内聊天 Hash 与路由同步。联系弹窗由 `App` 的页面内状态控制，开关不修改 URL、锚点或浏览器历史，保留原页面与滚动位置；由 `ContactOverlay` 管 Escape、焦点和滚动锁定。
- `lib/siteCorpus.ts` 汇总本地语料；`lib/deepseekChat.ts` → `api/chat.ts` 发送流式请求；`lib/chat/` 分离 SSE 解析、文字渐显、历史校验与消息裁剪。
- `lib/chat/interviewPrompt.ts` 是中英文系统提示词的唯一来源，由 `translations.chatbot.systemPrompt` 引用。面向产品经理或设计师面试，回复以「嗯！」开头、轻快简洁；自我介绍约 30 秒，保持短段落，主体只讲蚂蚁集团·OceanBase，之前工作一句话。B 端通用方法储备与 `siteCorpus` 个人事实分开，不能把知识当作实际经历。
- `components/chat/ChatMessageContent.tsx` 渲染 assistant Markdown，用户原文与历史保存内容保持不变。`interviewPrompt.ts` 约束回复按需加粗关键词、使用 2–4 项有序列表，仅在对比需要时使用小型表格；窄屏表格可横向滚动，自我介绍继续用约 30 秒的短段落。相关项目配图仅使用 `lib/chat/projectImages.ts` 的现有媒体清单，与 `siteCorpus` 共享；过滤占位图与 `sourceRegion` 裁剪原稿，DataPilot 仅取 `experience`，保留图注语境，不编造图片路径；原始 HTML 和外部图片不渲染。
- 首页姓名标题与简介统一来自 `i18n/translations.ts` 的 `home`，同步供聊天语料使用；输入框下的四个推荐问题为关于我、擅长领域、工作经历、项目经历，复用 `chatbot` 中的标签与提示词；点击仅回填并聚焦首页输入框，用户按 Enter 或点击发送后才经现有 `onAsk` 流程发送。
- `public/data/instagram.json` 与 `public/images/instagram/`：摄影快照；维护说明在 `docs/instagram-sync.md`。
- `index.css` 按 tokens、foundation、components、prose、responsive 顺序加载；`styles/components.css` 仅按原级联顺序导入 `styles/components/*.css`，修改时保留导入顺序。组件专属规则在对应文件，跨组件断点在 `responsive.css`。
- 聊天服务端入口保留在根目录 `api/chat.ts`，供 Vercel 部署和本地开发中间件使用。

## 修改与验证

- 设计工程 `/project/aidesignsystem` 的双语文案、配图和架构数据统一来自 `data/projects/designEngineering.ts`，由 `projectDetails.ts` 分派。背景与架构之后，正文按设计资产（`foundations`）、规则映射（`guidance`）、项目应用（`delivery`）组织；Code Connect、Skill、DESIGN.md 同属规则映射，代码交付与后续验证归入项目应用。`ProjectArchitecture.tsx` 从上到下按设计资产、规则映射、代码交付、项目应用四层呈现能力关系，使用无描边的四色色块，不展示箭头，样式在 `styles/components/project-architecture.css`；章节的 `architecture` 同时序列化进入聊天语料。`legacyIds` 保留旧 `design-highlights` / `project-gallery` / `connections` 深链接，不增加目录刻度。案例以探索设计师介入 AI 研发、稳定生成页面为主线，区分已交付内容、行业参照和后续验证，不把目标写为已量化成果。

- 项目详情正文参考链接使用 `ProjectDetailParagraphRun.href`，页面与 `siteCorpus` 同步保留链接；数据库运维平台原型地址统一来自 `DATABASE_OPS_PROTOTYPE_URL`。补充设计过程时区分设计目标、方案探索与验证结果；原始过程配图可用 `imagesDisclosure` 折叠，背景和目标表位于正文首节（`design-goals`），设计机会表通过单元格 `groups` 组织小标题和列表，`text` 由同一组内容派生供聊天读取；步骤条 GIF 通过小节的 `comparison` 并入第一个设计决策，左右对比优势与局限，窄屏堆叠，移除独立目录刻度，保留 `stepper-design` 元素 ID 兼容旧链接，以及聊天语料、动画与全屏预览。16.8% 与 75% 为不同时间窗口、不同用户群的同一种任务创建完成行为埋点统计（优化前熟练用户、优化后新用户），项目详情与关于页不可将其写成同一用户群的直接提升幅度。
- 数据库迁移漏斗数据来自 `data/projects/databaseOps.ts`，通过小节的 `funnel` 供页面与聊天共用。前两步数量 2428、858 及转化率来自原图，后两步 566、408 为估算，页面按用户要求隐藏「约」，悬停、无障碍描述与聊天语料保留估算口径。`ProjectFunnel.tsx` 提供阶段选择，`FunnelGraphic.tsx` 使用四层实色 SVG 漏斗，层顶部宽度与数量成比例，选中阶段使用低饱和灰蓝强调色；右侧信息占约三分之一，35.34% 与底部总结的 16.8% 标红。保留键盘选择、滚入动画、减少动效与响应式布局；模板演进与来源见 `docs/databaseops-chart.md`。

- 当前会话记忆与余量统一由 `lib/chat/context.ts` 管理：应用预算 64,000 token（含 2,048 回复预留）、500,000 字节请求上限；保留完整问答轮次，超限移出最早轮次但不删除本地历史，最新一轮过长时不发送。`ContextMeter.tsx` 位于聊天发送按钮左侧，计入站点资料、当前会话和草稿，明确标注估算；前端发送、余量展示和服务端校验共用预算，不恢复固定 99 条截断。

- 界面固定中文，移除语言切换能力并忽略旧语言偏好；原有双语数据继续保留。保留深浅主题和响应式布局；首次访问默认亮色，已有主题偏好继续生效，主题在首屏绘制前初始化。复用现有 CSS 变量。
- 关于我 / Resume 入口保持 `/about` 路由；侧栏宽度 256px，桌面收起后保留 72px 图标栏，栏顶默认显示 4x，悬停或键盘聚焦切换展开图标，AI 产品与数据工具分为两个独立图标入口，悬停或点击仅展示各自分类的项目，一级菜单使用圆角线性图标；「新对话 / New chat」使用无内部横线的空心对话气泡图标，关于我文档图标同样移除内部横线并保留折角，主导航与收起栏共用；新对话创建空白会话并返回首页 `/`，保留其他会话与后台响应；站点标志继续返回 `/`；900px 及以下改为抽屉，包含焦点管理、Escape / 遮罩关闭与滚动锁定。首页保留简介、输入框与推荐问题，不展示项目列表或加载 3D 工牌，按一屏可用高度和右侧容器宽度适配；首页响应式样式集中在 `styles/components/home.css`；项目入口集中在侧栏；推荐问题使用描边胶囊按钮、无悬停箭头，移动端以 12px 字号横向单行排列，超出后可横向滚动、中文简介较小字号单行，菜单旁显示 DESIGN.4x 首页链接，侧栏品牌 x 同为小写；全站不展示页脚；原有简介翻译语料继续供聊天使用。
- 清理前核实静态导入、动态导入、`import.meta.glob`、数据引用；公共资源可能被外部链接引用，不能只按本地文本搜索结果删除。
- 现有 `Lanyard/LICENSE.md` 是组件许可证，保留。
- `npm test` 运行 `tests/*.test.ts`，覆盖内容标识、双语数据与聊天流等关键行为；现有 Vite 运行器支持 TS/TSX 和原始 Markdown，无需额外测试依赖。
- `npm run typecheck` 检查前端、聊天 API 和 Vite 配置；`npm run build` 同时完成检查与生产构建。内容来源、解析或交互逻辑变更后运行测试与构建，界面变更还需浏览器验证。
- `npm run dev` 的聊天接口在本地执行。`npm run preview` 不启动 API。接口验证使用 `npm run dev:full`（需要 Vercel CLI）。
- `DEEPSEEK_API_KEY` 仅供服务端使用，不要把密钥放入 `VITE_*` 或客户端代码。
- 调整目录、命令或内容来源时，同步更新 `README.md` 的索引与本指南。

- 设计工程化为直接进入 `/project/aidesignsystem` 的一级导航，不显示二级菜单；桌面、移动端抽屉和收起侧栏保持一致。展开侧栏与移动端抽屉中，AI 产品使用线性四芒星图标，数据工具使用简洁终端图标（>_），设计工程化使用颜料盘图标；收起侧栏的 AI 产品与数据工具分别使用四芒星与终端图标，设计工程化继续作为独立的颜料盘图标入口。图标保持 18px 画布、24 × 24 viewBox 和 1.7 线宽的圆角线性风格。原 Design Token、Skills、DESIGN.md 路由与内容保留，但不再作为导航菜单展示。

- 项目导航使用 `navigationTitle` 覆盖菜单名称（AI 智能问数），`hiddenFromNavigation` 隐藏入口但保留详情路由（Agent 记忆插件）。Text2SQL（`/project/text2sql`）依据早期交互稿整理双语案例，内容保存在 `projectDetails.ts`，原稿 `public/images/text2sql-interaction-design.png` 默认折叠；项目已上线，个人职责为产品界面设计，原稿标注「待定」的结果审阅与异常反馈仍按方案探索描述，不推断最终落地或效果指标。任务流编辑器（`/project/workflow-editor`）依据原始设计文章整理双语案例，内容同样保存在 `projectDetails.ts`，原文配图默认折叠。
- Text2SQL 交互原型位于 `/prototype/text2sql`，由 `pages/SqlEditorPrototype.tsx` 按需加载，`components/sql-prototype/model.ts` 管本地模拟逻辑，页面导入作用域内的 `styles/components/sql-prototype.css`；详情页通过 `demoUrl` 提供入口，独立于作品集 Header、侧栏、聊天与联系浮层，保留应用层 `ChatStoreProvider` 生命周期。AI 回复与 SQL 执行均为本地模拟，不连接真实数据库；按原截图默认浅色，原型暗色切换不修改站点偏好。原稿「待定」的结果审阅和异常状态仅用于交互演示，不回写为历史上线事实或效果指标。


- Text2SQL 概述通过 `overviewPrototype` 嵌入本地原型；`PrototypePreview` 的可选 `viewportWidth` 使用 ResizeObserver 等比缩放桌面画布。原型 `?embed=1` 隐藏内部返回链接，避免 iframe 嵌套作品集。

数据库运维视觉版的全部配图展板复用 `MeshGradientBackground`。配色取自 OceanBase DataPilot「从问数到报告」四个面板（实际为冰蓝与紫粉两套交替），按素材路径稳定打散分配；`ProjectGallery.imageFrame` 仅在视觉版启用，原版布局不变。图注位于展板外，首屏继续隐藏图注。

- 数据库运维平台仅展示当前视觉版本，导航以「数据库运维平台」指向 `/project/databaseops`；旧 `/project/databaseops-visual` 重定向到正式地址并保留查询参数和 Hash，不再展示原版布局及阅读原版入口。原始项目数据继续供当前版与聊天共用。

- 项目详情统一参考数据库运维平台的阅读呈现；`CaseStudyMedia.tsx` 提供渐变展板、原图预览和明确配图占位，`styles/components/case-study.css` 作用于通用详情与 DataPilot。首屏按标题、简介、标签、主图排列；正文沿用原章节 ID、事实与双语数据，过程材料使用折叠卡片，外部原型使用胶囊链接按钮。Text2SQL 保留首屏本地原型；不为缺图编造截图或成果。

## 发布快捷指令

- 用户发送 `/deploy` 时，读取 `/Users/rriwen/.codex/skills/deploy/SKILL.md` 并执行：验证当前修改、提交并推送 GitHub、部署 Vercel 生产环境、确认 Ready 后报告链接。该指令即本次发布请求。

## PDF 简历与网站下载同步

- `output/pdf/任文倩_产品设计师简历.pdf` 是 PDF 简历的唯一发布源。每次修改或重新生成此文件，必须在同一任务中同步覆盖 `frontend/public/任文倩_产品设计师简历.pdf` 和兼容旧链接的 `frontend/public/任文倩的简历_AI产品设计师.pdf`，不允许网站附件与源文件版本分离。
- 同步更新 `frontend/src/components/about/ResumeDownload.tsx` 下载链接的 `v` 参数为源 PDF 的 SHA-256 前 12 位，避免沿用旧缓存；下载文件名保持不变。
- 交付前核对三个 PDF 的 SHA-256 完全一致，并检查源 PDF 的分页与渲染。部署后从网站下载入口获取附件，与源文件逐字节比对。
- 本规则要求同步本地网站附件，不自动授权每次修改后发布生产环境；未部署时明确说明网站源附件已同步、线上待部署。用户要求部署时按部署技能执行。


DataPilot 产品体验正文以多轮对话、人机交互和智能体回放孵化为主线，正文以客户或用户问题举例，不展示客户名称，交互方案与验证结果保持区分；保留原章节 ID 与 POC、海外探索分组。`data/projects/dataPilot.ts` 的 `designPlaceholder` 保存七组待补设计稿说明，仅在页面展示，不进入聊天事实或媒体清单；首屏简介同样由该文件维护。产品体验正文仅显示 `title` 章节标题，不展示 `intro` 副标题。

DataPilot 的 `product-evolution` 章节说明问数、应用生成、与应用持续对话三个阶段，分别对应现有问数示意、画布探索、三栏布局；画布阶段保留设计稿占位与配图说明，其他阶段使用已有截图。

DataPilot「背景目标」复用数据库运维平台的布局方式：背景正文下以分割线衔接目标用户、产品目标、衡量标准三列信息，窄屏单列。

- AI 问数产品演进通过 `DataPilotEvolution.tsx` 展示三阶段手动切换，左侧阶段说明、右侧截图；无自动轮播，支持方向键。素材来自 `dataPilot.ts` 的 `evolutionMedia`，缺失画布截图保留配图说明，真实截图同步供聊天使用。

- AI 问数体验正文通过 `DataPilotSection.group` 归为「持续对话体验」与「Agent 问题排查」，子节保留原 ID 与深链接；目录仅显示分组，聊天语料保留分组和子节层级。背景目标、产品演进、验证结果继续独立展示。

- AI 问数验证结果由 `DataPilotResults.tsx` 以并排大数字与比例图展示，数据来自 `dataPilot.ts` 的 `adoptionResult`，保留发布应用数 / 创建应用数口径。导航分类显示「平台工具」，稳定分类 ID 仍为 `data-tools`。

- 聊天的 AI 问数语料读取当前展示的首屏 lead 与正文分组，不再导入已隐藏的 paragraphs / metadata；仅保留真实配图说明，排除配图占位。回答以最新站点资料为准，项目详情中的状态、指标及统计口径优先于历史回答，规则维护在 `lib/chat/interviewPrompt.ts`。
