# 项目工作指南

设计工程正文最新章节顺序：项目背景、Design Token、Design.md、代码映射、CLI工具、项目应用。设计知识与 Skill 归入 Design.md，组件实现归入代码映射，项目应用仅保留实际案例；保留旧深链接，首屏五层架构不随正文重组改变。

## 文案语言偏好

- 后续文案修改只更新中文，不再同步修改英文。全站英文翻译数据已移除，仅维护中文内容；保留产品名、代码标识、外部链接和许可证中的英文。

## 先定位，再读取

- 先读根目录 `README.md` 的任务索引；视觉改动再读 `DESIGN.md`。
- 源码集中在 `frontend/src/`、`api/`。先 `rg --files`，再按符号或 class 搜索，按需读取命中附近内容。
- 默认跳过 `node_modules/`、`dist/`、`.vercel/`、`tmp/`、`output/` 和图片/PDF；不要为了解项目而读取 `.env*` 中的真实配置，变量说明看 `.env.example`。
- 组件已按 `components/project/`、`components/about/`、`components/chat/`、`components/Lanyard/` 分域，组件样式在 `styles/components/`；先按任务选目录，再搜索函数、选择器或项目 slug。

## 结构与内容边界

- 视觉版首屏展板的 `MeshGradientBackground.tsx` 使用 Paper Shaders Mesh Gradient，配色与动画参数对齐 OceanBase DataPilot 官网首屏；配色复用 `--showcase-ice` / `--showcase-sky` / `--showcase-blue` / `--showcase-lavender`，不添加鼠标交互。Paper Shaders 许可与 NOTICE 位于 `public/licenses/paper-shaders/`，原 `Iridescence.LICENSE.md` 也保留；离屏和后台暂停、减少动态效果冻结及静态渐变回退。首屏图注隐藏，放大预览保留说明；图片无可见边框与阴影。视觉版顶部使用全站 `--page-top`。

