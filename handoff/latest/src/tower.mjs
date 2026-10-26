const M=globalThis.Matter??(await import('../third_party/matter.js')).default;
const {Engine,Bodies,Body,Composite,Events}=M;
export {M as Matter};
export const CANNON={x:200,y:80};
export function newTower(seed=1,variant=true){const engine=Engine.create({enableSleeping:true});engine.gravity.y=.65;
 const g={engine,seed,variant,status:'playing',shots:8,hits:0,targets:[],supports:[],balls:[],age:0,shotAge:999,last:[],coreOrigin:{x:200,y:360}};
 const floor=Bodies.rectangle(200,610,500,30,{isStatic:true,label:'floor'});g.floor=floor;
 for(const [i,x]of [83+(seed%5)*5,317-(seed%7)*4].entries()){
  const platform=Bodies.rectangle(x,430,95,16,{isStatic:true,label:'platform'});g.supports.push(platform);
  for(let r=0;r<3+(seed%2);r++){const b=Bodies.rectangle(x+(r%2?8:-8),405-r*35,44,32,{restitution:.15,friction:.45,label:'target',density:.0015});b.kind=i;g.targets.push(b)}
 }
 g.core=Bodies.circle(200,360,20,{restitution:.1,friction:.8,label:'core',density:.012});const pedestal=Bodies.rectangle(200,389,54,18,{isStatic:true,label:'pedestal'});g.supports.push(pedestal);
 Composite.add(engine.world,[floor,...g.supports,...g.targets,g.core]);
 Events.on(engine,'collisionStart',event=>{for(const pair of event.pairs){for(const[a,b]of [[pair.bodyA,pair.bodyB],[pair.bodyB,pair.bodyA]]){
  if(a.label==='target'&&!a.removed&&b.label==='ball'&&b.speed>1.6){a.marked=true;g.hits++}
  if(a.label==='core'&&b.label==='ball'&&b.speed>2&&g.variant)g.coreHit=true;
 }}});return g;
}
export function shoot(g,x,y){if(g.status!=='playing'||g.shots<=0||g.shotAge<90||!Number.isFinite(x+y))return false;
 const dx=x-CANNON.x,dy=Math.max(30,y-CANNON.y),d=Math.hypot(dx,dy),ball=Bodies.circle(CANNON.x,CANNON.y,10,{label:'ball',density:.012,restitution:.35,frictionAir:.001});Body.setVelocity(ball,{x:dx/d*20,y:dy/d*20});Composite.add(g.engine.world,ball);g.balls.push(ball);g.shots--;g.shotAge=0;return true;
}
export function stepTower(g){if(g.status!=='playing')return;Engine.update(g.engine,1000/60);g.age++;g.shotAge++;g.last=[];
 for(const t of g.targets)if(!t.removed&&(t.marked||t.position.y>480||t.position.x<0||t.position.x>400)){t.removed=true;g.last.push({x:t.position.x,y:t.position.y,kind:t.kind});Composite.remove(g.engine.world,t)}
 for(const b of g.balls)if(!b.removed&&(b.position.y>600||b.position.x<-100||b.position.x>500||g.shotAge>260)){b.removed=true;Composite.remove(g.engine.world,b)}
 if(g.variant&&(g.coreHit||g.core.position.y>420||Math.abs(g.core.position.x-200)>45))g.status='lost';
 else if(g.targets.every(t=>t.removed)&&g.shotAge>=90&&g.balls.every(b=>b.removed||b.isSleeping))g.status='won';
 else if(g.shots===0&&g.shotAge>260)g.status='lost';
}
export function disposeTower(g){Events.off(g.engine);Composite.clear(g.engine.world,false);Engine.clear(g.engine)}
