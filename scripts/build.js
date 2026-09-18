#!/usr/bin/env node
/**
 * NOC-Kit tek dosya derleyicisi.
 *
 * index.html + assets/** dosyalarini alir, CSS'i <style>, JS'i <script>,
 * gorselleri data: URI olarak icine gomer ve dist/index.html uretir.
 * Cikan dosya hicbir yerel dosyaya bagimli degildir: USB'ye atip
 * internetsiz bir jump host'ta acabilirsiniz.
 *
 * Kullanim:  node scripts/build.js
 * Bagimlilik yok, Node 14+ yeterli.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function dataUri(rel) {
  const file = path.join(ROOT, rel);
  const ext = path.extname(rel).toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error('Bilinmeyen gorsel turu: ' + rel);
  return 'data:' + mime + ';base64,' + fs.readFileSync(file).toString('base64');
}

function build() {
  let html = read('index.html');
  const inlined = { css: 0, js: 0, img: 0 };

  // 1) <link rel="stylesheet" href="assets/..."> -> <style>
  html = html.replace(
    /<link rel="stylesheet" href="(assets\/[^"]+\.css)">/g,
    (_, href) => {
      inlined.css++;
      return '<style>\n' + read(href) + '\n</style>';
    }
  );

  // 2) <script src="assets/..."></script> -> <script>...</script>
  html = html.replace(
    /<script src="(assets\/[^"]+\.js)"><\/script>/g,
    (_, src) => {
      inlined.js++;
      // </script> gecen bir string JS icinde varsa erken kapanmayi onle
      return '<script>\n' + read(src).replace(/<\/script>/g, '<\\/script>') + '\n</script>';
    }
  );

  // 3) assets/img/... yollari -> data: URI
  html = html.replace(/"(assets\/img\/[^"]+)"/g, (_, rel) => {
    inlined.img++;
    return '"' + dataUri(rel) + '"';
  });

  // 4) manifest.webmanifest harici bir dosya gerektirir; tek dosyalik
  //    derlemede PWA kurulabilirligi hedef degil, satiri kaldir.
  html = html.replace(/^.*<link rel="manifest"[^>]*>\r?\n/gm, '');

  if (/(?:src|href)="assets\//.test(html)) {
    throw new Error('Gomulmemis yerel varlik kaldi; build.js guncellenmeli.');
  }

  fs.mkdirSync(DIST, { recursive: true });
  const out = path.join(DIST, 'index.html');
  fs.writeFileSync(out, html);

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(
    `dist/index.html yazildi — ${kb} KB ` +
      `(${inlined.css} css, ${inlined.js} js, ${inlined.img} gorsel gomuldu)`
  );
}

build();