- `App.tsx`：路由、主题和全局浮层；`PageToolbar` 在所有页面右上角提供主题按钮，仅在首页对话入口和聊天界面且存在非空历史对话时提供历史按钮；「联系我」使用圆角按钮，位于 `PageToolbar` 主题按钮右侧，侧栏、收起栏与移动抽屉不再重复展示入口；`Header` 管理侧栏开关、移动端菜单与焦点，`SiteSidebar` 提供桌面固定目录、移动端抽屉，`SidebarRail` 提供桌面收起后的图标导航与项目分类浮层，正文继续使用页面滚动；首页直接加载，About、项目详情、摄影和一些尝试按路由懒加载。`pages/` 组合页面，`components/` 按功能拆分 UI。
- `data/projects.ts`：项目清单、稳定 slug、category 与中文标签；分类和标签属于项目记录，不能按数组位置另行关联。`projectCategories` 与 `getProjectGroups` 统一分类的顺序、中文名称和分组，供侧栏使用；分类顺序为 AI 产品、数据工具、设计工程，数据工具内数据库运维平台在数据库开发工具之前。`data/projectDetails.ts`：通用中文详情，`sections` 将章节标题、正文、可选表格与配图绑定，`subsections` 保存章节内的小标题、正文、圆点列表、可选表格与配图，页面和聊天共用；章节 ID 稳定一致；小节的 `comparisonPlaceholder` 保存前后对比配图占位，桌面左旧右新、窄屏上下排列，准备说明不进入聊天语料。`data/projects/dataPilot.ts`：DataPilot 文案、链接与配图的唯一来源，详情页与聊天共用。
- `data/projectViews.ts` 维护同一项目的独立展示入口。数据库运维视觉版 `/project/databaseops-visual` 为旧地址别名，重定向到正式地址 `/project/databaseops`，读取同一项目详情内容。`getProjectNavigationGroups` 使用项目正式地址且不再增加别名入口，展开侧栏、收起栏和移动抽屉共用；独立视图不加入 `projects` 清单，不重复进入聊天语料。`components/project/DatabaseOpsVisualCaseStudy.tsx` 按需加载并导入作用域内的 `styles/components/databaseops-visual.css`；`data/projects/databaseOpsVisual.ts` 仅保存中文展示文案、图注和素材入口，正文、表格与证据继续读取原详情。`public/images/databaseops-visual-source-setup.jpg` 为现有原型的真实截图。视觉版采用展板大图、图文并排与交互细节拆解，保留原型、步骤条 GIF 和图片全屏预览，支持深浅主题与移动端；验证指标继续区分 16.8% 与 75% 的不同用户群和时间窗口。
- `content/about/zh.md`：关于页中文内容；`content/about/parseAboutContent.ts`：纯解析；`content/about.ts`：加载与缓存。每个 `##` / `###` 标题须有 `<!-- id: stable-id -->`，同文件 ID 唯一、同义条目稳定一致；改标题或顺序保留 ID。章节 ID 固定为 `work`、`projects`、`education`、`contact`。
- DataPilot 的 POC 以海尔生产场景为主案例，围绕场景范围、指标口径、连续演示任务、业务评价与阶段交付展开，统一维护在 `data/projects/dataPilot.ts`。保留首节 `poc-validation`，新增章节使用稳定一致的 `poc-haier-*` ID；以原生表格和四步流程图展示，表格复用 `components/project/DetailTable.tsx`，专用布局在 `DataPilotPocSection.tsx`；`table` 与 `steps` 同步进入聊天语料，不嵌入 PPT 截图。区分演示应用、验证要求与实际效果，不将页面业务指标写为设计成果。
- 关于页与项目详情的刻度导航共用 `components/SectionAnchorNav.tsx`，仅 960px 及以上展示右侧刻度，窄屏隐藏；项目的 Hash 与章节高亮由 `components/project/ProjectAnchorNav.tsx` 管理；通用目录由 `data/projectAnchors.ts` 按实际内容生成，保留中文稳定 ID。详情不展示返回和相邻项目入口；Hash 跳转、刷新和浏览器历史需保持可用，DataPilot 深链接可切换到对应内容分组；正文 tab 原地切换并更新首节 Hash，不触发滚动，刷新与浏览器前进后退仍恢复锚点定位；`ReadingPageHeader` 顶部标题出现时同步展示 `DataPilotPartMenu` 下拉菜单，支持当前项标记、键盘与点击外部关闭，切换使用目标分组首节 Hash，保留刷新及前进后退。
- `components/about/WorkEntry.tsx` 按 ID 保留特殊布局，项目卡片跟随 `oceanbase`，经历用循环展示。教育经历在工作经历与联系方式之间展示学校、专业、学历和时间，复用 Markdown 数据并加入目录；完整教育文案仍供聊天使用。
- `components/Lanyard/` 由联系弹窗打开时懒加载，展示可拖拽工牌动画，关闭时释放场景，首页不引用；加载期间由 `ContactOverlay` 显示轻量静态工牌占位，纹理就绪并完成首帧绘制后通过 `onReady` 切换至 3D，WebGL 不可用时保留静态预览；`renderContainerRef` 指定整个弹窗为画布，本地布局框仅确定初始位置与大小，不限制拖拽范围。`Lanyard.tsx` 是 React 入口，`scene.ts` 管创建与清理，`simulation.ts` 管物理；纹理、几何、材质和配置分别维护。
- 博客由外部 Notion 承载，链接保留在 `components/SiteSidebar.tsx` 但入口暂时隐藏，顶部导航也不展示；无站内博客或数据库内容接口。
- 「一些尝试」使用 `/experiments` 路由，`pages/Experiments.tsx` 按需加载，暂时仅展示标题和「内容准备中。」；原路由可直达，展开侧栏、收起图标栏与移动端抽屉均不展示入口。
- `ChatbotView.tsx` 首次打开时懒加载 `components/chat/ChatPanel.tsx`；`ChatStoreProvider.tsx` 在应用层持有唯一的会话状态及生命周期，供历史入口与聊天界面共享；`useChatThread.ts` 连接该状态与按需生成的语料，`lib/chat/chatStore.ts` 管按会话隔离的并行请求、草稿和问题队列，`conversationStorage.ts` 管版本化 localStorage 保存及旧 sessionStorage 迁移；`conversationTitle.ts` 本地归纳首条提问的主题标题，新旧记录共用，保留项目名称、消息内容和历史排序。切换会话或页面不终止生成；停止只影响当前回复并保留已显示文本；停止标记作为消息元数据持久保存，在对话流对应位置显示「已终止」，不作为消息正文发送给模型。聊天界面不展示返回按钮，仅在首页对话入口和聊天界面右上角展示 `ChatHistory.tsx`，提供查看、续聊和单条删除，删除前通过 `components/Popconfirm.tsx` 气泡二次确认，浮层使用原生顶层避免被滚动列表裁切；支持取消、Escape、点击外部关闭与焦点恢复；删除当前聊天返回首页，其他记录删除不改变当前页面，生成中的记录删除时取消请求和队列；存储删除失败保留记录，同源标签页同步删除；首次发送才进入历史，刷新不自动重发中断请求；空白对话统一返回首页，不再渲染单独欢迎页。首页输入、新建和历史选择经 `App` 以唯一 ID 的有序命令转交 `ChatPanel`；首页输入保留当前路由，消费时绑定会话且等待该会话已有回复结束，不能因懒加载、StrictMode 或重开对话重复发送。`hooks/useHashOverlay.ts` 管页内聊天 Hash 与路由同步。联系弹窗由 `App` 的页面内状态控制，开关不修改 URL、锚点或浏览器历史，保留原页面与滚动位置；由 `ContactOverlay` 管 Escape、焦点和滚动锁定。
- `lib/siteCorpus.ts` 汇总本地语料；`lib/deepseekChat.ts` → `api/chat.ts` 发送流式请求；`lib/chat/` 分离 SSE 解析、文字渐显、历史校验与消息裁剪。
- `lib/chat/interviewPrompt.ts` 是中文系统提示词的唯一来源，由 `translations.chatbot.systemPrompt` 引用。面向产品经理或设计师面试，回复以「嗯！」开头、轻快简洁；自我介绍约 30 秒，保持短段落，主体只讲蚂蚁集团·OceanBase，之前工作一句话。B 端通用方法储备与 `siteCorpus` 个人事实分开，不能把知识当作实际经历。
- `components/chat/ChatMessageContent.tsx` 渲染 assistant Markdown，用户原文与历史保存内容保持不变。`interviewPrompt.ts` 约束回复按需加粗关键词、使用 2–4 项有序列表，仅在对比需要时使用小型表格；窄屏表格可横向滚动，自我介绍继续用约 30 秒的短段落。相关项目配图仅使用 `lib/chat/projectImages.ts` 的现有媒体清单，与 `siteCorpus` 共享；过滤占位图与 `sourceRegion` 裁剪原稿，DataPilot 仅取 `experience`，保留图注语境，不编造图片路径；原始 HTML 和外部图片不渲染。
- 首页姓名标题与简介统一来自 `i18n/translations.ts` 的 `home`，同步供聊天语料使用；输入框下的四个推荐问题为关于我、擅长领域、工作经历、项目经历，复用 `chatbot` 中的标签与提示词；点击仅回填并聚焦首页输入框，用户按 Enter 或点击发送后才经现有 `onAsk` 流程发送。
- `public/data/instagram.json` 与 `public/images/instagram/`：摄影快照；维护说明在 `docs/instagram-sync.md`。
- `index.css` 按 tokens、foundation、components、prose、responsive 顺序加载；`styles/components.css` 仅按原级联顺序导入 `styles/components/*.css`，修改时保留导入顺序。组件专属规则在对应文件，跨组件断点在 `responsive.css`。
- 聊天服务端入口保留在根目录 `api/chat.ts`，供 Vercel 部署和本地开发中间件使用。

