/* NOC-Kit — 28 aracın HTML görünümleri
   Bu dosya index.html tarafından sırayla yüklenir; sıralamayı değiştirmeyin. */
function buildViews(){
  const V={};
  V.subnet=`${viewHead('subnet')}
    <div class="row row-2">${field('<span data-i18n="f_ip">'+t('f_ip')+'</span> <span class="req">*</span>',text('ipAddress','192.168.1.0'))}${field('<span data-i18n="f_cidr">'+t('f_cidr')+'</span> <span class="req">*</span>',num('cidr',24,0,32))}</div>
    ${alertBox('subnet')}${btn('btn_calc','calculateSubnet()')}
    <div id="subnetResults" style="display:none;">
      <div class="grid-out">
        <div class="cell"><span class="k" data-i18n="res_network">${t('res_network')}</span><span class="v" id="resNetwork">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_bcast">${t('res_bcast')}</span><span class="v" id="resBroadcast">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_mask">${t('res_mask')}</span><span class="v" id="resMask">-</span></div>
        <div class="cell accent2"><span class="k" data-i18n="res_wild">${t('res_wild')}</span><span class="v" id="resWildcard">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_first">${t('res_first')}</span><span class="v" id="resFirstIp">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_last">${t('res_last')}</span><span class="v" id="resLastIp">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_class">${t('res_class')}</span><span class="v" id="resClass">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_scope">${t('res_scope')}</span><span class="v" id="resScope">-</span></div>
        <div class="cell accent span2"><span class="k" data-i18n="res_hostcount">${t('res_hostcount')}</span><span class="v" id="resHostCount">-</span><span class="sub" id="resNetType"></span></div>
      </div>
      <div class="rangebar-wrap"><div class="binmap-title" data-i18n="res_network">${t('res_network')}</div>
        <div class="rangebar"><div class="rb-seg rb-net" id="rbNet">NET</div><div class="rb-seg rb-host" id="rbHost">USABLE</div><div class="rb-seg rb-bcast" id="rbBcast">BCAST</div></div>
        <div class="rb-caption"><span id="rbCapLeft">-</span><span id="rbCapRight">-</span></div></div>
      <div class="binmap"><div class="binmap-title">Bit Map</div><div class="binrow"><span class="binlbl">IP</span><span id="binIp"></span></div><div class="binrow"><span class="binlbl">Mask</span><span id="binMask"></span></div>
        <div class="binlegend"><span><span class="swatch" style="background:var(--accent)"></span>network bits</span><span><span class="swatch" style="background:var(--text-faint)"></span>host bits</span></div></div>
    </div>${notesHtml('subnet')}`;

  V.vlsm=`${viewHead('vlsm')}
    <div class="row row-2">${field('<span data-i18n="f_base_net">'+t('f_base_net')+'</span> <span class="req">*</span>',text('vlsmBase','10.0.0.0'))}${field('<span data-i18n="f_base_cidr">'+t('f_base_cidr')+'</span> <span class="req">*</span>',num('vlsmCidr',22,0,30))}</div>
    ${field('<span data-i18n="f_reqs">'+t('f_reqs')+'</span>',`<textarea id="vlsmReqs">Satış:50, IT:25, Misafir:10, Yönetim:5, Yazıcılar:2</textarea><div class="hint" data-i18n="hint_vlsm">${t('hint_vlsm')}</div>`)}
    ${alertBox('vlsm')}${btn('btn_split','calculateVlsm()')}
    <div id="vlsmResults" style="display:none;"><div class="cell span2" style="margin-bottom:12px;"><span class="k" data-i18n="res_used">${t('res_used')}</span><span class="v" id="vlsmUsage">-</span></div>
      <div class="table-wrap"><table class="vlsm"><thead><tr><th>Ad</th><th>Host</th><th>Network</th><th>CIDR</th><th>Mask</th><th>Range</th><th>Broadcast</th></tr></thead><tbody id="vlsmTbody"></tbody></table></div></div>${notesHtml('vlsm')}`;

  V.conv=`${viewHead('conv')}<div class="liveconv">
    ${field('<span data-i18n="f_cidr">'+t('f_cidr')+'</span>',text('convCidr','/24','f_cidr'))}
    ${field('<span data-i18n="res_mask">'+t('res_mask')+'</span>',text('convMask','','res_mask'))}
    ${field('<span data-i18n="res_wild">'+t('res_wild')+'</span>',text('convWild','','res_wild'))}
    ${field('<span data-i18n="res_hostcount">'+t('res_hostcount')+'</span>',`<input type="text" id="convHosts" disabled placeholder="-">`)}</div>${notesHtml('conv')}`;

  V.ipv6=`${viewHead('ipv6')}
    <div class="row row-2">${field('<span data-i18n="f_ipv6_addr">'+t('f_ipv6_addr')+'</span> <span class="req">*</span>',text('ipv6Addr','2001:db8::'))}${field('<span data-i18n="f_ipv6_prefix">'+t('f_ipv6_prefix')+'</span> <span class="req">*</span>',num('ipv6Prefix',48,0,128))}</div>
    ${alertBox('ipv6')}${btn('btn_calc','calculateIpv6()')}
    <div id="ipv6Results" style="display:none;">
      <div class="grid-out">
        <div class="cell"><span class="k" data-i18n="res_ipv6_net">${t('res_ipv6_net')}</span><span class="v" id="ipv6Net">-</span></div>
        <div class="cell accent"><span class="k" data-i18n="res_ipv6_comp">${t('res_ipv6_comp')}</span><span class="v" id="ipv6Comp">-</span></div>
        <div class="cell span2"><span class="k" data-i18n="res_ipv6_full">${t('res_ipv6_full')}</span><span class="v" id="ipv6Full">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_ipv6_first">${t('res_ipv6_first')}</span><span class="v" id="ipv6First">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_ipv6_last">${t('res_ipv6_last')}</span><span class="v" id="ipv6Last">-</span></div>
        <div class="cell accent2"><span class="k" data-i18n="res_ipv6_count">${t('res_ipv6_count')}</span><span class="v" id="ipv6Count">-</span></div>
        <div class="cell accent2"><span class="k" data-i18n="res_ipv6_subnets">${t('res_ipv6_subnets')}</span><span class="v" id="ipv6Subnets">-</span></div>
      </div></div>${notesHtml('ipv6')}`;

  V.ipconv=`${viewHead('ipconv')}
    ${field('<span data-i18n="f_ip_input">'+t('f_ip_input')+'</span>',text('ipconvIp','192.168.1.1','f_ip'))}
    <div class="grid-out" style="margin-top:8px;">
      <div class="cell"><span class="k" data-i18n="res_network">${t('res_network')}</span><span class="v" id="ipcDotted">-</span></div>
      <div class="cell"><span class="k" data-i18n="res_dec">${t('res_dec')}</span><span class="v" id="ipcDec">-</span></div>
      <div class="cell"><span class="k" data-i18n="res_hex">${t('res_hex')}</span><span class="v" id="ipcHex">-</span></div>
      <div class="cell"><span class="k" data-i18n="res_bin">${t('res_bin')}</span><span class="v" id="ipcBin">-</span></div>
      <div class="cell"><span class="k" data-i18n="res_oct">${t('res_oct')}</span><span class="v" id="ipcOct">-</span></div>
      <div class="cell"><span class="k" data-i18n="res_rev">${t('res_rev')}</span><span class="v" id="ipcRev">-</span></div>
    </div>
    ${field('<span data-i18n="res_dec">'+t('res_dec')+'</span>',text('ipconvDec','','res_dec'))}${notesHtml('ipconv')}`;

  V.mtu=`${viewHead('mtu')}
    <div class="row row-2">${field('<span data-i18n="f_mtu">'+t('f_mtu')+'</span> <span class="req">*</span>',num('mtuVal',1500,576,9216))}${field('<span data-i18n="f_encap">'+t('f_encap')+'</span>',sel('mtuEncap',[{v:'none',l:'None (Ethernet)'},{v:'dot1q',l:'802.1Q (+4)'},{v:'pppoe',l:'PPPoE (+8)'},{v:'gre',l:'GRE (+24)'},{v:'mpls',l:'MPLS (+4)'},{v:'vxlan',l:'VXLAN (+50)'},{v:'geneve',l:'GENEVE (+50)'},{v:'ipsec',l:'IPsec ESP (+73)'}]))}</div>
    ${btn('btn_calc','calculateMtu()')}
    <div id="mtuResults" style="display:none;">
      <div class="grid-out">
        <div class="cell accent"><span class="k" data-i18n="res_mss">${t('res_mss')}</span><span class="v" id="mtuMss">-</span></div>
        <div class="cell accent2"><span class="k" data-i18n="res_mss_pppoe">${t('res_mss_pppoe')}</span><span class="v" id="mtuMssPppoe">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_ip_mtu">${t('res_ip_mtu')}</span><span class="v" id="mtuIpMtu">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_overhead">${t('res_overhead')}</span><span class="v" id="mtuOverhead">-</span></div>
      </div>
      <div class="table-wrap" style="margin-top:14px;"><table class="encap-table" id="encapTable"></table></div>
    </div>${notesHtml('mtu')}`;

  V.vlan=`${viewHead('vlan',true)}
    <div class="row row-2">${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('vlanVendor',vopts(['cisco','aruba','huawei','fortinet'])))}${field('<span data-i18n="f_mode">'+t('f_mode')+'</span>',sel('vlanMode',[{v:'access',l:t('opt_access')},{v:'trunk',l:t('opt_trunk')}]))}</div>
    <div class="row row-3">${field('<span data-i18n="f_iface">'+t('f_iface')+'</span>',text('vlanIface','GigabitEthernet0/1'))}${field('<span data-i18n="f_vlan_id">'+t('f_vlan_id')+'</span>',text('vlanAccessId','10'))}${field('<span data-i18n="f_trunk_allow">'+t('f_trunk_allow')+'</span>',text('vlanTrunkAllow','10,20,30'))}</div>
    <div class="row row-2" id="vlanNativeRow">${field('<span data-i18n="f_native">'+t('f_native')+'</span>',text('vlanNative','999'))}${field('<span data-i18n="f_desc">'+t('f_desc')+'</span>',text('vlanDesc','Uplink'))}</div>
    <div class="row row-2" id="vlanDescAccessRow">${field('<span data-i18n="f_desc">'+t('f_desc')+'</span>',text('vlanDescAccess','User Port'))}<div></div></div>
    ${btn('btn_generate','generateVlan()')}${codeBox('vlan')}`;

  V.stp=`${viewHead('stp',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('stpVendor',[{v:'cisco',l:'Cisco (IOS) — Rapid-PVST+'},{v:'aruba',l:'Aruba (AOS-CX) — RPVST'},{v:'huawei',l:'Huawei (VRP) — RSTP'}]))}
    <div class="row row-3">${field('<span data-i18n="f_vlan_vid">'+t('f_vlan_vid')+'</span>',text('stpVlan','10'))}${field('<span data-i18n="f_priority">'+t('f_priority')+'</span>',num('stpPriority',4096,0,61440,4096))}${field('<span data-i18n="f_edge">'+t('f_edge')+'</span>',text('stpIface','GigabitEthernet0/5'))}</div>
    ${field('<span data-i18n="f_edge">'+t('f_edge')+'</span> (Root Guard)',text('stpRootGuard','GigabitEthernet0/9'))}
    ${btn('btn_generate','generateStp()')}${codeBox('stp')}`;

  V.portsec=`${viewHead('portsec',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('vendorPortSec',vopts(V3)))}
    <div class="row row-3">${field('<span data-i18n="f_iface">'+t('f_iface')+'</span>',text('portSecInterface','GigabitEthernet0/1'))}${field('<span data-i18n="f_max_mac">'+t('f_max_mac')+'</span>',num('portSecMax',2,1,8192))}${field('<span data-i18n="f_action">'+t('f_action')+'</span>',sel('portSecAction',[{v:'shutdown',l:'Shutdown'},{v:'restrict',l:'Restrict'},{v:'protect',l:'Protect'}]))}</div>
    ${btn('btn_generate','generatePortSec()')}${codeBox('portSec')}`;

  V.lag=`${viewHead('lag',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('lagVendor',vopts(['cisco','huawei','aruba'])))}
    <div class="row row-3">${field('<span data-i18n="f_lag_group">'+t('f_lag_group')+'</span>',num('lagGroup',1,1,4096))}${field('<span data-i18n="f_lag_mode">'+t('f_lag_mode')+'</span>',sel('lagMode',[{v:'active',l:'LACP active'},{v:'passive',l:'LACP passive'},{v:'on',l:'on (static)'}]))}${field('<span data-i18n="f_maxactive">'+t('f_maxactive')+'</span>',num('lagMaxactive',4,1,32))}</div>
    <div class="row row-2">${field('<span data-i18n="f_hash">'+t('f_hash')+'</span>',sel('lagHash',[{v:'src-dst-ip',l:'src-dst-ip (L3)'},{v:'src-dst-mac',l:'src-dst-mac (L2)'},{v:'src-dst-mac-ip',l:'src-dst-mac-ip (L2+L3)'}]))}${field('<span data-i18n="f_fast">'+t('f_fast')+'</span>',sel('lagFast',[{v:'fast',l:'fast (1s)'},{v:'normal',l:'normal (30s)'}]))}</div>
    ${field('<span data-i18n="f_lag_phys">'+t('f_lag_phys')+'</span>',text('lagPhys','GigabitEthernet0/1, GigabitEthernet0/2'))}
    ${btn('btn_generate','generateLag()')}${codeBox('lag')}`;

  V.macfmt=`${viewHead('macfmt')}
    ${field('<span data-i18n="f_mac_input">'+t('f_mac_input')+'</span>',`<textarea id="macInput" rows="7" placeholder="00:1A:2B:3C:4D:5E">001A.2B3C.4D5E
00-1A-2B-3C-4D-60
00:1a:2b:3c:4d:61</textarea>`)}
    ${alertBox('macfmt')}${btn('btn_mac_convert','convertMac()')}
    <div id="macfmtResults" style="display:none;">
      <div class="codebox"><div class="codebox-head"><span class="tag" data-i18n="f_mac_cisco">${t('f_mac_cisco')}</span><button class="btn-ghost" onclick="copyCode('macCiscoBlock',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="macCiscoBlock"></code></pre></div>
      <div class="codebox"><div class="codebox-head"><span class="tag" data-i18n="f_mac_windows">${t('f_mac_windows')}</span><button class="btn-ghost" onclick="copyCode('macWinBlock',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="macWinBlock"></code></pre></div>
      <div class="codebox"><div class="codebox-head"><span class="tag" data-i18n="f_mac_unix">${t('f_mac_unix')}</span><button class="btn-ghost" onclick="copyCode('macUnixBlock',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="macUnixBlock"></code></pre></div>
    </div>${notesHtml('macfmt')}`;

  V.staticroute=`${viewHead('staticroute',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('srVendor',vopts(V5)))}
    <div class="row row-2">${field('<span data-i18n="f_sr_ver">'+t('f_sr_ver')+'</span>',sel('srVer',[{v:'ipv4',l:'IPv4'},{v:'ipv6',l:'IPv6'}]))}${field('<span data-i18n="f_ad">'+t('f_ad')+'</span>',num('srAd',1,1,255))}</div>
    <div class="row row-2">${field('<span data-i18n="f_sr_dest">'+t('f_sr_dest')+'</span> <span class="req">*</span>',text('srDest','192.168.50.0'))}${field('<span data-i18n="f_sr_mask">'+t('f_sr_mask')+'</span> <span class="req">*</span>',text('srMask','255.255.255.0'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_sr_nexthop">'+t('f_sr_nexthop')+'</span>',text('srNexthop','10.0.0.1'))}${field('<span data-i18n="f_sr_iface">'+t('f_sr_iface')+'</span>',text('srIface','GigabitEthernet0/0'))}</div>
    ${btn('btn_generate','generateStaticRoute()')}${codeBox('staticroute')}`;

  V.redundancy=`${viewHead('redundancy',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('vendorRedundancy',[{v:'cisco',l:'Cisco (IOS) — HSRP'},{v:'fortinet',l:'Fortinet (FortiOS) — VRRP'},{v:'aruba',l:'Aruba (AOS-CX) — VRRP'},{v:'huawei',l:'Huawei (VRP) — VRRP'}]))}
    <div class="row row-3">${field('<span data-i18n="f_vlan_id">'+t('f_vlan_id')+'</span>',num('redVlanId',10))}${field('<span data-i18n="f_vlan_name">'+t('f_vlan_name')+'</span>',text('redVlanName','IT_DEPT'))}${field('<span data-i18n="f_svi_ip">'+t('f_svi_ip')+'</span>',text('redSviIp','192.168.10.2'))}${field('<span data-i18n="f_svi_mask">'+t('f_svi_mask')+'</span>',text('redSviMask','/24'))}${field('<span id="lblRedVip" data-i18n="f_vip">'+t('f_vip')+'</span>',text('redVip','192.168.10.1'))}${field('<span id="lblRedPriority" data-i18n="f_hpriority">'+t('f_hpriority')+'</span>',num('redPriority',110))}</div>
    ${field('Track object (uplink interface)',text('redTrack','GigabitEthernet0/0'))}
    ${btn('btn_generate','generateRedundancy()')}${codeBox('red')}`;

  V.ospf=`${viewHead('ospf',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('ospfVendor',vopts(V5)))}
    <div class="row row-3">${field('<span data-i18n="f_proc">'+t('f_proc')+'</span>',text('ospfProc','1'))}${field('<span data-i18n="f_rid">'+t('f_rid')+'</span>',text('ospfRid','1.1.1.1'))}${field('<span data-i18n="f_area">'+t('f_area')+'</span>',text('ospfArea','0'))}</div>
    <div class="row row-3">${field('<span data-i18n="f_area_type">'+t('f_area_type')+'</span>',sel('ospfAreaType',[{v:'normal',l:'normal'},{v:'stub',l:'stub'},{v:'nssa',l:'nssa'},{v:'tstub',l:'totally stub'},{v:'tnssa',l:'totally nssa'}]))}${field('<span data-i18n="f_ospf_auth">'+t('f_ospf_auth')+'</span>',sel('ospfAuth',[{v:'none',l:'none'},{v:'md5',l:'MD5'},{v:'sha',l:'SHA'}]))}${field('<span data-i18n="f_ospf_cost">'+t('f_ospf_cost')+'</span>',num('ospfCost',10,1,65535))}</div>
    <div class="row row-2" id="ospfNetworkRow">${field('<span data-i18n="f_net">'+t('f_net')+'</span>',text('ospfNet','192.168.10.0'))}${field('<span data-i18n="f_wild">'+t('f_wild')+'</span>',text('ospfWildcard','0.0.0.255'))}</div>
    ${field('<span data-i18n="f_ospf_iface">'+t('f_ospf_iface')+'</span>',text('ospfIface','port1'))}
    ${field('<span data-i18n="f_ospf_pass">'+t('f_ospf_pass')+'</span>',text('ospfPass','','ph_ospf_pass'))}
    ${field('<span data-i18n="f_passive">'+t('f_passive')+'</span>',text('ospfPassive','Vlan10, Vlan20'))}
    ${btn('btn_generate','generateOspf()')}${codeBox('ospf')}`;

  V.bgp=`${viewHead('bgp',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('bgpVendor',vopts(V5)))}
    <div class="row row-3">${field('<span data-i18n="f_local_as">'+t('f_local_as')+'</span>',text('bgpLocalAs','65001'))}${field('<span data-i18n="f_rid">'+t('f_rid')+'</span>',text('bgpRid','1.1.1.1'))}${field('<span data-i18n="f_neighbor_as">'+t('f_neighbor_as')+'</span>',text('bgpNeighborAs','65002'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_neighbor_ip">'+t('f_neighbor_ip')+'</span>',text('bgpNeighborIp','203.0.113.2'))}${field('<span data-i18n="f_adv_net">'+t('f_adv_net')+'</span>',text('bgpAdvNet','192.168.10.0/24'))}</div>
    <div class="row row-3">${field('<span data-i18n="f_bgp_pass">'+t('f_bgp_pass')+'</span>',text('bgpPass',''))}${field('<span data-i18n="f_upd_src">'+t('f_upd_src')+'</span>',text('bgpUpdSrc','Loopback0'))}${field('<span data-i18n="f_mhop">'+t('f_mhop')+'</span>',num('bgpMhop',2,1,255))}</div>
    <div class="checkrow" style="margin-bottom:6px;">
      <label><input type="checkbox" id="bgpNhs" checked> next-hop-self</label>
      <label><input type="checkbox" id="bgpRr"> route-reflector-client</label>
      <label><input type="checkbox" id="bgpSoft" checked> soft reconfig inbound</label>
    </div>
    ${btn('btn_generate','generateBgp()')}${codeBox('bgp')}`;

  V.supernet=`${viewHead('supernet')}
    ${field('<span data-i18n="f_supernet_input">'+t('f_supernet_input')+'</span>',`<textarea id="supernetInput" rows="6" placeholder="192.168.0.0/24">192.168.0.0/24
192.168.1.0/24
192.168.2.0/24
192.168.3.0/24</textarea>`)}
    ${alertBox('supernet')}${btn('btn_summarize','calculateSupernet()')}
    <div id="supernetResults" style="display:none;">
      <div class="grid-out">
        <div class="cell"><span class="k" data-i18n="res_supernet_net">${t('res_supernet_net')}</span><span class="v" id="supernetNet">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_supernet_mask">${t('res_supernet_mask')}</span><span class="v" id="supernetMaskOut">-</span></div>
        <div class="cell accent"><span class="k" data-i18n="res_supernet_cidr">${t('res_supernet_cidr')}</span><span class="v" id="supernetCidr">-</span></div>
        <div class="cell accent2 span2"><span class="k" data-i18n="res_supernet_range">${t('res_supernet_range')}</span><span class="v" id="supernetRange">-</span></div>
        <div class="cell span2"><span class="k" data-i18n="res_supernet_usage">${t('res_supernet_usage')}</span><span class="v" id="supernetUsage">-</span></div>
      </div>
      <div class="table-wrap" style="margin-top:12px;"><table class="vlsm"><thead><tr><th>Network</th><th>CIDR</th><th>Range</th></tr></thead><tbody id="supernetTbody"></tbody></table></div>
    </div>${notesHtml('supernet')}`;

  V.acl=`${viewHead('acl',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('vendorAcl',[{v:'cisco',l:'Cisco (IOS) — Extended ACL'},{v:'fortinet',l:'Fortinet (FortiOS) — Policy'},{v:'aruba',l:'Aruba (AOS-CX) — IPv4 ACL'},{v:'huawei',l:'Huawei (VRP) — Advanced ACL'},{v:'paloalto',l:'Palo Alto (PAN-OS) — Security'}]))}
    <div class="row row-3">${field('<span data-i18n="f_rule_name">'+t('f_rule_name')+'</span>',text('aclName','BLOCK_WEB'))}${field('<span data-i18n="f_action">'+t('f_action')+'</span>',sel('aclAction',[{v:'permit',l:'Permit'},{v:'deny',l:'Deny'}]))}${field('<span data-i18n="f_proto">'+t('f_proto')+'</span>',sel('aclProto',[{v:'tcp',l:'TCP'},{v:'udp',l:'UDP'},{v:'icmp',l:'ICMP'},{v:'ip',l:'IP (all)'}]))}</div>
    <div class="row row-3">${field('<span data-i18n="f_src_ip">'+t('f_src_ip')+'</span>',text('aclSrcIp','10.10.10.0'))}${field('<span data-i18n="f_src_mask">'+t('f_src_mask')+'</span>',text('aclSrcMask','/24'))}${field('<span data-i18n="f_dst_port">'+t('f_dst_port')+'</span>',text('aclPort','443'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_dst_ip">'+t('f_dst_ip')+'</span>',text('aclDstIp','172.16.0.0'))}${field('<span data-i18n="f_dst_mask">'+t('f_dst_mask')+'</span>',text('aclDstMask','/24'))}</div>
    <div class="checkrow" style="margin-bottom:6px;">
      <label><input type="checkbox" id="aclEstablished"> established</label>
      <label><input type="checkbox" id="aclLog"> log</label>
      <label><input type="checkbox" id="aclIpv6"> IPv6 ACL</label>
    </div>
    ${field('<span data-i18n="f_remark">'+t('f_remark')+'</span>',text('aclRemark','Block web to servers'))}
    ${btn('btn_build','generateAcl()')}${codeBox('acl')}`;

  V.nat=`${viewHead('nat',true)}
    <div class="row row-2">${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('natVendor',vopts(V4)))}${field('<span data-i18n="f_nat_type">'+t('f_nat_type')+'</span>',sel('natType',[{v:'static',l:t('opt_static')},{v:'pat',l:t('opt_pat')},{v:'staticpat',l:t('opt_staticpat')}]))}</div>
    <div class="row row-3">${field('<span data-i18n="f_nat_name">'+t('f_nat_name')+'</span>',text('natName','NAT_RULE_1'))}${field('<span data-i18n="f_priv_ip">'+t('f_priv_ip')+'</span>',text('natPrivIp','192.168.10.0'))}${field('<span data-i18n="f_priv_mask">'+t('f_priv_mask')+'</span>',text('natPrivMask','/24'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_pub_ip">'+t('f_pub_ip')+'</span>',text('natPubIp','203.0.113.10'))}${field('<span data-i18n="f_out_iface">'+t('f_out_iface')+'</span>',text('natOutIface','GigabitEthernet0/0'))}</div>
    <div class="row row-2" id="natPatRow" style="display:none;">${field('<span data-i18n="f_lport">'+t('f_lport')+'</span>',num('natLport',80,1,65535))}${field('<span data-i18n="f_gport">'+t('f_gport')+'</span>',num('natGport',8080,1,65535))}</div>
    ${btn('btn_generate','generateNat()')}${codeBox('nat')}`;

  V.vpn=`${viewHead('vpn',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('vpnVendor',vopts(V4)))}
    <div class="row row-3">${field('<span data-i18n="f_ike">'+t('f_ike')+'</span>',sel('vpnIke',[{v:'ikev2',l:'IKEv2'},{v:'ikev1',l:'IKEv1'}]))}${field('<span data-i18n="f_p1life">'+t('f_p1life')+'</span>',text('vpnP1life','86400'))}${field('<span data-i18n="f_p2life">'+t('f_p2life')+'</span>',text('vpnP2life','3600'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_vpn_name">'+t('f_vpn_name')+'</span>',text('vpnName','HQ_TO_BRANCH'))}${field('<span data-i18n="f_peer">'+t('f_peer')+'</span>',text('vpnPeer','198.51.100.1'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_local_net">'+t('f_local_net')+'</span>',text('vpnLocalNet','192.168.10.0'))}${field('<span data-i18n="f_local_mask">'+t('f_local_mask')+'</span>',text('vpnLocalMask','0.0.0.255'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_remote_net">'+t('f_remote_net')+'</span>',text('vpnRemoteNet','192.168.20.0'))}${field('<span data-i18n="f_remote_mask">'+t('f_remote_mask')+'</span>',text('vpnRemoteMask','0.0.0.255'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_localid">'+t('f_localid')+'</span>',text('vpnLocalId',''))}${field('<span data-i18n="f_remoteid">'+t('f_remoteid')+'</span>',text('vpnRemoteId',''))}</div>
    <div class="row row-2">${field('<span data-i18n="f_psk">'+t('f_psk')+'</span>',text('vpnPsk','ChangeMe123!'))}${field('<span data-i18n="f_pfs">'+t('f_pfs')+'</span>',sel('vpnPfs',[{v:'14',l:'group14'},{v:'19',l:'group19 (ECDH)'},{v:'20',l:'group20'},{v:'2',l:'group2'}]))}</div>
    <div class="checkrow" style="margin-bottom:6px;">
      <label><input type="checkbox" id="vpnNatt" checked> NAT-T</label>
      <label><input type="checkbox" id="vpnDpd" checked> DPD</label>
      <label><input type="checkbox" id="vpnPfsOn" checked> PFS</label>
    </div>
    ${btn('btn_generate','generateVpn()')}${codeBox('vpn')}`;

  V.aaa=`${viewHead('aaa',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('aaaVendor',vopts(['cisco','aruba','huawei'])))}
    <div class="row row-2">${field('<span data-i18n="f_aaa_type">'+t('f_aaa_type')+'</span>',sel('aaaType',[{v:'radius',l:'RADIUS'},{v:'tacacs',l:'TACACS+'}]))}${field('<span data-i18n="f_aaa_server">'+t('f_aaa_server')+'</span>',text('aaaServer','10.0.0.250'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_aaa_key">'+t('f_aaa_key')+'</span>',text('aaaKey','SharedKey123!'))}${field('<span data-i18n="f_aaa_port">'+t('f_aaa_port')+'</span>',text('aaaPort','1812'))}</div>
    ${field('<span data-i18n="f_iface">'+t('f_iface')+'</span>',text('aaaIface','GigabitEthernet0/1'))}
    <div class="checkrow" style="margin-bottom:6px;">
      <label><input type="checkbox" id="aaaMab" checked> MAB fallback</label>
      <label><input type="checkbox" id="aaaDynVlan"> dynamic VLAN assignment</label>
      <label><input type="checkbox" id="aaaAcct" checked> accounting</label>
    </div>
    ${field('<span data-i18n="f_deadtime">'+t('f_deadtime')+'</span>',num('aaaDeadtime',15,1,1440))}
    ${btn('btn_generate','generateAaa()')}${codeBox('aaa')}`;

  V.qos=`${viewHead('qos',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('qosVendor',vopts(['cisco','huawei','aruba'])))}
    <div class="row row-3">${field('<span data-i18n="f_qos_policy">'+t('f_qos_policy')+'</span>',text('qosPolicy','SHAPE_OUT'))}${field('<span data-i18n="f_qos_cir">'+t('f_qos_cir')+'</span> <span class="req">*</span>',num('qosCir',10000000,1))}${field('<span data-i18n="f_qos_bc">'+t('f_qos_bc')+'</span>',num('qosBc',1250000,1))}</div>
    ${field('<span data-i18n="f_qos_mark">'+t('f_qos_mark')+'</span>',text('qosMark','EF'))}
    ${btn('btn_generate','generateQos()')}${codeBox('qos')}`;

  V.fwzone=`${viewHead('fwzone',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('fwzVendor',[{v:'paloalto',l:'Palo Alto (PAN-OS)'},{v:'fortinet',l:'Fortinet (FortiOS)'},{v:'cisco',l:'Cisco (IOS) — ZBF'}]))}
    <div class="row row-2">${field('<span data-i18n="f_fwz_zone">'+t('f_fwz_zone')+'</span> <span class="req">*</span>',text('fwzZone','TRUST'))}${field('<span data-i18n="f_fwz_iface">'+t('f_fwz_iface')+'</span>',text('fwzIface','GigabitEthernet0/1'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_fwz_to">'+t('f_fwz_to')+'</span> <span class="req">*</span>',text('fwzTo','UNTRUST'))}${field('<span data-i18n="f_fwz_app">'+t('f_fwz_app')+'</span>',text('fwzApp','web-browsing'))}</div>
    ${field('<span data-i18n="f_fwz_intra">'+t('f_fwz_intra')+'</span>',sel('fwzIntra',[{v:'allow',l:t('opt_allow')},{v:'deny',l:t('opt_deny')}]))}
    ${btn('btn_generate','generateFwz()')}${codeBox('fwzone')}`;

  V.hashchk=`${viewHead('hashchk')}
    ${field('<span data-i18n="f_hash_file">'+t('f_hash_file')+'</span>',`<input type="file" id="hashFileInput" onchange="computeFileHash(event)">`)}
    <div class="hint" data-i18n="hint_hash">${t('hint_hash')}</div>
    <div id="hashStatus" class="hint" style="display:none;margin-top:12px;"></div>
    <div id="hashResults" style="display:none;margin-top:14px;">
      <div class="grid-out">
        <div class="cell"><span class="k" data-i18n="res_hash_name">${t('res_hash_name')}</span><span class="v" id="hashFileName">-</span></div>
        <div class="cell"><span class="k" data-i18n="res_hash_size">${t('res_hash_size')}</span><span class="v" id="hashFileSize">-</span></div>
      </div>
      <div class="codebox" style="margin-top:12px;"><div class="codebox-head"><span class="tag">SHA-1</span><button class="btn-ghost" onclick="copyCode('hashSha1Block',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="hashSha1Block"></code></pre></div>
      <div class="codebox"><div class="codebox-head"><span class="tag">SHA-256</span><button class="btn-ghost" onclick="copyCode('hashSha256Block',event)" data-i18n="copy">${t('copy')}</button></div><pre class="codeblock"><code id="hashSha256Block"></code></pre></div>
    </div>${notesHtml('hashchk')}`;

  V.dhcp=`${viewHead('dhcp',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('dhcpVendor',vopts(['cisco','huawei','aruba'])))}
    <div class="row row-2">${field('<span data-i18n="f_dhcp_role">'+t('f_dhcp_role')+'</span>',sel('dhcpRole',[{v:'server',l:t('opt_server')},{v:'relay',l:t('opt_relay')}]))}${field('<span data-i18n="f_dhcp_pool">'+t('f_dhcp_pool')+'</span>',text('dhcpPool','LAN_POOL'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_base_net">'+t('f_base_net')+'</span>',text('dhcpNet','192.168.10.0'))}${field('<span data-i18n="f_base_cidr">'+t('f_base_cidr')+'</span>',text('dhcpMask','255.255.255.0'))}</div>
    <div class="row row-3">${field('<span data-i18n="f_dhcp_gw">'+t('f_dhcp_gw')+'</span>',text('dhcpGw','192.168.10.1'))}${field('<span data-i18n="f_dhcp_dns">'+t('f_dhcp_dns')+'</span>',text('dhcpDns','8.8.8.8'))}${field('<span data-i18n="f_lease">'+t('f_lease')+'</span>',sel('dhcpLease',[{v:'0 8 0',l:t('lease_8h')},{v:'1 0 0',l:t('lease_1d')},{v:'3 0 0',l:t('lease_3d')},{v:'infinite',l:t('lease_inf')}]))}</div>
    <div class="row row-2">${field('<span data-i18n="f_dhcp_excl">'+t('f_dhcp_excl')+'</span>',text('dhcpExcl','192.168.10.1 192.168.10.10'))}${field('<span data-i18n="f_dhcp_option">'+t('f_dhcp_option')+'</span>',text('dhcpOption','150 10.0.0.5'))}</div>
    ${field('<span data-i18n="f_dhcp_resv">'+t('f_dhcp_resv')+'</span>',text('dhcpResv','aabb.ccdd.eeff 192.168.10.50'))}
    ${btn('btn_generate','generateDhcp()')}${codeBox('dhcp')}`;

  V.dns=`${viewHead('dns',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('dnsVendor',vopts(['cisco','huawei','aruba'])))}
    <div class="row row-2">${field('<span data-i18n="f_dns_role">'+t('f_dns_role')+'</span>',sel('dnsRole',[{v:'server',l:t('opt_server')},{v:'forwarder',l:'Forwarder'}]))}${field('<span data-i18n="f_iface">'+t('f_iface')+'</span>',text('dnsIface','Vlan10'))}</div>
    ${field('<span data-i18n="f_dns_fwd">'+t('f_dns_fwd')+'</span>',text('dnsFwd','8.8.8.8, 1.1.1.1'))}
    ${btn('btn_generate','generateDns()')}${codeBox('dns')}`;

  V.snmp=`${viewHead('snmp',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('snmpVendor',vopts(V5)))}
    <div class="row row-2">${field('<span data-i18n="f_snmp_ver">'+t('f_snmp_ver')+'</span>',sel('snmpVer',[{v:'v2c',l:'v2c'},{v:'v3',l:'v3'}]))}${field('<span data-i18n="f_snmp_sec">'+t('f_snmp_sec')+'</span>',sel('snmpSec',[{v:'authPriv',l:'authPriv'},{v:'authNoPriv',l:'authNoPriv'},{v:'noAuthNoPriv',l:'noAuthNoPriv'}]))}</div>
    <div class="row row-2">${field('<span data-i18n="f_snmp_comm">'+t('f_snmp_comm')+'</span>',text('snmpComm','monitoring'))}${field('<span data-i18n="f_snmp_acl">'+t('f_snmp_acl')+'</span>',text('snmpAcl','10.0.0.0/24'))}</div>
    ${field('<span data-i18n="f_snmp_trap">'+t('f_snmp_trap')+'</span>',text('snmpTrap','10.0.0.100'))}
    ${btn('btn_generate','generateSnmp()')}${codeBox('snmp')}`;

  V.baseline=`${viewHead('baseline',true)}
    ${field('<span data-i18n="f_vendor">'+t('f_vendor')+'</span>',sel('baseVendor',vopts(V5)))}
    <div class="row row-3">${field('<span data-i18n="f_host">'+t('f_host')+'</span>',text('baseHostname','core-sw01'))}${field('<span data-i18n="f_user">'+t('f_user')+'</span>',text('baseUser','netadmin'))}${field('<span data-i18n="f_pass">'+t('f_pass')+'</span>',text('basePass','S3cureP@ss!'))}${field('<span data-i18n="f_ntp">'+t('f_ntp')+'</span>',text('baseNtp','10.0.0.1'))}${field('<span data-i18n="f_syslog">'+t('f_syslog')+'</span>',text('baseSyslog','10.0.0.2'))}</div>
    <div class="row row-2">${field('<span data-i18n="f_timezone">'+t('f_timezone')+'</span>',text('baseTz','Europe/Istanbul'))}${field('<span data-i18n="f_logging_level">'+t('f_logging_level')+'</span>',sel('baseLevel',[{v:'informational',l:'informational'},{v:'warnings',l:'warnings'},{v:'errors',l:'errors'},{v:'debugging',l:'debugging'}]))}</div>
    <div class="checkrow" style="margin-bottom:6px;">
      <label><input type="checkbox" id="baseHardening" checked> ${t('f_hardening')}</label>
      <label><input type="checkbox" id="baseSsh2" checked> SSH v2 only</label>
      <label><input type="checkbox" id="baseNoTelnet" checked> disable telnet/http</label>
    </div>
    ${btn('btn_generate','generateBaseline()')}${codeBox('base')}`;

  V.passgen=`${viewHead('passgen')}
    <div class="row row-2">${field('<span data-i18n="f_pg_len">'+t('f_pg_len')+'</span>',num('pgLen',24,4,128))}${field('<span data-i18n="f_pg_count">'+t('f_pg_count')+'</span>',num('pgCount',5,1,20))}</div>
    <div class="checkrow" style="margin-bottom:14px;">
      <label><input type="checkbox" id="pgUpper" checked> <span data-i18n="chk_upper">${t('chk_upper')}</span></label>
      <label><input type="checkbox" id="pgLower" checked> <span data-i18n="chk_lower">${t('chk_lower')}</span></label>
      <label><input type="checkbox" id="pgDigit" checked> <span data-i18n="chk_digit">${t('chk_digit')}</span></label>
      <label><input type="checkbox" id="pgSym" checked> <span data-i18n="chk_sym">${t('chk_sym')}</span></label>
      <label><input type="checkbox" id="pgAvoid"> <span data-i18n="chk_avoid">${t('chk_avoid')}</span></label>
    </div>
    ${btn('btn_create','generatePasswords()')}
    <div class="strength"><i id="pgStrength"></i></div>
    <div id="pgList" style="display:flex;flex-direction:column;gap:8px;"></div>${notesHtml('passgen')}`;
  return V;
}
