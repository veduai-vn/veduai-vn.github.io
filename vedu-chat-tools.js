/* VeduAI - nut DINH KEM (anh / PDF / Word) + nut MIC cho o chat tren web.
   Cach dung (trong trang chat):
     <script src="vedu-chat-tools.js"></script>
     VeduChatTools.init({ input: '#o-chat', bar: '#thanh-nut' });     // bar = cho de chen 2 nut + the ten file
   Khi gui tin: const kem = VeduChatTools.lay();   // {anh, van_ban, ten_file} roi tu xoa; tron vao body goi web-chat
*/
(function () {
  const W = window, S = { anh: '', van_ban: '', ten_file: '' }, MAX = 2 * 1024 * 1024;
  const load = (src) => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const chia = () => alert('File nặng hơn 2MB. Bạn chia nhỏ ra rồi gửi từng phần một nhé.');
  async function anhNho(file) {
    const url = await new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(file); });
    const im = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    for (const [mx, q] of [[1600, .82], [1300, .72], [1000, .65]]) {
      const k = Math.min(1, mx / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const d = c.toDataURL('image/jpeg', q).split(',')[1]; if (d.length < 2500000) return d;
    }
    return '';
  }
  async function docPdf(file) {
    if (!W.pdfjsLib) { await load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); W.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
    const pdf = await W.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; let t = '';
    for (let p = 1; p <= Math.min(pdf.numPages, 15); p++) { const c = await (await pdf.getPage(p)).getTextContent(); t += c.items.map(i => i.str).join(' ') + '\n'; if (t.length > 12000) break; }
    return t;
  }
  async function docWord(file) {
    if (!W.mammoth) await load('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    return (await W.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  }
  W.VeduChatTools = {
    lay() { const o = { anh: S.anh, van_ban: S.van_ban, ten_file: S.ten_file }; S.anh = S.van_ban = S.ten_file = ''; this._chip(); return o; },
    co() { return !!(S.anh || S.van_ban); },
    _chip() { const c = this._c; if (!c) return; c.innerHTML = S.ten_file ? '📎 ' + S.ten_file.replace(/[<>&]/g, '') + ' <b style="cursor:pointer" id="vct-x">✕</b>' : ''; const x = c.querySelector('#vct-x'); if (x) x.onclick = () => { S.anh = S.van_ban = S.ten_file = ''; this._chip(); }; },
    init(o) {
      const inp = document.querySelector(o.input), bar = document.querySelector(o.bar); if (!inp || !bar) return;
      const mk = (t, ti) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.title = ti; b.style.cssText = 'font-size:20px;padding:6px 10px;border-radius:10px;border:1px solid #cbd5e1;background:transparent;cursor:pointer'; return b; };
      const bA = mk('📎', 'Đính kèm ảnh, PDF hoặc Word'), bM = mk('🎤', 'Nói thay vì gõ');
      const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*,.pdf,.doc,.docx'; fi.style.display = 'none';
      const chip = document.createElement('span'); chip.style.cssText = 'font-size:13px;margin-left:6px'; this._c = chip;
      bar.append(bA, bM, fi, chip); bA.onclick = () => fi.click();
      fi.onchange = async () => {
        const f = fi.files[0]; fi.value = ''; if (!f) return;
        try {
          const n = f.name.toLowerCase(); S.anh = S.van_ban = '';
          if (/^image\//.test(f.type)) { S.anh = await anhNho(f); if (!S.anh) return chia(); }
          else if (f.size > MAX) return chia();
          else if (n.endsWith('.pdf')) { S.van_ban = (await docPdf(f)).trim(); }
          else if (n.endsWith('.docx')) { S.van_ban = (await docWord(f)).trim(); }
          else return alert('Mình đọc được ảnh, PDF và Word (.docx). Bạn chọn lại giúp mình nhé.');
          if (!S.anh && S.van_ban.length < 20) { S.van_ban = ''; return alert('File này mình chưa đọc được chữ (có thể là bản scan). Bạn chụp ảnh trang đó gửi giúp mình nhé.'); }
          S.ten_file = f.name.slice(0, 40); this._chip();
        } catch (e) { alert('Chưa đọc được file này. Bạn thử lại hoặc chụp ảnh gửi mình nhé.'); }
      };
      const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
      if (!SR) { bM.onclick = () => alert('Trình duyệt này chưa hỗ trợ nói. Bạn dùng Chrome hoặc Safari mới, hoặc gõ chữ nhé.'); return; }
      let rec = null, on = false, goc = '';
      bM.onclick = () => {
        if (on) { rec.stop(); return; }
        rec = new SR(); rec.lang = 'vi-VN'; rec.interimResults = true; rec.continuous = false; goc = inp.value ? inp.value + ' ' : '';
        rec.onstart = () => { on = true; bM.style.background = '#fecaca'; };
        rec.onresult = (e) => { let t = ''; for (const r of e.results) t += r[0].transcript; inp.value = goc + t; inp.dispatchEvent(new Event('input', { bubbles: true })); };
        rec.onend = () => { on = false; bM.style.background = 'transparent'; };
        rec.onerror = (e) => { on = false; bM.style.background = 'transparent'; if (e.error === 'not-allowed') alert('Bạn cho phép dùng micro cho trang này nhé.'); };
        rec.start();
      };
    }
  };
})();