## 修改与验证

- 设计工程 `/project/aidesignsystem` 的中文文案、配图和架构数据统一来自 `data/projects/designEngineering.ts`，由 `projectDetails.ts` 分派。背景与架构之后，正文按设计资产（`foundations`）、规则映射（`guidance`）、项目应用（`delivery`）组织；Code Connect、Skill、DESIGN.md 同属规则映射，代码交付与后续验证归入项目应用。`ProjectArchitecture.tsx` 从上到下按设计资产、规则映射、代码交付、项目应用四层呈现能力关系，使用无描边的四色色块，不展示箭头，样式在 `styles/components/project-architecture.css`；章节的 `architecture` 同时序列化进入聊天语料。`legacyIds` 保留旧 `design-highlights` / `project-gallery` / `connections` 深链接，不增加目录刻度。案例以探索设计师介入 AI 研发、稳定生成页面为主线，区分已交付内容、行业参照和后续验证，不把目标写为已量化成果。

- 项目详情正文参考链接使用 `ProjectDetailParagraphRun.href`，页面与 `siteCorpus` 同步保留链接；数据库运维平台原型地址统一来自 `DATABASE_OPS_PROTOTYPE_URL`。补充设计过程时区分设计目标、方案探索与验证结果；原始过程配图可用 `imagesDisclosure` 折叠，背景和目标表位于正文首节（`design-goals`），设计机会表通过单元格 `groups` 组织小标题和列表，`text` 由同一组内容派生供聊天读取；步骤条 GIF 通过小节的 `comparison` 并入第一个设计决策，左右对比优势与局限，窄屏堆叠，移除独立目录刻度，保留 `stepper-design` 元素 ID 兼容旧链接，以及聊天语料、动画与全屏预览。16.8% 与 75% 为不同时间窗口、不同用户群的同一种任务创建完成行为埋点统计（优化前熟练用户、优化后新用户），项目详情与关于页不可将其写成同一用户群的直接提升幅度。
- 数据库迁移漏斗数据来自 `data/projects/databaseOps.ts`，通过小节的 `funnel` 供页面与聊天共用。前两步数量 2428、858 及转化率来自原图，后两步 566、408 为估算，页面按用户要求隐藏「约」，悬停、无障碍描述与聊天语料保留估算口径。`ProjectFunnel.tsx` 提供阶段选择，`FunnelGraphic.tsx` 使用四层实色 SVG 漏斗，层顶部宽度与数量成比例，选中阶段使用低饱和灰蓝强调色；右侧信息占约三分之一，35.34% 与底部总结的 16.8% 标红。保留键盘选择、滚入动画、减少动效与响应式布局；模板演进与来源见 `docs/databaseops-chart.md`。

- 当前会话记忆与余量统一由 `lib/chat/context.ts` 管理：应用预算 64,000 token（含 2,048 回复预留）、500,000 字节请求上限；保留完整问答轮次，超限移出最早轮次但不删除本地历史，最新一轮过长时不发送。`ContextMeter.tsx` 位于聊天发送按钮左侧，计入站点资料、当前会话和草稿，明确标注估算；前端发送、余量展示和服务端校验共用预算，不恢复固定 99 条截断。

- 界面固定中文，移除语言切换能力并忽略旧语言偏好；全站仅维护中文数据，不再保留英文翻译分支。保留深浅主题和响应式布局；首次访问默认亮色，已有主题偏好继续生效，主题在首屏绘制前初始化。复用现有 CSS 变量。
- 关于我 / Resume 入口保持 `/about` 路由；侧栏宽度 256px，桌面收起后保留 72px 图标栏，栏顶默认显示 4x，悬停或键盘聚焦切换展开图标，AI 产品与数据工具分为两个独立图标入口，悬停或点击仅展示各自分类的项目，一级菜单使用圆角线性图标；「新对话 / New chat」使用无内部横线的空心对话气泡图标，关于我文档图标同样移除内部横线并保留折角，主导航与收起栏共用；新对话创建空白会话并返回首页 `/`，保留其他会话与后台响应；站点标志继续返回 `/`；900px 及以下改为抽屉，包含焦点管理、Escape / 遮罩关闭与滚动锁定。首页保留简介、输入框与推荐问题，不展示项目列表或加载 3D 工牌，按一屏可用高度和右侧容器宽度适配；首页响应式样式集中在 `styles/components/home.css`；项目入口集中在侧栏；推荐问题使用描边胶囊按钮、无悬停箭头，移动端以 12px 字号横向单行排列，超出后可横向滚动、中文简介较小字号单行，菜单旁显示 DESIGN.4x 首页链接，侧栏品牌 x 同为小写；全站不展示页脚；中文简介语料继续供聊天使用。
- 清理前核实静态导入、动态导入、`import.meta.glob`、数据引用；公共资源可能被外部链接引用，不能只按本地文本搜索结果删除。
- 现有 `Lanyard/LICENSE.md` 是组件许可证，保留。
- `npm test` 运行 `tests/*.test.ts`，覆盖内容标识、中文数据与聊天流等关键行为；现有 Vite 运行器支持 TS/TSX 和原始 Markdown，无需额外测试依赖。
- `npm run typecheck` 检查前端、聊天 API 和 Vite 配置；`npm run build` 同时完成检查与生产构建。内容来源、解析或交互逻辑变更后运行测试与构建，界面变更还需浏览器验证。
- `npm run dev` 的聊天接口在本地执行。`npm run preview` 不启动 API。接口验证使用 `npm run dev:full`（需要 Vercel CLI）。
- `DEEPSEEK_API_KEY` 仅供服务端使用，不要把密钥放入 `VITE_*` 或客户端代码。
- 调整目录、命令或内容来源时，同步更新 `README.md` 的索引与本指南。

