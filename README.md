<p align="center">
  <img src="assets/img/logo-dark.png#gh-dark-mode-only" alt="NOC-Kit" width="320">
  <img src="assets/img/logo-light.png#gh-light-mode-only" alt="NOC-Kit" width="320">
</p>

<p align="center">
  <b>Ağ mühendisleri için 28 araçlık, sunucusuz araç kutusu.</b><br>
  Subnet · VLSM · VLAN · STP · OSPF · BGP · ACL · NAT · IPsec VPN · 802.1X · QoS · DHCP · SNMP
</p>

<p align="center">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="dependencies" src="https://img.shields.io/badge/dependencies-0-brightgreen">
  <img alt="languages" src="https://img.shields.io/badge/i18n-TR%20EN%20DE%20FR%20ES-orange">
</p>

---

## Ne işe yarar

NOC-Kit, sahada ve NOC'ta sürekli tekrar eden hesap ve konfigürasyon işlerini tek sayfada toplar. Girdileri yazarsınız, karşılığında **Cisco IOS, Fortinet FortiOS, Palo Alto PAN-OS, Huawei VRP ve Aruba AOS-CX** sözdiziminde kopyalanmaya hazır CLI çıktısı alırsınız.

**Veri hiçbir yere gitmez.** Ne backend var, ne analytics, ne de dış API çağrısı. Bütün hesaplama tarayıcıda çalışır; firmware hash'i bile `crypto.subtle` ile yerel olarak alınır. Sayfayı kaydedip internetsiz bir jump host'ta açabilirsiniz.

## Araçlar

| Grup | Araçlar |
|---|---|
| **IP & Adresleme** | Subnet hesaplayıcı (bit haritalı), VLSM bölücü, mask dönüştürücü, IPv6 hesaplayıcı, IP/Hex/Binary dönüştürücü, MTU & TCP MSS |
| **Anahtarlama (L2)** | VLAN & port modu, Spanning Tree, Port Security, Link Aggregation (LACP), MAC format dönüştürücü |
| **Yönlendirme** | Statik route, HSRP/VRRP, OSPF, BGP, route summarization (supernet) |
| **Güvenlik & Erişim** | ACL üretici, NAT/PAT, IPsec VPN, 802.1X / RADIUS / TACACS+, QoS policer, firewall zone/policy, firmware hash doğrulama |
| **Hizmetler** | DHCP sunucu/relay, DNS, SNMP, cihaz baseline (day-0), parola/secret üretici |

Her araç, altında o konuya dair kısa **uzman notları** ile birlikte gelir.

## Özellikler

- **5 dil** — Türkçe, İngilizce, Almanca, Fransızca, İspanyolca. Seçim hatırlanır.
- **Koyu / açık tema** — ilk açılışta sistem tercihine uyar, sonra seçiminizi saklar.
- **Kalıcı bağlantı** — `#ospf`, `#bgp` gibi hash ile doğrudan bir araca link verebilirsiniz.
- **Klavye erişilebilirliği** — araç menüsünde Tab/Enter, odak halkaları, `aria` etiketleri.
- **Sıfır bağımlılık** — framework yok, npm paketi yok, build şart değil.

## Hızlı başlangıç

```bash
git clone https://github.com/MeteKarakan/noc-kit.git
cd noc-kit
```

> Bu depo **noc-kit.com** için hazırlandı: `index.html`, `sitemap.xml`, `robots.txt` ve `CNAME` içindeki adresler bu alan adına göre ayarlı. Farklı bir alan adı kullanacaksan `python3 scripts/set-domain.py yeni-alan-adin.com` çalıştırman yeterli (ilgili tüm dosyaları tek seferde günceller).

`index.html` dosyasını doğrudan tarayıcıda açabilirsiniz. Yerel bir sunucu tercih ederseniz:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Tek dosya derlemesi

CSS, JS ve görselleri tek bir HTML içine gömmek için:

```bash
node scripts/build.js
# -> dist/index.html  (~272 KB, tamamen bağımsız)
```

Çıkan dosyayı e-postayla gönderebilir, USB'ye atabilir veya internet erişimi olmayan bir makinede açabilirsiniz. `dist/` klasörü `.gitignore` içindedir.

## Yayına alma — GitHub Pages (bu depo bunun için hazır)

Bu repo **github.com/MeteKarakan/noc-kit** ve alan adı **noc-kit.com** için ayarlandı (`www.noc-kit.com` de çalışacak, otomatik olarak kök alan adına yönlenecek).

1. **Repoyu gönder**
   ```bash
   git remote add origin https://github.com/MeteKarakan/noc-kit.git
   git branch -M main
   git push -u origin main
   ```
