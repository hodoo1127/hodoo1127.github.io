import { getDict, subscribeI18n } from '../i18n.js';

export function init(){
  const cdDisp = document.getElementById('cd-display');
  const cdMin = document.getElementById('cd-min');
  const cdSec = document.getElementById('cd-sec');
  const cdBeep = document.getElementById('cd-beep');
  const cdToggle = document.getElementById('cd-toggle');
  const cdReset = document.getElementById('cd-reset');

  let cdTimer = null, cdEndAt = 0, cdRemainMs = 0;
  let cdInterval = 30;
  let beepCtx = null;

  function ensureBeepCtx(){
    if(!beepCtx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(AC){ beepCtx = new AC(); }
    }
  }
  function cdBeepPlay(){
    if(!cdBeep.checked || !beepCtx) return;
    try{
      if(beepCtx.state === 'suspended'){ beepCtx.resume?.(); }
      const o=beepCtx.createOscillator(), g=beepCtx.createGain();
      o.type='sine'; o.frequency.value=880; g.gain.value=0.08;
      o.connect(g); g.connect(beepCtx.destination);
      o.start(); setTimeout(()=>{ try{o.stop();}catch(e){} }, 400);
    }catch(e){}
  }
  function cdFmtMs(ms){
    ms = Math.max(0, Math.floor(ms));
    const m  = Math.floor(ms / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  }
  function cdRenderMs(ms){ cdDisp.textContent = cdFmtMs(ms); }
  function updateToggleLabel(){
    const d = getDict();
    const running = !!cdTimer;
    cdToggle.textContent = running ? d.stop : d.start;
    cdToggle.setAttribute('aria-pressed', String(running));
  }
  subscribeI18n(updateToggleLabel);

  function cdTick(){
    const now = performance.now();
    cdRemainMs = Math.max(0, Math.round(cdEndAt - now));
    cdRenderMs(cdRemainMs);
    if(cdRemainMs <= 0){
      clearInterval(cdTimer); cdTimer = null;
      updateToggleLabel();
      cdBeepPlay();
    }
  }
  function startCdTick(){
    clearInterval(cdTimer);
    cdTimer = setInterval(cdTick, cdInterval);
  }
  document.addEventListener('visibilitychange', ()=>{
    if(!cdTimer) return;
    cdInterval = document.hidden ? 250 : 30;
    startCdTick();
  });

  cdToggle.addEventListener('click', ()=>{
    ensureBeepCtx();
    if(beepCtx?.state === 'suspended'){ beepCtx.resume?.(); }

    if(cdTimer){
      clearInterval(cdTimer); cdTimer = null;
      updateToggleLabel(); return;
    }
    let baseMs = cdRemainMs>0 ? cdRemainMs
                : Math.max(0, (parseInt(cdMin.value||'0',10)||0)*60 + (parseInt(cdSec.value||'0',10)||0)) * 1000;
    cdRenderMs(baseMs);
    if(baseMs <= 0){ updateToggleLabel(); return; }
    cdEndAt = performance.now() + baseMs;
    startCdTick();
    updateToggleLabel();
  });

  cdReset.addEventListener('click', ()=>{
    clearInterval(cdTimer); cdTimer = null;
    cdRemainMs = 0;
    cdRenderMs(0);
    updateToggleLabel();
  });

  function cdTotalFromInputsSec(){
    const m = Math.max(0, parseInt(cdMin.value || '0', 10) || 0);
    const s = Math.max(0, parseInt(cdSec.value || '0', 10) || 0);
    return Math.max(0, m*60 + s);
  }
  function cdSetTotalSeconds(totalSec){
    totalSec = Math.max(0, totalSec|0);
    const m = Math.floor(totalSec/60), s = totalSec%60;
    cdMin.value = String(m);
    cdSec.value = String(s);
    if(!cdTimer){
      cdRenderMs(totalSec*1000);
    }else{
      cdRemainMs = totalSec*1000;
      cdEndAt = performance.now() + cdRemainMs;
      cdRenderMs(cdRemainMs);
    }
  }
  function cdSetTotalMs(ms){
    ms = Math.max(0, Math.floor(ms));
    cdMin.value = String(Math.floor(ms/60000));
    cdSec.value = String(Math.floor((ms%60000)/1000));
    if(!cdTimer){
      cdRenderMs(ms);
    }else{
      cdRemainMs = ms;
      cdEndAt = performance.now() + cdRemainMs;
      cdRenderMs(cdRemainMs);
    }
  }
  function cdNormalizeInputs(){ cdSetTotalSeconds(cdTotalFromInputsSec()); }
  cdMin.addEventListener('input', cdNormalizeInputs);
  cdSec.addEventListener('input', cdNormalizeInputs);

  document.querySelectorAll('#cd-steppers .step').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const deltaSec = parseInt(btn.dataset.delta, 10) || 0;
      if(cdTimer){ cdSetTotalMs(cdRemainMs + deltaSec*1000); }
      else{ cdSetTotalSeconds(cdTotalFromInputsSec() + deltaSec); }
    });
  });

  cdRenderMs(0);
  updateToggleLabel();
  cdSetTotalSeconds(cdTotalFromInputsSec());
}
