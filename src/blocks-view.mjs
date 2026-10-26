import{newBlocks,placeBlock,fits}from'./blocks.mjs';
const COLORS=['','#d3f489','#a3d6f7','#ffb7a3','#d0b8ef','#f8d589'];
export function mountBlocks(host,seed,variant,ui){
 const g=newBlocks(seed,variant),canvas=document.createElement('canvas');canvas.width=800;canvas.height=1080;canvas.setAttribute('aria-label','8×8摆块棋盘。先点下方形块，再点棋盘左上落点。');host.replaceChildren(canvas);const ctx=canvas.getContext('2d');ctx.scale(2,2);let selected=0,drag=false,moved=false,start=null,ghost=null,pulse=0,raf;
 const pos=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.x)*400/r.width,y:(e.clientY-r.y)*540/r.height}};
 function cell(x,y,color,alpha=1,size=39){ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,size,size,6);ctx.fill();ctx.fillStyle='#ffffff28';ctx.fillRect(x+5,y+4,size-10,3);ctx.globalAlpha=1}
 function draw(){ctx.clearRect(0,0,400,540);for(let r=0;r<8;r++)for(let c=0;c<8;c++)cell(28+c*43,25+r*43,COLORS[g.board[r][c]]||'#213749');
  if(ghost&&g.tray[selected]){let p=g.tray[selected],ok=fits(g.board,p.cells,ghost.r,ghost.c);for(const[a,b]of p.cells)if(ghost.r+a>=0&&ghost.r+a<8&&ghost.c+b>=0&&ghost.c+b<8)cell(28+(ghost.c+b)*43,25+(ghost.r+a)*43,ok?COLORS[p.color]:'#ff6f79',.6)}
  ctx.fillStyle='#93aebb';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText('拖动放置，或先点形块再点棋盘',200,396);
  g.tray.forEach((p,i)=>{ctx.fillStyle=selected===i?'#334c53':'#1c3042';ctx.beginPath();ctx.roundRect(10+i*130,418,120,105,12);ctx.fill();if(p){const w=Math.max(...p.cells.map(x=>x[1]))+1,h=Math.max(...p.cells.map(x=>x[0]))+1;for(const[r,c]of p.cells)cell(10+i*130+(120-w*24)/2+c*24,418+(105-h*24)/2+r*24,COLORS[p.color],1,21)}else{ctx.fillStyle='#617c8c';ctx.fillText('✓',70+i*130,478)}});
  if(pulse>0){ctx.fillStyle=`rgba(211,244,137,${pulse*.16})`;ctx.fillRect(24,20,352,352);pulse-=.04;raf=requestAnimationFrame(draw)}
 }
 function render(){ui.stats(`清除 ${g.lines} / 4 条线`,`得分 ${g.score}`);draw();if(g.status!=='playing')ui.finish(g.status,g.score,`放置 ${g.moves} 次，清除 ${g.lines} 条线`)}
 function drop(r,c){if(placeBlock(g,selected,r,c)){const lines=g.last?.lines||0;ui.sound(lines?'clear':'tap');ui.feedback(lines?(g.last.burst?'交叉余波！交点周围额外清除':`清除 ${lines} 条线`):'落下了。为下一块留一点空间。');if(lines)pulse=1;selected=g.tray.findIndex(Boolean);if(selected<0)selected=0;ghost=null;render()}else{ui.sound('bad');ui.feedback('这里放不下，换一个落点。');draw()}}
 canvas.onpointerdown=e=>{e.preventDefault();const p=pos(e);ui.gesture();if(p.y>=418){const i=Math.floor((p.x-10)/130);if(i>=0&&i<3&&g.tray[i]){selected=i;drag=true;moved=false;start=p;canvas.setPointerCapture(e.pointerId);draw()}}else if(p.y<370&&g.tray[selected])drop(Math.floor((p.y-25)/43),Math.floor((p.x-28)/43))};
 canvas.onpointermove=e=>{if(!drag)return;const p=pos(e);if(Math.hypot(p.x-start.x,p.y-start.y)>8)moved=true;const w=Math.max(...g.tray[selected].cells.map(x=>x[1]))+1;ghost={r:Math.floor((p.y-25)/43)-1,c:Math.floor((p.x-28)/43)-Math.floor(w/2)};draw()};
 canvas.onpointerup=e=>{if(drag&&moved&&ghost)drop(ghost.r,ghost.c);drag=false;ghost=null;draw()};canvas.onpointercancel=()=>{drag=false;ghost=null;draw()};
 render();return{state:()=>structuredClone(g),dispose(){cancelAnimationFrame(raf);canvas.onpointerdown=canvas.onpointermove=canvas.onpointerup=canvas.onpointercancel=null}};
}
