// JavaScript port of vp125/water-sort scripts/core/puzzle_state.gd static helpers.
// MIT Copyright (c) 2026 vp125. See third_party/WATER_SORT_LICENSE.txt.
// Changes: per-tube capacities, defensive invalid-index checks, immutable wrapper upstream.
export function runLength(tube){if(!tube.length)return 0;const color=tube.at(-1);let n=0;for(let k=tube.length-1;k>=0;k--){if(tube[k]!==color)break;n++}return n}
export function canPourBetween(tubes,caps,from,to){if(from===to||!tubes[from]||!tubes[to])return false;const src=tubes[from],dst=tubes[to];if(!src.length||dst.length>=caps[to])return false;return!dst.length||dst.at(-1)===src.at(-1)}
export function applyPour(tubes,caps,from,to){const src=tubes[from],dst=tubes[to],count=Math.min(runLength(src),caps[to]-dst.length),color=src.at(-1);for(let i=0;i<count;i++){src.pop();dst.push(color)}return count}
export function allSorted(tubes,caps){for(let i=0;i<tubes.length;i++){const tube=tubes[i];if(!tube.length)continue;if(tube.length!==caps[i]||runLength(tube)!==caps[i])return false}return true}
