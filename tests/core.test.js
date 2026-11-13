import test from 'node:test';
import assert from 'node:assert/strict';
import {Collision} from '../src/game/Collision.js';
import {SaveManager} from '../src/game/SaveManager.js';
import {PHOTO_ORDER,ACCESS_CODE,notes} from '../src/game/PuzzleManager.js';
test('walls prevent movement; sliding remains possible',()=>{const c=new Collision();c.add(2,0,1,4);const p={x:1,z:0};c.move(p,1,1);assert.equal(p.x,1);assert.equal(p.z,1);assert.equal(c.visible({x:0,z:0},{x:4,z:0}),false);});
test('pathfinding routes around obstacles with collision clearance',()=>{const c=new Collision();c.add(0,-6,8,2);const a={x:0,z:0},b={x:0,z:-14};const path=c.path(a,b);assert.ok(path.length>0);assert.ok(path.some(p=>Math.abs(p.x)>=6));for(const p of path)assert.equal(c.blocked(p.x,p.z,.45),false);});
test('save roundtrip, settings, malformed storage and unsupported versions',()=>{const data=new Map();globalThis.localStorage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};const s={chapter:4,items:['key','photo1'],position:{x:0,z:-127},puzzles:{photo:true}};assert.ok(SaveManager.save(s));assert.equal(SaveManager.load().chapter,4);assert.deepEqual(SaveManager.load().items,s.items);SaveManager.setSettings({effects:0,bob:false});assert.equal(SaveManager.settings().effects,0);assert.equal(SaveManager.settings().bob,false);data.set('forest.save','{');assert.equal(SaveManager.load(),null);data.set('forest.save',JSON.stringify({...s,version:9}));assert.equal(SaveManager.load(),null);});
test('puzzle solutions are discoverable in in-world notes',()=>{assert.equal(ACCESS_CODE,'0814');assert.match(notes.record[1],/8월 14일/);assert.deepEqual(PHOTO_ORDER,['photo3','photo1','photo4','photo2']);assert.match(notes.diary[1],/III → I → IV → II/);});
