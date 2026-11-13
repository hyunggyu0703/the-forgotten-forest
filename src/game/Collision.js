export class Collision {
 constructor(){this.boxes=[];}
 add(x,z,w,d){this.boxes.push({x,z,w:w/2,d:d/2});}
 blocked(x,z,r=.32){return x< -54+r||x>54-r||z>30-r||z< -235+r||this.boxes.some(b=>Math.abs(x-b.x)<b.w+r&&Math.abs(z-b.z)<b.d+r);}
 move(p,dx,dz,r=.32){if(!this.blocked(p.x+dx,p.z,r))p.x+=dx;if(!this.blocked(p.x,p.z+dz,r))p.z+=dz;}
 visible(a,b){const d=Math.hypot(a.x-b.x,a.z-b.z),n=Math.ceil(d/.5);for(let i=1;i<n;i++){const t=i/n;if(this.blocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,.05))return false;}return true;}
 path(a,b){const step=2, key=(x,z)=>`${x},${z}`,snap=v=>Math.round(v/step)*step;
 const start={x:snap(a.x),z:snap(a.z)},goal={x:snap(b.x),z:snap(b.z)},open=[start],came=new Map(),cost=new Map([[key(start.x,start.z),0]]);let end=null;
 for(let it=0;open.length&&it<5000;it++){let bi=0;for(let i=1;i<open.length;i++)if(open[i].f<open[bi].f)bi=i;const c=open.splice(bi,1)[0],ck=key(c.x,c.z);if(Math.hypot(c.x-goal.x,c.z-goal.z)<3){end=c;break;}
 for(const [dx,dz] of [[2,0],[-2,0],[0,2],[0,-2]]){const n={x:c.x+dx,z:c.z+dz},nk=key(n.x,n.z);if(this.blocked(n.x,n.z,.48)||!this.visible(c,n))continue;const g=cost.get(ck)+1;if(g<(cost.get(nk)??Infinity)){cost.set(nk,g);came.set(nk,c);n.f=g+Math.hypot(n.x-goal.x,n.z-goal.z)/step;open.push(n);}}}
 if(!end)return [];const out=[];while(key(end.x,end.z)!==key(start.x,start.z)){out.unshift(end);end=came.get(key(end.x,end.z));if(!end)break;}return out;}
}