- 设计工程化为直接进入 `/project/aidesignsystem` 的一级导航，不显示二级菜单；桌面、移动端抽屉和收起侧栏保持一致。展开侧栏与移动端抽屉中，AI 产品使用线性四芒星图标，数据工具使用简洁终端图标（>_），设计工程化使用颜料盘图标；收起侧栏的 AI 产品与数据工具分别使用四芒星与终端图标，设计工程化继续作为独立的颜料盘图标入口。图标保持 18px 画布、24 × 24 viewBox 和 1.7 线宽的圆角线性风格。原 Design Token、Skills、DESIGN.md 路由与内容保留，但不再作为导航菜单展示。

- 项目导航使用 `navigationTitle` 覆盖菜单名称（AI 智能问数），`hiddenFromNavigation` 隐藏入口但保留详情路由（Agent 记忆插件）。Text2SQL（`/project/text2sql`）依据早期交互稿整理中文案例，内容保存在 `projectDetails.ts`，原稿 `public/images/text2sql-interaction-design.png` 默认折叠；项目已上线，个人职责为产品界面设计，原稿标注「待定」的结果审阅与异常反馈仍按方案探索描述，不推断最终落地或效果指标。任务流编辑器（`/project/workflow-editor`）依据原始设计文章整理中文案例，内容同样保存在 `projectDetails.ts`，原文配图默认折叠。
- Text2SQL 交互原型位于 `/prototype/text2sql`，由 `pages/SqlEditorPrototype.tsx` 按需加载，`components/sql-prototype/model.ts` 管本地模拟逻辑，页面导入作用域内的 `styles/components/sql-prototype.css`；详情页通过 `demoUrl` 提供入口，独立于作品集 Header、侧栏、聊天与联系浮层，保留应用层 `ChatStoreProvider` 生命周期。AI 回复与 SQL 执行均为本地模拟，不连接真实数据库；按原截图默认浅色，原型暗色切换不修改站点偏好。原稿「待定」的结果审阅和异常状态仅用于交互演示，不回写为历史上线事实或效果指标。


- Text2SQL 概述通过 `overviewPrototype` 嵌入本地原型；`PrototypePreview` 的可选 `viewportWidth` 使用 ResizeObserver 等比缩放桌面画布。原型 `?embed=1` 隐藏内部返回链接，避免 iframe 嵌套作品集。

数据库运维视觉版的全部配图展板复用 `MeshGradientBackground`。配色取自 OceanBase DataPilot「从问数到报告」四个面板（实际为冰蓝与紫粉两套交替），按素材路径稳定打散分配；`ProjectGallery.imageFrame` 仅在视觉版启用，原版布局不变。图注位于展板外，首屏继续隐藏图注。

- 数据库运维平台仅展示当前视觉版本，导航以「数据库运维平台」指向 `/project/databaseops`；旧 `/project/databaseops-visual` 重定向到正式地址并保留查询参数和 Hash，不再展示原版布局及阅读原版入口。原始项目数据继续供当前版与聊天共用。

- 项目详情统一参考数据库运维平台的阅读呈现；`CaseStudyMedia.tsx` 提供渐变展板、原图预览和明确配图占位，`styles/components/case-study.css` 作用于通用详情与 DataPilot。首屏按标题、简介、标签、主图排列；正文沿用原章节 ID、事实与中文数据，过程材料使用折叠卡片，外部原型使用胶囊链接按钮。Text2SQL 保留首屏本地原型；不为缺图编造截图或成果。

## 发布快捷指令

- 用户发送 `/deploy` 时，读取 `/Users/rriwen/.codex/skills/deploy/SKILL.md` 并执行：验证当前修改、提交并推送 GitHub、部署 Vercel 生产环境、确认 Ready 后报告链接。该指令即本次发布请求。

## PDF 简历与网站下载同步

- `output/pdf/任文倩_产品设计师简历.pdf` 是 PDF 简历的唯一发布源。每次修改或重新生成此文件，必须在同一任务中同步覆盖 `frontend/public/任文倩_产品设计师简历.pdf` 和兼容旧链接的 `frontend/public/任文倩的简历_AI产品设计师.pdf`，不允许网站附件与源文件版本分离。
- 同步更新 `frontend/src/components/about/ResumeDownload.tsx` 下载链接的 `v` 参数为源 PDF 的 SHA-256 前 12 位，避免沿用旧缓存；下载文件名保持不变。
- 交付前核对三个 PDF 的 SHA-256 完全一致，并检查源 PDF 的分页与渲染。部署后从网站下载入口获取附件，与源文件逐字节比对。
- 本规则要求同步本地网站附件，不自动授权每次修改后发布生产环境；未部署时明确说明网站源附件已同步、线上待部署。用户要求部署时按部署技能执行。


DataPilot 产品体验正文以多轮对话、人机交互和智能体回放孵化为主线，正文以客户或用户问题举例，不展示客户名称，交互方案与验证结果保持区分；保留原章节 ID 与 POC、海外探索分组。`data/projects/dataPilot.ts` 的 `designPlaceholder` 保存七组待补设计稿说明，仅在页面展示，不进入聊天事实或媒体清单；首屏简介同样由该文件维护。产品体验正文仅显示 `title` 章节标题，不展示 `intro` 副标题。

