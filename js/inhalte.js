/* ============================================================
   HIER PFLEGEN: Links, Kontakt und Termine
   Für neue Termine nur diese Datei ändern.
   ============================================================ */

window.PAUSEAI_AT = {

  // Anmeldung zum wöchentlichen Online-Call (Luma → Google Meet).
  // Muss auf eine Seite mit allen Terminen zeigen, nicht auf ein einzelnes Event:
  // der Luma-Kalender von PauseAI Austria.
  // Leer lassen = Knopf führt zum Kontaktbereich.
  callLink: 'https://luma.com/pauseAI_austria',

  // WhatsApp-Gruppe von PauseAI Österreich. Leer = wird ausgeblendet.
  whatsapp: 'https://chat.whatsapp.com/JxvFMVZ1MMQ5mFDlwAmSYH',

  // Kontakt-E-Mail. Leer = wird ausgeblendet.
  // %%IMPRESSUM_EMAIL%% wird beim Veröffentlichen aus dem GitHub-Secret eingesetzt
  // (siehe README, „Veröffentlichen“). Lokal bleibt der Knopf deshalb ausgeblendet.
  email: '%%IMPRESSUM_EMAIL%%',

  // Der regelmäßige Online-Call
  wochenCall: {
    wochentag: 4,          // 0 = Sonntag, 4 = Donnerstag
    beginn: '19:00',       // Wiener Zeit
    dauerMinuten: 60,
    // Donnerstage ohne Call (JJJJ-MM-TT). Die Seite springt dann zum nächsten Termin.
    ausfaelle: ['2026-12-24', '2026-12-31'],
    // Donnerstage mit anderer Uhrzeit (JJJJ-MM-TT: 'HH:MM'). Vergangene Einträge stören nicht.
    andereZeit: { '2026-11-26': '18:30' }
  },

  // Einzelne Termine. Vergangene werden automatisch ausgeblendet.
  // Format:
  // {
  //   datum: '2026-12-03',          // JJJJ-MM-TT
  //   beginn: '18:30',
  //   titel: 'Vortragsabend: Was ist KI-Risiko?',
  //   untertitel: 'Ein Einstieg für alle, die neugierig sind.',
  //   ort: 'Wien, Ort folgt',
  //   ortOffen: true,               // optional: Ort steht noch nicht fest (wird dezent markiert)
  //   link: ''                      // optional: Anmeldung oder Details
  // },
  termine: [
    {
      datum: '2026-11-17',
      beginn: '17:00',
      titel: 'Erstes Treffen vor Ort',
      untertitel: 'Wir lernen einander kennen, tauschen uns aus und planen die nächsten Schritte.',
      ort: 'Café Stein, Währinger Straße 6–8, 1090 Wien',
      link: ''
    }
  ]
};
