import './style.css';
import {Game} from './game/Game.js';
try {const game=new Game();if(import.meta.env.DEV&&new URLSearchParams(location.search).has('test'))window.__forest=game;} catch(error) {console.error(error);document.querySelector('#app').innerHTML='<div class="fatal"><h1>숲을 불러올 수 없습니다.</h1><p>WebGL을 지원하는 PC 브라우저에서 하드웨어 가속을 활성화한 뒤 다시 시도하세요.</p></div>';}
