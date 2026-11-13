import * as THREE from 'three';
export class Player {
 constructor(game){this.g=game;this.pos=new THREE.Vector3(0,0,17);this.yaw=0;this.pitch=0;this.keys=new Set();this.stamina=1;this.step=0;this.walk=0;this.flash=false;this.moving=false;
 addEventListener('keydown',e=>{if(['Tab','Space','ControlLeft'].includes(e.code))e.preventDefault();if(e.repeat)return;this.keys.add(e.code);game.key(e.code);});addEventListener('keyup',e=>this.keys.delete(e.code));addEventListener('blur',()=>{this.keys.clear();if(game.mode==='play')game.pause();});
 document.addEventListener('mousemove',e=>{if(document.pointerLockElement&&game.mode==='play'){this.yaw-=e.movementX*.002*game.settings.sensitivity;this.pitch=THREE.MathUtils.clamp(this.pitch-e.movementY*.002*game.settings.sensitivity,-1.4,1.4);}});
 }
 update(dt){const k=this.keys,crouch=k.has('ControlLeft')||k.has('ControlRight'),run=k.has('ShiftLeft')&&this.stamina>.04&&!crouch;let x=Number(k.has('KeyD'))-Number(k.has('KeyA')),z=Number(k.has('KeyS'))-Number(k.has('KeyW'));const len=Math.hypot(x,z);this.moving=len>0;this.running=run&&this.moving;this.crouch=crouch;
 if(len){x/=len;z/=len;const speed=crouch?1.65:run?6.2:3.1;this.g.world.collision.move(this.pos,(x*Math.cos(this.yaw)+z*Math.sin(this.yaw))*speed*dt,(-x*Math.sin(this.yaw)+z*Math.cos(this.yaw))*speed*dt);this.walk+=dt*speed;this.step+=dt;if(this.step>(run?.29:crouch?.8:.51)){this.g.audio.foot(run);this.step=0;}}
 this.stamina=THREE.MathUtils.clamp(this.stamina+dt*(this.running?-.16:.11),0,1);const bob=this.g.settings.bob&&len?Math.sin(this.walk*2.7)*.035:0;this.g.camera.position.set(this.pos.x,this.g.world.height(this.pos.x,this.pos.z)+(crouch?1:1.75)+bob,this.pos.z);this.g.camera.rotation.set(this.pitch,this.yaw,0,'YXZ');
 }
}
