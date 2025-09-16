import { applyI18n } from './i18n.js';

const loaders = {
  stopwatch: async ()=>{ const m = await import('./tools/stopwatch.js'); m.init(); },
  countdown: async ()=>{ const m = await import('./tools/countdown.js'); m.init(); },
  pwgen:     async ()=>{ const m = await import('./tools/pwgen.js');     m.init(); },
  text:      async ()=>{ const m = await import('./tools/texttools.js'); m.init(); },
  url:       async ()=>{ const m = await import('./tools/urltools.js');  m.init(); },
  memo:      async ()=>{ const m = await import('./tools/memo.js');      m.init(); },
};

const sections = {
  stopwatch: document.getElementById('tab-stopwatch'),
  countdown: document.getElementById('tab-countdown'),
  pwgen:     document.getElementById('tab-pwgen'),
  text:      document.getElementById('tab-text'),
  url:       document.getElementById('tab-url'),
  memo:      document.getElementById('tab-memo')
};

const tabButtons = document.querySelectorAll('.tabbtn[role="tab"]');
const loaded = {};

export function initTabs(){
  tabButtons.forEach((b, idx)=>{
    b.addEventListener('click', ()=>activateTab(b.dataset.tab));
    b.addEventListener('keydown', e=>{
      if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const list = Array.from(tabButtons);
        const next = list[(idx + dir + list.length) % list.length];
        next.focus(); next.click();
      }
    });
  });

  const initial = localStorage.getItem('lastTab') || 'stopwatch';
  activateTab(initial);
}

export async function activateTab(tabId){
  tabButtons.forEach(b=>{
    const active = b.dataset.tab === tabId;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', String(active));
    b.tabIndex = active ? 0 : -1;
  });
  Object.entries(sections).forEach(([id, panel])=>{
    const show = id === tabId;
    panel.classList.toggle('hidden', !show);
    panel.setAttribute('aria-hidden', String(!show));
  });
  localStorage.setItem('lastTab', tabId);
  applyI18n(document);

  if(!loaded[tabId] && loaders[tabId]){
    await loaders[tabId]();
    loaded[tabId] = true;
  }
}
