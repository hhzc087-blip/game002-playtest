import { chromium } from 'playwright';
import fs from 'node:fs';
const cases=[['blocky','https://poki.com/zh/g/blocky-blast-puzzle'],['drift','https://poki.com/zh/g/drift-boss'],['hook','https://poki.com/zh/g/stickman-hook'],['devil','https://poki.com/zh/g/level-devil'],['mart','https://poki.com/zh/g/monkey-mart'],['watermelon','https://poki.com/zh/g/watermelon-drop'],['subway','https://poki.com/zh/g/subway-surfers'],['aquapark','https://poki.com/zh/g/aquaparkio'],['chess','https://poki.com/zh/g/master-chess'],['woody','https://poki.com/zh/g/woody-sort'],['numbers','https://www.crazygames.com/game/drop-merge-the-numbers'],['nuts','https://www.crazygames.com/game/nuts-puzzle-sort-by-color'],['screws','https://www.crazygames.com/game/screw-out-bolts-and-nuts'],['cats','https://teambeanloop.itch.io/six-cats-under'],['court','https://graebor.itch.io/sort-the-court']];
fs.mkdirSync('output/playwright/references',{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.GAME002_CHROMIUM?{executablePath:process.env.GAME002_CHROMIUM}:{})});const results=[];
try{for(const [id,url] of cases){
 const context=await browser.newContext({viewport:{width:960,height:700}});const page=await context.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));let r={id,url,errors,inputs:[]};
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:22000});await page.waitForTimeout(7000);
  r.final_url=page.url();r.title=await page.title();r.frames=page.frames().map(f=>f.url());
  await page.screenshot({path:`output/playwright/references/${id}-before.jpg`});
  for(const text of ['Run game','Play Now','Play','开始','开始游戏','同意']){for(const frame of page.frames()){
   const b=frame.getByRole('button',{name:text,exact:true}).first();if(await b.isVisible().catch(()=>false)){await b.click({timeout:1200}).catch(()=>{});r.inputs.push(`button:${text}`);}
  }}
  // The game surface occupies the centre of these observed portal containers.
  const surface=page.locator('#game-container, #game-player, iframe').first();const box=await surface.boundingBox().catch(()=>null);
  if(box){const x=box.x+box.width/2,y=box.y+box.height*.65;await page.mouse.click(x,y);r.inputs.push({click:[x,y]});}
  await page.waitForTimeout(3500);await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');await page.waitForTimeout(1200);
  r.inputs.push('Space','ArrowRight');await page.screenshot({path:`output/playwright/references/${id}-after.jpg`});
  r.text=(await page.locator('body').innerText()).slice(0,2500);r.canvas=0;
  for(const f of page.frames())r.canvas+=await f.locator('canvas').count().catch(()=>0);
  r.observation='Attempted public operation; screenshots must be inspected before claiming gameplay verified.';
 }catch(e){r.failure=String(e)}
 await context.close();results.push(r);fs.writeFileSync('evidence/research/reference-runtime.json',JSON.stringify(results,null,2));console.log(id,r.failure||r.canvas);
}}finally{await browser.close()}