DataPilot 的 `product-evolution` 章节说明问数、应用生成、与应用持续对话三个阶段，分别对应现有问数示意、画布探索、三栏布局；画布阶段保留设计稿占位与配图说明，其他阶段使用已有截图。

DataPilot 页面不再展示目标用户、产品目标、衡量标准三列信息，产品演进直接衔接持续对话体验；原始背景数据保留供聊天使用。

- AI 问数产品演进通过 `DataPilotEvolution.tsx` 展示三阶段手动切换，左侧阶段说明、右侧截图；无自动轮播，支持方向键。素材来自 `dataPilot.ts` 的 `evolutionMedia`，缺失画布截图保留配图说明，真实截图同步供聊天使用。

- AI 问数体验正文通过 `DataPilotSection.group` 归为「持续对话体验」与「Agent 问题排查」，子节保留原 ID 与深链接；目录仅显示分组，聊天语料保留分组和子节层级。背景目标、产品演进、验证结果继续独立展示。

- AI 问数验证结果由 `DataPilotResults.tsx` 以并排大数字与比例图展示，数据来自 `dataPilot.ts` 的 `adoptionResult`，保留发布应用数 / 创建应用数口径。导航分类显示「平台工具」，稳定分类 ID 仍为 `data-tools`。

- 聊天的 AI 问数语料读取当前展示的首屏 lead 与正文分组，不再导入已隐藏的 paragraphs / metadata；仅保留真实配图说明，排除配图占位。回答以最新站点资料为准，项目详情中的状态、指标及统计口径优先于历史回答，规则维护在 `lib/chat/interviewPrompt.ts`。

AI 问数保持现有章节与分组；发心、初期目标融入背景目标，全链路示意融入连续分析案例。示意数据由 `dataPilot.ts` 的 `diagram` 维护，`DataPilotJourney.tsx` 渲染，`siteCorpus.ts` 同步序列化。流程图表达设计目标与关注点，不将参考资料中的自动路由、权限申请等能力当作已上线事实。

Data Agent 分为「项目背景」（`overview`）与「产品演进」（`product-evolution`）两个独立章节，各自显示标题与目录项。背景包含初衷、取数路径图与三列摘要；产品演进包含访谈发现与三阶段手动切换。保留原深链接，聊天语料同步章节层级。

持续对话体验通过 `DataPilotDialogue.tsx` 展示连续任务、条件继承切换、三栏信息分工与分析／报告更新分支。中文正文、设计取舍与示意内容统一维护在 `dataPilot.ts` 的 `dialogue` 字段，`siteCorpus.ts` 同步读取且保留方案性质说明。原章节 ID 不变，`designPlaceholder` 保留为后续真实设计稿说明，在已有原生示意的章节不重复显示占位展板。样式位于 `styles/components/datapilot.css`，支持键盘、深浅主题和窄屏。

持续对话首节通过 `groupIntro` 作为分组导语展示，保留 `continuous-analysis-example` 深链接与任务示意，不显示独立标题、不占子节编号；页面与聊天保持相同层级。

Data Agent 持续对话体验以个人贡献描述产品规则、交互设计及工程协作，区分条件继承、对象关联、执行反馈；状态存储、上下文组装、权限校验、工具调用和重试实现归工程，不写为个人底层技术交付。图注保留行为规则与联合验收重点，不将方案写为已验证成果，中文正文与聊天语料同步。

Data Agent 在持续对话前增加「问答体验」分组（`qa-experience`），以 `qa-overview` 展示导语与三行标签说明（`steps`），标签为问答前、问答中、问答后，每行将用户目标与设计判断合并为一句话，后接 `qa-entry`、`qa-execution`、`qa-result` 三个稳定 ID，分别讲问答前入口与首次澄清、问答中过程与产物分离、问答后结果阅读与核查。`DataPilotQA.tsx` 采用顶部问题说明、下方左侧渐变交互示意与右侧判断／取舍／验收的布局，窄屏按问题、示意、说明顺序堆叠；衔接持续对话的文案置于第三环节末尾。该组件渲染渐变展板上的模拟界面，支持首次范围确认、执行中／无数据／查询失败／生成失败状态切换、报告／明细切换与来源展开；正文按具体问题、设计判断、关键取舍、协作与验收组织，首次问答聚焦范围明确、异常反馈与结果核查，条件继承和报告更新留在持续对话部分。正文与中文示意内容来自 `dataPilot.ts` 的 `qaExperience`；`siteCorpus.ts` 仅收录正文、设计判断和衔接段，排除 `mockup` 模拟数据及界面内容，不将参考截图中的自动授权、置信度检测、Skill 和定时任务写成上线成果。

Data Agent 案例以“持续探索数据，同时保留可阅读、可修改、可分享的报告”为主线；背景保留自然语言问数的初衷与 BI 访谈发现，演进保留简单问数、生成报告、持续对话的三阶段说明，问答体验压缩为三阶段铺垫，持续对话重点讲条件承接、分析与报告修改的边界、任务与产物状态。结果区明确 15%→60% 为整体迭代结果，`bullets` 首项保留公式，其余项展示反思；POC、海外与 Agent 排查内容保留。

Data Agent 在项目背景末尾呈现定位摘要，使用网格呈现，包含目标用户、产品目标、衡量标准、核心职责与设计挑战；窄屏纵向排列。中文内容由 `data/projects/dataPilot.ts` 的 overview.table 维护并同步进入聊天；采纳率仅作为整体迭代指标，不归因于单项设计。

