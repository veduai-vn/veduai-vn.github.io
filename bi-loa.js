/* bi-loa.js - tăng âm lượng giọng Bi: đưa thẻ audio (blob:/data:) qua bộ khuếch đại + chống rè.
   Dùng:  BiLoa(audioEl)  sau khi gán src (trước/sau play đều được). Trang tự mở khoá âm thanh ở lần bấm đầu tiên (iPhone/Zalo).
   Nếu máy không cho (âm thanh chưa mở khoá) thì phát bình thường, không mất tiếng. */
(function () {
  if (window.BiLoa) return;
  var AC = window.AudioContext || window.webkitAudioContext, ctx = null, GAIN = 2.8;
  function mo() { if (!AC) return null; try { if (!ctx) ctx = new AC(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) {} return ctx; }
  ['pointerdown', 'touchstart', 'touchend', 'click', 'keydown'].forEach(function (ev) { document.addEventListener(ev, mo, { passive: true }); });
  window.BiLoa = function (a, g) {
    try {
      if (!a || a._biLoa) return a;
      if (!/^(blob:|data:)/.test(String(a.currentSrc || a.src || ''))) return a;   // âm thanh khác nguồn: không qua được bộ khuếch đại (sẽ im tiếng), bỏ qua
      var c = mo(); if (!c || c.state !== 'running') return a;
      var s = c.createMediaElementSource(a), gn = c.createGain(), cp = c.createDynamicsCompressor();
      gn.gain.value = g || GAIN;
      cp.threshold.value = -14; cp.knee.value = 12; cp.ratio.value = 10; cp.attack.value = 0.003; cp.release.value = 0.2;
      s.connect(gn); gn.connect(cp); cp.connect(c.destination);
      a._biLoa = 1; a.volume = 1;
    } catch (e) {}
    return a;
  };
  /* phát một đoạn tiếng Bi từ máy chủ (vao-doc) với âm lượng lớn */
  window.BiLoaDoc = function (url, onEnd) {
    return fetch(url, { headers: { 'ngrok-skip-browser-warning': '1' } }).then(function (r) { if (!r.ok) throw new Error('tts'); return r.blob(); }).then(function (b) {
      var a = new Audio(URL.createObjectURL(b)); a.onended = a.onerror = function () { if (onEnd) onEnd(); };
      BiLoa(a); var p = a.play(); if (p && p.catch) p.catch(function () { if (onEnd) onEnd(); }); return a;
    });
  };
})();
