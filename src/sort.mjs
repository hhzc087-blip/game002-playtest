// Original implementation of public sorting rules. No unlicensed upstream code/assets.
import {rng}from './blocks.mjs';
const key=t=>t.map(a=>a.join('')).join('|');
export function isSorted(tubes,caps){return tubes.every((t,i)=>!t.length||(t.length===caps[i]&&t.every(c=>c===t[0])))}
function moved(tubes,caps,a,b){if(a===b||!tubes[a]?.length||!tubes[b]||tubes[b].length>=caps[b])return null;const color=tubes[a].at(-1);if(tubes[b].length&&tubes[b].at(-1)!==color)return null;let run=0;for(let j=tubes[a].length-1;j>=0&&tubes[a][j]===color;j--)run++;const n=Math.min(run,caps[b]-tubes[b].length),next=tubes.map(t=>t.slice());next[b].push(...next[a].splice(-n));return next}
export function newSort(seed=1,variant=true){const random=rng(seed),caps=[4,4,4,4,4,4];let tubes=[[0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[],[]],witness=[],seen=new Set([key(tubes)]);
 for(let step=0;step<30;step++){
  const choices=[];for(let a=0;a<6;a++)if(tubes[a].length)for(let b=0;b<6;b++)if(a!==b)for(let n=1;n<=tubes[a].length&&n<=caps[b]-tubes[b].length;n++){
   const c=tubes[a].at(-1);if(!tubes[a].slice(-n).every(v=>v===c))continue;const next=tubes.map(t=>t.slice());next[b].push(...next[a].splice(-n));if(seen.has(key(next)))continue;
   const forward=moved(next,caps,b,a);if(forward&&key(forward)===key(tubes))choices.push({next,move:[b,a]});
  }
  if(!choices.length)break;const choice=choices[Math.floor(random()*choices.length)];tubes=choice.next;seen.add(key(tubes));witness.unshift(choice.move);
 }
 return{seed,variant,tubes,caps,moves:0,status:'playing',history:[],flipLeft:variant?1:0,witness};
}
export function pour(g,a,b){if(g.status!=='playing')return false;const next=moved(g.tubes,g.caps,a,b);if(!next)return false;g.history.push({tubes:g.tubes.map(t=>t.slice()),moves:g.moves,flipLeft:g.flipLeft});g.tubes=next;g.moves++;g.last={a,b};if(isSorted(g.tubes,g.caps))g.status='won';return true}
export function invertTube(g,i){if(g.status!=='playing'||!g.flipLeft||!g.tubes[i]||g.tubes[i].length<2||new Set(g.tubes[i]).size<2)return false;g.history.push({tubes:g.tubes.map(t=>t.slice()),moves:g.moves,flipLeft:g.flipLeft});g.tubes[i].reverse();g.flipLeft--;g.moves++;g.last={flip:i};return true}
export function undoSort(g){const old=g.history.pop();if(!old)return false;Object.assign(g,old,{status:'playing',last:null});return true}
export function solveSort(g,budget=80000){
 // DFS over actual legal pours; equal-capacity tube symmetry removes redundant states.
 const seen=new Map();let visited=0;const canonical=t=>t.map((a,i)=>`${g.caps[i]}:${a.join('')}`).sort().join('|');
 function search(t,path){if(isSorted(t,g.caps))return path;if(path.length>65||++visited>budget)return null;const k=canonical(t);if((seen.get(k)??Infinity)<=path.length)return null;seen.set(k,path.length);
  const moves=[];let usedEmpty=false;
  for(let a=0;a<t.length;a++)if(t[a].length)for(let b=0;b<t.length;b++)if(a!==b){if(!t[b].length){if(usedEmpty&&a===0)continue;if(t[a].every(c=>c===t[a][0]))continue}const next=moved(t,g.caps,a,b);if(next){const bonus=(t[b].length?10:0)+(next[b].length===g.caps[b]?8:0);moves.push({a,b,next,bonus})}}
  moves.sort((a,b)=>b.bonus-a.bonus);const duplicate=new Set();for(const m of moves){const nk=canonical(m.next);if(duplicate.has(nk))continue;duplicate.add(nk);const out=search(m.next,[...path,[m.a,m.b]]);if(out)return out}return null;
 }return search(g.tubes,[]);
}
