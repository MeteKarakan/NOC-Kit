/* NOC-Kit — durum, yardımcılar, IP/IPv6 matematiği, form üreticileri
   Bu dosya index.html tarafından sırayla yüklenir; sıralamayı değiştirmeyin. */
let LANG='tr';
const LOCALES={tr:'tr-TR',en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES'};
function loc(){ return LOCALES[LANG]||'tr-TR'; }
const STORE='nockit:';
function save(k,v){ try{ localStorage.setItem(STORE+k,v); }catch(e){} }
function load(k){ try{ return localStorage.getItem(STORE+k); }catch(e){ return null; } }
function t(k){ return (I18N[LANG]&&I18N[LANG][k])||I18N.tr[k]||k; }
/* notes map: tool -> array of note keys */
const NOTES = {
  subnet:['n_subnet_1','n_subnet_2'], vlsm:['n_vlsm_1','n_vlsm_2'], conv:['n_conv_1'], ipv6:['n_ipv6_1','n_ipv6_2'], ipconv:['n_ipconv_1'], mtu:['n_mtu_1','n_mtu_2'],
  vlan:['n_vlan_1','n_vlan_2'], stp:['n_stp_1','n_stp_2'], portsec:['n_portsec_1','n_portsec_2'], lag:['n_lag_1','n_lag_2'],
  dhcp:['n_dhcp_1','n_dhcp_2'], staticroute:['n_sr_1','n_sr_2'], redundancy:['n_red_1','n_red_2'], ospf:['n_ospf_1','n_ospf_2','n_ospf_3'], bgp:['n_bgp_1','n_bgp_2','n_bgp_3'],
  acl:['n_acl_1','n_acl_2','n_acl_3'], nat:['n_nat_1','n_nat_2'], vpn:['n_vpn_1','n_vpn_2','n_vpn_3'], aaa:['n_aaa_1','n_aaa_2','n_aaa_3'], qos:['n_qos_1','n_qos_2'], fwzone:['n_fwz_1','n_fwz_2'],
  dns:['n_dns_1','n_dns_2'], snmp:['n_snmp_1','n_snmp_2'], baseline:['n_base_1','n_base_2','n_base_3'], passgen:['n_pg_1','n_pg_2'],
  macfmt:['n_mac_1','n_mac_2'], supernet:['n_sup_1','n_sup_2'], hashchk:['n_hash_1','n_hash_2']
};
function notesHtml(tool){ const ns=NOTES[tool]; if(!ns||!ns.length) return ''; return `<div class="notes"><div class="nt">★ ${t('notes_title')}</div><ul>${ns.map(n=>`<li>${t(n)}</li>`).join('')}</ul></div>`; }

/* ---------- icons + tools ---------- */
const ICONS = {
  subnet:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8.1 7.2 L11 16 M15.9 7.2 L13 16 M8.4 6 H15.6"/>',
  vlsm:'<rect x="3" y="4" width="18" height="4"/><rect x="3" y="10" width="10" height="4"/><rect x="3" y="16" width="6" height="4"/>',
  conv:'<path d="M7 7h10M7 7l3-3M7 7l3 3M17 17H7M17 17l-3-3M17 17l-3 3"/>',
  ipv6:'<circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8.1 7.2 L11 16 M15.9 7.2 L13 16 M8.4 6 H15.6" stroke-dasharray="2 2"/>',
  ipconv:'<path d="M4 7h11M4 7l3-3M4 7l3 3M20 17H9M20 17l-3-3M20 17l-3 3"/>',
  mtu:'<rect x="3" y="9" width="18" height="6" rx="1"/><path d="M7 9V6M12 9V6M17 9V6"/>',
  vlan:'<rect x="3" y="6" width="18" height="4"/><rect x="3" y="14" width="18" height="4"/><path d="M8 10v4M16 10v4"/>',
  stp:'<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12 6.5 17M12 12l5.5 5"/>',
  portsec:'<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  lag:'<rect x="3" y="7" width="7" height="10" rx="1"/><rect x="14" y="7" width="7" height="10" rx="1"/><path d="M10 12h4"/>',
  dhcp:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h4"/>',
  staticroute:'<path d="M4 18h16M4 18l4-4M4 18l4 4M14 6l4 4-4 4"/>',
  redundancy:'<path d="M4 8a8 8 0 0 1 14-4"/><path d="M20 16a8 8 0 0 1-14 4"/><path d="M18 4v4h-4M6 20v-4h4"/>',
  ospf:'<circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/>',
  bgp:'<path d="M4 19 20 5M4 5l16 14"/><circle cx="4" cy="19" r="1.6"/><circle cx="20" cy="5" r="1.6"/>',
  acl:'<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  nat:'<rect x="3" y="9" width="7" height="6" rx="1"/><rect x="14" y="9" width="7" height="6" rx="1"/><path d="M10 12h4"/>',
  vpn:'<rect x="4" y="10" width="6" height="10" rx="1"/><rect x="14" y="10" width="6" height="10" rx="1"/><path d="M9 6a3 3 0 0 1 6 0v4H9z"/>',
  aaa:'<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="15" r="1.4"/>',
  qos:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
  fwzone:'<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/><path d="M11 12h2"/>',
  dns:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  snmp:'<path d="M4 4h16v6H4zM4 14h16v6H4z"/><circle cx="7" cy="7" r="1"/><circle cx="7" cy="17" r="1"/>',
  baseline:'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 9h10M7 13h6"/>',
  passgen:'<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14v2"/>',
  macfmt:'<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 11v2M11 11v2M15 11v2"/><path d="M3 9.5h18"/>',
  supernet:'<circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M6 16V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v7"/><path d="M12 9v7"/>',
  hashchk:'<path d="M9 3 7 21M17 3l-2 18M4 8h17M3 16h17"/>'
};
const TOOLS = [
  {id:'subnet',group:'ip',prompt:'subnet-calc'},{id:'vlsm',group:'ip',prompt:'vlsm-splitter'},{id:'conv',group:'ip',prompt:'mask-converter'},
  {id:'ipv6',group:'ip',prompt:'ipv6-calc'},{id:'ipconv',group:'ip',prompt:'ip-converter'},{id:'mtu',group:'ip',prompt:'mtu-mss'},
  {id:'vlan',group:'l2',prompt:'vlan-config'},{id:'stp',group:'l2',prompt:'stp-config'},{id:'portsec',group:'l2',prompt:'port-security'},{id:'lag',group:'l2',prompt:'lacp-lag'},{id:'macfmt',group:'l2',prompt:'mac-formatter'},
  {id:'staticroute',group:'routing',prompt:'static-route'},{id:'redundancy',group:'routing',prompt:'fhrp-gen'},{id:'ospf',group:'routing',prompt:'ospf-gen'},{id:'bgp',group:'routing',prompt:'bgp-gen'},{id:'supernet',group:'routing',prompt:'route-summarize'},
  {id:'acl',group:'security',prompt:'acl-gen'},{id:'nat',group:'security',prompt:'nat-gen'},{id:'vpn',group:'security',prompt:'ipsec-vpn'},{id:'aaa',group:'security',prompt:'aaa-8021x'},{id:'qos',group:'security',prompt:'qos-policer'},{id:'fwzone',group:'security',prompt:'fw-zone'},{id:'hashchk',group:'security',prompt:'firmware-hash'},
  {id:'dhcp',group:'services',prompt:'dhcp-config'},{id:'dns',group:'services',prompt:'dns-config'},{id:'snmp',group:'services',prompt:'snmp-config'},{id:'baseline',group:'services',prompt:'day0-baseline'},{id:'passgen',group:'services',prompt:'secret-gen'}
];
const GROUPS=['ip','l2','routing','security','services'];
let activeTool='subnet';

/* ---------- IP helpers ---------- */
function ipToLong(ip){return ip.split('.').reduce((a,o)=>(a<<8)+parseInt(o,10),0)>>>0;}
function longToIp(l){return [(l>>>24)&255,(l>>>16)&255,(l>>>8)&255,l&255].join('.');}
function isValidIp(ip){return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);}
function convertMaskToDecimal(m){m=m.trim();if(m.startsWith('/')){const c=parseInt(m.substring(1),10);if(c>=0&&c<=32){const x=(c===0)?0:(0xFFFFFFFF<<(32-c))>>>0;return longToIp(x);}}return m;}
function convertMaskToWildcard(m){const d=convertMaskToDecimal(m);if(!isValidIp(d))return "0.0.0.0";return longToIp((~ipToLong(d))>>>0);}
function cidrFromMask(d){
  if(!isValidIp(d))return null;
  const l=ipToLong(d);
  const bits=l.toString(2).padStart(32,'0');
  if(bits.indexOf('01')!==-1) return null; /* sıfırdan sonra bir gelemez: ardışık olmayan mask */
  const ones=bits.indexOf('0');
  return ones===-1?32:ones;
}
function toBinaryOctets(l){return [(l>>>24)&255,(l>>>16)&255,(l>>>8)&255,l&255].map(o=>o.toString(2).padStart(8,'0'));}
function renderBits(l,c){const o=toBinaryOctets(l);let h='',bi=0;o.forEach((x,oi)=>{h+='<span class="bitgroup">';for(let i=0;i<8;i++){h+=`<span class="bit ${bi<c?'net':''}">${x[i]}</span>`;bi++;}h+='</span>';if(oi<3)h+='<span style="color:var(--text-faint)">.</span>';});return h;}
function ipClass(ip){const f=parseInt(ip.split('.')[0],10);if(f>=1&&f<=126)return 'A';if(f===127)return 'Loopback';if(f>=128&&f<=191)return 'B';if(f>=192&&f<=223)return 'C';if(f>=224&&f<=239)return 'D (Multicast)';if(f>=240)return 'E (Reserved)';return '?';}
function isRFC1918(ip){const l=ipToLong(ip);if(((l&0xFF000000)>>>0)===0x0A000000)return true;if(((l&0xFFF00000)>>>0)===0xAC100000)return true;if(((l&0xFFFF0000)>>>0)===0xC0A80000)return true;return false;}
/* IPv6 */
function expandIPv6(a){if(a==='::')return '0000:0000:0000:0000:0000:0000:0000:0000';let[h,t]=a.split('::');h=h?h.split(':'):[];t=t?t.split(':'):[];const m=8-h.length-t.length;const g=[...h,...Array(m).fill('0'),...t];if(g.length!==8||g.some(x=>!/^[0-9a-fA-F]{1,4}$/.test(x)))return null;return g.map(x=>x.padStart(4,'0').toLowerCase()).join(':');}
function ipv6ToBigInt(a){const e=expandIPv6(a);if(!e)return null;let b=0n;e.split(':').forEach(g=>{b=(b<<16n)+BigInt(parseInt(g,16));});return b;}
function bigIntToIPv6(b){const g=[];for(let i=0;i<8;i++)g.push(((b>>BigInt((7-i)*16))&0xFFFFn).toString(16));return g.join(':');}
function compressIPv6(b){const g=[];for(let i=0;i<8;i++)g.push(((b>>BigInt((7-i)*16))&0xFFFFn).toString(16));let bs=-1,bl=0,cs=-1,cl=0;g.forEach((x,i)=>{if(x==='0'){if(cs<0)cs=i;cl++;if(cl>bl){bl=cl;bs=cs;}}else{cs=-1;cl=0;}});const o=g.map(x=>x||'0');if(bl>=2){const bf=o.slice(0,bs),af=o.slice(bs+bl);return (bf.join(':')||'')+'::'+(af.join(':')||'');}return o.join(':');}
function isValidIPv6(a){return expandIPv6(a)!==null;}

