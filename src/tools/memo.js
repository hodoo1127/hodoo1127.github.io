import { getDict, subscribeI18n } from '../i18n.js';

export function init(){
  const memo=document.getElementById('memo-area');
  const memoTitle=document.getElementById('memo-title');
  const memoFile=document.getElementById('memo-file');
  const memoStatus=document.getElementById('memo-status');
  const memoFileBtn=document.getElementById('memo-file-btn');
  const memoFileName=document.getElementById('memo-file-name');
  const LS_KEY='everyday-tools-memo';

  function ts(){
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'), hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
    return `memo-${y}${m}${dd}-${hh}${mm}.txt`;
  }
  function saveLocal(){
    try{
      localStorage.setItem(LS_KEY, memo.value);
      memoStatus.textContent=(getDict()).autosaved;
    }catch(e){ memoStatus.textContent='Storage error'; }
  }
  let memoSaveT=null;
  memo.addEventListener('input', ()=>{
    memoStatus.textContent='...';
    clearTimeout(memoSaveT);
    memoSaveT=setTimeout(saveLocal, 250);
  });
  (function loadLocal(){
    const v=localStorage.getItem(LS_KEY);
    if(v!==null){ memo.value=v; memoStatus.textContent=(getDict()).autosaved; }
  })();
  memoFileBtn.addEventListener('click', ()=>{ memoFile.click(); });
  memoFile.addEventListener('change', (e)=>{
    const file=e.target.files&&e.target.files[0];
    if(!file){ memoFileName.textContent=(getDict()).no_file; return; }
    memoFileName.textContent = file.name;
    const reader=new FileReader();
    reader.onload=(ev)=>{ memo.value=ev.target.result; saveLocal(); };
    reader.readAsText(file,'utf-8');
  });
  document.getElementById('memo-save').addEventListener('click', ()=>{
    const text=memo.value||''; const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); let name=(memoTitle.value&&memoTitle.value.trim()?memoTitle.value.trim():ts());
    if(!name.toLowerCase().endsWith('.txt')) name += '.txt';
    a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
  });
  document.getElementById('memo-clear').addEventListener('click', ()=>{ memo.value=''; saveLocal(); });

  subscribeI18n(()=>{
    memoStatus.textContent=(getDict()).autosaved;
  });
}
