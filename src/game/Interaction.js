import * as THREE from 'three';
export class Interaction {
 constructor(g){this.g=g;this.current=null;this.direction=new THREE.Vector3();this.delta=new THREE.Vector3();}
 update(){const g=this.g;g.camera.getWorldDirection(this.direction);let best=4;this.current=null;for(const i of g.world.interactables){if(i.type!=='action'&&g.state.items.includes(i.id))continue;this.delta.set(i.x-g.camera.position.x,i.y-g.camera.position.y,i.z-g.camera.position.z);const d=this.delta.length();if(d<best&&this.delta.normalize().dot(this.direction)>.78&&g.world.collision.visible(g.player.pos,i)){best=d;this.current=i;}}
 g.hud.prompt(this.current?.label);}
 use(){if(this.current)this.g.interact(this.current);}
}
