export function init(){
  const urlIn=document.getElementById('url-in');
  const urlOut=document.getElementById('url-out');
  const enc=document.getElementById('url-encode');
  const dec=document.getElementById('url-decode');
  const clr=document.getElementById('url-clear');

  enc.addEventListener('click', ()=>{ try{ urlOut.value=encodeURIComponent(urlIn.value);}catch(e){ urlOut.value='Error: '+e.message; } });
  dec.addEventListener('click', ()=>{ try{ urlOut.value=decodeURIComponent(urlIn.value);}catch(e){ urlOut.value='Error: '+e.message; } });
  clr.addEventListener('click', ()=>{ urlIn.value=''; urlOut.value=''; });
}
