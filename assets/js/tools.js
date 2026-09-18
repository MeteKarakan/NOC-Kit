/* NOC-Kit — hesaplama ve konfigürasyon üretme mantığı
   Bu dosya index.html tarafından sırayla yüklenir; sıralamayı değiştirmeyin. */
/* ============================================================ TOOL LOGIC ============================================================ */
function calculateSubnet(){
  const ip=val('ipAddress').trim(),cidr=parseInt(val('cidr'),10); const err=document.getElementById('subnetError');
  if(!isValidIp(ip)||isNaN(cidr)||cidr<0||cidr>32){ err.classList.add('show'); document.getElementById('subnetResults').style.display='none'; return; }
  err.classList.remove('show');
  const ipLong=ipToLong(ip),maskLong=(cidr===0)?0:(0xFFFFFFFF<<(32-cidr))>>>0,networkLong=(ipLong&maskLong)>>>0,broadcastLong=(networkLong|(~maskLong>>>0))>>>0;
  let first=networkLong+1,last=broadcastLong-1,hc=Math.pow(2,32-cidr)-2,netType=t('net_normal');
  if(cidr===32){first=last=networkLong;hc=1;netType=t('net_single');}
  else if(cidr===31){first=networkLong;last=broadcastLong;hc=2;netType=t('net_ptp');}
  else if(cidr===30){netType=t('net_link');}
  document.getElementById('resNetwork').innerText=longToIp(networkLong);
  document.getElementById('resBroadcast').innerText=longToIp(broadcastLong);
  document.getElementById('resMask').innerText=longToIp(maskLong);
  document.getElementById('resWildcard').innerText=longToIp((~maskLong)>>>0);
  document.getElementById('resFirstIp').innerText=longToIp(first);
  document.getElementById('resLastIp').innerText=longToIp(last);
  document.getElementById('resHostCount').innerText=hc.toLocaleString(loc());
  document.getElementById('resNetType').innerText=netType;
  document.getElementById('resClass').innerHTML=ipClass(ip)+(isRFC1918(ip)?` <span class="badge private">${t('scope_private')}</span>`:` <span class="badge public">${t('scope_public')}</span>`);
  document.getElementById('resScope').innerText=isRFC1918(ip)?t('scope_private'):t('scope_public');
  document.getElementById('rbCapLeft').innerText=longToIp(networkLong);
  document.getElementById('rbCapRight').innerText=longToIp(broadcastLong);
  document.getElementById('rbNet').innerText=cidr>=31?'':'NET';
  document.getElementById('rbBcast').innerText=cidr>=31?'':'BCAST';
  document.getElementById('rbHost').innerText=hc.toLocaleString(loc())+' USABLE';
  document.getElementById('binIp').innerHTML=renderBits(ipLong,cidr);
  document.getElementById('binMask').innerHTML=renderBits(maskLong,cidr);
  document.getElementById('subnetResults').style.display='block';
}

function neededPrefixForHosts(h){let b=0;while(Math.pow(2,b)-2<h)b++;return 32-b;}
function calculateVlsm(){
  const baseIp=val('vlsmBase').trim(),baseCidr=parseInt(val('vlsmCidr'),10); const err=document.getElementById('vlsmError'),errMsg=document.getElementById('vlsmErrorMsg');
  if(!isValidIp(baseIp)||isNaN(baseCidr)||baseCidr<0||baseCidr>30){ errMsg.innerText=t('err_invalid_base'); err.classList.add('show'); document.getElementById('vlsmResults').style.display='none'; return; }
  const raw=val('vlsmReqs').split(',').map(s=>s.trim()).filter(Boolean);
  if(!raw.length){ errMsg.innerText=t('err_one_host'); err.classList.add('show'); return; }
  let reqs=raw.map((r,i)=>{ let n='Subnet'+(i+1),c=r; if(r.includes(':')){const p=r.split(':');n=p[0].trim();c=p[1].trim();} return {name:n,hosts:parseInt(c,10)}; });
  if(reqs.some(r=>isNaN(r.hosts)||r.hosts<1)){ errMsg.innerText=t('err_invalid_hosts'); err.classList.add('show'); return; }
  reqs.sort((a,b)=>b.hosts-a.hosts);
  const baseMask=(baseCidr===0)?0:(0xFFFFFFFF<<(32-baseCidr))>>>0,baseNet=(ipToLong(baseIp)&baseMask)>>>0,baseBcast=(baseNet|(~baseMask>>>0))>>>0;
  const totalSize=Math.pow(2,32-baseCidr); let cursor=baseNet,used=0,rows=[],overflow=false;
  reqs.forEach(r=>{ const p=neededPrefixForHosts(r.hosts),bs=Math.pow(2,32-p); cursor=Math.ceil(cursor/bs)*bs; const net=cursor>>>0,bcast=(net+bs-1)>>>0; if(bcast>baseBcast){overflow=true;return;} const ml=p===0?0:(0xFFFFFFFF<<(32-p))>>>0; const f=p>=31?net:net+1,l=p>=31?bcast:bcast-1; rows.push({name:r.name,hosts:r.hosts,network:longToIp(net),cidr:p,mask:longToIp(ml),range:longToIp(f)+' – '+longToIp(l),broadcast:longToIp(bcast)}); used+=bs; cursor=net+bs; });
  if(overflow){ errMsg.innerText=t('err_overflow'); err.classList.add('show'); document.getElementById('vlsmResults').style.display='none'; return; }
  err.classList.remove('show');
  document.getElementById('vlsmTbody').innerHTML=rows.map(r=>`<tr><td>${r.name}</td><td>${r.hosts}</td><td>${r.network}</td><td>/${r.cidr}</td><td>${r.mask}</td><td>${r.range}</td><td>${r.broadcast}</td></tr>`).join('');
  document.getElementById('vlsmUsage').innerText=used.toLocaleString(loc())+' / '+totalSize.toLocaleString(loc())+' ('+Math.round(used/totalSize*100)+'%)';
  document.getElementById('vlsmResults').style.display='block';
}

function calculateSupernet(){
  const raw=val('supernetInput'); const err=document.getElementById('supernetError'),errMsg=document.getElementById('supernetErrorMsg');
  const lines=raw.split('\n').map(s=>s.trim()).filter(Boolean);
  const nets=[];
  lines.forEach(line=>{
    const m=line.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*\/\s*(\d{1,2})$/);
    if(!m) return;
    const ip=m[1],cidr=parseInt(m[2],10);
    if(!isValidIp(ip)||isNaN(cidr)||cidr<0||cidr>32) return;
    const maskLong=(cidr===0)?0:(0xFFFFFFFF<<(32-cidr))>>>0;
    const netLong=(ipToLong(ip)&maskLong)>>>0, bcastLong=(netLong|(~maskLong>>>0))>>>0;
    nets.push({ip,cidr,netLong,bcastLong});
  });
  if(nets.length<2||nets.length!==lines.length){ errMsg.innerText=t('err_supernet_min'); err.classList.add('show'); document.getElementById('supernetResults').style.display='none'; return; }
  err.classList.remove('show');
  const minStart=Math.min(...nets.map(n=>n.netLong)), maxEnd=Math.max(...nets.map(n=>n.bcastLong));
  const prefix=Math.clz32((minStart^maxEnd)>>>0);
  const maskLong=(prefix===0)?0:(0xFFFFFFFF<<(32-prefix))>>>0;
  const superNet=(minStart&maskLong)>>>0, superBcast=(superNet|(~maskLong>>>0))>>>0;
  document.getElementById('supernetNet').innerText=longToIp(superNet);
  document.getElementById('supernetMaskOut').innerText=longToIp(maskLong);
  document.getElementById('supernetCidr').innerText='/'+prefix;
  document.getElementById('supernetRange').innerText=longToIp(superNet)+' – '+longToIp(superBcast);
  const totalUser=nets.reduce((s,n)=>s+(n.bcastLong-n.netLong+1),0), totalBlock=Math.pow(2,32-prefix);
  document.getElementById('supernetUsage').innerText=totalUser.toLocaleString(loc())+' / '+totalBlock.toLocaleString(loc())+' ('+Math.round(totalUser/totalBlock*100)+'%)';
  document.getElementById('supernetTbody').innerHTML=nets.map(n=>`<tr><td>${n.ip}</td><td>/${n.cidr}</td><td>${longToIp(n.netLong)} – ${longToIp(n.bcastLong)}</td></tr>`).join('');
  document.getElementById('supernetResults').style.display='block';
}