/* ---------- output helpers ---------- */
function val(id){const e=document.getElementById(id);return e?e.value:'';}
function chk(id){const e=document.getElementById(id);return e?e.checked:false;}
function setOut(c,ti,co,title,code){document.getElementById(ti).innerText=title;document.getElementById(co).innerText=code;document.getElementById(c).style.display='block';}
function showToast(m){const t=document.getElementById('toast');document.getElementById('toastMsg').innerText=m;t.classList.add('show');clearTimeout(showToast._h);showToast._h=setTimeout(()=>t.classList.remove('show'),1800);}
function writeClip(txt){
  if(navigator.clipboard&&window.isSecureContext) return navigator.clipboard.writeText(txt);
  return new Promise((res,rej)=>{ try{ const ta=document.createElement('textarea'); ta.value=txt; ta.setAttribute('readonly',''); ta.style.position='fixed'; ta.style.top='-1000px'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); const ok=document.execCommand('copy'); document.body.removeChild(ta); ok?res():rej(new Error('copy')); }catch(e){ rej(e); } });
}
function copyCode(id,evt){const c=document.getElementById(id).innerText;writeClip(c).then(()=>{showToast(t('copied_toast'));if(evt&&evt.target){const b=evt.target,o=b.innerText;b.innerText=t('copied');setTimeout(()=>b.innerText=o,1600);}}).catch(()=>showToast(t('copy_fail')));}
function copyText(x,b){writeClip(x).then(()=>{showToast(t('copied_toast'));if(b){const o=b.innerText;b.innerText=t('copied');setTimeout(()=>b.innerText=o,1600);}}).catch(()=>showToast(t('copy_fail')));}

