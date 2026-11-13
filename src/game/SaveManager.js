export const defaults = {quality:'Medium', scale:1, shadows:'Medium', music:.35, effects:.65, bob:true, fps:false, sensitivity:1};
export class SaveManager {
 static read(key,fallback=null){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
 static load(){const s=this.read('forest.save');return s?.version===1&&Array.isArray(s.items)&&s.chapter>=1&&s.chapter<=5?s:null;}
 static save(state){try{localStorage.setItem('forest.save',JSON.stringify({...state,version:1}));return true;}catch{return false;}}
 static settings(){return {...defaults,...this.read('forest.settings',{})};}
 static setSettings(s){try{localStorage.setItem('forest.settings',JSON.stringify(s));}catch{}}
}
