export function init(){
  const pwLen=document.getElementById('pw-len');
  const pwUpper=document.getElementById('pw-upper');
  const pwLower=document.getElementById('pw-lower');
  const pwNum=document.getElementById('pw-num');
  const pwSymbol=document.getElementById('pw-symbol');
  const pwAmbig=document.getElementById('pw-ambig');
  const pwOut=document.getElementById('pw-out');
  const btnMake=document.getElementById('pw-make');
  const btnCopy=document.getElementById('pw-copy');

  btnMake.addEventListener('click', ()=>{
    const len=Math.max(6, Math.min(64, +pwLen.value||16));
    pwOut.value = genPassword(len, pwUpper.checked, pwLower.checked, pwNum.checked, pwSymbol.checked, pwAmbig.checked);
  });
  btnCopy.addEventListener('click', ()=>{
    const t=pwOut.value; if(!t) return;
    if(navigator.clipboard && window.isSecureContext){ navigator.clipboard.writeText(t); }
    else{
      const ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
  });
}

function randInt(max){
  const a = new Uint32Array(1); crypto.getRandomValues(a);
  return a[0] % max;
}
function randFrom(str){ return str[randInt(str.length)]; }

function genPassword(len, upper, lower, num, symbol, ambig){
  let U="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let L="abcdefghijklmnopqrstuvwxyz";
  let N="0123456789";
  let S="!@#$%^&*()-_=+[{]}:;,.?";
  if(ambig){ U=U.replace(/[IO]/g,''); L=L.replace(/[l]/g,''); N=N.replace(/[10]/g,''); }
  const sets = [];
  if(upper) sets.push(U);
  if(lower) sets.push(L);
  if(num)   sets.push(N);
  if(symbol)sets.push(S);
  const pool = sets.length ? sets.join('') : L;

  const out = sets.map(set => randFrom(set));
  while(out.length < len){ out.push(randFrom(pool)); }
  for(let i=out.length-1;i>0;i--){
    const j = randInt(i+1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join('');
}
