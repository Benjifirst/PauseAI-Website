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

  // Nächster wöchentlicher Call: überspringt Ausfälle, beachtet abweichende Uhrzeiten.
  function nextWeekly(call, now) {
    var d = new Date(now);
    var diff = (call.wochentag - d.getUTCDay() + 7) % 7;
    var day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + diff * 864e5;
    var ausfaelle = call.ausfaelle || [];
    var andere = call.andereZeit || {};
    for (var i = 0; i < 60; i++, day += 7 * 864e5) {
      var iso = isoDate(day);
      if (ausfaelle.indexOf(iso) !== -1) continue;
      var beginn = andere[iso] || call.beginn || '19:00';
      var t = beginn.split(':');
      var start = day + (+t[0]) * 36e5 + (+t[1]) * 6e4;
      var end = start + (call.dauerMinuten || 60) * 6e4;
      if (now >= end) continue;
      return { start: start, beginn: beginn, live: now >= start };
    }
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
      ' · ' + n.beginn + ' Uhr (österreichische Zeit) · Google Meet';
    var cd = box.querySelector('.countdown');
    cd.textContent = n.live ? 'Läuft gerade' : countdownText(n.start - now);
    cd.classList.toggle('live', n.live);

    // Zeile in der Terminliste: Standard-Uhrzeit aus inhalte.js, beim nächsten Call
    // mit abweichender Uhrzeit ein Hinweis, damit oben und unten dasselbe steht.
    var time = document.querySelector('[data-weekly] [data-call-time]');
    if (time) {
      var regular = cfg.wochenCall.beginn || '19:00';
      time.textContent = WOCHENTAGE[cfg.wochenCall.wochentag] + ', ' + regular + ' Uhr (österreichische Zeit)' +
        (n.beginn !== regular ? ' · am ' + d.getUTCDate() + '. ' + MONATE[d.getUTCMonth()] + ' ausnahmsweise ' + n.beginn + ' Uhr' : '');
    }
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
      list.appendChild(el('div', 'row empty', 'Weitere Termine kündigen wir hier an, sobald sie feststehen.'));
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

  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

  renderNext();
  renderEvents();
  setInterval(renderNext, 30000);
})();
