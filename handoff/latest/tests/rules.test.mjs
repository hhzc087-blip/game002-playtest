import test from 'node:test';import assert from 'node:assert/strict';
import {newBlocks,placeBlock,legalMoves,resolveLines,fits} from '../src/blocks.mjs';
import {newSort,pour,solveSort,isSorted,invertTube,undoSort} from '../src/sort.mjs';
import {newTower,shoot,stepTower} from '../src/tower.mjs';

test('a crossing row and column clear simultaneously, burst is a real rules difference',()=>{
 const board=Array.from({length:8},()=>Array(8).fill(0));board[3].fill(1);for(let r=0;r<8;r++)board[r][3]=1;board[2][2]=1;
 const base=resolveLines(board,false),variant=resolveLines(board,true);
 assert.equal(base.lines,2);assert.equal(base.board[2][2],1);assert.equal(variant.board[2][2],0);
});
test('invalid placement never consumes a piece or changes score',()=>{const g=newBlocks(10);const before=JSON.stringify(g);assert.equal(placeBlock(g,0,-5,-5),false);assert.equal(JSON.stringify(g),before)});
test('same seed has the same offers, and ten rounds can reach actual terminal states',()=>{
 for(let seed=1;seed<=10;seed++){let a=newBlocks(seed),b=newBlocks(seed);assert.deepEqual(a,b);let turns=0;while(a.status==='playing'&&turns++<400){const moves=legalMoves(a);assert(moves.length);const m=moves[seed%moves.length];placeBlock(a,m.i,m.r,m.c)}assert.notEqual(a.status,'playing')}
});
test('sort rejects different top colors and full targets without mutation',()=>{const g={tubes:[[0,1],[0]],caps:[4,1],moves:0,status:'playing',history:[]};const x=JSON.stringify(g);assert.equal(pour(g,0,1),false);assert.equal(JSON.stringify(g),x)});
test('generated sorting puzzles have a valid executable witness across 200 seeds per mode',()=>{
 for(const variant of [false,true])for(let seed=1;seed<=200;seed++){const g=newSort(seed,variant);assert(!isSorted(g.tubes,g.caps));const solution=solveSort(g,80000);assert(solution&&solution.length>0,`seed ${seed}`);for(const [a,b] of solution)assert(pour(g,a,b));assert.equal(g.status,'won');}
});
test('single inversion changes buried color access and cannot be reused',()=>{const g=newSort(3,true);const i=g.tubes.findIndex(t=>t.length>1&&new Set(t).size>1),before=g.tubes[i].slice();assert(invertTube(g,i));assert.deepEqual(g.tubes[i],before.reverse());assert(!invertTube(g,i))});
test('tower uses real physical hits and ten layouts can end by legal shots',()=>{
 for(let seed=1;seed<=15;seed++){const g=newTower(seed,true);for(let f=0;f<45;f++)stepTower(g);let tries=0;while(g.status==='playing'&&tries++<12){const targets=g.targets.filter(t=>!t.removed).sort((a,b)=>a.position.y-b.position.y);assert(targets.length);const t=targets[0];shoot(g,t.position.x,t.position.y);for(let f=0;f<300&&g.status==='playing';f++)stepTower(g);}assert.equal(g.status,'won',`seed ${seed}: ${g.status}, targets ${g.targets.filter(t=>!t.removed).length}`);assert(g.hits>0);}
});
test('protecting the core is an actual loss condition',()=>{const g=newTower(1,true);g.core.position.x=-100;stepTower(g);assert.equal(g.status,'lost')});
test('every new deal has a full constructive placement order, across 100 seeds',()=>{for(let seed=1;seed<=100;seed++){const g=newBlocks(seed);for(const m of g.dealWitness){const p=g.tray[m.i];assert(fits(g.board,p.cells,m.r,m.c));placeBlock(g,m.i,m.r,m.c)}}});
test('reverse-generated witnesses themselves execute, independently of solver',()=>{for(let seed=1;seed<=200;seed++){const g=newSort(seed);const path=g.witness.slice();for(const[a,b]of path){if(g.status==='won')break;assert(pour(g,a,b))}assert.equal(g.status,'won')}});
test('undo restores a used inversion and no color mass is created',()=>{const g=newSort(5),t=g.tubes.map(t=>t.slice()),i=t.findIndex(t=>new Set(t).size>1);assert(invertTube(g,i));assert(undoSort(g));assert.deepEqual(g.tubes,t);assert.equal(g.flipLeft,1)});
test('clearing targets cannot declare victory while a projectile may still hit the core',()=>{const g=newTower(2,true);g.targets.forEach(t=>t.removed=true);shoot(g,80,300);g.shotAge=91;stepTower(g);assert.equal(g.status,'playing')});