function macToHex(raw){ return raw.replace(/[^0-9a-fA-F]/g,'').toLowerCase(); }
const MAC_RE=/(?:[0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}|(?:[0-9a-fA-F]{4}\.){2}[0-9a-fA-F]{4}|\b[0-9a-fA-F]{12}\b/g;
const MAC_MAX_LINES=20000, MAC_MAX_LINE_LEN=4000;
function extractMacs(raw){
  const lines=String(raw||'').split('\n');
  const seen=new Set(), out=[];
  const limit=Math.min(lines.length,MAC_MAX_LINES);
  for(let i=0;i<limit;i++){
    let line=lines[i];
    if(!line) continue;
    if(line.length>MAC_MAX_LINE_LEN) line=line.slice(0,MAC_MAX_LINE_LEN);
    MAC_RE.lastIndex=0;
    let m;
    while((m=MAC_RE.exec(line))!==null){
      const hex=macToHex(m[0]);
      if(hex.length===12&&!seen.has(hex)){ seen.add(hex); out.push(hex); }
    }
  }
  return out;
}
function convertMac(){
  const raw=val('macInput'); const err=document.getElementById('macfmtError'),errMsg=document.getElementById('macfmtErrorMsg');
  const list=extractMacs(raw);
  if(!list.length){ errMsg.innerText=t('err_invalid_mac'); err.classList.add('show'); document.getElementById('macfmtResults').style.display='none'; return; }
  err.classList.remove('show');
  const cisco=list.map(h=>h.match(/.{4}/g).join('.')).join('\n');
  const win=list.map(h=>h.match(/.{2}/g).join('-')).join('\n');
  const unix=list.map(h=>h.match(/.{2}/g).join(':')).join('\n');
  document.getElementById('macCiscoBlock').innerText=cisco;
  document.getElementById('macWinBlock').innerText=win;
  document.getElementById('macUnixBlock').innerText=unix;
  document.getElementById('macfmtResults').style.display='block';
}

function formatBytes(n){ if(n<1024) return n+' B'; if(n<1048576) return (n/1024).toFixed(1)+' KB'; if(n<1073741824) return (n/1048576).toFixed(1)+' MB'; return (n/1073741824).toFixed(2)+' GB'; }
function readFileAsArrayBuffer(file){ return new Promise((resolve,reject)=>{ const reader=new FileReader(); reader.onload=()=>resolve(reader.result); reader.onerror=()=>reject(reader.error); reader.readAsArrayBuffer(file); }); }
const HEXLUT=(function(){ const a=new Array(256); for(let i=0;i<256;i++) a[i]=(i<16?'0':'')+i.toString(16); return a; })();
async function digestHex(algo,buffer){
  const hashBuffer=await crypto.subtle.digest(algo,buffer);
  const bytes=new Uint8Array(hashBuffer);
  let hex='';
  for(let i=0;i<bytes.length;i++) hex+=HEXLUT[bytes[i]];
  return hex;
}
async function computeFileHash(evt){
  const file=evt.target.files&&evt.target.files[0]; if(!file) return;
  const statusEl=document.getElementById('hashStatus'),resEl=document.getElementById('hashResults');
  resEl.style.display='none'; statusEl.style.display='block'; statusEl.innerText=t('hash_computing');
  try{
    const buffer=await readFileAsArrayBuffer(file);
    if(!window.crypto||!window.crypto.subtle) throw new Error('no-subtle');
    const [sha1,sha256]=await Promise.all([digestHex('SHA-1',buffer),digestHex('SHA-256',buffer)]);
    document.getElementById('hashFileName').innerText=file.name;
    document.getElementById('hashFileSize').innerText=formatBytes(file.size);
    document.getElementById('hashSha1Block').innerText=sha1;
    document.getElementById('hashSha256Block').innerText=sha256;
    statusEl.style.display='none'; resEl.style.display='block';
  }catch(e){ statusEl.innerText=t('hash_error'); }
}

function convFromCidr(){ let raw=val('convCidr').replace('/','').trim(); const n=parseInt(raw,10); if(isNaN(n)||n<0||n>32)return; const m=n===0?0:(0xFFFFFFFF<<(32-n))>>>0; document.getElementById('convMask').value=longToIp(m); document.getElementById('convWild').value=longToIp((~m)>>>0); document.getElementById('convHosts').value=n>=31?(n===32?'1':'2'):(Math.pow(2,32-n)-2).toLocaleString(loc()); }
function convFromMask(){ const v=val('convMask').trim(); if(!isValidIp(v))return; const c=cidrFromMask(v); if(c===null)return; document.getElementById('convCidr').value='/'+c; document.getElementById('convWild').value=convertMaskToWildcard(v); document.getElementById('convHosts').value=c>=31?(c===32?'1':'2'):(Math.pow(2,32-c)-2).toLocaleString(loc()); }
function convFromWild(){ const v=val('convWild').trim(); if(!isValidIp(v))return; const d=longToIp((~ipToLong(v))>>>0); document.getElementById('convMask').value=d; const c=cidrFromMask(d); if(c===null)return; document.getElementById('convCidr').value='/'+c; document.getElementById('convHosts').value=c>=31?(c===32?'1':'2'):(Math.pow(2,32-c)-2).toLocaleString(loc()); }

function calculateIpv6(){
  const addr=val('ipv6Addr').trim(),prefix=parseInt(val('ipv6Prefix'),10); const err=document.getElementById('ipv6Error');
  if(!isValidIPv6(addr)||isNaN(prefix)||prefix<0||prefix>128){ err.classList.add('show'); document.getElementById('ipv6Results').style.display='none'; return; }
  err.classList.remove('show');
  const big=ipv6ToBigInt(addr),mask=(prefix===0)?0n:((1n<<BigInt(prefix))-1n)<<(BigInt(128)-BigInt(prefix)),network=big&mask;
  const hostBits=BigInt(128)-BigInt(prefix),total=BigInt(1)<<hostBits;
  const first=(prefix>=127)?network:network+1n,last=(prefix===128)?network:(prefix===127?network+1n:network+total-1n);
  document.getElementById('ipv6Net').innerText=compressIPv6(network);
  document.getElementById('ipv6Comp').innerText=compressIPv6(network);
  document.getElementById('ipv6Full').innerText=bigIntToIPv6(network);
  document.getElementById('ipv6First').innerText=compressIPv6(first);
  document.getElementById('ipv6Last').innerText=compressIPv6(last);
  document.getElementById('ipv6Count').innerText=total.toLocaleString(loc());
  const sub64=prefix<=64?(BigInt(1)<<BigInt(64-prefix)).toLocaleString(loc()):'—';
  document.getElementById('ipv6Subnets').innerText=sub64;
  document.getElementById('ipv6Results').style.display='block';
}

function calcIpconv(){
  const ip=val('ipconvIp').trim();
  if(isValidIp(ip)){ const l=ipToLong(ip); document.getElementById('ipcDotted').innerText=ip; document.getElementById('ipcDec').innerText=String(l); document.getElementById('ipcHex').innerText='0x'+l.toString(16).toUpperCase().padStart(8,'0'); document.getElementById('ipcBin').innerText=toBinaryOctets(l).join('.'); document.getElementById('ipcOct').innerText='0'+l.toString(8); }
  else ['ipcDotted','ipcDec','ipcHex','ipcBin','ipcOct'].forEach(i=>document.getElementById(i).innerText='-');
  const dec=val('ipconvDec').trim(); const rev=document.getElementById('ipcRev'); if(!dec){ rev.innerText='—'; } else if(/^\d+$/.test(dec)&&Number(dec)<=4294967295){ rev.innerText=longToIp(Number(dec)>>>0); } else { rev.innerText='—'; }
}

const ENCAPS=[{v:'none',o:0},{v:'dot1q',o:4},{v:'pppoe',o:8},{v:'gre',o:24},{v:'mpls',o:4},{v:'vxlan',o:50},{v:'geneve',o:50},{v:'ipsec',o:73}];
function calculateMtu(){
  const mtu=parseInt(val('mtuVal'),10),enc=val('mtuEncap'); if(isNaN(mtu)||mtu<576){ document.getElementById('mtuResults').style.display='none'; return; }
  const encDef=ENCAPS.find(e=>e.v===enc)||ENCAPS[0]; const ov=encDef.o; const eff=mtu-ov;
  document.getElementById('mtuMss').innerText=(eff-40)+' bytes';
  document.getElementById('mtuMssPppoe').innerText=(eff-48)+' bytes';
  document.getElementById('mtuIpMtu').innerText=eff+' bytes';
  document.getElementById('mtuOverhead').innerText=ov+' bytes';
  document.getElementById('encapTable').innerHTML=`<thead><tr><th>Encapsulation</th><th>Overhead</th><th>Effective MTU</th><th>TCP MSS</th></tr></thead><tbody>${ENCAPS.map(e=>`<tr class="${e.v===enc?'sel':''}"><td>${e.v}</td><td>${e.o}</td><td>${mtu-e.o}</td><td>${mtu-e.o-40}</td></tr>`).join('')}</tbody>`;
  document.getElementById('mtuResults').style.display='block';
}

function refreshVlanFields(){ const v=val('vlanVendor'); document.getElementById('vlanVendorChip').innerText=v.toUpperCase(); const isTrunk=val('vlanMode')==='trunk'; document.getElementById('vlanNativeRow').style.display=isTrunk?'grid':'none'; document.getElementById('vlanDescAccessRow').style.display=isTrunk?'none':'grid'; }
function generateVlan(){
  const v=val('vlanVendor'),mode=val('vlanMode'),iface=val('vlanIface').trim(),accessId=val('vlanAccessId').trim(),trunkAllow=val('vlanTrunkAllow').trim(),native=val('vlanNative').trim();
  const desc=mode==='trunk'?val('vlanDesc').trim():val('vlanDescAccess').trim();
  if(!iface){ showToast(t('toast_iface')); return; }
  let c='';
  if(v==='cisco'){ c=mode==='access'?`interface ${iface}\n description ${desc}\n switchport mode access\n switchport access vlan ${accessId}\n switchport nonegotiate\n spanning-tree portfast\n spanning-tree bpduguard enable\n no shutdown`:`interface ${iface}\n description ${desc}\n switchport trunk encapsulation dot1q\n switchport mode trunk\n switchport trunk native vlan ${native}\n switchport trunk allowed vlan ${trunkAllow}\n switchport nonegotiate\n no shutdown`; }
  else if(v==='aruba'){ c=mode==='access'?`interface ${iface}\n no shutdown\n description ${desc}\n vlan access ${accessId}`:`interface ${iface}\n no shutdown\n description ${desc}\n vlan trunk native ${native}\n vlan trunk allowed ${trunkAllow}`; }
  else if(v==='huawei'){ c=mode==='access'?`interface ${iface}\n description ${desc}\n port link-type access\n port default vlan ${accessId}\n undo negotiation\n undo shutdown`:`interface ${iface}\n description ${desc}\n port link-type trunk\n port trunk pvid vlan ${native}\n port trunk allow-pass vlan ${trunkAllow}\n undo negotiation\n undo shutdown`; }
  else if(v==='fortinet'){ c=mode==='access'?`config switch-controller managed-switch\n    edit "SW1"\n        config ports\n            edit "${iface}"\n                set vlan ${accessId}\n                set description "${desc}"\n            next\n        end\n    next\nend`:`config switch-controller managed-switch\n    edit "SW1"\n        config ports\n            edit "${iface}"\n                set mode trunk\n                set native-vlan ${native}\n                set allowed-vlans ${trunkAllow}\n                set description "${desc}"\n            next\n        end\n    next\nend`; }
  setOut('vlanOutputContainer','vlanOutputTitle','vlanCodeBlock',v.toUpperCase()+' Config',c);
}

function generateStp(){
  const v=val('stpVendor'),vlan=val('stpVlan').trim(),prio=val('stpPriority').trim(),iface=val('stpIface').trim(),rg=val('stpRootGuard').trim();
  let c='';
  if(v==='cisco'){ c=`spanning-tree mode rapid-pvst\nspanning-tree vlan ${vlan} priority ${prio}\nspanning-tree extend system-id`; if(iface) c+=`\n!\ninterface ${iface}\n spanning-tree portfast\n spanning-tree bpduguard enable`; if(rg) c+=`\n!\ninterface ${rg}\n spanning-tree guard root`; }
  else if(v==='huawei'){ c=`stp mode rstp\nstp instance ${vlan} priority ${prio}\nstp pathcost-standard legacy`; if(iface) c+=`\n#\ninterface ${iface}\n stp edged-port enable\n stp bpdu-protection`; if(rg) c+=`\n#\ninterface ${rg}\n stp root-protection`; }
  else if(v==='aruba'){ c=`spanning-tree mode rpvst\nspanning-tree vlan ${vlan} priority ${prio}`; if(iface) c+=`\n!\ninterface ${iface}\n    spanning-tree port-type admin-edge\n    spanning-tree bpdu-guard`; if(rg) c+=`\n!\ninterface ${rg}\n    spanning-tree guard root`; }
  setOut('stpOutputContainer','stpOutputTitle','stpCodeBlock',v.toUpperCase()+' Config',c);
}

function generatePortSec(){
  const v=val('vendorPortSec'),iface=val('portSecInterface').trim(),maxMac=val('portSecMax').trim(),action=val('portSecAction');
  if(!iface||!maxMac){ showToast(t('toast_iface_max')); return; }
  let c='';
  if(v==='cisco') c=`interface ${iface}\n switchport mode access\n switchport port-security\n switchport port-security maximum ${maxMac}\n switchport port-security mac-address sticky\n switchport port-security violation ${action}\n errdisable recovery cause psecure-violation\n errdisable recovery interval 300`;
  else if(v==='huawei') c=`interface ${iface}\n port link-type access\n port-security enable\n port-security max-mac-num ${maxMac}\n port-security mac-address sticky\n port-security protect-action ${action}`;
  else if(v==='aruba') c=`interface ${iface}\n routing type layer2\n port-access port-security enable\n port-access port-security client-limit ${maxMac}\n port-access port-security violation-action ${action}`;
  setOut('portSecOutputContainer','portSecOutputTitle','portSecCodeBlock',v.toUpperCase()+' Port Security',c);
}

function generateLag(){
  const v=val('lagVendor'),grp=val('lagGroup').trim(),mode=val('lagMode'),hash=val('lagHash'),fast=val('lagFast'),maxact=val('lagMaxactive').trim(),phys=val('lagPhys').trim().split(',').map(s=>s.trim()).filter(Boolean);
  let c='';
  if(v==='cisco'){ c=`port-channel load-balance ${hash}\n`; c+=phys.map(p=>`interface ${p}\n channel-group ${grp} mode ${mode}`).join('\n'); c+=`\n!\ninterface Port-channel${grp}\n description LACP-PO${grp}\n lacp max-bundle ${maxact}\n lacp rate ${fast}\n no shutdown`; }
  else if(v==='huawei'){ c=`eth-trunk ${grp}\n description LACP-PO${grp}\n mode ${mode==='on'?'manual':'lacp-static'}\n trunkport ${phys.join(' ')}\n load-balance ${hash}\n lacp max-active ${maxact}\n lacp priority ${fast==='fast'?'1':'0'}\n undo shutdown`; }
  else if(v==='aruba'){ c=phys.map(p=>`interface ${p}\n no shutdown\n lag ${grp}`).join('\n'); c+=`\n!\ninterface lag ${grp}\n no shutdown\n description LACP-PO${grp}\n lacp mode ${mode}\n lacp rate ${fast}`; }
  setOut('lagOutputContainer','lagOutputTitle','lagCodeBlock',v.toUpperCase()+' LACP',c);
}

function generateStaticRoute(){
  const v=val('srVendor'),ver=val('srVer'),dest=val('srDest').trim(),maskRaw=val('srMask').trim(),nh=val('srNexthop').trim(),iface=val('srIface').trim(),ad=val('srAd').trim();
  if(!dest||!maskRaw){ showToast(t('toast_srcdst')); return; }
  const mask=convertMaskToDecimal(maskRaw); const isV6=ver==='ipv6'; const pfx=isV6?'ipv6 route':'ip route'; const maskArg=isV6?(maskRaw.startsWith('/')?maskRaw:maskRaw):mask;
  let c='';
  if(v==='cisco') c=nh?`${pfx} ${dest} ${maskArg} ${nh} ${ad&&ad!=='1'?ad:''}`.trim():`${pfx} ${dest} ${maskArg} ${iface} ${ad&&ad!=='1'?ad:''}`.trim();
  else if(v==='fortinet') c=`config router ${isV6?'ipv6':'static'}\n    edit 0\n        set dst ${dest} ${mask}\n${nh?`        set gateway ${nh}\n`:''}        set device "${iface||'wan1'}"\n        set distance ${ad}\n    next\nend`;
  else if(v==='paloalto') c=`set network virtual-router default routing-table ip static-route ROUTE-${dest} destination ${dest}${maskRaw.startsWith('/')?maskRaw:'/'+maskRaw}\n${nh?`set network virtual-router default routing-table ip static-route ROUTE-${dest} nexthop ip-address ${nh}\n`:''}set network virtual-router default routing-table ip static-route ROUTE-${dest} interface ${iface||'ethernet1/1'}\nset network virtual-router default routing-table ip static-route ROUTE-${dest} admin-dist ${ad}`;
  else if(v==='huawei') c=nh?`${isV6?'ipv6':'ip'} route-static ${dest} ${maskArg} ${nh} ${ad&&ad!=='1'?'preference '+ad:''}`.trim():`${isV6?'ipv6':'ip'} route-static ${dest} ${maskArg} ${iface} ${ad&&ad!=='1'?'preference '+ad:''}`.trim();
  else if(v==='aruba') c=nh?`${isV6?'ipv6':'ip'} route ${dest}/${cidrFromMask(mask)||24} ${nh} ${ad&&ad!=='1'?ad:''}`.trim():`${isV6?'ipv6':'ip'} route ${dest}/${cidrFromMask(mask)||24} ${iface}`;
  setOut('staticrouteOutputContainer','staticrouteOutputTitle','staticrouteCodeBlock',v.toUpperCase()+' Static Route',c);
}

function generateRedundancy(){
  const v=val('vendorRedundancy'),vlanId=val('redVlanId').trim(),vlanName=val('redVlanName').trim(),sviIp=val('redSviIp').trim(),sviMask=convertMaskToDecimal(val('redSviMask').trim()),vip=val('redVip').trim(),prio=val('redPriority').trim(),track=val('redTrack').trim();
  if(!vlanId||!vlanName||!sviIp||!sviMask||!vip||!prio){ showToast(t('toast_allfields')); return; }
  let c='';
  if(v==='cisco'){ c=`vlan ${vlanId}\n name ${vlanName}\n exit\ninterface vlan ${vlanId}\n description ${vlanName}\n ip address ${sviIp} ${sviMask}\n standby version 2\n standby 1 ip ${vip}\n standby 1 priority ${prio}\n standby 1 preempt`; if(track){ c+=`\n standby 1 track ${track} decrement 30`; } c+=`\n no shutdown\n exit`; }
  else if(v==='fortinet') c=`config system interface\n    edit "vlan${vlanId}"\n        set vdom "root"\n        set alias "${vlanName}"\n        set ip ${sviIp} ${sviMask}\n        set interface "port1"\n        set vlanid ${vlanId}\n        config vrrp\n            edit 1\n                set vrip ${vip}\n                set priority ${prio}\n                set preempt enable\n            next\n        end\n    next\nend`;
  else if(v==='aruba') c=`vlan ${vlanId}\n name ${vlanName}\n exit\ninterface vlan ${vlanId}\n description ${vlanName}\n ip address ${sviIp} ${sviMask}\n vrrp 1 address-family ipv4\n  address ${vip} primary\n  priority ${prio}\n  preempt\n  exit\n no shutdown\n exit`;
  else if(v==='huawei') c=`vlan ${vlanId}\n name ${vlanName}\n quit\ninterface Vlanif${vlanId}\n description ${vlanName}\n ip address ${sviIp} ${sviMask}\n vrrp vrid 1 virtual-ip ${vip}\n vrrp vrid 1 priority ${prio}\n vrrp vrid 1 preempt-mode timer delay 0${track?`\n vrrp vrid 1 track interface ${track} reduced 30`:''}\n quit`;
  setOut('redOutputContainer','redOutputTitle','redCodeBlock',v.toUpperCase()+' Config',c);
}

function generateOspf(){
  const v=val('ospfVendor'),proc=val('ospfProc').trim(),rid=val('ospfRid').trim(),area=val('ospfArea').trim(),net=val('ospfNet').trim(),wc=val('ospfWildcard').trim(),iface=val('ospfIface').trim(),areaType=val('ospfAreaType'),auth=val('ospfAuth'),cost=val('ospfCost'),passive=val('ospfPassive').trim();
  let c='';
  const areaCmd={stub:'stub',nssa:'nssa',tstub:'stub no-summary',tnssa:'nssa no-summary'}[areaType]||'';
  const authKey=(val('ospfPass')||'').trim()||'ChangeMe-OSPF!';
  if(v==='cisco'){ c=`router ospf ${proc}\n router-id ${rid}`; if(areaCmd) c+=`\n area ${area} ${areaCmd}`; if(auth!=='none') c+=`\n area ${area} authentication message-digest`; if(passive){ c+=`\n passive-interface default`; passive.split(',').map(s=>s.trim()).filter(Boolean).forEach(p=>{ c+=`\n no passive-interface ${p}`; }); } if(net&&wc) c+=`\n network ${net} ${wc} area ${area}`; c+=`\n!\ninterface ${iface||'GigabitEthernet0/0'}\n ip ospf ${proc} area ${area}\n ip ospf cost ${cost}`; if(auth==='md5') c+=`\n ip ospf authentication message-digest\n ip ospf message-digest-key 1 md5 ${authKey}`; else if(auth==='sha') c+=`\n ip ospf authentication key-chain OSPF-KC\n!\nkey chain OSPF-KC\n key 1\n  key-string ${authKey}\n  cryptographic-algorithm hmac-sha-256`; }
  else if(v==='huawei'){ c=`ospf ${proc} router-id ${rid}\n area ${area}${areaCmd?` ${areaCmd}`:''}`; c+=`\n  network ${net} ${wc}`; if(auth!=='none') c+=`\n  authentication-mode ${auth==='md5'?'md5':'hmac-sha256'} 1 cipher ${authKey}`; if(passive){ c+=`\n#\n passive-interface default`; passive.split(',').map(s=>s.trim()).filter(Boolean).forEach(p=>{ c+=`\n undo passive-interface ${p}`; }); } c+=`\n#\ninterface ${iface||'GigabitEthernet0/0'}\n ospf cost ${cost}`; }
  else if(v==='aruba'){ c=`router ospf ${proc}\n router-id ${rid}\n area ${area}${areaCmd?` ${areaCmd}`:''}`; if(passive){ c+=`\n passive-interface default`; passive.split(',').map(s=>s.trim()).filter(Boolean).forEach(p=>{ c+=`\n no passive-interface ${p}`; }); } c+=`\n!\ninterface ${iface||'vlan10'}\n ip ospf ${proc} area ${area}\n ip ospf cost ${cost}`; if(auth==='md5') c+=`\n ip ospf message-digest-key 1 md5 plaintext ${authKey}\n ip ospf authentication message-digest`; else if(auth==='sha') c+=`\n ip ospf sha-key 1 sha-256 plaintext ${authKey}\n ip ospf authentication sha`; }
  else if(v==='fortinet') c=`config router ospf\n    set router-id ${rid}\n    config area\n        edit ${area}\n${areaCmd?`            set type ${areaCmd.includes('nssa')?'nssa':'stub'}\n            set default-cost ${cost}\n`:''}        next\n    end\n    config ospf-interface\n        edit "${iface||'port1'}"\n            set interface "${iface||'port1'}"\n            set area ${area}\n            set cost ${cost}\n        next\n    end\nend`;
  else if(v==='paloalto') c=`set network virtual-router default protocol ospf router-id ${rid}\nset network virtual-router default protocol ospf enable yes\nset network virtual-router default protocol ospf area ${area} type ${areaCmd||'normal'}\nset network virtual-router default protocol ospf area ${area} interface ${iface||'ethernet1/1'} enable yes\nset network virtual-router default protocol ospf area ${area} interface ${iface||'ethernet1/1'} metric ${cost}`;
  setOut('ospfOutputContainer','ospfOutputTitle','ospfCodeBlock',v.toUpperCase()+' OSPF',c);
}

function generateBgp(){
  const v=val('bgpVendor'),localAs=val('bgpLocalAs').trim(),rid=val('bgpRid').trim(),nAs=val('bgpNeighborAs').trim(),nIp=val('bgpNeighborIp').trim(),advRaw=val('bgpAdvNet').trim();
  const pass=val('bgpPass').trim(),updSrc=val('bgpUpdSrc').trim(),mhop=val('bgpMhop').trim(),nhs=chk('bgpNhs'),rr=chk('bgpRr'),soft=chk('bgpSoft');
  let advNet='',advMask=''; if(advRaw.includes('/')){ const [ip,c]=advRaw.split('/'); advNet=ip.trim(); advMask=convertMaskToDecimal('/'+c.trim()); }
  let c='';
  if(v==='cisco'){ c=`router bgp ${localAs}\n bgp router-id ${rid}\n bgp log-neighbor-changes\n neighbor ${nIp} remote-as ${nAs}`; if(pass) c+=`\n neighbor ${nIp} password ${pass}`; if(updSrc) c+=`\n neighbor ${nIp} update-source ${updSrc}`; if(mhop&&mhop!=='1') c+=`\n neighbor ${nIp} ebgp-multihop ${mhop}`; if(nhs) c+=`\n neighbor ${nIp} next-hop-self`; if(rr) c+=`\n neighbor ${nIp} route-reflector-client`; if(soft) c+=`\n neighbor ${nIp} soft-reconfiguration inbound`; if(advNet) c+=`\n network ${advNet} mask ${advMask}`; }
  else if(v==='huawei'){ c=`bgp ${localAs}\n router-id ${rid}\n peer ${nIp} as-number ${nAs}`; if(pass) c+=`\n peer ${nIp} password cipher ${pass}`; if(updSrc) c+=`\n peer ${nIp} connect-interface ${updSrc}`; if(mhop&&mhop!=='1') c+=`\n peer ${nIp} ebgp-max-hop ${mhop}`; if(nhs) c+=`\n peer ${nIp} next-hop-local`; if(soft) c+=`\n peer ${nIp} route-policy IMPORT import`; if(advNet) c+=`\n network ${advNet} ${advMask}`; }
  else if(v==='fortinet'){ c=`config router bgp\n    set as ${localAs}\n    set router-id ${rid}\n    config neighbor\n        edit "${nIp}"\n            set remote-as ${nAs}`; if(pass) c+=`\n            set password ${pass}`; if(updSrc) c+=`\n            set update-source ${updSrc}`; if(mhop&&mhop!=='1') c+=`\n            set ebgp-multihop ${mhop}`; if(nhs) c+=`\n            set next-hop-self enable`; if(rr) c+=`\n            set route-reflector-client enable`; c+=`\n        next\n    end`; if(advNet) c+=`\n    config network\n        edit 1\n            set prefix ${advNet} ${advMask}\n        next\n    end`; c+=`\nend`; }
  else if(v==='paloalto'){ c=`set network virtual-router default protocol bgp local-as ${localAs}\nset network virtual-router default protocol bgp router-id ${rid}\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 peer-address ip ${nIp}\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 peer-as ${nAs}`; if(pass) c+=`\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 peer-address ip ${nIp} secret ${pass}`; if(updSrc) c+=`\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 local-address interface ${updSrc}`; if(mhop&&mhop!=='1') c+=`\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 ebgp-multihop ${mhop}`; if(nhs) c+=`\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 next-hop-self`; if(rr) c+=`\nset network virtual-router default protocol bgp peer-group PG1 peer NEIGH1 route-reflector-client`; }
  else if(v==='aruba'){ c=`router bgp ${localAs}\n    router-id ${rid}\n    neighbor ${nIp} remote-as ${nAs}`; if(pass) c+=`\n    neighbor ${nIp} password ${pass}`; if(updSrc) c+=`\n    neighbor ${nIp} update-source ${updSrc}`; if(mhop&&mhop!=='1') c+=`\n    neighbor ${nIp} ebgp-multihop ${mhop}`; if(nhs) c+=`\n    neighbor ${nIp} next-hop-self`; if(rr) c+=`\n    neighbor ${nIp} route-reflector-client`; if(advNet) c+=`\n    network ${advNet}/${cidrFromMask(advMask)||''}`; }
  setOut('bgpOutputContainer','bgpOutputTitle','bgpCodeBlock',v.toUpperCase()+' BGP',c);
}

function generateAcl(){
  const v=val('vendorAcl'),name=val('aclName').trim()||'MY_RULE',action=val('aclAction'),proto=val('aclProto'),srcIp=val('aclSrcIp').trim(),srcMaskRaw=val('aclSrcMask').trim(),dstIp=val('aclDstIp').trim(),dstMaskRaw=val('aclDstMask').trim(),port=val('aclPort').trim();
  const established=chk('aclEstablished'),log=chk('aclLog'),ipv6=chk('aclIpv6'),remark=val('aclRemark').trim();
  if(!srcIp||!srcMaskRaw||!dstIp||!dstMaskRaw){ showToast(t('toast_srcdst')); return; }
  if(ipv6){ if(!isValidIPv6(srcIp)||!isValidIPv6(dstIp)){ showToast(t('toast_invalid_ip')); return; } }
  else if(!isValidIp(srcIp)||!isValidIp(dstIp)){ showToast(t('toast_invalid_ip')); return; }
  const srcMaskDec=convertMaskToDecimal(srcMaskRaw),dstMaskDec=convertMaskToDecimal(dstMaskRaw),srcWild=convertMaskToWildcard(srcMaskRaw),dstWild=convertMaskToWildcard(dstMaskRaw);
  const srcPfx=srcMaskRaw.startsWith('/')?srcMaskRaw:'/'+srcMaskRaw, dstPfx=dstMaskRaw.startsWith('/')?dstMaskRaw:'/'+dstMaskRaw;
  const srcStr=ipv6?`${srcIp}${srcPfx}`:`${srcIp} ${srcWild}`,dstStr=ipv6?`${dstIp}${dstPfx}`:`${dstIp} ${dstWild}`; const portStr=(port&&proto!=='ip')?` eq ${port}`:''; const estStr=(established&&proto==='tcp')?' established':''; const logStr=log?' log':'';
  let c='';
  if(v==='cisco'){ const type=ipv6?'ipv6 access-list':'ip access-list extended'; c=`${type} ${name}${remark?`\n remark ${remark}`:''}\n 10 ${action} ${proto} ${srcStr} ${dstStr}${portStr}${estStr}${logStr}\n exit`; }
  else if(v==='fortinet'){ let svc='ALL'; let svcObj=''; if(proto==='tcp'&&port){ svc=`TCP_${port}`; svcObj=`config firewall service custom\n    edit "${svc}"\n        set tcp-portrange ${port}\n    next\nend\n\n`; } else if(proto==='udp'&&port){ svc=`UDP_${port}`; svcObj=`config firewall service custom\n    edit "${svc}"\n        set udp-portrange ${port}\n    next\nend\n\n`; } else if(proto==='icmp') svc='ALL_ICMP'; c=`${svcObj}config firewall address\n    edit "${name}_SRC"\n        set subnet ${srcIp} ${srcMaskDec}\n    next\n    edit "${name}_DST"\n        set subnet ${dstIp} ${dstMaskDec}\n    next\nend\n\nconfig firewall policy\n    edit 0\n        set name "${name}"\n        set srcintf "any"\n        set dstintf "any"\n        set srcaddr "${name}_SRC"\n        set dstaddr "${name}_DST"\n        set action ${action==='permit'?'accept':'deny'}\n        set schedule "always"\n        set service "${svc}"\n        set logtraffic all\n    next\nend`; }
  else if(v==='aruba') c=`ipv4 access-list ${name}${remark?`\n remark ${remark}`:''}\n 10 ${action} ${proto} ${srcStr} ${dstStr}${portStr}${estStr}${logStr}\n exit`;
  else if(v==='huawei') c=`acl name ${name} advance${remark?`\n description ${remark}`:''}\n rule 10 ${action} ${proto} source ${srcStr} destination ${dstStr}${(port&&proto!=='ip')?' destination-port eq '+port:''}${log?' logging':''}\n quit`;
  else if(v==='paloalto'){ const srcM=srcMaskRaw.startsWith('/')?srcMaskRaw:'/'+srcMaskRaw, dstM=dstMaskRaw.startsWith('/')?dstMaskRaw:'/'+dstMaskRaw; const svc=port?`${proto.toUpperCase()}-${port}`:'any'; c=`set rulebase security rules ${name} from any to any\nset rulebase security rules ${name} source "${srcIp}${srcM}"\nset rulebase security rules ${name} destination "${dstIp}${dstM}"\nset rulebase security rules ${name} service "${svc}"\nset rulebase security rules ${name} action ${action==='permit'?'allow':'deny'}\nset rulebase security rules ${name} log-end yes`; }
  setOut('aclOutputContainer','aclOutputTitle','aclCodeBlock',v.toUpperCase()+' Config',c);
}

function refreshNatFields(){ const v=val('natVendor'); document.getElementById('natVendorChip').innerText=v.toUpperCase(); const type=val('natType'); document.getElementById('natPatRow').style.display=type==='staticpat'?'grid':'none'; }
function generateNat(){
  const v=val('natVendor'),type=val('natType'),name=val('natName').trim()||'NAT_RULE',privIp=val('natPrivIp').trim(),privMaskRaw=val('natPrivMask').trim(),pubIp=val('natPubIp').trim(),outIface=val('natOutIface').trim();
  const lport=val('natLport').trim(),gport=val('natGport').trim();
  const privMaskDec=convertMaskToDecimal(privMaskRaw),privWild=convertMaskToWildcard(privMaskRaw);
  let c='';
  if(v==='cisco'){ if(type==='static') c=`ip nat inside source static ${privIp} ${pubIp}`; else if(type==='staticpat') c=`ip nat inside source static tcp ${privIp} ${lport} ${pubIp} ${gport} extendable`; else c=`access-list 1 permit ${privIp} ${privWild}\nip nat inside source list 1 interface ${outIface} overload\n!\ninterface ${outIface}\n ip nat outside`; }
  else if(v==='fortinet'){ if(type==='static') c=`config firewall vip\n    edit "${name}"\n        set extip ${pubIp}\n        set mappedip "${privIp}"\n        set extintf "any"\n    next\nend`; else if(type==='staticpat') c=`config firewall vip\n    edit "${name}"\n        set extip ${pubIp}\n        set mappedip "${privIp}"\n        set extport ${gport}\n        set mappedport ${lport}\n    next\nend`; else c=`config firewall address\n    edit "${name}_SRC"\n        set subnet ${privIp} ${privMaskDec}\n    next\nend\nconfig firewall policy\n    edit 0\n        set srcintf "internal"\n        set dstintf "wan1"\n        set srcaddr "${name}_SRC"\n        set dstaddr "all"\n        set action accept\n        set nat enable\n    next\nend`; }
  else if(v==='paloalto'){ if(type==='static') c=`set rulebase nat rules ${name} from any to any source ${privIp} destination any\nset rulebase nat rules ${name} source-translation static-ip translated-address ${pubIp}`; else if(type==='staticpat') c=`set rulebase nat rules ${name} from any to any destination ${pubIp}\nset rulebase nat rules ${name} destination-translation translated-address ${privIp} translated-port ${lport}`; else c=`set rulebase nat rules ${name} from any to any source ${privIp}${privMaskRaw.startsWith('/')?privMaskRaw:'/'+privMaskRaw} destination any\nset rulebase nat rules ${name} source-translation dynamic-ip-and-port translated-address ${pubIp}`; }
  else if(v==='huawei'){ if(type==='static') c=`nat static global ${pubIp} inside ${privIp}`; else if(type==='staticpat') c=`nat server protocol tcp global ${pubIp} ${gport} inside ${privIp} ${lport}`; else c=`acl 3000\n rule permit ip source ${privIp} ${privWild}\n#\ninterface ${outIface}\n nat outbound 3000`; }
  setOut('natOutputContainer','natOutputTitle','natCodeBlock',v.toUpperCase()+' NAT',c);
}

function generateVpn(){
  const v=val('vpnVendor'),ike=val('vpnIke'),name=val('vpnName').trim()||'VPN_TUNNEL',peer=val('vpnPeer').trim(),psk=val('vpnPsk').trim(),lNet=val('vpnLocalNet').trim(),lMask=val('vpnLocalMask').trim(),rNet=val('vpnRemoteNet').trim(),rMask=val('vpnRemoteMask').trim();
  const p1=val('vpnP1life').trim(),p2=val('vpnP2life').trim(),pfs=val('vpnPfs'),natt=chk('vpnNatt'),dpd=chk('vpnDpd'),pfsOn=chk('vpnPfsOn'),lid=val('vpnLocalId').trim(),rid=val('vpnRemoteId').trim();
  let c='';
  if(v==='cisco'){ const ikeCmd=ike==='ikev2'?'crypto ikev2 policy 10':'crypto isakmp policy 10'; c=`${ikeCmd}\n encryption aes 256\n integrity sha256\n group 14\n lifetime ${p1}\ncrypto isakmp key ${psk} address ${peer}\ncrypto ipsec transform-set TS-${name} esp-aes 256 esp-sha256-hmac\naccess-list 100 permit ip ${lNet} ${lMask} ${rNet} ${rMask}\ncrypto ipsec security-association lifetime kilobytes ${p2}\ncrypto map CMAP-${name} 10 ipsec-isakmp\n set peer ${peer}\n set transform-set TS-${name}\n${pfsOn?` set pfs group${pfs}\n`:''} match address 100`; }
  else if(v==='fortinet'){ c=`config vpn ipsec phase1-interface\n    edit "${name}"\n        set interface "wan1"\n        set ike-version ${ike==='ikev2'?'2':'1'}\n        set peertype any\n        set remote-gw ${peer}\n        set psksecret ${psk}\n        set proposal aes256-sha256\n        set keylife ${p1}${natt?'\n        set nattraversal enable':''}${dpd?'\n        set dpd on-idle':''}${lid?`\n        set localid "${lid}"`:''}${rid?`\n        set remoteid "${rid}"`:''}\n    next\nend\nconfig vpn ipsec phase2-interface\n    edit "${name}_p2"\n        set phase1name "${name}"\n        set src-subnet ${lNet} ${lMask}\n        set dst-subnet ${rNet} ${rMask}\n        set keylifeseconds ${p2}${pfsOn?`\n        set pfs enable\n        set dhgrp ${pfs}`:''}\n    next\nend`; }
  else if(v==='paloalto'){ c=`set network interface tunnel tunnel.1\nset network virtual-router default interface tunnel.1\nset zone VPN_ZONE network layer3 tunnel.1\nset network ike-crypto-profile IKE-${name} hash sha256 dh-group group${pfs} encryption aes-256-cbc lifetime seconds ${p1}\nset network ike-gateway ${name} protocol-version ${ike==='ikev2'?'ikev2':'ikev1'}\nset network ike-gateway ${name} peer-address ip ${peer}\nset network ike-gateway ${name} authentication pre-shared-key key ${psk}${natt?`\nset network ike-gateway ${name} nat-traversal enable`:''}${dpd?`\nset network ike-gateway ${name} dead-peer-detection enable`:''}\nset network ipsec-crypto-profile IPSEC-${name} esp encryption aes-256-cbc lifetime seconds ${p2}\nset network tunnel ipsec ${name} tunnel-interface tunnel.1\nset network tunnel ipsec ${name} auto-key ike-gateway ${name}\nset network tunnel ipsec ${name} auto-key ipsec-crypto-profile IPSEC-${name}${pfsOn?`\nset network tunnel ipsec ${name} auto-key ipsec-crypto-profile IPSEC-${name} dh-group group${pfs}`:''}\nset rulebase security rules ${name}_ALLOW source ${lNet} destination ${rNet}`; }
  else if(v==='huawei'){ c=`ike ${ike==='ikev2'?'proposal 10':'proposal 10'}\n encryption-algorithm aes-256\n authentication-algorithm sha2-256\n dh group${pfs}\nike peer ${name}\n pre-shared-key simple ${psk}\n remote-address ${peer}${ike==='ikev2'?'':'\n exchange-mode main'}${natt?'\n nat traversal':''}${dpd?'\n dpd enable':''}${lid?`\n local-id ${lid}`:''}${rid?`\n remote-id ${rid}`:''}\nipsec proposal PROP-${name}\n encapsulation-mode tunnel\nipsec policy POLICY-${name} 10 isakmp\n ike-peer ${name}\n proposal PROP-${name}\n security acl 3001\n sa duration ${p2}${pfsOn?`\n pfs group${pfs}`:''}\nacl 3001\n rule permit ip source ${lNet} ${lMask} destination ${rNet} ${rMask}`; }
  setOut('vpnOutputContainer','vpnOutputTitle','vpnCodeBlock',v.toUpperCase()+' IPsec VPN',c);
}

function generateAaa(){
  const v=val('aaaVendor'),type=val('aaaType'),server=val('aaaServer').trim(),key=val('aaaKey').trim(),port=val('aaaPort').trim()||'1812',iface=val('aaaIface').trim();
  const mab=chk('aaaMab'),dynVlan=chk('aaaDynVlan'),acct=chk('aaaAcct'),deadtime=val('aaaDeadtime').trim();
  let c='';
  if(v==='cisco'){ if(type==='radius'){ c=`radius server AAA\n address ipv4 ${server} auth-port ${port} key ${key}\naaa new-model\naaa group server radius AAA\n server name AAA\n deadtime ${deadtime}\naaa authentication dot1x default group AAA${mab?' local':' local'}\n${mab?'aaa authentication mab default group AAA local\n':''}${dynVlan?'aaa authorization network default group AAA\n':''}${acct?'aaa accounting dot1x default start-stop group AAA\n':''}dot1x system-auth-control\n!\ninterface ${iface}\n switchport mode access\n authentication port-control auto${mab?'\n mab enable':''}\n dot1x pae authenticator`; } else { c=`tacacs server AAA\n address ipv4 ${server} key ${key}\naaa new-model\naaa group server tacacs+ AAA\n server name AAA\n deadtime ${deadtime}\naaa authentication login default group AAA local\naaa authorization exec default group AAA local\naaa authorization commands 15 default group AAA local${acct?'\naaa accounting commands 15 default start-stop group AAA':''}\nline vty 0 4\n login authentication default`; } }
  else if(v==='huawei'){ if(type==='radius'){ c=`radius-server template AAA\n radius-server authentication ${server} ${port}\n radius-server accounting ${server} 1813\n radius-server shared-key cipher ${key}\n server deadtime ${deadtime}\naaa\n authentication-scheme default\n authentication-mode radius local\n authorization-scheme default\n authorization-mode ${dynVlan?'radius ':''}local${acct?'\n accounting-scheme default\n accounting-mode radius':''}\ndot1x enable\ninterface ${iface}\n port link-type access\n dot1x enable${mab?'\n mac-authen enable':''}`; } else { c=`hwtacacs-server template AAA\n hwtacacs-server authentication ${server}\n hwtacacs-server shared-key cipher ${key}\n server deadtime ${deadtime}\naaa\n authentication-scheme default\n authentication-mode hwtacacs local\n authorization-scheme default\n authorization-scheme default\n authorization-mode hwtacacs local${acct?'\n accounting-scheme default\n accounting-mode hwtacacs':''}`; } }
  else if(v==='aruba'){ if(type==='radius'){ c=`radius-server host ${server} key ${key}\naaa group server radius AAA\n server ${server}\n deadtime ${deadtime}\naaa authentication dot1x default group AAA local${mab?'\naaa authentication mac-auth default group AAA local':''}${dynVlan?'\naaa authorization network default group AAA':''}${acct?'\naaa accounting dot1x default start-stop group AAA':''}\ninterface ${iface}\n port-access port-control auto${mab?'\n port-access mac-auth':''}${dynVlan?'\n port-access aaa-attr-vlan':''}`; } else { c=`tacacs-server host ${server} key ${key}\naaa authentication login default group tacacs local\naaa authorization exec default group tacacs local`; } }
  setOut('aaaOutputContainer','aaaOutputTitle','aaaCodeBlock',v.toUpperCase()+' AAA',c);
}

function generateQos(){
  const v=val('qosVendor'),policy=val('qosPolicy').trim(),cir=parseInt(val('qosCir'),10),bc=parseInt(val('qosBc'),10)||0,mark=val('qosMark').trim();
  const cirKbps=Math.max(1,Math.round(cir/1000)); // Huawei 'car' ve Aruba 'rate-limit' kbit/s bekler, girdi bps olduğu için çevir
  let c='';
  if(v==='cisco') c=`class-map match-any ${policy}-CLASS\n match any\npolicy-map ${policy}\n class ${policy}-CLASS\n  police cir ${cir} bc ${bc}\n  conform-action transmit\n  exceed-action drop${mark?`\n  set dscp ${mark}`:''}\n!\ninterface GigabitEthernet0/0\n service-policy output ${policy}`;
  else if(v==='huawei') c=`traffic classifier ${policy}\n if-match any\ntraffic behavior ${policy}\n car cir ${cirKbps} cbs ${bc} green pass red discard${mark?`\n remark dscp ${mark}`:''}\ntraffic policy ${policy}\n classifier ${policy} behavior ${policy}\ninterface GigabitEthernet0/0\n traffic-policy ${policy} outbound`;
  else if(v==='aruba') c=`class ipv4 ${policy}\n match any\n exit\npolicy ${policy}\n class ipv4 ${policy}\n  rate-limit ${cirKbps} kbps${mark?`\n  set dscp ${mark}`:''}\n  exit\ninterface 1/1/1\n  service-policy ${policy} in`;
  setOut('qosOutputContainer','qosOutputTitle','qosCodeBlock',v.toUpperCase()+' QoS',c);
}

function generateFwz(){
  const v=val('fwzVendor'),zone=val('fwzZone').trim(),iface=val('fwzIface').trim(),to=val('fwzTo').trim(),app=val('fwzApp').trim(),intra=val('fwzIntra');
  let c='';
  if(v==='paloalto') c=`set zone ${zone} network layer3 ${iface}\nset zone ${zone} enable-packet-buffer-protection yes\nset zone ${to} network layer3 ${iface}\nset zone ${zone} ${intra==='deny'?'block':'allow'} intra-zone-traffic yes\nset rulebase security rules ${zone}_TO_${to} from ${zone} to ${to}\nset rulebase security rules ${zone}_TO_${to} application ${app||'any'}\nset rulebase security rules ${zone}_TO_${to} action allow\nset rulebase security rules default from ${zone} to any action deny`;
  else if(v==='fortinet') c=`config system zone\n    edit "${zone}"\n        set interface "${iface}"\n    next\n    edit "${to}"\n        set interface "${iface}"\n    next\nend\nconfig firewall policy\n    edit 0\n        set srcintf "${zone}"\n        set dstintf "${to}"\n        set action accept\n        set service "ALL"\n        set logtraffic all\n    next\nend`;
  else if(v==='cisco') c=`zone security ${zone}\nzone security ${to}\nzone-pair security ${zone}-${to}-PAIR source ${zone} destination ${to}\n service-policy type inspect ${zone}-${to}-POLICY\n!\nclass-map type inspect match-any ${zone}-${to}-CLASS\n match protocol ${app||'tcp'}\npolicy-map type inspect ${zone}-${to}-POLICY\n class type inspect ${zone}-${to}-CLASS\n  inspect\n class class-default\n  drop\n!\ninterface ${iface}\n zone-member security ${zone}`;
  setOut('fwzoneOutputContainer','fwzoneOutputTitle','fwzoneCodeBlock',v.toUpperCase()+' Zone/Policy',c);
}

function generateDhcp(){
  const v=val('dhcpVendor'),role=val('dhcpRole'),pool=val('dhcpPool').trim(),net=val('dhcpNet').trim(),mask=val('dhcpMask').trim(),gw=val('dhcpGw').trim(),dns=val('dhcpDns').trim(),excl=val('dhcpExcl').trim(),option=val('dhcpOption').trim(),resv=val('dhcpResv').trim(),lease=val('dhcpLease');
  let c='';
  if(v==='cisco'){ if(role==='server'){ c=`ip dhcp excluded-address ${excl}`; if(option){const [oc,...rest]=option.split(/\s+/); c+=`\nip dhcp option ${oc} ip ${rest.join(' ')}`;} c+=`\n!\nip dhcp pool ${pool}\n network ${net} ${mask}\n default-router ${gw}\n dns-server ${dns}\n lease ${lease}`; if(resv){const [mac,ip]=resv.split(/\s+/); c+=`\n!\nip dhcp pool ${pool}_RESV\n host ${ip} ${mask}\n hardware-address ${mac}`;} } else c=`interface ${val('dhcpIface')||'Vlan10'}\n ip helper-address ${gw}`; }
  else if(v==='huawei'){ if(role==='server'){ c=`dhcp enable\nip pool ${pool}\n network ${net} mask ${mask}\n gateway-list ${gw}\n dns-list ${dns}\n lease day ${lease==='infinite'?'0 0 infinite':lease}${excl?`\n excluded-ip-address ${excl}`:''}${resv?`\n static-bind mac-address ${resv.split(/\s+/)[0]} ip-address ${resv.split(/\s+/)[1]}`:''}`; } else c=`dhcp enable\ninterface ${val('dhcpIface')||'Vlanif10'}\n dhcp select relay\n dhcp relay server-ip ${gw}`; }
  else if(v==='aruba'){ if(role==='server'){ c=`dhcp-server\n pool ${pool}\n  network ${net}/${cidrFromMask(convertMaskToDecimal(mask))||24}\n  default-router ${gw}\n  dns-server ${dns}\n  lease ${lease}${excl?`\n  range ${excl}`:''}${resv?`\n  reservation ${resv}`:''}`; } else c=`interface ${val('dhcpIface')||'vlan10'}\n dhcp-relay\n ip helper-address ${gw}`; }
  setOut('dhcpOutputContainer','dhcpOutputTitle','dhcpCodeBlock',v.toUpperCase()+' DHCP',c);
}

function generateDns(){
  const v=val('dnsVendor'),role=val('dnsRole'),iface=val('dnsIface').trim(),fwd=val('dnsFwd').trim().split(',').map(s=>s.trim()).filter(Boolean);
  let c='';
  if(v==='cisco') c=role==='server'?`ip dns server\nip domain-name local\nip name-server ${fwd.join(' ')}\ninterface ${iface}\n ip address ${val('dnsNet')||'10.0.0.1 255.255.255.0'}`:`ip name-server ${fwd.join(' ')}`;
  else if(v==='huawei') c=role==='server'?`dns server enable\ndns server ${fwd.join(' ')}`:`dns resolve\ndns server ${fwd.join(' ')}`;
  else if(v==='aruba') c=role==='server'?`ip dns server\nip domain-name local\nip name-server ${fwd.join(' ')}`:`ip name-server ${fwd.join(' ')}`;
  setOut('dnsOutputContainer','dnsOutputTitle','dnsCodeBlock',v.toUpperCase()+' DNS',c);
}

function generateSnmp(){
  const v=val('snmpVendor'),ver=val('snmpVer'),comm=val('snmpComm').trim(),acl=val('snmpAcl').trim(),sec=val('snmpSec'),trap=val('snmpTrap').trim();
  let c='';
  if(v==='cisco'){ if(ver==='v2c') c=`snmp-server community ${comm} RO${acl?' '+acl:''}\nsnmp-server location DC1\nsnmp-server contact netops${trap?`\nsnmp-server host ${trap} version 2c ${comm}`:''}`; else c=`snmp-server group GRP v3 priv read VIEW\nsnmp-server user ${comm} GRP v3 auth sha AuthPass123 priv aes 256 PrivPass123\nsnmp-server view VIEW iso included${trap?`\nsnmp-server host ${trap} version 3 priv ${comm}`:''}`; }
  else if(v==='huawei'){ if(ver==='v2c') c=`snmp-agent\nsnmp-agent community read ${comm}${acl?' acl '+acl:''}\nsnmp-agent sys-info version v2c${trap?`\nsnmp-agent target-host trap address udp-domain ${trap} params securityname ${comm}`:''}`; else c=`snmp-agent\nsnmp-agent group v3 ${comm} ${sec}\nsnmp-agent usm-user v3 ${comm} group ${comm} auth-mode sha AuthPass123 priv-mode aes256 PrivPass123${trap?`\nsnmp-agent target-host trap address udp-domain ${trap} params securityname ${comm}`:''}`; }
  else if(v==='aruba'){ if(ver==='v2c') c=`snmp-server community ${comm} restricted${acl?' '+acl:''}${trap?`\nsnmp-server trap ${trap}`:''}`; else c=`snmpv3 user ${comm} auth sha AuthPass123 priv aes PrivPass123\nsnmpv3 user ${comm} ${sec}${trap?`\nsnmp-server trap ${trap}`:''}`; }
  else if(v==='fortinet'){ if(ver==='v2c') c=`config system snmp sysinfo\n    set status enable\n    set contact-info "netops"\nend\nconfig system snmp community\n    edit 1\n        set id ${comm}\n    next\nend${trap?`\nconfig system snmp sysinfo\n    set trap-status enable\n    set trap-high-cpu-use 80\nend`:''}`; else c=`config system snmp user\n    edit "${comm}"\n        set security-level ${sec}\n        set auth-proto sha\n        set auth-pwd AuthPass123\n        set priv-proto aes256\n        set priv-pwd PrivPass123\n    next\nend`; }
  else if(v==='paloalto'){ if(ver==='v2c') c=`set deviceconfig system snmp-setting access-setting ${acl||'10.0.0.0/24'}\nset deviceconfig system snmp-setting snmp-system contact netops`; else c=`set deviceconfig system snmp-setting v3-view VIEW oid 1\nset deviceconfig system snmp-setting v3-user ${comm} auth-pass-val AuthPass123 priv-pass-val PrivPass123 auth-proto sha priv-proto aes256`; }
  setOut('snmpOutputContainer','snmpOutputTitle','snmpCodeBlock',v.toUpperCase()+' SNMP',c);
}

const TZMAP={'UTC':['UTC',0],'Europe/Istanbul':['TRT',3],'Europe/London':['GMT',0],'Europe/Berlin':['CET',1],'Europe/Paris':['CET',1],'Europe/Madrid':['CET',1],'Europe/Moscow':['MSK',3],'America/New_York':['EST',-5],'America/Chicago':['CST',-6],'America/Denver':['MST',-7],'America/Los_Angeles':['PST',-8],'America/Sao_Paulo':['BRT',-3],'Asia/Dubai':['GST',4],'Asia/Kolkata':['IST',5],'Asia/Shanghai':['CST',8],'Asia/Tokyo':['JST',9],'Asia/Singapore':['SGT',8],'Australia/Sydney':['AEST',10]};
function tzInfo(tz){ if(TZMAP[tz]) return TZMAP[tz]; const m=tz.match(/^UTC?([+-]\d{1,2})$/i); if(m) return [tz.toUpperCase(),parseInt(m[1],10)]; const last=(tz.split('/').pop()||'UTC').slice(0,4).toUpperCase(); return [last,0]; }
function generateBaseline(){
  const v=val('baseVendor'),host=val('baseHostname').trim(),user=val('baseUser').trim(),pass=val('basePass').trim(),ntp=val('baseNtp').trim(),syslog=val('baseSyslog').trim(),tz=val('baseTz').trim(),level=val('baseLevel');
  const hardening=chk('baseHardening'),ssh2=chk('baseSsh2'),noTelnet=chk('baseNoTelnet');
  if(!host||!user||!pass){ showToast(t('toast_host_user')); return; }
  let c=''; const [tzAbbr,tzOff]=tzInfo(tz);
  if(v==='cisco'){ c=`hostname ${host}\n!\nusername ${user} privilege 15 secret ${pass}\n!\nno ip domain lookup\nip domain-name local${ssh2?'\ncrypto key generate rsa modulus 2048':''}\n!\nntp server ${ntp}\nclock timezone ${tzAbbr} ${tzOff}\nlogging host ${syslog}\nlogging trap ${level}\n!\nline vty 0 4\n transport input ssh\n login local\n!\nline con 0\n login local`; if(hardening) c+=`\n!\nservice password-encryption\nno service pad\nno ip source-route\nno ip finger`; if(noTelnet) c+=`\nno ip http server\nno ip http secure-server\nno service tcp-small-servers\nno service udp-small-servers`+"\n!\nbanner motd ^ Authorized access only. ^"; }
  else if(v==='fortinet') c=`config system global\n    set hostname "${host}"\n    set timezone ${tz}\nend\nconfig system admin\n    edit "${user}"\n        set password ${pass}\n        set accprofile "super_admin"\n    next\nend\nconfig system ntp\n    set ntpsync enable\n    config ntpserver\n        edit 1\n            set server "${ntp}"\n        next\n    end\nend\nconfig log syslogd setting\n    set status enable\n    set server "${syslog}"\n    set mode udp\n    set severity ${level}\nend`;
  else if(v==='paloalto') c=`set deviceconfig system hostname ${host}\nset deviceconfig system timezone ${tz}\nset mgt-config users ${user} password ${pass}\nset deviceconfig system ntp-servers primary-ntp-server ntp-server-address ${ntp}\nset shared log-settings syslog SYSLOG-PROFILE server SYSLOG-SRV server ${syslog}\nset shared log-settings syslog SYSLOG-PROFILE server SYSLOG-SRV transport UDP\nset shared log-settings syslog SYSLOG-PROFILE server SYSLOG-SRV severity ${level}`;
  else if(v==='huawei'){ const habs=String(Math.abs(tzOff)).padStart(2,'0'); c=`sysname ${host}\nclock timezone ${tzAbbr} ${tzOff>=0?'add':'minus'} ${habs}:00:00\naaa\n local-user ${user} password irreversible-cipher ${pass}\n local-user ${user} privilege level 15\n local-user ${user} service-type ssh\nntp-service unicast-server ${ntp}\ninfo-center loghost ${syslog}\ninfo-center timestamp log date ${level}\nstelnet server enable\nssh user ${user}\nssh user ${user} authentication-type password${hardening?`\nundo telnet server enable\nundo http server enable`:''}`; }
  else if(v==='aruba') c=`hostname ${host}\nclock timezone ${tzAbbr} ${tzOff}\nuser ${user} group administrators password plaintext ${pass}\nntp server ${ntp}\nlogging ${syslog} severity ${level}\nssh server vrf default${noTelnet?'\nno telnet-server':''}`;
  setOut('baseOutputContainer','baseOutputTitle','baseCodeBlock',v.toUpperCase()+' Baseline',c);
}

function generatePasswords(){
  const len=parseInt(val('pgLen'),10)||24,count=parseInt(val('pgCount'),10)||5;
  const upper=chk('pgUpper'),lower=chk('pgLower'),digit=chk('pgDigit'),sym=chk('pgSym'),avoid=chk('pgAvoid');
  let pool=''; if(upper) pool+='ABCDEFGHJKLMNPQRSTUVWXYZ'+(avoid?'':'IO'); if(lower) pool+='abcdefghijkmnpqrstuvwxyz'+(avoid?'':'lo'); if(digit) pool+='23456789'+(avoid?'':'01'); if(sym) pool+='!@#$%^&*-_=+';
  if(!pool) pool='abcdefghijkmnpqrstuvwxyz23456789';
  const arr=new Uint32Array(len*count); crypto.getRandomValues(arr);
  const list=[]; for(let c=0;c<count;c++){ let s=''; for(let i=0;i<len;i++) s+=pool[arr[c*len+i]%pool.length]; list.push(s); }
  const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const listEl=document.getElementById('pgList');
  listEl.innerHTML=list.map(p=>`<div class="pwd-out"><code>${esc(p)}</code><button class="btn-ghost" type="button" data-pwd="${esc(p)}" data-i18n="copy">${t('copy')}</button></div>`).join('');
  listEl.querySelectorAll('button[data-pwd]').forEach(b=>b.addEventListener('click',()=>copyText(b.dataset.pwd,b)));
  const bits=Math.round(len*Math.log2(pool.length)); const bar=document.getElementById('pgStrength'); bar.style.width=Math.min(100,bits/128*100)+'%'; bar.style.background=bits>=100?'var(--success)':bits>=60?'var(--accent)':'var(--danger)';
}

/* ---------- dynamic listeners + live refresh ---------- */
function attachDynamicListeners(){
  const cc=document.getElementById('convCidr'),cm=document.getElementById('convMask'),cw=document.getElementById('convWild');
  if(cc) cc.addEventListener('input',convFromCidr); if(cm) cm.addEventListener('input',convFromMask); if(cw) cw.addEventListener('input',convFromWild);
  const ipi=document.getElementById('ipconvIp'),ipd=document.getElementById('ipconvDec');
  if(ipi) ipi.addEventListener('input',calcIpconv); if(ipd) ipd.addEventListener('input',calcIpconv);
  const vv=document.getElementById('vlanVendor'),vm=document.getElementById('vlanMode');
  if(vv) vv.addEventListener('change',refreshVlanFields); if(vm) vm.addEventListener('change',refreshVlanFields); if(vv) refreshVlanFields();
  const natV=document.getElementById('natVendor'),natT=document.getElementById('natType');
  if(natV) natV.addEventListener('change',refreshNatFields); if(natT) natT.addEventListener('change',refreshNatFields); if(natV) refreshNatFields();
  Object.entries(VENDOR_CHIPS).forEach(([id,chipId])=>{ const el=document.getElementById(id); if(el) el.addEventListener('change',()=>{ const chip=document.getElementById(chipId); if(chip) chip.innerText=el.value.toUpperCase(); }); });
  const redV=document.getElementById('vendorRedundancy'); if(redV) redV.addEventListener('change',()=>{ const cisco=redV.value==='cisco'; document.getElementById('lblRedVip').innerText=cisco?'HSRP VIP':'VRRP VIP'; document.getElementById('lblRedPriority').innerText=cisco?'HSRP Priority':'VRRP Priority'; const rc=document.getElementById('redundancyVendorChip'); if(rc) rc.innerText=redV.value.toUpperCase(); });
}
const VENDOR_CHIPS={vlanVendor:'vlanVendorChip',stpVendor:'stpVendorChip',vendorPortSec:'portsecVendorChip',lagVendor:'lagVendorChip',srVendor:'staticrouteVendorChip',vendorRedundancy:'redundancyVendorChip',ospfVendor:'ospfVendorChip',bgpVendor:'bgpVendorChip',vendorAcl:'aclVendorChip',natVendor:'natVendorChip',vpnVendor:'vpnVendorChip',aaaVendor:'aaaVendorChip',qosVendor:'qosVendorChip',fwzVendor:'fwzoneVendorChip',dhcpVendor:'dhcpVendorChip',dnsVendor:'dnsVendorChip',snmpVendor:'snmpVendorChip',baseVendor:'baselineVendorChip'};
function syncVendorChips(){ Object.entries(VENDOR_CHIPS).forEach(([id,chipId])=>{ const el=document.getElementById(id),chip=document.getElementById(chipId); if(el&&chip) chip.innerText=el.value.toUpperCase(); }); }
function refreshLiveTools(){ try{ if(document.getElementById('convCidr')) convFromCidr(); }catch(e){} try{ calcIpconv(); }catch(e){} try{ syncVendorChips(); }catch(e){} }
