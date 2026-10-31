/* bi-bar.js - thanh điều hướng + gấu Bi dùng chung cho mọi trang của bé (Lùi · Về nhà · Tới).
   Gắn bằng:  <script src="bi-bar.js"></script>  ngay trước </body>.  Trang vao.html có thanh riêng nên không gắn. */
(function () {
  if (window.__biBar) return; window.__biBar = 1;
  var KEY = 'ms_vao_id', q = new URLSearchParams(location.search), me = null;
  try {
    var u = q.get('u'), t = q.get('t');
    if (u && t && /^[a-f0-9]{16,64}$/.test(t)) { me = { u: u, t: t }; localStorage.setItem(KEY, JSON.stringify(me)); }
    else me = JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch (e) {}
  var home = 'vao.html' + (me && me.u && me.t ? '?u=' + encodeURIComponent(me.u) + '&t=' + me.t : '');

  var bc = document.createElement('script'); bc.src = 'bi-chung.js?v=1'; document.head.appendChild(bc);   // sao + nút góc phải + bạn nhỏ chạy nhảy dùng chung
  var tm = document.createElement('link'); tm.rel = 'stylesheet'; tm.href = 'bi-theme.css?v=2'; document.head.appendChild(tm);   // giao diện xanh chấm bi chung (sau mot-sach.css)
  var css = document.createElement('style');
  css.textContent =
    '#bibar{position:fixed;right:8px;top:calc(6px + env(safe-area-inset-top,0px));z-index:9999;display:flex;gap:2px;padding:3px 5px;background:rgba(255,255,255,.96);border:3px solid #C9DAF2;border-radius:20px;box-shadow:0 4px 0 #B5CBEA,0 6px 14px rgba(0,0,0,.15);font-family:"Nunito",system-ui,sans-serif}' +
    '#bibar button,#bibar a{appearance:none;border:0;background:transparent;color:#24305E;text-decoration:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:50px;height:46px;border-radius:14px;font:800 10px/1 "Nunito",system-ui,sans-serif;transition:transform .12s,background .15s}' +
    '#bibar button:active,#bibar a:active{transform:translateY(3px) scale(.94);background:rgba(255,216,77,.45)}' +
    '#bibar span{font-size:22px;line-height:1}' +
    '#bibar .bi{animation:bibarlac 2.6s ease-in-out infinite}' +
    '@keyframes bibarlac{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-3px)}}' +
    '.bibar-pt{position:fixed;z-index:10000;pointer-events:none;font-size:22px;animation:bibarbay .85s ease-out forwards}' +
    '@keyframes bibarbay{from{opacity:1;transform:translate(0,0) scale(.6)}to{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.4)}}' +
    '@media (prefers-color-scheme:dark){#bibar{background:rgba(31,40,80,.96);border-color:#38437A;box-shadow:0 5px 0 #0E1328,0 10px 24px rgba(0,0,0,.4)}#bibar button,#bibar a{color:#F1F4FF}}' +
    '.mascot.bibear{font-size:76px!important;line-height:1.15!important;display:block!important;width:92px!important;height:auto!important;text-align:center;animation:bibarlac 2.6s ease-in-out infinite}';
  document.head.appendChild(css);

  var bar = document.createElement('div'); bar.id = 'bibar'; bar.setAttribute('role', 'navigation'); bar.setAttribute('aria-label', 'Điều hướng');
  bar.innerHTML = '<button id="bb-lui" aria-label="Quay lại"><span>⬅️</span>Lùi</button>' +
    '<a id="bb-nha" href="' + home + '" aria-label="Về trang chính"><span class="bi">🏠</span>Trang chủ</a>' +
    '<button id="bb-tien" aria-label="Đi tới"><span>➡️</span>Tới</button>';
  document.body.appendChild(bar);
  if (!document.querySelector('.ms-head')) document.body.style.paddingTop = 'calc(58px + env(safe-area-inset-top,0px))';   // trang không có đầu trang riêng: chừa chỗ cho thanh điều hướng
  document.getElementById('bb-lui').onclick = function () { history.length > 1 ? history.back() : (location.href = home); };
  document.getElementById('bb-tien').onclick = function () { history.forward(); };
  bar.addEventListener('pointerdown', function (e) {
    for (var i = 0; i < 6; i++) {
      var s = document.createElement('span'); s.className = 'bibar-pt'; s.textContent = ['⭐', '✨', '💛', '🌟', '🎈'][i % 5];
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
      s.style.setProperty('--dx', ((Math.random() - .5) * 120) + 'px'); s.style.setProperty('--dy', (-20 - Math.random() * 90) + 'px');
      document.body.appendChild(s); setTimeout(function (x) { x.remove(); }.bind(null, s), 900);
    }
  });

  /* mọi trang dùng chung một linh vật: gấu Bi (thay cô bé tím cũ) */
  var CAU = ['Hihi, nhột quá! 🤭', 'Bi đây, Bi đây! 🐻', 'Cùng học nào! 📚', 'Bạn giỏi lắm! 🌟', 'Bi yêu bạn! 💖', 'Cố lên nha! 💪'], kc = 0, au = null;
  function pop(x, y, n) {
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span'); s.className = 'bibar-pt'; s.textContent = ['⭐', '✨', '💛', '🌟', '🎈', '💖'][i % 6];
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', ((Math.random() - .5) * 140) + 'px'); s.style.setProperty('--dy', (-20 - Math.random() * 100) + 'px');
      document.body.appendChild(s); setTimeout(function (z) { z.remove(); }.bind(null, s), 900);
    }
  }
  document.querySelectorAll('.mascot').forEach(function (m) {
    m.innerHTML = '🐻'; m.classList.add('bibear'); m.setAttribute('aria-hidden', 'true'); m.style.cursor = 'pointer';
    m.addEventListener('pointerdown', function () {
      var c = CAU[kc++ % CAU.length], r = m.getBoundingClientRect();
      if (m.animate) m.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-22px) rotate(-12deg) scale(1.15)' }, { transform: 'translateY(0) rotate(0)' }], { duration: 550, easing: 'ease-out' });
      pop(r.left + r.width / 2, r.top + r.height / 3, 10);
      var n = document.createElement('div'); n.textContent = c;
      n.style.cssText = 'position:fixed;z-index:10001;pointer-events:none;background:#fff;color:#24305E;border:3px solid #E3AE00;border-radius:20px 20px 20px 4px;padding:6px 12px;font:800 17px Nunito,system-ui,sans-serif;box-shadow:0 4px 0 #B5CBEA;transition:opacity .4s;white-space:nowrap;left:' + Math.max(8, Math.min(innerWidth - 230, r.left)) + 'px;top:' + Math.max(8, r.top - 44) + 'px';
      document.body.appendChild(n); setTimeout(function () { n.style.opacity = 0; }, 1300); setTimeout(function () { n.remove(); }, 1750);
      try { if (au) au.pause(); au = new Audio('https://devotee-outclass-couch.ngrok-free.dev/webhook/vao-doc?text=' + encodeURIComponent(c.replace(/[\u{1F000}-\u{1FFFF}\u2600-\u27BF\uFE0F]/gu, '').trim())); au.play().catch(function () {}); } catch (x) {}
    });
  });
})();