问答体验使用 `DataPilotQATabs.tsx` 以问答前、问答中、问答后三个手动 Tab 展示，参考 LakeBase 应用场景的居中 Tab 与整块渐变左文右图布局，窄屏堆叠。原 qa-entry / qa-execution / qa-result 深链接、刷新与前进后退保留；Tab 切换原地更新 Hash，支持方向键与 Home / End，“算什么、怎么算、如何查”说明分别放入对应 Tab；内容仍由 dataPilot.ts 统一维护。

Data Agent 取数路径图使用 `MeshGradientBackground` 实时网格渐变，沿用 LakeBase 首屏的蓝白配色；色块内部连续流动，不使用背景图片平移缩放。保留离屏／后台暂停、减少动态效果静止与静态渐变回退。`lakebase-banner-background.jpg` 保留为历史参考素材。

持续对话三个方案通过 `DataPilotDialogueTabs.tsx` 手动切换，标签为结果追问、上下文与记忆、定时任务，复用问答体验的描边胶囊分段控制器。保留条件承接、报告修改与执行反馈的原章节 ID、Hash 恢复和键盘操作，Tab 切换不滚动；分组仅展示导语，连续任务示意数据保留；持续对话每个 Tab 采用整块渐变展板，左侧标题、说明与要点紧凑排列，右侧展示 4:3 截图轮播占位，Tab 与展板紧密衔接。

问答体验与持续对话的截图占位复用 `ScreenshotCarousel.tsx`，5 秒自动切换，48px 横条显示倒计时进度，支持手动选择，不显示秒数与暂停按钮。隐藏 Tab、离屏、页面后台、截图悬停、键盘聚焦与减少动态效果时暂停；占位仍明确标记，不作为真实截图进入聊天语料。

截图轮播仅保留可点击的进度横条；点击后重置计时并继续自动轮播，不因鼠标停留在横条或点击聚焦而暂停。未选中横条使用浅底，当前倒计时轨道使用深底，填充使用深色。

问题排查分组标题为「问题排查」，复用 `DataPilotDialogueTabs.tsx`，以找到步骤、核对依据、修正复测三个 Tab 展示简短说明、方案要点与动态渐变截图轮播占位；保留 `agent-replay` 和 `accuracy`，新增中文一致的 `agent-evidence`。内容仍通过 `dataPilot.ts` 的 dialogue 字段供页面与聊天共用，保持方案性质。

Data Agent 各 Tab 的 `screenshotBriefs` 仅用于展示待补截图的界面、操作与状态要求，不进入聊天语料或媒体清单。问答、持续对话与排查正文需明确操作对象和影响范围；新增规则按方案表述，整体采纳率与单项方案的验证区分。

Data Agent 产品体验采用客观表述，职责覆盖对客需求与场景、产品需求规划、前端设计研发与验证、后端接口协作，以应用采纳率为目标。产品演进按用户要求保留原有两段正文与三阶段说明，不在该节追加上线状态与职责叙述。问答体验、持续对话与问题排查按用户要求恢复审查改写前的表述，保留方案与实际效果的区分；中文与聊天语料同步，成果与反思保持独立。

Data Agent 定位摘要位于项目背景末尾，由 overview.table 统一维护：两行三列，首行为产品目标、目标用户、衡量标准，次行为核心职责、设计目标、设计挑战；仅保留整组顶部的分割线，无外框和内部网格线，窄屏纵向排列。职责与挑战使用精简客观表述，不在背景正文重复长段说明，中文与聊天语料同步。

持续使用智能报告（`continuous-dialogue`）按 ①围绕报告分析、②可控修改（`report-editing`）、③作用范围、④定时任务连续分块展示，不使用 Tab；保留 `conversation`、`continuous-analysis-validation`、`applications` 深链接。正文、取舍、版本与回滚事实及方案边界统一维护在 `dataPilot.ts` 并进入聊天语料。①②③ 采用左侧标题与正文、右侧渐变截图展板，文字位于渐变背景外，窄屏上下排列；④ 定时任务以简短正文呈现。问题排查继续使用原有三 Tab。删除追问指代易被误解的研究结论，以历史对话累积作为分析入口的设计背景。


Data Agent 产品形态演进的标题、描述与优劣统一保存在 dataPilot.ts 的 evolutionMedia；DataPilotEvolution.tsx 先展示描述，再以绿色对勾、红色叉展示优势与问题，聊天语料同步读取。

问答体验三个 Tab 更新为明确需求、对齐口径、生成核查，沿用 qa-entry / qa-execution / qa-result 深链接。正文来自 dataPilot.ts：渐变展板左侧同时展示设计难点与 qaExperience.decisions 的三项圆点列表设计决策及取舍，右侧展示对应截图，并同步进入聊天语料；qaExperience.materialBrief 保留为内部素材准备记录，不在页面展示，也不进入聊天语料。截图准备说明与各阶段主题同步。

多轮对话与持续使用（`continuous-dialogue`）复用基础问答体验的胶囊 Tab 与渐变左文右图布局，以连续追问、应用修改、跨次复用、周期运行四项手动切换；保留原小节 ID、Hash 与键盘操作。每项以难点、简短背景和三条加粗标签的设计取舍组织，`screenshotBriefs` 提供对应截图与状态要求，不进入聊天语料；版本与回滚保留报告能力边界。

Data Agent「问题排查」复用现有渐变展板与截图轮播，以结果准确性、执行异常、执行耗时三个 Tab 展示具体场景、设计难点与三条策略；保留 agent-replay、agent-evidence，新增 agent-latency，accuracy 仍为下方 AgentOps 孵化说明及链接。基础问答聚焦日常状态与结果摘要，排查聚焦异常证据、失败影响与耗时定位，不重复多轮条件承接或报告版本能力。正文与方案边界经 dialogue 同步进入聊天，screenshotBriefs 不进入语料；历史回放不重跑，复测需单独发起。

