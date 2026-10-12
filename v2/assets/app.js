(()=>{
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],root=document.documentElement;
 const header=$('.site-header');
 const syncHeaderHeight=()=>root.style.setProperty('--header-height',header.getBoundingClientRect().height+'px');
 syncHeaderHeight();if('ResizeObserver' in window)new ResizeObserver(syncHeaderHeight).observe(header);else window.addEventListener('resize',syncHeaderHeight);
 let headerFrame=0;
 const syncCompactHeader=()=>{headerFrame=0;const compact=header.classList.contains('is-compact');header.classList.toggle('is-compact',compact?scrollY>24:scrollY>120);};
 const requestHeaderUpdate=()=>{if(!headerFrame)headerFrame=requestAnimationFrame(syncCompactHeader);};
 window.addEventListener('scroll',requestHeaderUpdate,{passive:true});
 window.addEventListener('resize',requestHeaderUpdate);syncCompactHeader();
 let memory={},storageOK=true;
 const read=(key,fallback)=>{try{return localStorage.getItem(key)??fallback;}catch{storageOK=false;return memory[key]??fallback;}};
 const write=(key,value)=>{memory[key]=value;try{localStorage.setItem(key,value);}catch{storageOK=false;}};
 let announcementTimer;const announce=text=>{clearTimeout(announcementTimer);$('#announcement').textContent=text;announcementTimer=setTimeout(()=>{$('#announcement').textContent='';},6500);};
 let saved=new Set();
 try{const parsed=JSON.parse(read('mburoja.saved','null'));const old=parsed===null?JSON.parse(read('myFavs','[]')):parsed;
  if(Array.isArray(old))saved=new Set(old.map(x=>typeof x==='string'?Number(x.replace(/^Page/,'')):x).filter(n=>Number.isInteger(n)&&n>=1&&n<=132));
 }catch{}
 $$('#preferences,.filters,.search-area,.reading-actions,.saved-nav,[data-save],.audio-repeat').forEach(e=>e.hidden=false);
 const themeNames={system:'Sistemi',light:'E çelët',dark:'E errët'},sizeNames={normal:'Normal',large:'I madh',larger:'Më i madh'};
 function syncPreferences(){const theme=['light','dark'].includes(root.dataset.theme)?root.dataset.theme:'system',size=root.dataset.textSize||'normal';$$('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));$$('[data-size-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sizeChoice===size)));}
 $$('[data-theme-choice]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.themeChoice;if(next==='system')delete root.dataset.theme;else root.dataset.theme=next;write('mburoja.theme',next);syncPreferences();announce('Tema: '+themeNames[next]+'.');}));
 $$('[data-size-choice]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.sizeChoice;root.dataset.textSize=next;write('mburoja.textSize',next);syncPreferences();announce('Madhësia e tekstit: '+sizeNames[next]+'.');}));
 const readingChoices={arabicFont:['hamdullah','kitab','amiri','noto','abay','latif','system'],latinFont:['system','roboto','poppins','open-sans','lato','montserrat','georgia'],lineSpacing:['normal','comfortable','wide']};
 for(const [id,key] of [['arabic-font','arabicFont'],['latin-font','latinFont'],['line-spacing','lineSpacing']]){
  const select=$('#'+id);select.value=readingChoices[key].includes(root.dataset[key])?root.dataset[key]:readingChoices[key][0];
  select.addEventListener('change',()=>{if(!readingChoices[key].includes(select.value))return;root.dataset[key]=select.value;write('mburoja.'+key,select.value);announce(select.labels[0].firstChild.textContent+': '+select.selectedOptions[0].textContent+'.');});
 }
 document.addEventListener('keydown',event=>{const settings=$('.reading-settings');if(event.key==='Escape'&&settings.open){settings.open=false;settings.querySelector('summary').focus();}});
 document.addEventListener('click',event=>{const settings=$('.reading-settings');if(!settings.contains(event.target))settings.open=false;});
 syncPreferences();
 const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('sq').trim();
 const rows=$$('.chapter-list li'),search=$('#search');rows.forEach(row=>row.searchText=fold(row.dataset.search));
 let onlySaved=new URLSearchParams(location.search).get('view')==='saved';
 const refreshButtons=()=>{$$('[data-save]').forEach(button=>{const active=saved.has(Number(button.dataset.save));button.setAttribute('aria-pressed',String(active));
  if(button.classList.contains('save')){button.firstElementChild.textContent=active?'★':'☆';const title=button.closest('li').dataset.search;button.setAttribute('aria-label',`${active?'Hiq nga të përzgjedhurat':'Ruaj'}: ${title}`);button.title=active?'Hiq':'Ruaj';}
  else{button.querySelector('[data-save-label]').textContent=active?'I përzgjedhur':'Ruaj kapitullin';button.title=active?'Hiq nga të përzgjedhurat':'Ruaj kapitullin';}
 });};
 function filter(){if(!search)return;$('#home-hero').hidden=onlySaved;const terms=fold(search.value).split(/\s+/).filter(Boolean);let count=0;
  rows.forEach(row=>{row.hidden=(onlySaved&&!saved.has(Number(row.dataset.chapter)))||!terms.every(t=>row.searchText.includes(t));if(!row.hidden)count++;});
  $('#all-filter').setAttribute('aria-pressed',String(!onlySaved));$('#saved-filter').setAttribute('aria-pressed',String(onlySaved));$('#results').textContent=`${count} kapituj${onlySaved?' të përzgjedhur':''}`;$('#empty').hidden=count>0;
 }
 document.addEventListener('click',event=>{const button=event.target.closest('button[data-save]');if(!button)return;const id=Number(button.dataset.save);
  saved.has(id)?saved.delete(id):saved.add(id);write('mburoja.saved',JSON.stringify([...saved]));refreshButtons();filter();announce(storageOK?(saved.has(id)?'Kapitulli u ruajt.':'Kapitulli u hoq nga të përzgjedhurat.'):'Preferenca vlen vetëm në këtë faqe; shfletuesi nuk lejon ruajtjen.');
 });
 if(search){search.addEventListener('input',filter);[['#all-filter',false],['#saved-filter',true]].forEach(([selector,value])=>$(selector).addEventListener('click',()=>{onlySaved=value;filter();}));}
 const copy=$('#copy');if(copy)copy.addEventListener('click',async()=>{const content=$('#chapter-text');const text=[...content.querySelectorAll('p:not(.audio-missing):not(.audio-error)')].map(p=>p.textContent).join('\n\n');
  try{await navigator.clipboard.writeText(text);announce('Teksti u kopjua.');}catch{const range=document.createRange();range.selectNodeContents(content);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);announce('Teksti u përzgjodh. Përdorni komandën e kopjimit të pajisjes.');}
 });
 $$('.audio-repeat').forEach(button=>button.addEventListener('click',()=>{const audio=button.closest('figure').querySelector('audio');audio.loop=!audio.loop;button.setAttribute('aria-pressed',String(audio.loop));announce(audio.loop?'Përsëritja e audios u aktivizua.':'Përsëritja e audios u çaktivizua.');}));
 $$('audio').forEach(audio=>{audio.addEventListener('play',()=>$$('audio').forEach(other=>{if(other!==audio)other.pause();}));audio.addEventListener('error',()=>{audio.closest('figure').querySelector('.audio-error').hidden=false;});});
 window.addEventListener('pagehide',()=>$$('audio').forEach(a=>a.pause()));
 window.addEventListener('storage',event=>{if(event.key==='mburoja.saved'){try{const data=JSON.parse(event.newValue||'[]');if(Array.isArray(data)){saved=new Set(data.filter(n=>Number.isInteger(n)&&n>=1&&n<=132));refreshButtons();filter();}}catch{}}});
 refreshButtons();filter();
})();
