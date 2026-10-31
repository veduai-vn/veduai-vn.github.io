/* bi-nguoi-que.js - hai nhân vật NGƯỜI QUE của dự án Bi: BÚT (bạn nam) và CHÌ (bạn nữ).
   Dùng:  <script src="bi-nguoi-que.js"></script>
          BiQue.mount(document.getElementById('o'), 'nam', 'wave');   // 'nam' | 'nu'  ·  dáng: idle wave cheer think read run sad
          BiQue.html('nu', 'cheer')                                   // trả về chuỗi SVG
   Nét riêng: thân là nét mực + một vệt bút dạ quang vàng phía sau; Bút có "tóc" là ngòi bút chì, Chì có hai búi tóc là cục tẩy
   và nơ hồng; cả hai đeo huy hiệu ngôi sao (số sao học tập, giống Bi). Màu nét đổi theo chế độ sáng/tối của trang. */
(function () {
  if (window.BiQue) return;
  var INK = 'var(--qk-ink,#24305E)', CARD = 'var(--qk-card,#FFFFFF)', SKIN = '#FFE4D2', MARK = '#FFD84D';
  var css = document.createElement('style');
  css.textContent =
    '@media (prefers-color-scheme:dark){:root{--qk-ink:#F1F4FF;--qk-card:#2B3A78}}' +
    '.qk{width:100%;height:auto;display:block;overflow:visible}' +
    '.qk .bob{animation:qkbob 3.2s ease-in-out infinite;transform-origin:100px 256px}' +
    '.qk.qk-cheer .bob{animation:qkjump 1s cubic-bezier(.3,.7,.4,1) infinite}' +
    '.qk.qk-run .bob{animation:qkrun .5s ease-in-out infinite}' +
    '.qk.qk-sad .bob{animation:qksad 4s ease-in-out infinite}' +
    '.qk .blink{animation:qkblink 4.5s infinite;transform-origin:100px 62px}' +
    '.qk .wv{animation:qkwave .7s ease-in-out infinite alternate;transform-origin:100px 108px}' +
    '.qk .sw1{animation:qkswing .5s ease-in-out infinite alternate;transform-origin:100px 170px}' +
    '.qk .sw2{animation:qkswing .5s ease-in-out infinite alternate-reverse;transform-origin:100px 170px}' +
    '.qk .aw1{animation:qkswing .5s ease-in-out infinite alternate-reverse;transform-origin:100px 108px}' +
    '.qk .aw2{animation:qkswing .5s ease-in-out infinite alternate;transform-origin:100px 108px}' +
    '.qk .tw{animation:qktw 1.2s ease-in-out infinite;transform-origin:center;transform-box:fill-box}' +
    '.qk .tw2{animation-delay:-.4s}.qk .tw3{animation-delay:-.8s}' +
    '.qk .tilt{transform-origin:100px 92px}' +
    '.qk .tear{animation:qktear 2s ease-in infinite}' +
    '@keyframes qkbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}' +
    '@keyframes qkjump{0%,100%{transform:translateY(0) scaleY(.96)}45%{transform:translateY(-26px) scaleY(1.02)}}' +
    '@keyframes qkrun{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
    '@keyframes qksad{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}' +
    '@keyframes qkblink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}' +
    '@keyframes qkwave{from{transform:rotate(-12deg)}to{transform:rotate(14deg)}}' +
    '@keyframes qkswing{from{transform:rotate(-26deg)}to{transform:rotate(26deg)}}' +
    '@keyframes qktw{0%,100%{transform:scale(.4);opacity:.2}50%{transform:scale(1.15);opacity:1}}' +
    '@keyframes qktear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(34px);opacity:0}}' +
    '@media (prefers-reduced-motion:reduce){.qk *{animation:none!important}}';
  document.head.appendChild(css);

  function m(p) { return [200 - p[0], p[1]]; }
  function pts(a) { return a.map(function (p) { return p[0] + ',' + p[1]; }).join(' '); }
  var ARM = {   // [vai, khuỷu, tay]
    idle: [[100, 108], [74, 138], [68, 170]],
    down: [[100, 108], [88, 140], [84, 172]],
    waveR: [[100, 108], [138, 102], [154, 66]],
    up: [[100, 108], [70, 92], [56, 56]],
    chin: [[100, 108], [130, 126], [114, 92]],
    hip: [[100, 108], [66, 132], [86, 160]],
    book: [[100, 108], [76, 132], [86, 150]]
  };
  var LEG = {
    idle: [[100, 170], [88, 210], [84, 248]],
    wide: [[100, 170], [78, 208], [64, 244]],
    straight: [[100, 170], [100, 210], [100, 248]]
  };
  function R(a) { return a.map(m); }

  function limb(a, w) {
    return '<polyline points="' + pts(a) + '" fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function hand(p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="6.5" fill="' + SKIN + '" stroke="' + INK + '" stroke-width="3"/>'; }
  function shoe(p, col) { return '<ellipse cx="' + p[0] + '" cy="' + (p[1] + 3) + '" rx="12" ry="6.5" fill="' + col + '" stroke="' + INK + '" stroke-width="3"/>'; }
  function star(cx, cy, r, fill) {
    var d = '';
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); }
    return '<path d="' + d + 'Z" fill="' + fill + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/>';
  }

  function face(mood) {
    var eyes, mouth = '', extra = '';
    var eye = function (x) {
      return '<ellipse cx="' + x + '" cy="62" rx="6.2" ry="8" fill="#2BB5C8"/><ellipse cx="' + x + '" cy="64" rx="3.6" ry="5" fill="#1d1a3a"/><circle cx="' + (x - 2.4) + '" cy="59" r="2.6" fill="#fff"/>';
    };
    if (mood === 'happy') {
      eyes = '<path d="M80 64 Q88 54 96 64 M104 64 Q112 54 120 64" fill="none" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/>';
      mouth = '<path d="M90 74 Q100 90 110 74 Z" fill="#FF7A90" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>';
    } else if (mood === 'sad') {
      eyes = '<g class="blink">' + eye(88) + eye(112) + '</g><path d="M80 50 L96 55 M120 50 L104 55" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
      mouth = '<path d="M91 82 Q100 74 109 82" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
      extra = '<path class="tear" d="M121 70 q-5 8 0 11 q5 -3 0 -11z" fill="#6EC6FF" stroke="' + INK + '" stroke-width="1.8"/>';
    } else if (mood === 'think') {
      eyes = '<g class="blink">' + eye(88) + eye(112) + '</g><path d="M78 50 Q88 44 96 50" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
      mouth = '<path d="M94 80 Q100 77 106 80" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
    } else {
      eyes = '<g class="blink">' + eye(88) + eye(112) + '</g>';
      mouth = '<path d="M91 76 Q100 86 109 76" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
    }
    return eyes + mouth + extra +
      '<ellipse cx="78" cy="73" rx="6" ry="3.6" fill="#FF9FB5" opacity=".75"/><ellipse cx="122" cy="73" rx="6" ry="3.6" fill="#FF9FB5" opacity=".75"/>';
  }

  function hairNam() {   // tóc = ngòi bút chì
    return '<path d="M80 44 L100 -8 L120 44 Z" fill="' + MARK + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M92 14 L100 -8 L108 14 Z" fill="' + INK + '"/>' +
      '<path d="M90 44 L96 20 M110 44 L104 20" stroke="' + INK + '" stroke-width="2" stroke-linecap="round" opacity=".55"/>' +
      '<path d="M76 46 Q100 32 124 46" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
  }
  function hairNu() {    // hai búi tóc = cục tẩy + nơ hồng
    var bun = function (x) {
      return '<rect x="' + (x - 13) + '" y="22" width="26" height="22" rx="8" fill="#FF9FB5" stroke="' + INK + '" stroke-width="4" transform="rotate(' + (x < 100 ? -14 : 14) + ' ' + x + ' 33)"/>' +
        '<path d="M' + (x - 9) + ' 33 L' + (x + 9) + ' 33" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85" transform="rotate(' + (x < 100 ? -14 : 14) + ' ' + x + ' 33)"/>';
    };
    return bun(70) + bun(130) +
      '<path d="M100 36 L84 26 L84 46 Z M100 36 L116 26 L116 46 Z" fill="#FF7A90" stroke="' + INK + '" stroke-width="3.4" stroke-linejoin="round"/><circle cx="100" cy="36" r="5" fill="#FFD84D" stroke="' + INK + '" stroke-width="2.6"/>' +
      '<path d="M74 50 Q100 40 126 50" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>';
  }

  function build(kind, pose) {
    var nam = kind !== 'nu', accent = nam ? '#2F6FD6' : '#FF7A90';
    var armL = ARM.idle, armR = R(ARM.idle), legL = LEG.idle, legR = R(LEG.idle);
    var mood = 'idle', head = '', front = '', back = '', cls = 'qk-' + pose;
    var gL = '', gR = '', gLegL = '', gLegR = '';
    switch (pose) {
      case 'wave': armR = ARM.waveR; armR = [armR[0], [armR[1][0], armR[1][1]], armR[2]]; mood = 'happy'; break;
      case 'cheer': armL = ARM.up; armR = R(ARM.up); legL = LEG.wide; legR = R(LEG.wide); mood = 'happy';
        front += '<g class="tw">' + star(40, 46, 9, MARK) + '</g><g class="tw tw2">' + star(166, 30, 11, MARK) + '</g><g class="tw tw3">' + star(176, 104, 7, '#FF9FB5') + '</g><g class="tw tw2">' + star(28, 112, 7, '#6EC6FF') + '</g>'; break;
      case 'think': armL = ARM.hip; armR = ARM.chin; mood = 'think'; head = 'transform="rotate(-6 100 92)"';
        front += '<g class="tw"><circle cx="150" cy="30" r="11" fill="' + MARK + '" stroke="' + INK + '" stroke-width="3"/><path d="M145 42 h10 M147 47 h6" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M150 8 v-6 M166 14 l5 -4 M134 14 l-5 -4" stroke="' + MARK + '" stroke-width="3.4" stroke-linecap="round"/></g>'; break;
      case 'read': armL = ARM.book; armR = R(ARM.book); mood = 'idle';
        front += '<g><path d="M70 132 L100 140 L130 132 L130 166 L100 174 L70 166 Z" fill="' + accent + '" stroke="' + INK + '" stroke-width="3.4" stroke-linejoin="round"/><path d="M100 140 L100 174" stroke="' + INK + '" stroke-width="3"/><path d="M76 142 L96 148 M76 152 L96 158 M104 148 L124 142 M104 158 L124 152" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".85"/></g>';
        armL = [[100, 108], [72, 132], [74, 150]]; armR = [[100, 108], [128, 132], [126, 150]]; break;
      case 'run': armL = [[100, 108], [100, 140], [100, 170]]; armR = armL; legL = LEG.straight; legR = LEG.straight; mood = 'happy';
        gL = ' class="aw1"'; gR = ' class="aw2"'; gLegL = ' class="sw1"'; gLegR = ' class="sw2"'; break;
      case 'sad': armL = ARM.down; armR = R(ARM.down); mood = 'sad'; head = 'transform="rotate(5 100 92)"'; break;
      default: mood = 'idle';
    }
    if (pose === 'wave') gR = ' class="wv"';

    var torso = '<path d="M106 102 L106 172" stroke="' + MARK + '" stroke-width="16" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M100 92 L100 170" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>';
    var deco = '';
    if (nam) {
      deco = '<path d="M100 98 L84 90 L84 108 Z M100 98 L116 90 L116 108 Z" fill="#FF5C75" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="98" r="4" fill="#FF5C75" stroke="' + INK + '" stroke-width="2.4"/>' +
        '<rect x="108" y="140" width="26" height="22" rx="6" fill="' + accent + '" stroke="' + INK + '" stroke-width="3" transform="rotate(10 121 151)"/><path d="M100 104 L118 142" stroke="' + accent + '" stroke-width="4" stroke-linecap="round"/>';
    } else {
      deco = '<path d="M100 150 L64 196 L136 196 Z" fill="#FF7A90" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M82 176 L118 176" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
        '<path d="M100 104 q-14 -10 -14 0 q0 10 14 16 q14 -6 14 -16 q0 -10 -14 0z" fill="#FF9FB5" stroke="' + INK + '" stroke-width="2.6" stroke-linejoin="round"/>';
    }
    var badge = star(100, nam ? 126 : 134, 8, MARK);

    var lg = (nam ? '' : '');
    var svg =
      '<svg class="qk qk-' + (nam ? 'nam' : 'nu') + ' ' + cls + '" viewBox="0 0 200 270" role="img" aria-label="' + (nam ? 'Bút, bạn người que nam' : 'Chì, bạn người que nữ') + '" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="100" cy="258" rx="' + (pose === 'cheer' ? 26 : 44) + '" ry="6" fill="#000" opacity=".12"/>' +
      '<g class="bob">' +
      '<g' + gLegL + '>' + limb(legL, 7) + shoe(legL[2], accent) + '</g><g' + gLegR + '>' + limb(legR, 7) + shoe(legR[2], accent) + '</g>' +
      torso + (nam ? '' : '') + deco + badge +
      '<g' + gL + '>' + limb(armL, 7) + hand(armL[2]) + '</g><g' + gR + '>' + limb(armR, 7) + hand(armR[2]) + '</g>' +
      '<g ' + head + ' class="tilt">' +
      (nam ? hairNam() : hairNu()) +
      '<circle cx="100" cy="62" r="31" fill="' + CARD + '" stroke="' + INK + '" stroke-width="5"/>' + face(mood) + '</g>' +
      front + '</g></svg>';
    return svg;
  }

  window.BiQue = {
    poses: ['idle', 'wave', 'cheer', 'think', 'read', 'run', 'sad'],
    names: { nam: 'Bút', nu: 'Chì' },
    html: function (kind, pose) { return build(kind === 'nu' ? 'nu' : 'nam', pose || 'idle'); },
    mount: function (el, kind, pose) { if (el) el.innerHTML = this.html(kind, pose); return el; }
  };
})();
