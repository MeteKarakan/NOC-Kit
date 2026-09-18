#!/usr/bin/env python3
"""
NOC-Kit alan adi degistirici.

index.html, sitemap.xml, robots.txt, CNAME icindeki "noc-kit.com" gecen
tum mutlak adresleri yeni alan adiyla degistirir. .htaccess'teki www
yonlendirme blogunu, --www bayragina gore dogru yonde (www->kok ya da
kok->www) yeniden yazar.

Kullanim:
  python3 scripts/set-domain.py yeni-alan-adin.com
  python3 scripts/set-domain.py yeni-alan-adin.com --www   # canonical www ile
"""

import re
import sys
from pathlib import Path

OLD_DOMAIN = "noc-kit.com"
ROOT = Path(__file__).resolve().parent.parent

FILES = ["index.html", "sitemap.xml", "robots.txt", "CNAME"]

HTACCESS_BLOCK_RE = re.compile(
    r"# WWW-REDIRECT-START.*?# WWW-REDIRECT-END\n?", re.DOTALL
)


def build_htaccess_block(apex: str, use_www: bool) -> str:
    www = "www." + apex
    if use_www:
        cond, target = apex, www  # kok -> www
    else:
        cond, target = www, apex  # www -> kok
    cond_escaped = cond.replace(".", r"\.")
    return (
        "# WWW-REDIRECT-START (scripts/set-domain.py bu blogu otomatik yeniden yazar, elle duzenlemeyin)\n"
        f"# {cond} -> {target} yonlendirmesi\n"
        "<IfModule mod_rewrite.c>\n"
        "  RewriteEngine On\n"
        f"  RewriteCond %{{HTTP_HOST}} ^{cond_escaped}$ [NC]\n"
        f"  RewriteRule ^(.*)$ https://{target}/$1 [R=301,L]\n"
        "</IfModule>\n"
        "# WWW-REDIRECT-END\n"
    )


def main():
    if len(sys.argv) < 2:
        print("Kullanim: python3 scripts/set-domain.py yeni-alan-adin.com [--www]")
        sys.exit(1)

    new_domain = sys.argv[1].strip().lower()
    new_domain = re.sub(r"^https?://", "", new_domain).rstrip("/")
    use_www = "--www" in sys.argv[2:]

    if not re.match(r"^[a-z0-9][a-z0-9\-\.]*\.[a-z]{2,}$", new_domain):
        print(f"Gecersiz alan adi gorunuyor: {new_domain}")
        sys.exit(1)

    host = ("www." + new_domain) if use_www else new_domain
    changed = 0

    for name in FILES:
        path = ROOT / name
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        new_text = text.replace(OLD_DOMAIN, host)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            changed += 1
            print(f"guncellendi: {name}")

    htaccess = ROOT / ".htaccess"
    if htaccess.exists():
        text = htaccess.read_text(encoding="utf-8")
        if HTACCESS_BLOCK_RE.search(text):
            new_block = build_htaccess_block(new_domain, use_www)
            new_text = HTACCESS_BLOCK_RE.sub(new_block, text)
            if new_text != text:
                htaccess.write_text(new_text, encoding="utf-8")
                changed += 1
                print("guncellendi: .htaccess (www yonlendirme blogu)")
        else:
            print("uyari: .htaccess icinde WWW-REDIRECT blogu bulunamadi, atlandi.")

    print(f"\nTamam — {changed} dosya '{host}' icin guncellendi.")
    print("Not: og-cover.png / logo gorselleri degismedi, onlar alan adindan bagimsiz.")


if __name__ == "__main__":
    main()
