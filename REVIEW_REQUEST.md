# REVIEW_REQUEST

REVIEW_GOAL: 判断本轮市场证据、三个裸玩法实验与技术可玩性是否足够支持Human进一步试玩筛选；找出会导致误立项或错误声称“好玩”的问题。

QUESTIONS_FOR_REVIEW:
1. 59款样本的榜单/累计安装/活动热度/评分口径是否清楚，15款实玩未全部完成的缺口是否足以改变三选结论？重点挑战从市场信号到本轮最小玩法的推断。
2. 三个新增规则是否改变真实决策、能否与普通规则有效比较，是否还有无法解释的必败、物理提前结算、排序无解或触控误操作？请结合可玩入口和原始十局证据。
3. 在Human亲自各玩十局后，哪款值得继续或三款应否全部淘汰？仍缺哪些体验/真机/宿主证据，才能进入下一商业阶段，而不把机器人测试当人类接受？

SUSPECTED_RISKS: 当前榜单受投放影响；多款只读到明确规则而非长时实玩；排序上游Godot未原生运行；几何原型的反馈可能仍单调；拆塔可重复布局范围窄；求解预算不足不等于无解；尚无真实设备/TapTap宿主或Human重玩证据。

FILES_TO_INSPECT / WHY_EACH_FILE_MATTERS:
- `docs/research/market-games.csv/json`, `MARKET_RESEARCH.md`：逐款指标与来源，检验有没有把不同指标互换。
- `GAMEPLAY_ANALYSIS.md`, `DIRECTION_DECISIONS.md`：证据等级、A–E机制拆解及淘汰取舍，检验不是因开源方便选题。
- `OPEN_SOURCE_AUDIT.md`, `THIRD_PARTY_NOTICES.md`, `evidence/licenses/upstream-pins.json`：固定源码、许可、真实运行范围与不可复用内容。
- `src/blocks.mjs`, `src/sort-core.mjs`, `src/sort.mjs`, `src/tower.mjs`：实际规则、生成/可解见证、倒转和物理终局优先级。
- `scripts/browser-test.mjs`, `tests/rules.test.mjs`：测试是否通过真实输入，有没有注入赢局或把函数返回值当体验证明。
- `evidence/runtime/*tests*.json/txt`, `output/playwright/*-operations.mp4`：真实输入循环与失败/修正证据。
- `REPORT.md`, `MANIFEST.json`, `resource-cleanup.json`, `preservation-after.json`：声明边界、成员摘要、任务资源和旧项目保留。

RAW_EVIDENCE: `evidence/research/source-index.json`, `dataset-validation.json`, `reference-runtime.json`, `official-portal-previews.json`（含失败）, `royal-smash-listing.json`, `sand-blocks-listing.json`, `evidence/runtime/rules-*.txt`, `browser-tests-before-settle-fix.json`, `browser-tests-settle-fix.json`, `browser-tests-sort-port.json`, `upstream-sort-pour.json`, `upstream-and-webkit.json`, `remote-preview.json`，手机/桌面截图与三段实际操作录屏。商业预览抽帧未标作完整AV实玩。

EXPECTED_GOOD_RESULT: 三款能够直接玩、可解释胜负并迅速重试；指标和许可证据可追溯；无法完成的实玩/真机/商业验收明确保留；Human可以通过实际体验选择一款或全部淘汰，无需先批准正式美术/广告投入。