2. **Pages'i aç:** repo → **Settings → Pages → Source: GitHub Actions**. `main`'e her push'ta `.github/workflows/deploy-pages.yml` siteyi otomatik derleyip yayınlar (build adımı yok, sadece JS sözdizimi kontrolü + dosya kopyalama).
3. **Özel alan adını bağla:** aynı **Settings → Pages** ekranında *Custom domain* kutusuna `noc-kit.com` yaz ve kaydet. Depodaki `CNAME` dosyası zaten bu değeri içeriyor, GitHub bunu otomatik algılar.
4. **DNS kayıtlarını alan adı sağlayıcında (noc-kit.com'u aldığın yer) oluştur:**

   | Tip | Ad | Değer |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | MeteKarakan.github.io |

   (Güncel IP listesi için GitHub'ın [Pages DNS dokümanı](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)nı kontrol et — nadiren değişir.)
5. **DNS yayılmasını bekle** (birkaç dakika – birkaç saat). Ardından **Settings → Pages** ekranında `noc-kit.com` yanında yeşil onay işareti görünür.
6. **HTTPS'i zorunlu kıl:** aynı ekranda **Enforce HTTPS** kutusunu işaretle. Sayfa `crypto.subtle` (dosya hash'i) ve `localStorage` (tema/dil tercihi) kullanıyor — ikisi de HTTPS olmayan bağlamda çalışmaz.
7. `www.noc-kit.com` açan ziyaretçi otomatik olarak `noc-kit.com`'a yönlenir — bunu GitHub'ın kendi altyapısı yapar, ekstra ayar gerekmez. `robots.txt`, `sitemap.xml` ve `<link rel="canonical">` zaten kök alan adını (`noc-kit.com`) işaret ediyor, arama motorları için tek adres kafa karışıklığı olmaz.

**Repo adın `noc-kit` değilse** yukarıdaki `git remote` komutundaki adresi güncelle; alan adı ile ilgili hiçbir dosya repo adına bağlı değil.

### İleride hosting değiştirirsen

`_headers` (Netlify/Cloudflare Pages) ve `.htaccess` (Apache/cPanel) dosyaları da depoda hazır duruyor — GitHub Pages bunları **okumaz/işlemez** (zararsızca göz ardı edilirler), ama başka bir statik hosting'e geçersen güvenlik başlıkları ve `www` yönlendirmesi otomatik devreye girer. Alan adı değişirse `python3 scripts/set-domain.py yeni-alan-adin.com` bu dosyaların hepsini tek seferde günceller.

## Proje yapısı

```
noc-kit/
├── index.html              # Sayfa iskeleti ve meta etiketleri
├── assets/
│   ├── css/styles.css      # Tüm stiller; renkler :root değişkenlerinde
│   ├── js/
│   │   ├── i18n.js         # 5 dilin çeviri sözlüğü
│   │   ├── core.js         # Durum, IP/IPv6 matematiği, form üreticileri
│   │   ├── views.js        # 28 aracın HTML görünümleri
│   │   ├── tools.js        # Hesaplama ve CLI üretme mantığı
│   │   └── app.js          # Render, dil, tema, yönlendirme, başlatma
│   └── img/                # Logo (koyu/açık), favicon, OG kapağı
├── scripts/
│   ├── build.js             # Tek dosya derleyici (bağımlılıksız)
│   └── set-domain.py        # Alan adını tüm dosyalarda tek seferde değiştirir
├── sitemap.xml, robots.txt  # Arama motorları için
├── CNAME                    # GitHub Pages özel alan adı (yalnızca GH Pages kullananlar için)
├── _headers                 # Netlify / Cloudflare Pages güvenlik başlıkları
├── .htaccess                # Apache güvenlik başlıkları + www yönlendirmesi
├── 404.html                 # Markaya uygun hata sayfası
└── .github/workflows/       # GitHub Pages dağıtımı
```

> JS dosyaları klasik script olarak, `index.html` içindeki **sırayla** yüklenir (modül değildir; çünkü görünümlerdeki `onclick` global fonksiyonlara bağlıdır). Sıralamayı değiştirmeyin.

## Katkı rehberi

**Yeni araç eklemek** dört dosyaya dokunmayı gerektirir:

1. `i18n.js` — `t_<id>` ve `t_<id>_d` anahtarlarını **beş dile birden** ekleyin.
2. `core.js` — `ICONS` içine SVG yolunu, `TOOLS` içine `{id, group, prompt}` kaydını ekleyin.
3. `views.js` — `buildViews()` içine `V.<id> = ...` görünümünü yazın.
4. `tools.js` — üretici fonksiyonu yazın; vendor rozeti varsa `VENDOR_CHIPS` eşlemesine ekleyin.

Dil anahtarı paritesini kontrol etmek faydalıdır: bir dilde eksik anahtar sessizce Türkçeye düşer.

**Vendor çıktılarında** gerçek cihazda doğrulanmamış komut göndermeyin; hangi platform/sürümde test ettiğinizi PR açıklamasına yazın.

## Güvenlik notları

- CSP `script-src` içinde `'unsafe-inline'` var; bunun nedeni araçların üretici fonksiyonlarını `onclick="generateOspf()"` gibi satır içi olay tanımlarıyla çağırması. Bunu kaldırmak, tüm `views.js`/`tools.js` mantığını `addEventListener` tabanlı bir yapıya geçirmeyi gerektirir — planlanan bir sonraki adım.
- `_headers` (Netlify/Cloudflare) ve `.htaccess` (Apache) aynı politikayı uygular; ikisi de kullanılmayan platformdaki dosya zararsızdır, sadece görmezden gelinir.
- Parola üretici, IPsec PSK ve SNMP secret gibi alanlardaki değerler yalnızca tarayıcı belleğinde tutulur, hiçbir yere gönderilmez; yine de üretilen değerleri ekran görüntüsü/clipboard geçmişi gibi kanallardan sızdırmamaya dikkat edin.

## Sorumluluk reddi

Üretilen konfigürasyonlar bir başlangıç noktasıdır, doğrudan production'a yapıştırılacak reçete değildir. Değişiklik penceresinde, yedeği alınmış cihazda ve kendi standartlarınıza göre gözden geçirerek uygulayın. Parola üreticinin ürettiği secret'ları bir parola yöneticisinde saklayın.

## Lisans

[MIT](LICENSE)
