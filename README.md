# DESIGN.4X

个人设计师作品集，包含项目案例、个人经历、摄影和 AI 对话；博客导航链接到外部 Notion。技术栈：React 18、TypeScript、Vite、React Router、Three.js；聊天 API 部署在 Vercel，无数据库依赖。

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

## 按任务定位代码

| 要修改的内容 | 入口 |
| --- | --- |
| 页面路由、按需加载、全局主题与浮层 | [`frontend/src/App.tsx`](frontend/src/App.tsx) |
| React 挂载、统计、样式入口 | [`frontend/src/main.tsx`](frontend/src/main.tsx)、[`frontend/src/index.css`](frontend/src/index.css) |
| 首页布局与项目卡片 | [`frontend/src/pages/Home.tsx`](frontend/src/pages/Home.tsx) |
| 首页 3D 名片 | [`Lanyard.tsx`](frontend/src/components/Lanyard/Lanyard.tsx) 为 React 入口；同目录 `scene.ts` 管生命周期，`simulation.ts` 管物理，`textures.ts` 管纹理；保留许可证 |
| 项目名称、slug、封面、顺序、双语标签 | [`frontend/src/data/projects.ts`](frontend/src/data/projects.ts) |
| 通用项目详情文案和画廊 | [`frontend/src/data/projectDetails.ts`](frontend/src/data/projectDetails.ts) |
| DataPilot 文案、链接、配图 | [`frontend/src/data/projects/dataPilot.ts`](frontend/src/data/projects/dataPilot.ts)，页面与聊天共用 |
| 项目详情布局 | [`ProjectDetail.tsx`](frontend/src/pages/ProjectDetail.tsx) 分派；[`components/project/`](frontend/src/components/project/) 包含通用详情、DataPilot、画廊、图片查看器和相邻导航 |
| 关于页文案与解析 | [`content/about/*.md`](frontend/src/content/about/)、[`parseAboutContent.ts`](frontend/src/content/about/parseAboutContent.ts)；[`content/about.ts`](frontend/src/content/about.ts) 负责加载与缓存 |
| 关于页布局与时间线 | [`About.tsx`](frontend/src/pages/About.tsx) 组合 [`components/about/`](frontend/src/components/about/) 中的经历、项目卡片与时间线 |
| 外部 Notion 博客入口 | [`Header.tsx`](frontend/src/components/Header.tsx)、[`SiteFooter.tsx`](frontend/src/components/SiteFooter.tsx) |
| 摄影内容 | [`frontend/src/pages/Photography.tsx`](frontend/src/pages/Photography.tsx)、[`frontend/public/data/instagram.json`](frontend/public/data/instagram.json) |
| 导航、页脚、联系浮层、图标 | [`frontend/src/components/`](frontend/src/components/) |
| AI 聊天界面与会话 | [`ChatbotOverlay.tsx`](frontend/src/components/ChatbotOverlay.tsx) 按需加载 [`ChatPanel.tsx`](frontend/src/components/chat/ChatPanel.tsx)；会话状态在 [`useChatThread.ts`](frontend/src/components/chat/useChatThread.ts) |
| 聊天语料、传输与工具 | [`siteCorpus.ts`](frontend/src/lib/siteCorpus.ts) / [`deepseekChat.ts`](frontend/src/lib/deepseekChat.ts) → [`api/chat.ts`](api/chat.ts)；[`lib/chat/`](frontend/src/lib/chat/) 管 SSE 解析、文字渐显和历史校验 |
| Hash 浮层状态、路由同步与 Escape 关闭 | [`frontend/src/hooks/useHashOverlay.ts`](frontend/src/hooks/useHashOverlay.ts) |
| 中英文公共文案 | [`frontend/src/i18n/translations.ts`](frontend/src/i18n/translations.ts)、[`LanguageContext.tsx`](frontend/src/i18n/LanguageContext.tsx)；部分页面文案直接在页面内按 locale 切换 |
| 样式与响应式 | [`styles/components.css`](frontend/src/styles/components.css) 按序导入 [`styles/components/`](frontend/src/styles/components/) 中的各页面/组件样式；跨组件断点在 `styles/responsive.css` |
| 开发服务、本地聊天接口、打包 | [`frontend/vite.config.ts`](frontend/vite.config.ts) |
| 线上 API 入口与部署 | [`api/`](api/)、[`vercel.json`](vercel.json) |
| 内容与交互回归测试 | [`tests/`](tests/)，运行器 [`scripts/test.mjs`](scripts/test.mjs) 使用 Vite 转换 TS/TSX 与 Markdown |

## 内容来源

- 首页的项目卡片与标签来自同一条 `projects.ts` 记录，调整顺序不会错配标签。通用详情读取 `projectDetails.ts`；`dataagent` 的 DataPilot 案例统一读取 `data/projects/dataPilot.ts`，不要在页面或聊天语料中另写一份文案。
- 关于页读取中英文 Markdown，所有 `##` 章节和 `###` 条目都用隐藏注释声明稳定 ID：

  ```md
  ## 核心工作经历 <!-- id: work -->
  ### 高级体验设计师 <!-- id: oceanbase -->
  ```

  章节 ID 为 `work`、`projects`、`education`、`contact`；条目 ID 在同一文件中唯一，同义条目跨语言保持一致，改标题或顺序时保留 ID。新增工作条目会自动展示，项目卡片跟随 `oceanbase` 条目；教育数据保留供聊天使用。重复或缺失 ID 会报错。
- 博客由外部 Notion 承载，入口在导航与页脚；项目不再提供站内博客页面。
- 聊天语料由本地项目、About 与翻译资源汇总，见 `buildSiteCorpus`。首次打开聊天时加载 `ChatPanel` 并生成当前语言语料；关闭浮层保留会话和进行中的流式响应。
- 摄影读取本地 JSON 快照和图片；维护流程见 [`docs/instagram-sync.md`](docs/instagram-sync.md)。

首页直接加载；About、项目详情和摄影按路由懒加载。样式始终按 tokens → foundation → components → prose → responsive 顺序加载，拆分组件样式时保留 `components.css` 的导入顺序。

## 快速搜索

先按上表缩小范围，再搜索符号或 class，避免一次性读取大型页面、样式文件或图片目录：

```bash
rg --files frontend/src api tests
rg -n 'getDataPilotContent|DATA_PILOT_DEMO_URL' frontend/src/data/projects frontend/src/components/project
rg -n 'home-hero' frontend/src/pages/Home.tsx frontend/src/styles/components/home.css
rg -n 'buildSiteCorpus|sendDeepseekChatStream' frontend/src/lib api
```

`dist/`、`node_modules/`、`.vercel/` 和 `tmp/` 已被 Git 忽略。`output/` 保存独立交付物；它与 `frontend/public/` 中的同名文件不一定相同，不用于代码检索。删除图片前还需检查 Markdown、JSON、动态路径及外部链接的引用。

视觉规范见 [`DESIGN.md`](DESIGN.md)。修改后运行 `npm test` 和 `npm run build`；开发中可单独运行 `npm run typecheck`。涉及界面时再检查相关页面的中英文、深浅主题和移动端表现。

