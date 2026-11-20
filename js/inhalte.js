/* ============================================================
   HIER PFLEGEN: Links, Kontakt und Termine
   Für neue Termine nur diese Datei ändern.
   ============================================================ */

window.PAUSEAI_AT = {

  // Anmeldung zum wöchentlichen Online-Call (Luma → Google Meet).
  // Leer lassen = Knopf führt zum Kontaktbereich.
  callLink: 'https://luma.com/fyfjfejs',

  // WhatsApp-Gruppe von PauseAI Österreich. Leer = wird ausgeblendet.
  whatsapp: 'https://chat.whatsapp.com/JxvFMVZ1MMQ5mFDlwAmSYH',

  // Kontakt-E-Mail, z. B. 'kontakt@pauseai.at'. Leer = wird ausgeblendet.
  email: '',

  // Der regelmäßige Online-Call
  wochenCall: {
    wochentag: 4,          // 0 = Sonntag, 4 = Donnerstag
    beginn: '18:00',
    dauerMinuten: 60
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
      titel: 'Erstes Live-Treffen',
      untertitel: 'Zum ersten Mal vor Ort: einander kennenlernen, austauschen und die nächsten Schritte planen.',
      ort: 'Café Stein, Währinger Straße 6–8, 1090 Wien',
      link: ''
    }
  ]
};
