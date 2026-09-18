/* NOC-Kit — sayfa çizilmeden önce tema kararını uygular (FOUC yok). */
(function () {
  try {
    var t = localStorage.getItem('nockit:theme');
    if (!t) {
      t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
