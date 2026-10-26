import{newSort,pour,invertTube,undoSort,solveSort,isSorted}from'./sort.mjs';
const COLORS=['#ffb7a3','#a3d6f7','#d3f489','#d0b8ef'],SYMBOLS=['●','◆','▲','✚'];
export function mountSort(host,seed,variant,ui){
 const g=newSort(seed,variant);let selected=-1,flipMode=false,hinted=[];const board=document.createElement('div');board.className='tube-board';host.replaceChildren(board);
 function render(){board.replaceChildren();g.tubes.forEach((tube,i)=>{const b=document.createElement('button');b.className='tube'+(selected===i?' selected':'')+(hinted.includes(i)?' hinted':'')+(tube.length===4&&tube.every(x=>x===tube[0])?' complete':'');b.dataset.tube=i;b.setAttribute('aria-label',`管${i+1}，从底到顶 ${tube.map(x=>SYMBOLS[x]).join(' ')||'空'}`);b.disabled=g.status!=='playing';for(const c of tube){const d=document.createElement('span');d.className='drop';d.style.background=COLORS[c];d.textContent=SYMBOLS[c];b.append(d)}const label=document.createElement('span');label.className='tube-label';label.textContent=tube.length===0?'空管':`${i+1}`;b.append(label);board.append(b)});
  ui.stats(`已归位 ${g.tubes.filter(t=>t.length===4&&t.every(x=>x===t[0])).length} / 4 色`,`倒色 ${g.moves} 次`);ui.flipState(g.flipLeft,flipMode);if(g.status==='won')ui.finish('won',Math.max(0,100-g.moves),`${g.moves} 步完成；倒转${variant?(g.flipLeft?'尚未使用':'已使用'):'关闭'}`);
 }
 board.onclick=e=>{const b=e.target.closest('[data-tube]');if(!b)return;ui.gesture();const i=Number(b.dataset.tube);hinted=[];
  if(flipMode){if(invertTube(g,i)){ui.sound('clear');ui.feedback('整管倒转！原来的底色来到顶端。')}else ui.feedback('选择一支至少有两种颜色的管。');flipMode=false;selected=-1;render();return}
  if(selected<0){if(!g.tubes[i].length){ui.feedback('先选一支有颜色的管。');return}selected=i;ui.sound('tap');ui.feedback('再点空管，或顶层同色的管。')}
  else if(selected===i)selected=-1;
  else if(pour(g,selected,i)){selected=-1;ui.sound('clear');ui.feedback('倒入同色。留意下一步腾出的空间。');if(g.status==='playing'&&!solveSort(g,15000))ui.feedback('暂未找到后续解法。可以免费撤销或重试。')}
  else{ui.sound('bad');ui.feedback('只能倒进空管或顶层同色、还有空间的管。');selected=i===selected?-1:selected}render();
 };
 render();return{state:()=>structuredClone(g),hint(){const path=solveSort(g);if(!path?.length){ui.feedback('暂未找到可用解法。可以撤销几步，或重试这局。');return}hinted=path[0];selected=-1;ui.feedback(`试试从 ${hinted[0]+1} 号管倒入 ${hinted[1]+1} 号管。`);render()},undo(){if(undoSort(g)){selected=-1;flipMode=false;hinted=[];ui.feedback('已撤销，倒转机会也随这一步恢复。');render()}},flip(){if(!g.flipLeft){ui.feedback('本局倒转机会已经用过。');return}flipMode=!flipMode;selected=-1;ui.feedback('点一支混色管，把整管上下倒转。');render()},dispose(){board.onclick=null}};
}
