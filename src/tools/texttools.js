import { getDict, subscribeI18n } from '../i18n.js';

export function init(){
  const tx=document.getElementById('tx-in');
  const txStats=document.getElementById('tx-stats');
  const upper=document.getElementById('tx-upper');
  const lower=document.getElementById('tx-lower');
  const title=document.getElementById('tx-title');
  const clear=document.getElementById('tx-clear');

  function updateStats(){
    const t=tx.value; const total=t.length;
    const spaces=(t.match(/\s/g)||[]).length;
    const chars=total-spaces; const words=(t.trim().match(/\S+/g)||[]).length; const lines=t.split(/\r?\n/).length;
    const d=getDict();
    txStats.textContent=d.stats_fmt.replace("{total}",total).replace("{chars}",chars).replace("{spaces}",spaces).replace("{words}",words).replace("{lines}",lines);
  }

  upper.addEventListener('click', ()=>{ tx.value=tx.value.toUpperCase(); updateStats(); });
  lower.addEventListener('click', ()=>{ tx.value=tx.value.toLowerCase(); updateStats(); });
  title.addEventListener('click', ()=>{ tx.value=tx.value.toLowerCase().replace(/\b\w/g, c=>c.toUpperCase()); updateStats(); });
  clear.addEventListener('click', ()=>{ tx.value=""; updateStats(); });
  tx.addEventListener('input', updateStats);
  subscribeI18n(()=>updateStats());
  updateStats();
}