Data Agent 不再展示「设计落地与协同」章节，相关 DESIGN.md 实践集中在设计工程化项目中。设计工程化在 `project-design-rules` 详述视觉规则、组件状态与实现约束，在 `datapilot-design-collaboration` 展示研发使用与检查方式，区分方法参照、已做实践和后续验证。

多轮对话与持续使用采用连续追问、修改应用、使用应用三个 Tab。连续追问聚焦结果引用、比较探索与选择写入；修改应用聚焦作用范围、关联影响与报告版本检查、发布及回滚；使用应用合并跨次复用与周期更新，区分报告版本和数据更新记录。内容与截图说明统一维护在 dataPilot.ts，聊天同步正文；applications 通过 legacyIds 映射到 continuous-analysis-validation，保留旧深链接。报告版本、回滚和自主发布为已确认能力，其余交互机制保留方案边界。

Data Agent 的设计策略正文通过 `DataPilotWorkflow.tsx` 在流程说明末尾提供「Agent 工作流」文字链接，点击复用 `ProjectLightbox` 预览原始流程图。素材与裁剪范围由 `data/projects/dataPilot.ts` 的 `workflow.image` 统一维护；通过 `sourceRegion` 隐藏图片顶部标题，正文不再展示 SVG 流程展板。流程摘要与阶段说明继续供聊天使用。



POC 场景验证依据演示准备材料分为业务理解、场景筛选、指标映射、演示数据、连续任务、评价要求和阶段产出七节；以制造业为主线，油气、交通和巡检为匿名补充示例。保留六个原章节 ID，新增 `poc-demo-data`，顺序以正文为准。区分意向演示与正式 POC，公开资料、客户资料、推断及模拟记录分别表述；验收要求不是已验证结果。`DataPilotPocSection.tsx` 复用产品体验的单标题正文与加粗标签列表，任务表使用 `DetailTable.tsx`；示例性质说明由 `beforeTable` 保存，结尾由 `afterTable` 保存，与正文、表格和列表同步进入聊天语料，不将验证计划当作已实现效果。

海外 SaaS 探索保留原名称与五个 growth-* 深链接，内容依次为背景与目标、官网价值表达、登录注册、积分试用、阶段交付与上线验证。范围为官网、登录注册与积分试用设计已完成、待上线，不含付费流程。官网与登录注册配图来自 dp-saas-demo.vercel.app 的真实页面截图；积分试用按通用产品逻辑描述，具体结算规则保留方案边界。中文内容统一由 dataPilot.ts 维护并进入聊天语料。

AgentOps 案例由 projectDetails.ts 维护，以 Demo 销售日报异常串联定位执行、理解过程与核查异常；背景合并后通过 legacyIds 保留 openobserve-learning / shared-product-need 深链接，阶段成果与客户回放探索合并为「成果与后续」，明确已有产品 MVP、待内部验证，并通过 legacyIds 保留 customer-replay 深链接。截图保留无图注展示，演示内容不作为真实客户故障或效率成果。


开发编辑器入口统一为 `/project/datadevelop`，通过 `DevelopmentEditorsCaseStudy.tsx` 以 SQL 编辑器、任务流编辑器两个 Tab 展示原有内容，复用 Data Agent 的编号下划线样式。`?editor=workflow` 保存任务流 Tab，旧 `/project/workflow-editor` 保留其他查询与 Hash 重定向到此 Tab；切换原地更新 URL，支持键盘、刷新、历史恢复。`projects.ts` 仅合并导航，原两份案例数据与聊天语料保持独立。

Text2SQL 案例围绕就近编辑、任务指令与结果审阅三项设计取舍组织中文叙事，保留原章节 ID；正文以 `sourceRegion` 展示早期交互稿的输入、指令、生成与审阅局部，正文图注隐藏，末尾不再展示完整原稿入口；原始素材保留。首屏本地原型明确为模拟演示，结果审阅和异常反馈保留探索边界；正文与聊天语料共用 `projectDetails.ts`。

Text2SQL 首屏使用用户提供的 `public/images/text2sql-overview.jpg`，在标签下方以 2:1 比例顶部对齐展示，裁去部分底部内容，不显示图注，全屏预览保留完整原图；详情页移除嵌入演示、原型按钮与操作说明，独立 `/prototype/text2sql` 路由保留。

Text2SQL 开篇以「项目背景」说明目标用户、SQL 编写与修改问题及主导产品设计的职责；保留 `context` 锚点与目录项，目标和设计方案不写为已验证成果，正文与聊天共用。

Text2SQL 的四项方案合并为「设计策略」，按问答前、问答中、问答后三个小节展示，复用左右图文布局；`contextual-entry` 为章节 ID，原 `task-commands`、`generation-feedback`、`result-review` 经 `legacyIds` 保留。中文策略与聊天语料共用。

Text2SQL 问答前的两张局部图通过 `imagesLayout: carousel` 复用 `ScreenshotCarousel`，5 秒自动切换并支持进度条手动选择；保持裁剪、无图注与全屏预览，悬停、键盘聚焦、离屏、后台及减少动态效果时暂停。

Text2SQL 设计策略的问答前、中、后三阶段使用 1、2、3 圆形序号和竖向连接线，样式仅作用于本案例，窄屏保持纵向阅读。

通用项目的对话语料同步读取 `caseStudyPresentation.ts` 的当前首屏简介与能力标签，正文继续共用项目详情数据；设计工程化正文删除独立「全局架构」章节，首屏架构数据归入背景并保留旧锚点。

对话流的文字链接采用描边圆角按钮；项目配图复用 `ProjectLightbox` 页内放大，支持关闭、Escape 与焦点恢复，不再打开独立图片网页。