/* ---------- view builders ---------- */
function viewHead(id,chip){return `<div class="view-head"><h2><span data-i18n="t_${id}">${t('t_'+id)}</span>${chip?`<span class="chip" id="${id}VendorChip">CISCO</span>`:''}</h2><p data-i18n="t_${id}_d">${t('t_'+id+'_d')}</p></div>`;}
function field(label,control){return `<div class="field"><label>${label}</label>${control}</div>`;}
function text(id,v,ph){return `<input type="text" id="${id}" value="${v||''}"${ph?` data-i18n-ph="${ph}" placeholder="${t(ph)}"`:''}>`;}
function num(id,v,min,max,step){return `<input type="number" id="${id}" value="${v}"${min!=null?` min="${min}"`:''}${max!=null?` max="${max}"`:''}${step?` step="${step}"`:''}>`;}
function sel(id,opts){return `<select id="${id}">${opts.map(o=>`<option value="${o.v}">${o.l}</option>`).join('')}</select>`;}
function btn(lk,on){return `<button class="btn" onclick="${on}" data-i18n="${lk}">${t(lk)}</button>`;}
function codeBox(id){return `<div id="${id}OutputContainer" class="codebox" style="display:none;"><div class="codebox-head"><span class="tag" id="${id}OutputTitle">${t('cli_output')}</span><button class="btn-ghost" onclick="copyCode('${id}CodeBlock',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="${id}CodeBlock"></code></pre></div>${notesHtml(id)}`;}
function alertBox(id){return `<div class="alert" id="${id}Error"><span>⚠</span><span id="${id}ErrorMsg"></span></div>`;}
function vopts(list){return list.map(v=>({v,l:v.charAt(0).toUpperCase()+v.slice(1)+' ('+v+')'}));}
const V5=['cisco','fortinet','paloalto','huawei','aruba'],V4=['cisco','fortinet','paloalto','huawei'],V3=['cisco','aruba','huawei'];
