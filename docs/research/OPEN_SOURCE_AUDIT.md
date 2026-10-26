# 开源源码与运行核验

查询/运行日期：2026-10-26。精确commit及许可证SHA256见 `evidence/licenses/upstream-pins.json`。所有仓库克隆在隔离 `vendor/`，未加入交付Git历史。星数不能证明适合商业化；玩法选择在检索这些项目之前形成。

|候选|上游及固定commit|许可证与复用范围|实际运行证据|改造范围/限制|
|---|---|---|---|---|
|折线爆破|[viliceq/10block](https://github.com/viliceq/10block/tree/93dfa7eaf785043d038a4e5f20ba358d90f6edd9)|MIT；保留版权；改编放置合法性/同步消行结构|源码build通过，上游379测试通过；390宽触控环境实际拖一块，填充格0→3|保留基本规则；新8×8UI、四线挑战、可构造发牌、交点余波；没有复制其图标、PWA及用户数据|
|调色中转站参考A|[Evgeny-/water-sort](https://github.com/Evgeny-/water-sort/tree/9405d54dfc15ab361148e12655ee9de096237c05)|无根许可证，**不复用**代码/资源/关卡|源码build通过，手机尺寸进入关卡并实际倒色，计步0/18→1/18|仅隔离参考。README已出现2格小管，因此放弃把“半容量管”包装成本轮原创；不会因完整UI方便就选它|
|调色中转站参考B/纯规则移植|[vp125/water-sort](https://github.com/vp125/water-sort/tree/79fb6ce668c1e5731c6c235cc480f3efe5f9ce8c)|MIT，移植 `puzzle_state.gd` 静态规则为 `src/sort-core.mjs`；保留完整许可|Godot源码已clone/read；原生Godot未本地构建；公开Web导出只加载到进度条。**移植后的JS核心在本轮H5中完成400种子和十局触控验证**|无资产/预制关卡复用。增加一次整管倒转、独立反向生成器/求解器/免费撤销/符号辨色。此项目不能被称为“原生构建已通过”|
|借力拆塔|[liabru/matter-js](https://github.com/liabru/matter-js/tree/b8ee71cd7f9b49f53639ddaedd6254f1929bcbe5)|MIT，实际使用0.20.0引擎构建；保留许可|克隆读取官方slingshot源码；本地原示例拖动发射后刚体状态变化；本轮15布局物理测试及修正后另十局触控通过|未找到同时满足完整度/素材权利的可靠拆塔游戏，采用成熟物理引擎自建最小规则；炮口、目标、核心、布局和反馈全部本轮生成|

依赖：游戏运行无npm依赖、无外部CDN；Matter.js在本地随包提供。测试开发依赖Playwright固定1.64.1（Apache-2.0，实际包内LICENSE保留），不进入运行包。参考项目自己的React/Three/Vite/PWA等依赖只在vendor，不随本轮游戏发行。字体是系统字体，几何图形为代码绘制，声音是即时合成。

不复用清单：商业游戏的角色/关卡/材质/UI/音轨、无许可排序项目的所有代码与素材、上游Godot预制关卡/声音/图标、10block图标及PWA资源。研究截帧只能作评审证据，不能作游戏发行美术。

移动H5范围：本轮Chromium 360/390/430宽和真实触控事件；WebKit只做启动/渲染/无横溢出检查。未做iPhone/Android真机、TapTap宿主、低端设备长时或广告SDK验证。
