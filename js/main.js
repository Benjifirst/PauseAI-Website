(function () {
  'use strict';

  var cfg = window.PAUSEAI_AT || {};
  var TZ = 'Europe/Vienna';
  var WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var MONATE = ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var MONATE_KURZ = ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function external(a, href) {
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  }

  // ---------- Menü am Handy ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Zeit in Wien ----------
  // Aktuelle Wiener Uhrzeit als "Wanduhr"-Zeitstempel (UTC-Felder = Wiener Ortszeit).
  function viennaNow() {
    var parts = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  }

  function isoDate(ts) {
    return new Date(ts).toISOString().slice(0, 10);
  }

  function nextWeekly(call, now) {
    var t = (call.beginn || '19:00').split(':');
    var d = new Date(now);
    var diff = (call.wochentag - d.getUTCDay() + 7) % 7;
    var start = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), +t[0], +t[1]) + diff * 864e5;
    var end = start + (call.dauerMinuten || 60) * 6e4;
    if (diff === 0 && now >= end) { start += 7 * 864e5; end += 7 * 864e5; }
    // Ausgefallene Termine überspringen
    var ausfaelle = call.ausfaelle || [];
    for (var i = 0; i < 52 && ausfaelle.indexOf(isoDate(start)) !== -1; i++) {
      start += 7 * 864e5; end += 7 * 864e5;
    }
    return { start: start, live: now >= start && now < end };
  }

  function countdownText(ms) {
    var min = Math.max(0, Math.round(ms / 6e4));
    var days = Math.floor(min / 1440);
    var hours = Math.floor((min % 1440) / 60);
    var mins = min % 60;
    if (days > 1) return 'in ' + days + ' Tagen';
    if (days === 1) return hours ? 'in 1 Tag, ' + hours + ' Std.' : 'in 1 Tag';
    if (hours > 0) return 'in ' + hours + ' Std. ' + mins + ' Min.';
    return 'in ' + mins + ' Min.';
  }

  // ---------- Links ----------
  document.querySelectorAll('[data-call-link]').forEach(function (a) {
    if (cfg.callLink) { external(a, cfg.callLink); return; }
    a.setAttribute('href', '#mitmachen');
    a.removeAttribute('target');
    if (a.hasAttribute('data-label-nolink')) a.textContent = a.getAttribute('data-label-nolink');
  });

  document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
    if (!cfg.whatsapp) { a.hidden = true; return; }
    external(a, cfg.whatsapp);
  });

  // Platzhalter (lokal, ohne eingesetztes Secret) wie ein leeres Feld behandeln
  if (cfg.email && cfg.email.indexOf('%%') === 0) cfg.email = '';

  document.querySelectorAll('[data-email]').forEach(function (a) {
    if (!cfg.email) { a.hidden = true; return; }
    a.hidden = false;
    a.setAttribute('href', 'mailto:' + cfg.email);
    (a.querySelector('.v') || a).textContent = cfg.email;
  });

  // ---------- Banner "Nächster Termin" ----------
  function renderNext() {
    var box = document.getElementById('next-call');
    if (!box || !cfg.wochenCall) return;
    var now = viennaNow();
    var n = nextWeekly(cfg.wochenCall, now);
    var d = new Date(n.start);
    box.querySelector('.wd').textContent = WOCHENTAGE[d.getUTCDay()].slice(0, 2);
    box.querySelector('.day').textContent = d.getUTCDate();
    box.querySelector('.mon').textContent = MONATE_KURZ[d.getUTCMonth()];
    box.querySelector('.meta').textContent =
      WOCHENTAGE[d.getUTCDay()] + ', ' + d.getUTCDate() + '. ' + MONATE[d.getUTCMonth()] +
      ' · ' + cfg.wochenCall.beginn + ' Uhr (Wiener Zeit) · Google Meet';
    var cd = box.querySelector('.countdown');
    cd.textContent = n.live ? 'Läuft gerade' : countdownText(n.start - now);
    cd.classList.toggle('live', n.live);
  }

  // ---------- Terminliste ----------
  function renderEvents() {
    var list = document.getElementById('event-list');
    if (!list) return;
    var weekly = list.querySelector('[data-weekly]');
    var now = new Date(viennaNow());
    var today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

    var items = (cfg.termine || []).map(function (t) {
      var p = t.datum.split('-');
      return Object.assign({ ts: Date.UTC(+p[0], +p[1] - 1, +p[2]) }, t);
    }).filter(function (t) { return t.ts >= today; })
      .sort(function (a, b) { return a.ts - b.ts; });

    if (!items.length) {
      list.appendChild(el('div', 'row empty', 'Weitere Termine in Wien und anderswo in Österreich folgen in Kürze.'));
      return;
    }

    items.forEach(function (t, i) {
      var d = new Date(t.ts);
      var row = el('article', 'row');

      var k = el('div', 'k date');
      k.appendChild(el('span', 'big', String(d.getUTCDate()).padStart(2, '0') + '.'));
      k.appendChild(document.createTextNode(MONATE_KURZ[d.getUTCMonth()] + ' ' + d.getUTCFullYear()));
      row.appendChild(k);

      var body = el('div');
      var h = el('h3', null, t.titel);
      if (i === 0) h.appendChild(el('span', 'tag', 'Als Nächstes'));
      body.appendChild(h);
      if (t.untertitel) body.appendChild(el('p', null, t.untertitel));
      var meta = el('div', 'meta');
      meta.appendChild(el('span', null, WOCHENTAGE[d.getUTCDay()] + (t.beginn ? ', ' + t.beginn + ' Uhr' : '')));
      if (t.ort) meta.appendChild(el('span', t.ortOffen ? 'open' : null, t.ort));
      body.appendChild(meta);
      row.appendChild(body);

      var end = el('div');
      if (t.link) {
        var a = el('a', 'button small', 'Details');
        external(a, t.link);
        end.appendChild(a);
      }
      row.appendChild(end);
      // Einzeltermine stehen vor dem wöchentlichen Call
      list.insertBefore(row, weekly);
    });
  }

  // ---------- Ornament (Gitterwerk) ----------
  var lattice = document.querySelector('.lattice');
  if (lattice) {
    var pattern = 'k......k' + '........' + '..k..k..' + '...gg...' + '...gg...' + '..k..k..' + '........' + 'k......k';
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i];
      lattice.appendChild(el('i', c === 'k' ? 'k' : c === 'g' ? 'g' : null));
    }
    wipeLattice(lattice);
  }

  // Wischen über das Gitterwerk: Über einer Kachel wendet sich diese einmal um die eigene Achse.
  // Im Spalt zwischen zwei Kacheln wenden sich beide, an einer Kreuzung alle vier.
  // Von selbst bewegt sich nichts. Bei "Bewegung reduzieren" im System bleibt das Gitter still.
  function wipeLattice(host) {
    if (!host.animate) return;
    var N = 8;         // Kacheln pro Zeile und Spalte
    var EDGE = 2;      // der Spalt zählt ein wenig in die Kachel hinein, damit man ihn leichter trifft
    var calm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var flip = [
      { transform: 'perspective(260px) rotateY(0deg)' },
      { transform: 'perspective(260px) rotateY(180deg)' }
    ];
    var held = {};     // Kacheln unter dem Zeiger: wenden sich erst wieder, nachdem er sie verlassen hat

    // Welche Spalten bzw. Zeilen berührt der Zeiger? Im Spalt sind es die beiden angrenzenden.
    function touched(pos, pitch, w, gap) {
      var out = [];
      for (var i = 0; i < N; i++) {
        if (pos >= i * pitch - gap - EDGE && pos <= i * pitch + w + gap + EDGE) out.push(i);
      }
      return out;
    }

    function onPointer(e) {
      if (calm && calm.matches) return;
      var box = host.getBoundingClientRect();
      var gap = parseFloat(getComputedStyle(host).columnGap) || 0;
      var pitch = (box.width + gap) / N;
      var rows = touched(e.clientY - box.top, pitch, pitch - gap, gap);
      var cols = touched(e.clientX - box.left, pitch, pitch - gap, gap);
      var now = {};
      rows.forEach(function (r) {
        cols.forEach(function (c) {
          var i = r * N + c;
          var node = host.children[i];
          now[i] = true;
          if (!node || held[i] || node.turning) return;
          node.turning = true;
          node.animate(flip, { duration: 600, easing: 'cubic-bezier(.65, 0, .35, 1)' })
            .onfinish = function () { node.turning = false; };
        });
      });
      held = now;
    }

    host.addEventListener('pointermove', onPointer);
    host.addEventListener('pointerdown', onPointer);   // Antippen am Tablet
    host.addEventListener('pointerleave', function () { held = {}; });
  }

  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  renderNext();
  renderEvents();
  setInterval(renderNext, 30000);
})();
