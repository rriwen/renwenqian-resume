# 项目工作指南

## 先定位，再读取

- 先读根目录 `README.md` 的任务索引；视觉改动再读 `DESIGN.md`。
- 源码集中在 `frontend/src/`、`api/`。先 `rg --files`，再按符号或 class 搜索，按需读取命中附近内容。
- 默认跳过 `node_modules/`、`dist/`、`.vercel/`、`tmp/`、`output/` 和图片/PDF；不要为了解项目而读取 `.env*` 中的真实配置，变量说明看 `.env.example`。
- 组件已按 `components/project/`、`components/about/`、`components/chat/`、`components/Lanyard/` 分域，组件样式在 `styles/components/`；先按任务选目录，再搜索函数、选择器或项目 slug。

## 结构与内容边界

- `App.tsx`：路由、主题和全局浮层；首页直接加载，About、项目详情和摄影按路由懒加载。`pages/` 组合页面，`components/` 按功能拆分 UI。
- `data/projects.ts`：项目清单、稳定 slug 与双语标签；标签属于项目记录，不能按数组位置另行关联。`data/projectDetails.ts`：通用双语详情；`data/projects/dataPilot.ts`：DataPilot 文案、链接与配图的唯一来源，详情页与聊天共用。
- `content/about/*.md`：关于页双语内容；`content/about/parseAboutContent.ts`：纯解析；`content/about.ts`：加载与缓存。每个 `##` / `###` 标题须有 `<!-- id: stable-id -->`，同文件 ID 唯一、同义条目跨语言一致；改标题或顺序保留 ID。章节 ID 固定为 `work`、`projects`、`education`、`contact`。
- `components/about/WorkEntry.tsx` 按 ID 保留特殊布局，项目卡片跟随 `oceanbase`，经历用循环展示。教育文案仍供聊天使用；不要恢复不可达的隐藏 UI 副本。
- `components/Lanyard/Lanyard.tsx` 是 React 入口，`scene.ts` 管创建与清理，`simulation.ts` 管物理；纹理、几何、材质和配置分别维护。
- 博客由外部 Notion 承载，链接位于 `components/Header.tsx` 和 `components/SiteFooter.tsx`；无站内博客或数据库内容接口。
- `ChatbotOverlay.tsx` 首次打开时懒加载 `components/chat/ChatPanel.tsx`；`useChatThread.ts` 管会话、请求和语料生成，关闭浮层保留进行中的响应。`hooks/useHashOverlay.ts` 管 Hash 浮层状态、路由同步与 Escape 关闭。
- `lib/siteCorpus.ts` 汇总本地语料；`lib/deepseekChat.ts` → `api/chat.ts` 发送流式请求；`lib/chat/` 分离 SSE 解析、文字渐显、历史校验与消息裁剪。
- `public/data/instagram.json` 与 `public/images/instagram/`：摄影快照；维护说明在 `docs/instagram-sync.md`。
- `index.css` 按 tokens、foundation、components、prose、responsive 顺序加载；`styles/components.css` 仅按原级联顺序导入 `styles/components/*.css`，修改时保留导入顺序。组件专属规则在对应文件，跨组件断点在 `responsive.css`。
- 聊天服务端入口保留在根目录 `api/chat.ts`，供 Vercel 部署和本地开发中间件使用。

## 修改与验证

- 保留中英文、深浅主题和响应式布局；复用现有 CSS 变量。
- 清理前核实静态导入、动态导入、`import.meta.glob`、数据引用；公共资源可能被外部链接引用，不能只按本地文本搜索结果删除。
- 现有 `Lanyard/LICENSE.md` 是组件许可证，保留。
- `npm test` 运行 `tests/*.test.ts`，覆盖内容标识、双语数据与聊天流等关键行为；现有 Vite 运行器支持 TS/TSX 和原始 Markdown，无需额外测试依赖。
- `npm run typecheck` 检查前端、聊天 API 和 Vite 配置；`npm run build` 同时完成检查与生产构建。内容来源、解析或交互逻辑变更后运行测试与构建，界面变更还需浏览器验证。
- `npm run dev` 的聊天接口在本地执行。`npm run preview` 不启动 API。接口验证使用 `npm run dev:full`（需要 Vercel CLI）。
- `DEEPSEEK_API_KEY` 仅供服务端使用，不要把密钥放入 `VITE_*` 或客户端代码。
- 调整目录、命令或内容来源时，同步更新 `README.md` 的索引与本指南。
