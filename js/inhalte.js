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

  // Kontakt-E-Mail (offizielle PauseAI-Adresse). Leer = wird ausgeblendet.
  email: 'austria@pauseai.info',

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
      datum: '2026-12-01',
      beginn: '18:00',
      titel: 'Live-Treffen PauseAI',
      untertitel: 'Zum Kennenlernen und Austauschen.',
      ort: 'Café Eiles, Josefstädter Straße 2, 1080 Wien',
      link: ''
    }
  ]
};
