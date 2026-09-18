/* NOC-Kit — render, dil, tema, yönlendirme ve başlatma
   Bu dosya index.html tarafından sırayla yüklenir; sıralamayı değiştirmeyin. */
/* ---------- render nav + views ---------- */
function renderNav(){
  const scroll=document.getElementById('navScroll'); let h='';
  GROUPS.forEach(g=>{ const items=TOOLS.filter(x=>x.group===g);
    h+=`<div class="nav-group-label"><span data-i18n="group_${g}">${t('group_'+g)}</span><span class="cnt">${items.length}</span></div>`;
    items.forEach(it=>{ h+=`<div class="nav-item ${it.id===activeTool?'active':''}" role="button" tabindex="0" aria-label="${t('t_'+it.id)}" data-target="${it.id}" data-search="${t('t_'+it.id).toLowerCase()} ${t('t_'+it.id+'_d').toLowerCase()} ${it.prompt}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[it.id]||''}</svg><span class="lbl"><span data-i18n="t_${it.id}">${t('t_'+it.id)}</span><small data-i18n="t_${it.id}_d">${t('t_'+it.id+'_d')}</small></span></div>`; });
  });
  scroll.innerHTML=h;
  scroll.querySelectorAll('.nav-item').forEach(i=>{ i.addEventListener('click',()=>selectTool(i.dataset.target)); i.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectTool(i.dataset.target); } }); });
  applySearch();
}
function renderViews(){ const V=buildViews(); document.getElementById('views').innerHTML=TOOLS.map(it=>`<section class="view ${it.id===activeTool?'active':''}" id="view-${it.id}">${V[it.id]||''}</section>`).join(''); }
function selectTool(id,fromHash){ if(!TOOLS.some(x=>x.id===id)) return; activeTool=id; document.querySelectorAll('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.target===id)); document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+id)); const tool=TOOLS.find(x=>x.id===id); if(tool)document.getElementById('activeToolPrompt').innerText=tool.prompt; if(!fromHash){ try{ history.replaceState(null,'','#'+id); }catch(e){} } if(window.scrollY>0) window.scrollTo({top:0,behavior:'smooth'}); }

function applyLang(){
  document.documentElement.lang=LANG;
  document.title=t('doc_title');
  preserveAndRender();
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{el.placeholder=t(el.dataset.i18nPh);});
  document.getElementById('themeToggle').textContent=t(document.documentElement.getAttribute('data-theme')==='light'?'theme_light':'theme_dark');
}
const RECALC={subnet:['subnetResults','calculateSubnet'],vlsm:['vlsmResults','calculateVlsm'],ipv6:['ipv6Results','calculateIpv6'],mtu:['mtuResults','calculateMtu'],supernet:['supernetResults','calculateSupernet'],macfmt:['macfmtResults','convertMac'],vlan:['vlanOutputContainer','generateVlan'],stp:['stpOutputContainer','generateStp'],portsec:['portSecOutputContainer','generatePortSec'],lag:['lagOutputContainer','generateLag'],staticroute:['staticrouteOutputContainer','generateStaticRoute'],redundancy:['redOutputContainer','generateRedundancy'],ospf:['ospfOutputContainer','generateOspf'],bgp:['bgpOutputContainer','generateBgp'],acl:['aclOutputContainer','generateAcl'],nat:['natOutputContainer','generateNat'],vpn:['vpnOutputContainer','generateVpn'],aaa:['aaaOutputContainer','generateAaa'],qos:['qosOutputContainer','generateQos'],fwzone:['fwzoneOutputContainer','generateFwz'],dhcp:['dhcpOutputContainer','generateDhcp'],dns:['dnsOutputContainer','generateDns'],snmp:['snmpOutputContainer','generateSnmp'],baseline:['baseOutputContainer','generateBaseline']};
function preserveAndRender(){
  const saved={}; document.querySelectorAll('input,textarea,select').forEach(el=>{ if(el.id) saved[el.id]={v:el.value,checked:el.checked,type:el.type}; });
  const wasOpen=Object.entries(RECALC).filter(([,cfg])=>{ const el=document.getElementById(cfg[0]); return el&&el.style.display&&el.style.display!=='none'; }).map(([k])=>k);
  renderNav(); renderViews();
  Object.entries(saved).forEach(([id,s])=>{ const el=document.getElementById(id); if(el){ el.value=s.v; if(s.type==='checkbox') el.checked=s.checked; } });
  attachDynamicListeners(); refreshLiveTools();
  wasOpen.forEach(k=>{ const fn=window[RECALC[k][1]]; if(typeof fn==='function'){ try{ fn(); }catch(e){} } });
}

/* theme/clock */
document.getElementById('themeToggle').addEventListener('click',()=>{ const l=document.documentElement.getAttribute('data-theme')==='light'; const next=l?'dark':'light'; document.documentElement.setAttribute('data-theme',next); save('theme',next); document.getElementById('themeToggle').textContent=t(l?'theme_dark':'theme_light'); });
function tickClock(){ const n=new Date(); document.getElementById('clock').innerText=n.toLocaleTimeString(loc(),{hour12:false}); document.getElementById('footerClock').innerText=n.toLocaleDateString(loc())+' '+n.toLocaleTimeString(loc(),{hour12:false}); }
tickClock(); setInterval(tickClock,1000);

/* lang */
document.getElementById('langSwitch').addEventListener('click',e=>{ const b=e.target.closest('[data-lang]'); if(!b)return; LANG=b.dataset.lang; save('lang',LANG); document.querySelectorAll('#langSwitch .seg').forEach(s=>s.classList.toggle('active',s===b)); applyLang(); });

/* search */
function applySearch(){ const q=(document.getElementById('toolSearch').value||'').toLowerCase().trim(); let visible=0; document.querySelectorAll('.nav-item').forEach(it=>{ const hide=!!(q&&!(it.dataset.search||'').toLowerCase().includes(q)); it.classList.toggle('hidden',hide); if(!hide) visible++; }); const empty=document.getElementById('navEmpty'); if(empty) empty.style.display=visible?'none':'block'; }
document.getElementById('toolSearch').addEventListener('input',applySearch);

/* scroll-to-top */
const toTop=document.getElementById('toTop');
window.addEventListener('scroll',()=>{ toTop.classList.toggle('show',window.scrollY>360); },{passive:true});
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));


/* ---------- init ---------- */
(function init(){
  const savedLang=load('lang'); if(savedLang&&I18N[savedLang]) LANG=savedLang;
  document.querySelectorAll('#langSwitch .seg').forEach(b=>b.classList.toggle('active',b.dataset.lang===LANG));
  const h=(location.hash||'').replace('#','');
  if(TOOLS.some(x=>x.id===h)) activeTool=h;
  applyLang();
  const tool=TOOLS.find(x=>x.id===activeTool); if(tool) document.getElementById('activeToolPrompt').innerText=tool.prompt;
  document.getElementById('toolCount').innerText=TOOLS.length;
})();
window.addEventListener('hashchange',()=>{ const h=(location.hash||'').replace('#',''); if(h&&h!==activeTool) selectTool(h,true); });
