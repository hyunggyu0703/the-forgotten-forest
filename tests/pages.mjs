import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';

const baseURL=process.env.FOREST_PREVIEW_URL||'http://localhost:4173/the-forgotten-forest/';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-angle=swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:640,height:480}});
  const errors=[],failedAssets=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(new URL(r.url()).origin===new URL(baseURL).origin&&r.status()>=400)failedAssets.push(`${r.status()} ${r.url()}`);});
  const response=await page.goto(baseURL);
  assert.equal(response.status(),200);
  await page.locator('[data-action=new]').waitFor();
  assert.equal(await page.title(),'THE FORGOTTEN FOREST — 잊혀진 숲');
  const assets=await page.locator('script[src],link[href]:not([href^="https:"])').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')||n.getAttribute('href')));
  assert.ok(assets.length>=3);
  assert.ok(assets.every(x=>x.startsWith('/the-forgotten-forest/assets/')));
  assert.equal(await page.evaluate(()=>typeof window.__forest),'undefined');
  const seeded=await page.evaluate(()=>{
    const state={version:1,chapter:4,checkpoint:'archive',position:{x:0,z:-127},items:['flashlight','letter','key','record'],puzzles:{photo:true,unlocked:true},elapsed:45};
    const settings={quality:'Low',scale:.5,shadows:'Off',music:0,effects:0,bob:false,fps:false,sensitivity:1};
    const save=JSON.stringify(state),config=JSON.stringify(settings);
    localStorage.setItem('forest.save',save);localStorage.setItem('forest.settings',config);
    return {save,config};
  });
  await page.reload();
  await page.locator('[data-action=continue]').waitFor();
  assert.equal(await page.locator('[data-action=continue]').isEnabled(),true);
  const stored=await page.evaluate(()=>({save:localStorage.getItem('forest.save'),config:localStorage.getItem('forest.settings')}));
  assert.deepEqual(stored,seeded);
  await page.click('[data-action=continue]');
  await page.waitForFunction(()=>document.querySelector('#chapter-label')?.textContent.includes('CHAPTER 04'));
  assert.match(await page.locator('#chapter-label').innerText(),/THE TRUTH/);
  const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('forest.save')));
  assert.equal(restored.chapter,4);
  assert.equal(restored.checkpoint,'archive');
  assert.deepEqual(restored.items,['flashlight','letter','key','record']);
  assert.equal(await page.evaluate(()=>localStorage.getItem('forest.settings')),seeded.config);
  assert.deepEqual(failedAssets,[]);
  assert.deepEqual(errors,[]);
  console.log('PASS: production base path, assets, menu, absent dev hook, unchanged save/settings on reload, checkpoint continue; no failed resources or JavaScript errors');
} finally {await browser.close();}
