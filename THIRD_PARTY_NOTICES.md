# 开源与素材说明

本试玩代码与几何图形在GAME 002隔离目录开发；不包含GAME 001素材、商业游戏角色、关卡、界面或音频。标题与规则差异是本轮实验方案，不宣称基础玩法类别独占或全球首创。

- **Matter.js 0.20.0** — Liam Brummitt and contributors，MIT。实际物理引擎文件 `third_party/matter.js`；原许可证 `third_party/MATTER_LICENSE.txt`。源：<https://github.com/liabru/matter-js>。用于碰撞、刚体与场景模拟。
- **10block** — Copyright (c) 2026 viliceq，MIT。摆块合法性与行列同步消除结构参考/改编自其 `src/engine.ts`；保留 `third_party/10BLOCK_LICENSE.txt`。源：<https://github.com/viliceq/10block>。本轮改成8×8、有终局挑战目标、独立UI、可构造发牌与交叉余波。
- **Evgeny-/water-sort** — 检查到仓库根目录没有许可证。只在隔离vendor目录编译运行，**未复制代码、关卡、图片、字体或声音进入交付游戏**。不作商业可复用底座。
- **vp125/water-sort** — MIT代码及作者明确覆盖的生成音效/图标；克隆核验作为排序规则/生成方法参考，本轮未复制其资产或GDScript代码。原型排序为独立JavaScript实现。其Godot原生导出需单独工具链；报告明确实跑范围。

所有候选使用系统字体；反馈音由Web Audio即时合成；不加载外部CDN、付费API、广告SDK、统计SDK。`vendor/`、npm依赖和临时工具不进入试玩包。研究资料中的商标/玩法截图仅作为来源指引与评审证据，不能作为发行素材。
