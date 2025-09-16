import { getDict, subscribeI18n } from './i18n.js';

export function initTheme(){
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = stored || (prefersDark ? 'dark' : 'light');
  document.body.classList.toggle('light', mode === 'light');
  updateThemeButtonLabel();
  updateMetaThemeColor();

  themeBtn.addEventListener('click', ()=>{
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeButtonLabel();
    updateMetaThemeColor();
  });

  subscribeI18n(()=>updateThemeButtonLabel());

  function updateMetaThemeColor(){
    const meta = document.querySelector('meta[name="theme-color"]') ||
      document.head.appendChild(Object.assign(document.createElement('meta'), {name:'theme-color'}));
    meta.content = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0b0f14';
  }
  function updateThemeButtonLabel(){
    const d = getDict();
    themeBtn.textContent = document.body.classList.contains('light') ? d.theme_dark : d.theme_light;
  }
}
