/* Stecker-Animation im Kopfbereich (.stecker neben der Überschrift)
   Ein freundlicher kleiner Computer arbeitet, der Stecker fliegt raus, die Augen
   werden zum Pause-Zeichen, dann fährt die Kamera auf die Steckdose: Sie ist das Logo.
   Bewusst ohne Bösewicht und kurz (rund 3 s): Die Animation zeigt nur „Pause“,
   was genau gemeint ist, sagt der Text daneben.

   · Startet, sobald sie zur Hälfte sichtbar ist. Klick oder Tippen spielt sie nochmal ab.
   · Bei „Bewegung reduzieren“ in den Systemeinstellungen steht gleich das fertige Logo da. */
(function () {
  'use strict';

  var host = document.querySelector('.stecker');
  if (!host) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Farben wie in css/style.css
  var GROUND = '#F7F5F0', INK = '#161616', DIM = '#B9B4A8', LINE = '#CFCBC0',
    GOLD = '#9C7A1E', GOLD_LIGHT = '#C9A94F';

  // ---------- Zeit und Bewegung ----------
  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }   // Fortschritt 0..1 zwischen a und b ms
  function lerp(a, b, p) { return a + (b - a) * p; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeBack(t) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function easeBounce(t) {
    var n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  }

  // ---------- Bild ----------
  // Steckdose = Logo (Proportionen wie assets/logo.svg, 32er-Raster, hier 72 px groß)
  var SX = 340, SY = 110, S = 72, U = S / 32, SLOT_Y = SY + 8 * U, SLOT_H = 16 * U;
  var VB0 = [60, 50, 380, 253.3], VB1 = [294.5, 91.7, 163, 108.7];   // Gesamtbild → nah an der Steckdose

  var markup =
    '<line class="i-floor" x1="20" y1="250" x2="460" y2="250" stroke="' + LINE + '"/>' +
    // Computer
    '<g class="i-pc">' +
      '<rect x="96" y="240" width="88" height="10" fill="' + INK + '"/>' +
      '<path d="M124 220 L156 220 L162 240 L118 240 Z" fill="' + INK + '"/>' +
      '<rect x="80" y="110" width="120" height="110" fill="' + GROUND + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect x="94" y="124" width="92" height="66" fill="' + INK + '"/>' +
      '<rect class="i-eye" x="120" y="145" width="9" height="11" fill="' + GOLD_LIGHT + '"/>' +
      '<rect class="i-eye" x="151" y="145" width="9" height="11" fill="' + GOLD_LIGHT + '"/>' +
      '<path class="i-mouth" d="M128 168 Q140 176 152 168" stroke="' + GOLD_LIGHT + '" stroke-width="3" fill="none"/>' +
      '<rect class="i-led" x="96" y="202" width="6" height="6" fill="' + GOLD + '"/>' +
      '<rect x="150" y="204" width="36" height="3" fill="' + INK + '"/>' +
    '</g>' +
    // Steckdose
    '<g class="i-socket">' +
      '<rect x="' + SX + '" y="' + SY + '" width="' + S + '" height="' + S + '" fill="' + GROUND + '" stroke="' + INK + '" stroke-width="2"/>' +
      '<rect class="i-slot" x="' + (SX + 10 * U) + '" y="' + SLOT_Y + '" width="' + 4 * U + '" height="' + SLOT_H + '" fill="' + INK + '"/>' +
      '<rect class="i-slot" x="' + (SX + 18 * U) + '" y="' + SLOT_Y + '" width="' + 4 * U + '" height="' + SLOT_H + '" fill="' + INK + '"/>' +
      '<rect class="i-gsq" x="' + (SX + 3 * U) + '" y="' + (SY + 3 * U) + '" width="' + 3 * U + '" height="' + 3 * U + '" fill="' + GOLD + '" opacity="0"/>' +
      '<line class="i-gline" x1="' + (SX + 3 * U) + '" y1="' + (SY + 28.5 * U) + '" x2="' + (SX + 29 * U) + '" y2="' + (SY + 28.5 * U) + '" stroke="' + GOLD + '" stroke-width="' + U + '" stroke-dasharray="' + 26 * U + '" stroke-dashoffset="' + 26 * U + '"/>' +
    '</g>' +
    // Kabel und Stecker (Ursprung = Steckermitte, Kabel geht unten raus)
    '<path class="i-cable" stroke="' + INK + '" stroke-width="3" fill="none"/>' +
    '<g class="i-plug">' +
      '<g class="i-prongs" opacity="0">' +
        '<rect x="-11.2" y="-37" width="5" height="13" fill="' + DIM + '" stroke="' + INK + '"/>' +
        '<rect x="6.2" y="-37" width="5" height="13" fill="' + DIM + '" stroke="' + INK + '"/>' +
      '</g>' +
      '<rect x="-20" y="-25" width="40" height="50" fill="' + INK + '"/>' +
      '<line x1="-13" x2="13" y1="-6" y2="-6" stroke="#3A3A3A" stroke-width="2"/>' +
      '<line x1="-13" x2="13" y1="3" y2="3" stroke="#3A3A3A" stroke-width="2"/>' +
      '<line x1="-13" x2="13" y1="12" y2="12" stroke="#3A3A3A" stroke-width="2"/>' +
    '</g>';

  host.innerHTML = '<svg viewBox="' + VB0.join(' ') + '" focusable="false">' + markup + '</svg>';
  var svg = host.querySelector('svg');
  function q(c) { return svg.querySelector('.' + c); }
  function qa(c) { return Array.prototype.slice.call(svg.querySelectorAll('.' + c)); }
  var plug = q('i-plug'), prongs = q('i-prongs'), cable = q('i-cable'), pc = q('i-pc'), floor = q('i-floor'),
    eyes = qa('i-eye'), mouth = q('i-mouth'), led = q('i-led'),
    socket = q('i-socket'), slots = qa('i-slot'), gsq = q('i-gsq'), gline = q('i-gline');

  // ---------- Ablauf (ms) ----------
  var T0 = 1000;            // Stecker flutscht raus
  var DURATION = T0 + 2000;

  function render(t) {
    // Stecker: ruckelt zweimal, fällt dann auf den Boden
    var tug = seg(t, T0 - 550, T0 - 50);
    var tugY = tug > 0 && tug < 1 ? Math.max(0, Math.sin(tug * Math.PI * 2)) * 6 : 0;
    var fall = seg(t, T0, T0 + 700);
    var px = lerp(376, 322, easeOut(fall));
    var py = lerp(146, 228, easeBounce(fall)) + tugY;
    var rot = lerp(0, 90, easeOut(seg(t, T0, T0 + 450)));
    plug.setAttribute('transform', 'translate(' + px + ' ' + py + ') rotate(' + rot + ')');
    prongs.setAttribute('opacity', seg(t, T0 + 50, T0 + 250));
    var r = rot * Math.PI / 180, dx = -Math.sin(r), dy = Math.cos(r), ex = px + dx * 25, ey = py + dy * 25;
    cable.setAttribute('d', 'M200 200 C 238 200, 232 252, 262 249 S ' + (ex + dx * 55) + ' ' + (ey + dy * 55) + ' ' + ex + ' ' + ey);
    led.setAttribute('fill', t < T0 + 100 ? GOLD : LINE);

    // Steckdose wird mitgezogen und federt zurück
    var pop = seg(t, T0, T0 + 350), ps = 1 + Math.sin(pop * Math.PI) * 0.06 * (1 - pop);
    socket.setAttribute('transform', 'translate(0 ' + tugY * 0.35 + ') translate(376 146) scale(' + ps + ') translate(-376 -146)');

    // Gesicht: blinzelt am Anfang und nach dem Ausstecken, schaut zwischendurch kurz zur Seite
    var b1 = seg(t, 200, 350), b2 = seg(t, T0 + 120, T0 + 300);
    var blink = (b1 > 0 && b1 < 1 ? Math.sin(b1 * Math.PI) : 0) + (b2 > 0 && b2 < 1 ? Math.sin(b2 * Math.PI) : 0);
    var open = clamp(1 - blink);
    var look = Math.sin(seg(t, 420, T0 - 200) * Math.PI) * 4;
    mouth.setAttribute('opacity', 1 - seg(t, T0 + 280, T0 + 450));

    // Augen werden zum Pause-Zeichen
    var p = easeBack(seg(t, T0 + 280, T0 + 650)), pc1 = clamp(p);
    var h0 = lerp(2, 11, open), y0 = 150.5 + (1 - open) * 3, h = lerp(h0, 34, p);
    eyes.forEach(function (n, i) {
      n.setAttribute('x', lerp((i ? 151 : 120) + look, i ? 145 : 125, pc1));
      n.setAttribute('width', lerp(9, 10, pc1));
      n.setAttribute('y', lerp(y0, 157, pc1) - h / 2);
      n.setAttribute('height', h);
    });

    // Körper: nach dem Ausstecken ein Seufzer und ein Hüpfer
    var bob = Math.sin(seg(t, T0 + 150, T0 + 550) * Math.PI) * 2.5;
    bob -= Math.sin(seg(t, T0 + 600, T0 + 950) * Math.PI) * 7;
    pc.setAttribute('transform', 'translate(0 ' + bob + ')');

    // Kamerafahrt zur Steckdose, alles andere verblasst
    var fade = 1 - seg(t, T0 + 800, T0 + 1150);
    [plug, cable, pc, floor].forEach(function (n) { n.setAttribute('opacity', fade); });
    var z = easeInOut(seg(t, T0 + 700, T0 + 1400));
    svg.setAttribute('viewBox', VB0.map(function (v, i) { return lerp(v, VB1[i], z); }).join(' '));

    // Logo fertig: Goldquadrat, Goldlinie
    var g = easeBack(seg(t, T0 + 1200, T0 + 1450)), gx = SX + 4.5 * U, gy = SY + 4.5 * U;
    gsq.setAttribute('opacity', g > 0 ? 1 : 0);
    gsq.setAttribute('transform', 'translate(' + gx + ' ' + gy + ') scale(' + g + ') translate(' + -gx + ' ' + -gy + ')');
    gline.setAttribute('stroke-dashoffset', 26 * U * (1 - easeInOut(seg(t, T0 + 1300, T0 + 1600))));

    // Logo zwinkert einmal
    var k = seg(t, T0 + 1700, T0 + 1950), sq = k > 0 && k < 1 ? 1 - Math.sin(k * Math.PI) * 0.9 : 1;
    slots.forEach(function (n) { n.setAttribute('height', SLOT_H * sq); n.setAttribute('y', SLOT_Y + SLOT_H * (1 - sq) / 2); });
  }

  // ---------- Abspielen ----------
  if (reduce || !window.requestAnimationFrame) { render(DURATION); return; }

  var start = null, frame = null;
  function tick(now) {
    if (start === null) start = now;
    var t = Math.min(now - start, DURATION);
    render(t);
    frame = t < DURATION ? requestAnimationFrame(tick) : null;
  }
  function play() {
    if (frame) cancelAnimationFrame(frame);
    start = null;
    frame = requestAnimationFrame(tick);
  }
  render(0);
  host.addEventListener('click', play);

  if ('IntersectionObserver' in window) {
    var seen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { seen.disconnect(); play(); }
    }, { threshold: 0.5 });
    seen.observe(host);
  } else {
    play();
  }
})();
