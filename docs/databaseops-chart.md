# 数据库运维平台：迁移漏斗

采用四层实色 SVG 漏斗，各层顶部宽度与阶段数量成比例，底部衔接下一阶段数量，末层保持同宽。沿用此前图表的阶段对齐、右侧标签和原生按钮交互。

## 视觉与交互

- 阶段依次为「创建迁移项目、连接数据源、预检查、启动项目」。右侧信息占约三分之一，数量以小字号显示，转化率以较大字号显示，不展示序号。
- 选中阶段使用低饱和灰蓝强调色，其他层使用浅灰蓝；支持点击、指针悬停及键盘聚焦切换。35.34% 标红，突出连接数据源的卡点。
- 外围增加细边框，底部总结强调整体完成率 16.8%，使用站点 `--danger` 变量加粗标红。
- 色值复用 `styles/tokens.css`，兼容深浅主题；窄屏保留两侧布局并将转化率放到阶段信息下方。滚入后依次淡入，减少动效设置下直接显示。

## 数据口径

- 前两步数量 2428、858 及相邻转化率来自用户原图。
- 后两步 566、408 按转化率估算。页面按用户要求隐藏「约」，悬停提示、无障碍描述及聊天语料保留估算口径。
- 16.8% 是优化前熟练用户的整体任务创建完成率；阶段转化率以各自前一步为分母。
- 文案和数据由 `data/projects/databaseOps.ts` 统一提供给页面与聊天，无需额外图表运行库。

## 模板演进与许可

最初布局参考 [Lieflat Charts](https://github.com/larashero3-dotcom/lieflat-charts) `75c6978` 的 **L13 Hourglass Stream**（`templates/lupi-gallery.html` 中的 **The funnel, poured**）。根据用户反馈，已将刻线与流向曲线替换为分段色块，突出阶段流失与选中状态。

原模板作者：躺在废墟里。原改编代码的 [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) 与来源说明继续保留，原始许可见 [LICENSE](https://github.com/larashero3-dotcom/lieflat-charts/blob/75c6978/LICENSE)。
