# Three H5 experiments implementation plan

Goal: produce touch-playable experiments with independently verified rules and one ten-round Human comparison entry.
Architecture: three separate rules modules plus renderers; a thin shared page shell. Local MIT Matter.js for physics, original procedural geometry and generated tones. No generic game engine or backend.

- [x] Validate upstream: inspect LICENSE/README/manifests/core files in vendor/10block, vendor/water-sort, vendor/matter-js. Pin commits. Run a single localhost server and single headless browser; record inputs and observed state changes. Reject assets/dependencies without clear rights.
- [x] Domain tests first in tests/rules.test.mjs: simultaneous clears, invalid placements, no-fit, seeded deals; sorting color/capacity, generated witness, solver/deadlock, undo; physical hit, protected core, final shot and restart. Run `node --test tests/rules.test.mjs` and retain initial failure.
- [x] Implement src/blocks.mjs, src/sort.mjs, src/tower.mjs. Use transparent seeds and a bounded simulation; do not tune difficulty from monetization. Run node tests, sweep hundreds of seeds and at least 15 physics layouts.
- [x] Build index.html/style.css and src/app.mjs, src/*-view.mjs. One sentence per rule, touch targets, drag/tap, live highlights, end/retry, normal/variant and seed controls. Local history counts only real ended rounds. Optional feedback/export must use actual observed results.
- [x] Browser verification in scripts/browser-test.mjs: real pointer/touch input, ten completed rounds each, mobile 360/390/430, desktop, broken storage, restart, no console/network errors; capture screenshots and operation videos. Run at most one browser process.
- [x] Bundle minimum source/research/evidence with scripts/handoff.py. Verify archive/latest equality, exact ZIP members, CRC and SHA256. Publish private GitHub repository + Release under PUBLISH_HANDOFF; remotely download and verify hashes. Human acceptance stays PENDING.

User has already chosen autonomous inline execution; no additional workflow-selection pause. This instruction supersedes generic skill prompts asking Human to choose an execution style.

Scope note: native Godot upstream build was not performed; the MIT pure-rule JS port is what was executed. Commercial-game public runtime attempts include failures. See REPORT for these open evidence limits.
