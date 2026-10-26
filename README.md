# GAME 002 · 玩过再决定

[直接试玩三款H5](https://hhzc087-blip.github.io/game002-playtest/) · [远端交接入口](https://github.com/hhzc087-blip/game002-playtest/blob/main/PUBLISH_HANDOFF.md)

2026-10-26，覆盖8个平台/市场的59款产品发现、18组机制拆解、10方向比较，制作折线爆破、调色中转站、借力拆塔三个可玩实验。特色规则分别改变交叉清除、埋藏颜色访问、拆除目标与核心保护。

状态：PARTIAL / HUMAN_GAMEPLAY_PENDING。已有技术验证与实际录屏；没有确认商业吸引力，没有广告、付费API或TapTap发布。商业游戏研究并非15款全部实玩成功：多处入口加载失败，已区分官方规则文字、抽帧与实际操作证据。

本地运行：Node.js 22+，`npm start`，打开 `http://127.0.0.1:4172/`。运行不需要安装任何依赖。测试：`npm ci`、`npx playwright install chromium webkit`、`npm test`、另一个终端启动服务后 `npm run verify`。测试脚本使用真实触控输入和只读状态快照，不能强制胜利。

原型存储只有本机声音设置、真实结算局数和自愿反馈；进行中的一局不跨刷新保存。模式切换/重试还原同一种子；换局面推进种子。导出不上传任何数据。

研究在 `docs/research/`，许可证在 `THIRD_PARTY_NOTICES.md`，正式交接在 `handoff/latest/` 与不可变 `handoff/archive/`。GAME_001及父仓库历史保持原样。
