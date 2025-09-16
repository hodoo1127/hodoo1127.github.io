import { getLang, setLang, applyI18n, subscribeI18n } from './i18n.js';
import { initTheme } from './theme.js';
import { initTabs } from './tabs.js';

document.addEventListener('DOMContentLoaded', () => {
  // 연도
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // URL ?lang=xx 지원
  const urlLang = new URLSearchParams(location.search).get('lang');
  if (urlLang) setLang(urlLang);

  // 언어 셀렉터(id: langSel)
  const sel = document.getElementById('langSel');
  if(sel){
    sel.value = getLang();
    sel.addEventListener('change', ()=>{
      setLang(sel.value);
      syncPrivacyLink();
      syncUrl();
    });
  }

  applyI18n(document);
  initTheme();
  initTabs();

  // 개인정보 링크에 현재 언어 반영
  const privacyLink = document.querySelector('a[data-i18n="tab_privacy"]');
  function syncPrivacyLink(){ if (privacyLink) privacyLink.href = `privacy.html?lang=${getLang()}`; }
  syncPrivacyLink();
  subscribeI18n(syncPrivacyLink);

  // 다른 페이지에서 언어 변경 이벤트
  window.addEventListener('langchange', ()=>{
    if (sel) sel.value = getLang();
    applyI18n(document);
    syncPrivacyLink();
    syncUrl();
  });

  function syncUrl(){
    const u = new URL(location.href);
    u.searchParams.set('lang', getLang());
    history.replaceState(null, '', u.toString());
  }
});
