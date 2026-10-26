# GAME 002 prototype spec

Research precedes selection; see MARKET_RESEARCH.md and DIRECTION_DECISIONS.md. Human's autonomous instruction supersedes generic pre-build approval pauses. Three alternatives were compared: content-heavy management, deterministic puzzles, and immediate physics skill loops. Chosen experiments combine the strongest low-content loops, not a mandatory category split.

Implementation: static ES modules and Canvas/DOM. No server state, authentication, CDN assets or analytics. Matter.js is vendored locally with MIT notice. Each game owns its small rules module and UI; no general engine/library platform. Shared shell only handles sound, seed, navigation and voluntary local playtest notes.

Every game has one-sentence instructions on the play surface, obvious touch targets, immediate visual/audio feedback, clear win/loss/challenge end, same-seed retry and next-seed round. Sound is user-controlled and synthesized locally. Save only completed round counts/best score/preferences; an active round need not persist. Corrupted/unavailable storage must not block play. Optional ten-round ratings stay on device and export as JSON, never uploaded.

Game A: 8x8, three offered polyominoes, drag or tap-to-select/tap-to-place, simultaneous full-row/column clearing. Fixed transparent PRNG independent of ads/player value. Cross-line clear adds a radius-one cross burst in variant mode. Challenge target clears four lines; no-fit loses. A normal/variant switch enables genuine mechanics comparison.

Game B: sort four colors across capacity-four tubes plus two empty buffers. In variant the player may invert one mixed tube once per round; this changes access to buried colors. A half-capacity buffer was rejected after discovering it already exists in the inspected upstream. Reverse-generation creates legal forward witness; bounded solver verifies every shipped seed and can provide hint. Invalid pour changes nothing. Undo and same-seed retry are free; all tubes homogeneous and full-or-empty wins. Current deadlock gets explicit notice and undo. No forced timer.

Game C: drag from cannon to aim, release shoots into Matter.js structures. Targets count as cleared after physically leaving platform. Variant protects a blue core; core leaving its safe area loses even if all targets cleared. Ball/shots settle before outcome evaluation; maximum simulation duration prevents endless jitter. At least ten distinct layouts each have a witness shot sequence tested against real physics. No protected commercial assets/levels.

Validation: domain invariants and edge cases, hundreds of puzzle seeds, actual physics shot sequences, 10 complete rounds per game through UI/touch, desktop and narrow phone, console/resource checks, screenshots and recorded operations. Desktop emulation is not real device/TapTap validation. Human fun acceptance is PENDING regardless of test result.
