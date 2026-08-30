(function(){
  const ADDON_KEY='kssteam-local-addons-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(ADDON_KEY)||'[]')}catch{return[]}};
  const write=a=>localStorage.setItem(ADDON_KEY,JSON.stringify(a));
  const uid=()=>`addon-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const esc=v=>String(v??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const all=()=>read();
  const upsert=a=>{const list=read(),i=list.findIndex(x=>x.id===a.id);if(i<0)list.push(a);else list[i]=a;write(list);return a};
  const remove=id=>{write(read().filter(x=>x.id!==id));};
  const sourceType=url=>{if(/^https?:\/\/github\.com\//i.test(url))return'github';if(/^https?:\/\/gitlab\.com\//i.test(url))return'gitlab';return'url'};
  function addonCard(a){return `<article class="card addon-card"><div class="cover" style="--cover1:${esc(a.cover?.[0]||'#15200f')};--cover2:${esc(a.cover?.[1]||'#090c08')}"><div class="cover-badges"><span class="source-badge language">Add-on</span>${a.source?.type==='github'?'<span class="source-badge github">GitHub</span>':''}${a.source?.type==='gitlab'?'<span class="source-badge gitlab">GitLab</span>':''}</div><div class="cover-title">${esc(a.name)}</div></div><div class="card-body"><div class="meta"><span>Add-on · ${esc(a.version||'Local')}</span><span>LOCAL</span></div><p>${esc(a.description||'Launcher add-on')}</p><div class="card-foot"><span class="price">${esc(a.author||'Local')}</span><div class="card-actions"><button class="small-btn" data-addon-open="${esc(a.id)}">View profile →</button><button class="small-btn primary" data-addon-edit="${esc(a.id)}">Edit</button></div></div></div></article>`}
  function renderAddonCatalog(){
    if(window.state?.category!=='addon')return;
    const list=all();
    const q=(window.state?.query||'').toLowerCase().trim();
    const filtered=list.filter(a=>!q || [a.name,a.description,a.author,a.version,...(a.tags||[])].join(' ').toLowerCase().includes(q));
    const grid=document.getElementById('catalogGrid'); if(!grid)return;
    const head=`<div class="remote-heading"><span class="eyebrow">ADD-ONS</span><h3>Launcher add-ons</h3><p>${filtered.length} local add-ons. Create and edit everything directly in KS Steam Web.</p><div class="addon-toolbar"><button class="btn btn-primary" id="addonCreateInline">＋ Add my add-on</button></div></div>`;
    grid.innerHTML=head+(filtered.length?filtered.map(addonCard).join(''):'<div class="github-note">No local add-ons yet. Create one with <b>Add my add-on</b>.</div>');
    document.getElementById('resultCount').textContent=`${filtered.length} ${filtered.length===1?'item':'items'}`;
    document.getElementById('emptyState')?.classList.add('hidden');
    grid.querySelectorAll('[data-addon-open]').forEach(b=>b.onclick=()=>window.go('addon/'+encodeURIComponent(b.dataset.addonOpen)));
    grid.querySelectorAll('[data-addon-edit]').forEach(b=>b.onclick=()=>openEditor(b.dataset.addonEdit));
    document.getElementById('addonCreateInline')?.addEventListener('click',()=>openEditor(null));
  }
  function profile(a){
    const source=a.source||{};
    const download=source.url?`<a class="btn btn-primary" href="${esc(a.fileData||source.url)}" ${a.fileData?'download="'+esc(a.fileName||a.name)+ '"':'target="_blank" rel="noopener"'}>↧ Download add-on</a>`:'';
    const external=source.url&&!a.fileData?`<a class="btn btn-ghost" href="${esc(source.url)}" target="_blank" rel="noopener">Open source ↗</a>`:'';
    return `<div class="project-wrap"><div class="project-back"><button class="small-btn" id="addonBack">← Back to store</button><button class="small-btn" id="addonProfileEdit">Edit profile</button></div><div class="project-hero"><div class="project-logo">＋</div><div><div class="cover-badges"><span class="source-badge language">Add-on</span>${source.type==='github'?'<span class="source-badge github">GitHub</span>':''}${source.type==='gitlab'?'<span class="source-badge gitlab">GitLab</span>':''}</div><h1>${esc(a.name)}</h1><p>${esc(a.description||'')}</p><div class="project-meta"><span>${esc(a.version||'Local')}</span><span>${esc(a.author||'Local')}</span><span>Local profile</span></div></div></div><div class="project-grid"><section class="project-panel"><div class="panel-title"><span class="eyebrow">ADD-ON</span><h2>Profile</h2></div><dl class="repo-stats"><div><dt>Version</dt><dd>${esc(a.version||'Local')}</dd></div><div><dt>Author</dt><dd>${esc(a.author||'Local')}</dd></div><div><dt>Source</dt><dd>${esc(source.type||'local')}</dd></div><div><dt>Tags</dt><dd>${esc((a.tags||[]).join(', ')||'—')}</dd></div></dl><p class="repo-text">${esc(a.longDescription||a.description||'')}</p><div class="release-actions">${download}${external}</div></section><aside class="project-panel"><div class="panel-title"><span class="eyebrow">LOCAL DATA</span><h2>Management</h2></div><p class="repo-text">This add-on profile exists only in this browser. You can edit or remove every field.</p><button class="btn btn-ghost full" id="addonDelete">Delete add-on</button></aside></div></div>`;
  }
  function openEditor(id){
    const existing=all().find(x=>x.id===id)||{id:uid(),name:'',description:'',longDescription:'',version:'1.0.0',author:'',tags:[],source:{type:'',url:''},cover:['#15200f','#090c08']};
    let file=null;
    const d=document.getElementById('detailsDialog'), c=document.getElementById('detailsContent');
    c.innerHTML=`<div class="details-head"><div class="project-logo">＋</div><div><div class="eyebrow">LOCAL ADD-ON</div><h2>${id?'Edit':'Create'} add-on</h2><p>Everything here is stored locally in your browser.</p></div></div><form id="addonForm" class="addon-form"><label>Name<input name="name" required value="${esc(existing.name)}"></label><label>Version<input name="version" value="${esc(existing.version)}"></label><label>Author<input name="author" value="${esc(existing.author)}"></label><label>Description<textarea name="description">${esc(existing.description)}</textarea></label><label>Full description<textarea name="longDescription">${esc(existing.longDescription||existing.description||'')}</textarea></label><label>Tags<input name="tags" value="${esc((existing.tags||[]).join(', '))}"></label><label>Source URL <small>(GitHub / GitLab / direct)</small><input name="sourceUrl" type="url" placeholder="https://github.com/..." value="${esc(existing.source?.url||'')}"></label><label>Or choose a file from this PC<input id="addonFile" name="file" type="file"></label><div id="addonFileName" class="muted">${existing.fileName?esc(existing.fileName):'No local file selected'}</div><div class="release-actions"><button class="btn btn-primary" type="submit">Save add-on</button><button class="btn btn-ghost" type="button" id="addonCancel">Cancel</button></div></form>`;
    const fileInput=document.getElementById('addonFile');fileInput.onchange=()=>{file=fileInput.files?.[0]||null;document.getElementById('addonFileName').textContent=file?`${file.name} · ${Math.round(file.size/1024)} KB`:'No local file selected'};
    document.getElementById('addonCancel').onclick=()=>d.close();
    document.getElementById('addonForm').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);let fileData=existing.fileData||'';let fileName=existing.fileName||'';if(file){if(file.size>15*1024*1024){alert('For local browser storage, add-on files are limited to 15 MB. Use a GitHub/GitLab URL for larger files.');return;}fileData=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result));r.onerror=rej;r.readAsDataURL(file)});fileName=file.name;}
      const sourceUrl=String(fd.get('sourceUrl')||'').trim();const item={...existing,name:String(fd.get('name')||'').trim(),version:String(fd.get('version')||'').trim()||'1.0.0',author:String(fd.get('author')||'').trim()||'Local',description:String(fd.get('description')||'').trim(),longDescription:String(fd.get('longDescription')||'').trim(),tags:String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),source:{type:sourceType(sourceUrl),url:sourceUrl},fileData,fileName};upsert(item);d.close();renderAddonCatalog();if(window.location.hash.startsWith('#addon/'))window.route();};
    if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');
  }
  function seed(){
    const list=all();if(list.some(x=>x.id==='test-addon'))return;
    list.push({id:'test-addon',name:'KS Steam Test Add-on',version:'1.0.0',author:'KS Steam',description:'A small test launcher add-on for the KS Steam Web add-on system.',longDescription:'This is the built-in test add-on requested for the Web version. Its profile can be edited or deleted locally.',tags:['test','launcher','ks-steam'],source:{type:'url',url:'https://github.com/'},cover:['#1b2a12','#080c08']});write(list);
  }
  window.KSAddons={all,openEditor,renderAddonCatalog,profile,seed,remove};
  seed();
  if(location.hash.startsWith('#addon/') && window.route) window.route();
  document.addEventListener('click',e=>{const b=e.target.closest?.('#addAddonBtn');if(b){e.preventDefault();openEditor(null);}});
  window.addEventListener('hashchange',()=>{const raw=location.hash.slice(1);if(raw.startsWith('addon/') && window.route) window.route();});
})();
