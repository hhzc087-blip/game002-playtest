// Placement and simultaneous-clear structure adapted from viliceq/10block,
// MIT (c) 2026 viliceq. See third_party/10BLOCK_LICENSE.txt.
export function rng(seed){let x=(seed|0)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
export const SHAPES=[[[0,0]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[1,0],[1,1]],[[0,1],[1,0],[1,1]],[[0,0],[0,1],[0,2],[1,1]],[[0,0],[1,0],[2,0],[2,1]],[[0,0],[0,1],[0,2],[0,3]]];
export function fits(board,shape,r,c){return shape.every(([a,b])=>r+a>=0&&r+a<8&&c+b>=0&&c+b<8&&!board[r+a][c+b])}
export function resolveLines(board,variant){
 const rows=[],cols=[];for(let r=0;r<8;r++)if(board[r].every(Boolean))rows.push(r);for(let c=0;c<8;c++)if(board.every(row=>row[c]))cols.push(c);
 const b=board.map(row=>row.slice()),cleared=[];
 for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(rows.includes(r)||cols.includes(c)||(variant&&rows.some(y=>Math.abs(y-r)<=1)&&cols.some(x=>Math.abs(x-c)<=1))){if(b[r][c])cleared.push([r,c,b[r][c]]);b[r][c]=0}
 return{board:b,lines:rows.length+cols.length,cleared,burst:variant&&rows.length>0&&cols.length>0};
}
export function legalMoves(g){const moves=[];g.tray.forEach((p,i)=>{if(p)for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(fits(g.board,p.cells,r,c))moves.push({i,r,c})});return moves}
function deal(g){
 // Each three-piece deal has a constructive legal placement order on the current board.
 const rand=rng(g.randomState++),ghost={board:g.board.map(r=>r.slice()),tray:[]};g.tray=[];g.dealWitness=[];
 for(let i=0;i<3;i++){
  let candidates=[];for(let s=0;s<SHAPES.length;s++)for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(fits(ghost.board,SHAPES[s],r,c))candidates.push({s,r,c});
  if(!candidates.length){g.status='lost';return}
  const pick=candidates[Math.floor(rand()*candidates.length)],cells=SHAPES[pick.s],color=1+Math.floor(rand()*5);g.tray.push({cells:cells.map(x=>x.slice()),color});g.dealWitness.push({i,r:pick.r,c:pick.c});
  for(const [a,b]of cells)ghost.board[pick.r+a][pick.c+b]=color;ghost.board=resolveLines(ghost.board,g.variant).board;
 }
}
export function newBlocks(seed=1,variant=true){const rand=rng(seed),board=Array.from({length:8},()=>Array(8).fill(0));
 // Sparse opening, no complete line and no hidden difficulty manipulation.
 for(let r=4;r<8;r++)for(let c=0;c<8;c++)if(rand()<.40)board[r][c]=1+Math.floor(rand()*5);
 const g={seed,variant,board,tray:[],score:0,lines:0,moves:0,status:'playing',randomState:(seed|0)+1000,last:null};deal(g);return g;
}
export function placeBlock(g,i,r,c){const p=g.tray[i];if(g.status!=='playing'||!p||!fits(g.board,p.cells,r,c))return false;
 const b=g.board.map(row=>row.slice());for(const[a,d]of p.cells)b[r+a][c+d]=p.color;const out=resolveLines(b,g.variant);g.board=out.board;g.last=out;g.tray[i]=null;g.moves++;g.lines+=out.lines;g.score+=p.cells.length+out.lines*out.lines*20+(out.burst?50:0);
 if(g.lines>=4)g.status='won';else{if(g.tray.every(p=>!p))deal(g);if(g.status==='playing'&&!legalMoves(g).length)g.status='lost'}return true;
}
