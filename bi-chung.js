/* bi-chung.js - phần DÙNG CHUNG cho mọi trang của Mọt sách / Bi:
   1) Hệ thống SAO thống nhất (BiSao): học ở đâu cũng được sao, nối với Bi lớn lên.
   2) Nút nổi góc PHẢI: 🎤 Nói với Bi (luôn thấy) · 📘 Học · 🔊 Nghe hướng dẫn bằng tiếng Việt.
   3) Bạn nhỏ CHẠY NHẢY (Bút, Chì, Bi gấu luân phiên): thấy bấm được nhưng luôn nhảy đi chỗ khác.
   Gắn:  <script src="bi-chung.js"></script>  (bi-bar.js tự nạp).  Trang có thể đặt window.BI_GUIDE = 'lời hướng dẫn'. */
(function () {
  if (window.BiSao) return;
  var API = 'https://devotee-outclass-couch.ngrok-free.dev/webhook';
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\s+/g, '');
  var qs = '';
  try { var me = JSON.parse(localStorage.getItem('ms_vao_id') || 'null'); if (me && me.u && me.t) qs = '?u=' + encodeURIComponent(me.u) + '&t=' + me.t; } catch (e) {}
  function lnk(p) { return p + qs; }
  /* Trang người lớn (thầy cô, phụ huynh): không nhân vật chạy nhảy, không micro của bé; có trợ lý "Cần giúp gì không?" */
  var ADULT = /^(giao-vien|phu-huynh|giao-de|phieu-lam-quen)/.test(page) ? (/^giao-vien|^giao-de/.test(page) ? 'gv' : 'ph') : '';

  /* ---------- 1) SAO ---------- */
  var SK = 'ms_sao';
  function load() { try { return JSON.parse(localStorage.getItem(SK) || '{}'); } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(SK, JSON.stringify(s)); } catch (e) {} }
  var RULES = [
    ['Mỗi câu làm đúng', '+1 ⭐'],
    ['Hoàn thành một bài luyện / đề', '+5 ⭐'],
    ['Đúng từ 80% trở lên', '+10 ⭐ thưởng thêm'],
    ['Một lượt nói tiếng Anh với Bi', '+2 ⭐'],
    ['Học xong một tiết 45 phút', '+5 ⭐'],
    ['Vào học mỗi ngày (chuỗi ngày liên tiếp)', '+3 ⭐, thêm +1 mỗi ngày liền nhau (tối đa +10)']
  ];
  var chip;
  function today() { return new Date().toISOString().slice(0, 10); }
  function bumpBi(n) {   // cộng vào kho sao của "Bi lớn lên" nếu đã có
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf('bi_hub_') === 0) { var o = JSON.parse(localStorage.getItem(k) || '{}'); if (typeof o.stars === 'number') { o.stars += n; localStorage.setItem(k, JSON.stringify(o)); } } } } catch (e) {}
  }
  function toast(t) {
    var d = document.createElement('div'); d.textContent = t;
    d.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%) translateY(-10px);z-index:10050;background:#FFD84D;color:#4A3700;border:3px solid #E3AE00;border-radius:999px;padding:8px 18px;font:800 16px Nunito,system-ui,sans-serif;box-shadow:0 5px 0 #E3AE00;opacity:0;transition:.35s;pointer-events:none';
    document.body.appendChild(d); requestAnimationFrame(function () { d.style.opacity = 1; d.style.transform = 'translateX(-50%)'; });
    setTimeout(function () { d.style.opacity = 0; }, 2200); setTimeout(function () { d.remove(); }, 2700);
  }
  function meId() { try { return JSON.parse(localStorage.getItem('ms_vao_id') || 'null'); } catch (e) { return null; } }
  function srv(body) { return fetch(API + '/luyen-thi-5e2a', { method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' }, body: JSON.stringify(body) }).then(function (r) { return r.json(); }); }
  function pushSao(n, why) { var me = meId(); if (!me || !me.u) return; srv({ act: 'sao', u: me.u, t: me.t, delta: n, why: why || '', page: page }).catch(function () {}); }
  function pullSao() { var me = meId(); if (!me || !me.u) return; srv({ act: 'sao-tong', u: me.u }).then(function (r) { if (r && r.ok && r.tong > (load().total || 0)) { var s = load(); s.total = r.tong; save(s); paint(); } }).catch(function () {}); }
  function paint() { if (chip) chip.querySelector('b').textContent = (load().total || 0); }
  window.BiSao = {
    rules: RULES,
    total: function () { return load().total || 0; },
    add: function (n, why) {
      n = Math.max(0, Math.round(n || 0)); if (!n) return 0;
      var s = load(); s.total = (s.total || 0) + n; s.log = (s.log || []).concat([{ n: n, why: why || '', t: Date.now() }]).slice(-60); save(s); bumpBi(n); paint(); pushSao(n, why);
      toast('+' + n + ' ⭐ ' + (why || '')); return s.total;
    },
    daily: function () {   // gọi khi vào trang: thưởng chuyên cần, mỗi ngày một lần
      var s = load(), t = today(); if (s.day === t) return;
      var y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      s.streak = (s.day === y) ? (s.streak || 0) + 1 : 1; s.day = t; save(s);
      this.add(3 + Math.min(7, s.streak - 1), 'Chuyên cần ngày thứ ' + s.streak);
    },
    report: function (kind, data) { /* sao đã được gom qua BiSao.add; hàm giữ lại để các trang cũ gọi không lỗi */ return; }
  };

  /* ---------- giao diện ---------- */
  var st = document.createElement('style');
  st.textContent =
    '#bi-sao{position:fixed;left:10px;top:calc(8px + env(safe-area-inset-top,0px));z-index:9990;display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:2px solid #fff;border-radius:999px;padding:5px 12px 5px 8px;font:800 15px Nunito,system-ui,sans-serif;color:#24305E;text-decoration:none;box-shadow:0 4px 14px rgba(19,84,124,.18);cursor:pointer}' +
    '#bi-sao i{font-style:normal;font-size:18px}' +
    '#bi-fab{position:fixed;right:12px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:9990;display:flex;flex-direction:column;align-items:flex-end;gap:10px}' +
    '#bi-fab a,#bi-fab button{appearance:none;border:0;cursor:pointer;text-decoration:none;font:800 14px Nunito,system-ui,sans-serif;display:flex;align-items:center;gap:8px;border-radius:999px;color:#24305E}' +
    '#bi-fab .mic{width:68px;height:68px;justify-content:center;font-size:30px;color:#fff;background:linear-gradient(180deg,#6FD67A,#4CBF5B);box-shadow:0 5px 0 #2F9A3E,0 10px 22px rgba(47,154,62,.38);position:relative}' +
    '#bi-fab .mic:before{content:"";position:absolute;inset:-6px;border-radius:50%;border:3px solid rgba(76,191,91,.5);animation:bipulse 2s ease-out infinite}' +
    '#bi-fab .mic small{position:absolute;right:76px;top:50%;transform:translateY(-50%);white-space:nowrap;background:#fff;color:#24305E;border-radius:14px 4px 14px 14px;padding:6px 12px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.15)}' +
    '#bi-fab .sm{background:rgba(255,255,255,.85);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:2px solid #fff;padding:9px 14px;box-shadow:0 4px 14px rgba(19,84,124,.2)}' +
    '#bi-fab .sm.on{background:#FFD84D;color:#4A3700}' +
    '@keyframes bipulse{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.35);opacity:0}}' +
    '#bi-run{position:fixed;z-index:9980;width:52px;left:20px;top:200px;transition:left 1s cubic-bezier(.3,.8,.3,1),top 1s cubic-bezier(.3,.8,.3,1);cursor:pointer;touch-action:none;-webkit-tap-highlight-color:transparent}' +
    '#bi-run .in{animation:birun .55s ease-in-out infinite alternate;filter:drop-shadow(0 4px 4px rgba(10,48,92,.25))}' +
    '#bi-run.pop .in{animation:bipop .5s ease-out}' +
    '#bi-run .say{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);white-space:nowrap;background:#fff;border:2px solid #C9DAF2;color:#24305E;border-radius:14px 14px 14px 4px;padding:4px 10px;font:800 12px Nunito,system-ui,sans-serif;opacity:0;transition:.2s;pointer-events:none}' +
    '#bi-run .say.on{opacity:1}' +
    '@keyframes birun{from{transform:translateY(0) rotate(-4deg)}to{transform:translateY(-9px) rotate(4deg)}}' +
    '@keyframes bipop{0%{transform:scale(0)}70%{transform:scale(1.25)}100%{transform:scale(1)}}' +
    '#bi-tt{position:fixed;right:12px;bottom:calc(238px + env(safe-area-inset-bottom,0px));z-index:9995;display:flex;align-items:center;gap:6px;font-family:Nunito,system-ui,sans-serif;max-width:min(330px,calc(100vw - 24px))}' +
    '#bi-tt a,#bi-tt.wait>span:not(.sp):not(:last-child){color:inherit}' +
    '#bi-tt.ready a{display:flex;align-items:center;gap:12px;text-decoration:none;background:linear-gradient(180deg,#6FD67A,#4CBF5B);color:#fff;border-radius:22px;padding:10px 16px 10px 10px;box-shadow:0 5px 0 #2F9A3E,0 12px 26px rgba(47,154,62,.4);animation:bitt 1.4s ease-in-out infinite}' +
    '#bi-tt .pl{flex:none;width:46px;height:46px;border-radius:50%;background:#fff;color:#2F9A3E;display:grid;place-items:center;font-size:22px;padding-left:3px}' +
    '#bi-tt b{display:block;font-weight:800;font-size:15px;line-height:1.25}#bi-tt small{display:block;font-size:12px;font-weight:700;opacity:.9}' +
    '#bi-tt.wait{background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border:2px solid #fff;border-radius:20px;padding:8px 10px 8px 12px;color:#24305E;box-shadow:0 6px 18px rgba(19,84,124,.2)}' +
    '#bi-tt .sp{font-size:22px;animation:bispin 2s linear infinite;display:inline-block}' +
    '#bi-tt button{appearance:none;border:0;background:rgba(0,0,0,.14);color:#fff;width:26px;height:26px;border-radius:50%;cursor:pointer;font-size:13px;flex:none}' +
    '#bi-tt.wait button{background:#E6EEF9;color:#24305E}' +
    '@keyframes bitt{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes bispin{to{transform:rotate(360deg)}}' +
    '#bi-fab .adm{width:56px;height:56px;justify-content:center;font-size:26px;color:#fff;background:linear-gradient(180deg,#4DA3FF,#2F6FD6);box-shadow:0 5px 0 #1D4FA3,0 10px 22px rgba(47,111,214,.35);position:relative}' +
    '#bi-fab .adm small{position:absolute;right:64px;top:50%;transform:translateY(-50%);white-space:nowrap;background:#fff;color:#24305E;border-radius:14px 4px 14px 14px;padding:6px 12px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.15)}' +
    '#bi-help{position:fixed;left:10px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:9985;width:74px;cursor:pointer;filter:drop-shadow(0 6px 8px rgba(10,48,92,.22))}' +
    '#bi-help .say{position:absolute;bottom:100%;left:6px;white-space:nowrap;background:#fff;border:2px solid #C9DAF2;color:#24305E;border-radius:14px 14px 14px 4px;padding:5px 12px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 4px 12px rgba(19,84,124,.15);margin-bottom:-6px}' +
    '@media(max-width:560px){#bi-fab .adm small,#bi-help .say{display:none}#bi-help{width:58px}}' +
    '@media(max-width:560px){#bi-fab .mic{width:60px;height:60px;font-size:26px}#bi-fab .mic small{display:none}}' +
    '@media(prefers-reduced-motion:reduce){#bi-fab .mic:before,#bi-run .in{animation:none}}';
  document.head.appendChild(st);

  function ready(f) { if (document.readyState !== 'loading') f(); else document.addEventListener('DOMContentLoaded', f); }

  /* ---------- 2) hướng dẫn bằng giọng nói tiếng Việt ---------- */
  var GUIDES = {
    'giao-vien.html': 'Chào thầy cô! Đây là trang giáo viên. Thầy cô tạo bài kiểm tra online trong vài phút, gửi link vào nhóm Zalo của lớp, rồi xem kết quả cả lớp. Bài tự luận do AI chấm sơ bộ và thầy cô xem lại. Công cụ này miễn phí.',
    'giao-de.html': 'Đây là trang giao đề. Chọn đề, chọn lớp hoặc bạn nhỏ cần giao, rồi bấm giao. Kết quả sẽ có trong báo cáo.',
    'phu-huynh.html': 'Chào anh chị! Đây là trang theo dõi việc học của con. Anh chị xem con học bao lâu, đúng bao nhiêu câu, yếu phần nào, và nhắn trợ lý để giao chủ đề hoặc đặt nhắc lịch học.',
    'phu-huynh-menu.html': 'Chào anh chị! Chọn một mục để xem báo cáo của con, giao chủ đề hoặc đặt lịch nhắc học.',
    'phu-huynh-mon.html': 'Đây là trang theo dõi từng môn của con. Anh chị xem điểm mạnh, điểm yếu và các bài nên ôn thêm.',
    'phieu-lam-quen.html': 'Chào anh chị! Đây là phiếu làm quen. Anh chị điền thông tin cơ bản của con để bạn học AI biết con đang học lớp nào, môn nào.',
    'luyen-thi.html': 'Chào bạn! Đây là trang luyện thi. Bước một: chọn kỳ thi, số câu rồi bấm Bắt đầu. Bước hai: làm bài như trên tờ đề thật, bấm chọn đáp án hoặc gõ vào ô trống. Bước ba: bấm Nộp bài để xem điểm, lời giải từng câu và nhận sao thưởng.',
    'bi-noi-nhanh.html': 'Chào bạn! Đây là nơi nói tiếng Anh với Bi. Bấm nút micro màu xanh và nói một câu tiếng Anh. Bi sẽ trả lời, sửa câu giúp bạn và tặng sao.',
    'bi-lon-len.html': 'Đây là Bi lớn lên. Bạn học càng nhiều, nhận càng nhiều sao thì Bi càng lớn. Chạm vào đồ vật trong phòng để chơi cùng Bi.',
    'hoc-ngay.html': 'Chào bạn! Hãy chọn môn và bài muốn học, rồi trả lời từng câu. Làm đúng bạn sẽ nhận sao thưởng.',
    'vao.html': 'Chào bạn! Đây là trang chủ của bạn. Chọn Học, Chơi với Bi hoặc Luyện thi. Bấm nút micro bên phải để nói chuyện với Bi.',
    'kiem-tra.html': 'Đây là trang làm bài kiểm tra. Đọc kỹ từng câu, chọn đáp án rồi bấm nộp bài để xem điểm.',
    'bai-tap.html': 'Đây là trang bài tập. Làm từng câu, bấm kiểm tra để biết đúng hay sai và đọc lời giải.',
    'chat-hoc.html': 'Bạn có thể hỏi bài bằng chữ, ảnh hoặc giọng nói. Hãy nhắn câu hỏi, bạn học AI sẽ trả lời ngay.',
    'index.html': 'Chào anh chị! Một sách là bạn học AI cho học sinh. Anh chị có trợ lý riêng để biết con học thế nào. Bấm Học thử miễn phí để bắt đầu.'
  };
  var gUtter = null, gAudio = null, gBtn;
  function stopGuide() { try { speechSynthesis.cancel(); } catch (e) {} if (gAudio) { try { gAudio.pause(); } catch (e) {} gAudio = null; } if (gBtn) { gBtn.classList.remove('on'); gBtn.lastChild.textContent = 'Nghe hướng dẫn'; } }
  function speak(text) {
    stopGuide(); gBtn.classList.add('on'); gBtn.lastChild.textContent = 'Dừng đọc';
    var done = function () { if (gBtn) { gBtn.classList.remove('on'); gBtn.lastChild.textContent = 'Nghe hướng dẫn'; } };
    var voice = null;
    try { voice = (speechSynthesis.getVoices() || []).filter(function (v) { return /^vi/i.test(v.lang); })[0]; } catch (e) {}
    if (voice) { var u = new SpeechSynthesisUtterance(text); u.voice = voice; u.lang = 'vi-VN'; u.rate = .95; u.onend = u.onerror = done; gUtter = u; speechSynthesis.speak(u); return; }
    try {   // dự phòng: giọng đọc của máy chủ Bi
      gAudio = new Audio(API + '/vao-doc?text=' + encodeURIComponent(text.slice(0, 280))); gAudio.onended = done; gAudio.onerror = done; gAudio.play().catch(done);
    } catch (e) { done(); }
  }

  /* ---------- 3) nút nổi bên phải ---------- */
  function buildAdult() {
    if (document.getElementById('bi-help')) return;
    var gv = ADULT === 'gv';
    var f = document.createElement('div'); f.id = 'bi-fab';
    var guide = window.BI_GUIDE || GUIDES[page] || 'Chào bạn! Bấm nút Nghe hướng dẫn để nghe cách dùng trang này.';
    gBtn = document.createElement('button'); gBtn.type = 'button'; gBtn.className = 'sm'; gBtn.innerHTML = '<span>🔊</span><span>Nghe hướng dẫn</span>';
    gBtn.onclick = function () { if (gBtn.classList.contains('on')) stopGuide(); else speak(guide); };
    f.appendChild(gBtn);
    var a = document.createElement('a'); a.className = 'sm'; a.href = gv ? 'giao-de.html' : 'phu-huynh.html'; a.innerHTML = gv ? '<span>➕</span><span>Giao bài mới</span>' : '<span>📊</span><span>Báo cáo của con</span>'; if (page !== (gv ? 'giao-de.html' : 'phu-huynh.html')) f.appendChild(a);
    var h = document.createElement('a'); h.className = 'adm'; h.href = 'https://zalo.me/0984048177'; h.target = '_blank'; h.rel = 'noopener'; h.innerHTML = '💬<small>Hỗ trợ Admin</small>'; f.appendChild(h);
    document.body.appendChild(f);
    var b = document.createElement('div'); b.id = 'bi-help';
    b.innerHTML = '<div class="say">' + (gv ? 'Thầy cô cần giúp gì ạ?' : 'Anh chị cần giúp gì ạ?') + '</div><div class="fg">' + (window.BiQue ? BiQue.html(gv ? 'nam' : 'nu', 'wave') : '') + '</div>';
    b.onclick = function () { speak(guide); };
    document.body.appendChild(b);
  }
  function buildFab() {
    if (document.getElementById('bi-fab')) return;
    var f = document.createElement('div'); f.id = 'bi-fab';
    var guide = window.BI_GUIDE || GUIDES[page] || 'Chào bạn! Bấm nút micro màu xanh ở góc phải để nói chuyện với Bi. Bấm nút Học để vào bài học. Bấm ngôi sao ở góc trái để xem sao của bạn.';
    gBtn = document.createElement('button'); gBtn.type = 'button'; gBtn.className = 'sm'; gBtn.innerHTML = '<span>🔊</span><span>Nghe hướng dẫn</span>';
    gBtn.onclick = function () { if (gBtn.classList.contains('on')) stopGuide(); else speak(guide); };
    f.appendChild(gBtn);
    if (page !== 'hoc-ngay.html') { var h = document.createElement('a'); h.className = 'sm'; h.href = lnk('hoc-ngay.html'); h.innerHTML = '<span>📘</span><span>Học</span>'; f.appendChild(h); }
    if (page !== 'bi-noi-nhanh.html') { var m = document.createElement('a'); m.className = 'mic'; m.href = lnk('bi-noi-nhanh.html'); m.setAttribute('aria-label', 'Nói chuyện và học với Bi'); m.innerHTML = '🎤<small>Nói với Bi</small>'; f.appendChild(m); }
    document.body.appendChild(f);
  }
  function buildChip() {
    if (document.getElementById('bi-sao')) return;
    chip = document.createElement('a'); chip.id = 'bi-sao'; chip.href = lnk('bi-lon-len.html'); chip.title = 'Sao của bạn. Bấm để xem Bi lớn lên';
    chip.innerHTML = '<i>⭐</i><b>0</b>'; document.body.appendChild(chip); paint();
  }

  /* ---------- 4) bạn nhỏ chạy nhảy ---------- */
  var BEAR = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="24" cy="26" r="15" fill="#B8793E" stroke="#24305E" stroke-width="4"/><circle cx="76" cy="26" r="15" fill="#B8793E" stroke="#24305E" stroke-width="4"/><circle cx="50" cy="56" r="38" fill="#D9955A" stroke="#24305E" stroke-width="4"/><ellipse cx="50" cy="68" rx="17" ry="13" fill="#F6D9B8" stroke="#24305E" stroke-width="3"/><circle cx="50" cy="63" r="5" fill="#24305E"/><circle cx="36" cy="49" r="5.5" fill="#24305E"/><circle cx="64" cy="49" r="5.5" fill="#24305E"/><circle cx="34" cy="47" r="2" fill="#fff"/><circle cx="62" cy="47" r="2" fill="#fff"/><path d="M42 76 Q50 83 58 76" fill="none" stroke="#24305E" stroke-width="3" stroke-linecap="round"/></svg>';
  var SAYS = ['Hì hì, bắt mình đi!', 'Trượt rồi nha!', 'Mình ở đây nè!', 'Đố bạn bắt được!', 'Nhanh lên nào!', 'Chưa được đâu!'];
  function buildRunner() {
    if (document.getElementById('bi-run')) return;
    var order = ['nam', 'nu', 'bear'], idx = Math.floor(Math.random() * 3), n = 0;
    var el = document.createElement('div'); el.id = 'bi-run'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el);
    function fig() {
      var k = order[idx % 3];
      var inner = k === 'bear' ? BEAR : (window.BiQue ? BiQue.html(k, 'run') : BEAR);
      el.innerHTML = '<div class="say"></div><div class="in">' + inner + '</div>';
      el.style.width = k === 'bear' ? '50px' : '40px';
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    }
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function go(far) {
      var W = innerWidth, H = innerHeight, x0 = parseFloat(el.style.left) || 20, y0 = parseFloat(el.style.top) || 200, x, y, t = 0;
      do { x = rnd(10, Math.max(60, W - 110)); y = rnd(90, Math.max(160, H - 120)); t++; } while (far && Math.hypot(x - x0, y - y0) < 170 && t < 12);
      el.style.left = x + 'px'; el.style.top = y + 'px';
    }
    function dodge(e) {
      if (e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
      var s = el.querySelector('.say'); if (s) { s.textContent = SAYS[Math.floor(Math.random() * SAYS.length)]; s.classList.add('on'); setTimeout(function () { s.classList.remove('on'); }, 1100); }
      go(true); return false;
    }
    ['pointerenter', 'pointerdown', 'touchstart', 'mousedown', 'click'].forEach(function (ev) { el.addEventListener(ev, dodge, { passive: false }); });
    fig(); go(false);
    setInterval(function () { n++; if (n % 3 === 0) { idx++; fig(); } go(false); }, 6500);
  }


  /* ---------- 5) BÀI TƯƠNG TỰ: theo dõi và báo "sẵn sàng" ở MỌI trang ---------- */
  var TK = 'ms_tt', ttTimer = null, ttEl = null, ttSaid = false;
  function ttGet() { try { return JSON.parse(localStorage.getItem(TK) || 'null'); } catch (e) { return null; } }
  function ttSet(o) { try { o ? localStorage.setItem(TK, JSON.stringify(o)) : localStorage.removeItem(TK); } catch (e) {} }
  function say(t) {
    try { var u = new SpeechSynthesisUtterance(t); u.lang = 'vi-VN'; var v = (speechSynthesis.getVoices() || []).filter(function (x) { return /^vi/i.test(x.lang); })[0]; if (v) u.voice = v; speechSynthesis.speak(u); return; } catch (e) {}
    try { new Audio(API + '/vao-doc?text=' + encodeURIComponent(t)).play().catch(function () {}); } catch (e) {}
  }
  function beep() { try { var c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = .12; o.start(); setTimeout(function () { o.frequency.value = 1175; }, 140); setTimeout(function () { o.stop(); c.close(); }, 320); } catch (e) {} }
  function ttPaint() {
    var o = ttGet(); if (ttEl) { ttEl.remove(); ttEl = null; }
    if (!o) return;
    ttEl = document.createElement('div'); ttEl.id = 'bi-tt';
    if (o.state === 'ready') {
      ttEl.className = 'ready';
      ttEl.innerHTML = '<a href="' + String(o.url).replace(/"/g, '') + '"><span class="pl">▶</span><span><b>Bài tương tự đã sẵn sàng!</b><small>Bấm để làm ngay' + (o.tong ? ' · ' + o.tong + ' câu' : '') + '</small></span></a><button type="button" aria-label="Ẩn">✕</button>';
      ttEl.querySelector('button').onclick = function () { ttSet(null); ttPaint(); };
      ttEl.querySelector('a').onclick = function () { setTimeout(function () { ttSet(null); }, 400); };
    } else {
      ttEl.className = 'wait';
      ttEl.innerHTML = '<span class="sp">⏳</span><span><b>Đang soạn bài tương tự…</b><small>Khoảng 2–3 phút, xong sẽ có nút Play nổi lên</small></span><button type="button" aria-label="Ẩn">✕</button>';
      ttEl.querySelector('button').onclick = function () { ttSet(null); ttPaint(); clearInterval(ttTimer); };
    }
    document.body.appendChild(ttEl);
  }
  function ttPoll() {
    var o = ttGet(); if (!o || o.state === 'ready') { clearInterval(ttTimer); return; }
    if (Date.now() - o.since > 25 * 60 * 1000) { ttSet(null); ttPaint(); clearInterval(ttTimer); return; }
    fetch(API + '/giai-de-tt-trang-thai', { method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' }, body: JSON.stringify({ t: o.t, s: o.s, since: o.since }) })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r || !r.ok) { if (r && r.loi === 'phien') { ttSet(null); ttPaint(); clearInterval(ttTimer); } return; }
        if (r.san) {
          o.state = 'ready'; o.url = r.url; o.tong = r.tong; ttSet(o); clearInterval(ttTimer); ttPaint(); beep();
          if (!ttSaid) { ttSaid = true; say('Bài tương tự đã sẵn sàng. Bấm nút Play màu xanh để làm bài nhé.'); }
        } else if (!r.dang_soan && Date.now() - o.since > 90 * 1000) { ttSet(null); ttPaint(); clearInterval(ttTimer); }
      }).catch(function () {});
  }
  window.BiTT = {
    watch: function (t, s) { ttSet({ t: t, s: s, since: Date.now() - 2000, state: 'wait' }); ttSaid = false; ttPaint(); clearInterval(ttTimer); ttTimer = setInterval(ttPoll, 8000); setTimeout(ttPoll, 3000); },
    resume: function () { var o = ttGet(); if (!o) return; ttPaint(); if (o.state !== 'ready') { clearInterval(ttTimer); ttTimer = setInterval(ttPoll, 8000); ttPoll(); } }
  };

  function buildAdultLater() {
    if (window.BiQue) buildAdult();
    else { var sc = document.createElement('script'); sc.src = 'bi-nguoi-que.js'; sc.onload = buildAdult; sc.onerror = buildAdult; document.head.appendChild(sc); }
  }
  ready(function () {
    if (ADULT) { buildAdultLater(); BiTT.resume(); BiSao.daily = function () {}; return; }
    buildChip(); buildFab(); BiTT.resume(); pullSao();
    if (window.BiQue) buildRunner();
    else { var sc = document.createElement('script'); sc.src = 'bi-nguoi-que.js'; sc.onload = buildRunner; sc.onerror = buildRunner; document.head.appendChild(sc); }
    BiSao.daily();
    try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {}
  });
})();
