export class AudioManager {
 constructor(settings){this.settings=settings;this.time=0;}
 start(){if(this.ctx){this.ctx.resume();return;}const A=window.AudioContext||window.webkitAudioContext;if(!A)return;this.ctx=new A();this.music=this.ctx.createGain();this.fx=this.ctx.createGain();this.music.connect(this.ctx.destination);this.fx.connect(this.ctx.destination);this.apply(this.settings);
 const buffer=this.ctx.createBuffer(1,this.ctx.sampleRate*4,this.ctx.sampleRate),data=buffer.getChannelData(0);let v=0;for(let i=0;i<data.length;i++){v=(v+(Math.random()*2-1)*.02)/1.02;data[i]=v*4;}const noise=this.ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=this.ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=500;noise.connect(filter);filter.connect(this.music);noise.start();this.tone(42,5,.09,'sine',true);}
 apply(s){this.settings=s;if(this.ctx){this.music.gain.value=s.music*.5;this.fx.gain.value=s.effects*.5;}}
 tone(freq,duration=.2,volume=.2,type='sine',music=false){if(!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain(),t=this.ctx.currentTime;o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(12,freq*.6),t+duration);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(volume,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(music?this.music:this.fx);o.start();o.stop(t+duration);}
 foot(run){this.tone(run?75:55,.12,run?.3:.16,'triangle');}
 click(){this.tone(380,.06,.15,'square');}
 door(){this.tone(110,.9,.2,'sawtooth');}
 solve(){[330,440,660].forEach((f,i)=>setTimeout(()=>this.tone(f,.55,.15),i*120));}
 update(dt,chase){this.time+=dt;if(this.time>(chase?.65:14)){this.time=0;this.tone(chase?53:80,chase?.3:3,chase?.28:.08,'sine',true);if(!chase)this.tone(170,2,.05,'triangle',true);}}
}
