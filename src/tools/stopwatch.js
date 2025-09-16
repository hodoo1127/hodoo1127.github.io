import { getDict, subscribeI18n } from '../i18n.js';

export function init(){
  const swDisp = document.getElementById('sw-display');
  const swLaps = document.getElementById('sw-laps');
  const swToggle = document.getElementById('sw-toggle');
  const swReset = document.getElementById('sw-reset');
  const swLap = document.getElementById('sw-lap');

  let swTimer=null, swStart=0, swElapsed=0;

  function swFormat(ms){
    const m=Math.floor(ms/60000);
    const s=Math.floor((ms%60000)/1000);
    const cs=Math.floor((ms%1000)/10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  }
  function swTick(){ swDisp.textContent = swFormat((performance.now()-swStart) + swElapsed); }
  function updateToggleLabel(){
    const d = getDict();
    const running = !!swTimer;
    swToggle.textContent = running ? d.stop : d.start;
    swToggle.setAttribute('aria-pressed', String(running));
  }
  subscribeI18n(updateToggleLabel);

  swToggle.addEventListener('click', ()=>{
    if(swTimer){ clearInterval(swTimer); swTimer=null; swElapsed += (performance.now()-swStart); }
    else{ swStart = performance.now(); swTimer = setInterval(swTick, 30); }
    updateToggleLabel();
  });
  swReset.addEventListener('click', ()=>{
    clearInterval(swTimer); swTimer=null; swStart=0; swElapsed=0;
    swDisp.textContent="00:00.00"; swLaps.innerHTML="";
    updateToggleLabel();
  });
  swLap.addEventListener('click', ()=>{ const li=document.createElement('li'); li.textContent=swDisp.textContent; swLaps.prepend(li); });

  updateToggleLabel();
}