Text2SQL 的「工作流探索」（`workflow-exploration`）位于设计策略之前，通过 `ProjectWorkflow.tsx` 沿用 Data Agent 背景的渐变展板，将六步流程按顺时针环形排列，澄清、修正与返回输入的说明直接嵌入对应节点；窄屏按流程顺序纵向排列。数据统一由 `projectDetails.ts` 的 `workflow` 维护，并同步进入对话语料；示意与真实 Dify 节点、已验证能力区分，生成后由用户审阅与主动执行。

Text2SQL 工作流按 OBCloud 技术文章（https://open.oceanbase.com/blog/17723209269）校正为输入、信息抽取、表与样例召回、Prompt 组装、生成返回、用户接受或不接受；元数据索引作为前置准备。按用户确认，本版本仅单次对话，信息不足或结果不满意均需重新输入，不展示自动检查、自动修正或连续澄清能力；页面与聊天共用此限制。

设计工程化按真实问题与职责、已有实践与个人贡献、设计资产、规则、当前结果与后续验证组织，保留原章节 ID。首屏先展示实践范围，四层架构放入设计资产章节；Data Agent 规则协作与记忆插件独立前端交付分别说明。`designEngineering.ts` 的 `evidenceRequests` 为需用户提供的材料清单，页面使用折叠区展示，不进入聊天语料与媒体清单；未有记录支撑的稳定性、效率与复用收益保留为待验证。

关于我标题下展示「AI 产品、企业级工具、设计工程」三个领域标签，文案来自 translations.about.tags；各端导航统一显示「设计工程」，项目名称与路由保留。摄影入口在展开侧栏、收起栏和移动抽屉隐藏，/photography 页面仍可直达。

设计工程按通用方法呈现：首屏整体四层架构，正文依次为方法概览、设计资产、规则映射、代码交付、项目应用、方法验证与迭代。Data Agent 与记忆插件作为应用例子，不再作为全文主线；保持简洁、原锚点及待补证据隔离。

设计工程移除「方法验证与迭代」章节，正文在项目应用结束；各模块的待补证据标注保留。

设计工程架构图复用 MeshGradientBackground 动态渐变展板，白色线框区分层级，浅色半透明模块与黑色代码交付模块形成重点；保留四层关系、窄屏布局、减少动态效果和静态回退。

设计工程以 Agent Ready 设计系统为整体：架构及正文按设计资产、设计知识、设计与代码映射、Agent 接入、质量保障五模块展开，项目应用独立放在末尾。代码映射以统一设计属性和前端组件 API 为核心，Code Connect 承接映射；CLI／MCP、Registry 和系统化自动检查标为待建设。已有实践与待完善范围同步进入聊天，evidenceRequests 仅显示待补材料。保留原章节与已迁移小节的深链接，黑色模块强调设计与代码映射。

设计工程架构图参考 OceanBase OAgent 产品架构图的紧凑网格：左侧连续黑色层级栏、右侧浅色模块，五层无外框、仅显示名称；保留动态渐变与窄屏适配。

设计工程架构参照用户提供的 OAgent 截图：连续黑色层级栏与细分隔线，右侧连续虚线分区和半透明模块，恢复简短模块说明。补充组合模式、选择规则、API 契约、组件索引与项目上下文、检查反馈，新增内容明确为待建设；sharedPractices 展示贯穿机制并同步进入聊天语料。

设计工程详情围绕跨角色 AI 开发的一致性更新，保留整体架构，正文按 Design Token、DESIGN.md、代码映射、Skill 设计、CLI 工具与项目应用组织。组件 API 已与前端确认，Code Connect 为映射方案阶段；CLI 规则内容和交互由设计负责，工具实现由研发负责。工具栏组合为规则示例，Astryx 查询范围为方法参考。`screenshotPlaceholder` 复用 `CaseStudyPlaceholder` 展示配图占位，仅供页面展示，不进入聊天语料或真实媒体清单；正文不再展示证据索取清单。

设计工程正文布局由 `styles/components/design-engineering.css` 限定作用域：Token、DESIGN.md、Skill 与 CLI 使用通栏总述和图文并排，代码映射与项目应用双列对照；窄屏回到单列。工具栏规则表已移除，旧锚点保留；配图采用浅蓝、青蓝与淡紫渐变。保留截图占位和共享中文语料，正文总述使用正文字号，短描述使用次级文字且不加句号。

设计工程在代码映射后新增独立「Skill 设计」（`skill-design`）章节，说明组件用法与约束、前端组件库和工程实现标准的封装；旧 Skill 小节锚点迁移至该节，正文与聊天共用，配图保留占位。

设计工程 CLI 章节通过 `frontend/src/components/project/DesignCliDemo.tsx` 展示 OBDesign 本地交互模拟，`obdesign/help` 列出命令，采用 macOS 终端样式，初始为空，输入后回车返回六项指令（search、component、docs、theme、build、upgrade）；支持连续输出、上下键历史、Tab 补全、clear / Ctrl+L / Cmd+K 清屏与 Ctrl+C 取消输入，窗口按钮提供关闭重开、最小化恢复和高度切换。命令数据来自 `designEngineering.ts` 的 `designCliCommands`，不进入聊天事实；样式复用 `design-engineering.css` 与全站主题变量，不执行真实命令。

部署前先同步并验证对话语料：以当前中文内容源为准，检查 `lib/siteCorpus.ts` 对正文、表格、设计取舍和链接的映射，再执行测试、构建与发布。任务流表格的 `decision` 同步序列化为采用／不采用；`illustration` 仅展示原稿裁剪，保持排除于聊天媒体清单。
