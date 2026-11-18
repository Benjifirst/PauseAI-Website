# PauseAI Österreich · Website

Website von **PauseAI Österreich**, der österreichischen Gruppe der internationalen Bewegung [PauseAI](https://pauseai.info).

Reines HTML, CSS und JavaScript, ohne Build-Schritt, Frameworks oder externe Abhängigkeiten. Optik: Wiener Jugendstil („Florahof“).

## Was wo liegt

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite: Über uns, Warum, Termine, Team, Mitmachen & Kontakt |
| `vorschlag.html`, `weiterlesen.html` | Eigene Seiten: unser Vorschlag, Lesestoff und Links |
| `js/inhalte.js` | **Hier pflegen:** Call-Link, WhatsApp, E-Mail, Team, Termine |
| `js/main.js` | Logik: nächster Donnerstag-Call, Countdown, Terminliste, Team |
| `css/style.css` | Gestaltung |
| `impressum.html`, `datenschutz.html` | Rechtliches, rote Platzhalter (`class="todo"`) noch ausfüllen |
| `assets/` | Logo, Gruppenfoto im Kopfbereich (`assets/fotos/`), später Porträts (`assets/team/…`) |
| `fonts/PoiretOne-Regular.ttf` | Titelschrift, lokal eingebunden (kein Google Fonts) |
| `vorschau-schrift.html`, `fonts/vorschau/` | Nur zum Vergleichen von Titelschriften, nicht verlinkt |

## Häufige Änderungen

Fast alles, was sich regelmäßig ändert, steht in **`js/inhalte.js`**. Dort reicht es, Text zu ändern, HTML muss man nicht anfassen.

### Neuen Termin eintragen

Unter `termine` einen Eintrag ergänzen:

```js
{ datum: '2026-12-03', beginn: '18:30', titel: 'Vortragsabend', untertitel: '…', ort: 'Wien, …', link: '' },
```

Vergangene Termine verschwinden automatisch. Der wöchentliche Donnerstag-Call (18:00, Wiener Zeit) wird automatisch berechnet.

### Teammitglied hinzufügen

Unter `team` einen Eintrag ergänzen. Foto optional: quadratisches Bild nach `assets/team/` legen und bei `foto` den Pfad eintragen, sonst werden Initialen gezeigt.

```js
{ name: 'Vorname Nachname', rolle: 'Veranstaltungen', text: 'Ein Satz, warum ich dabei bin.', foto: 'assets/team/vorname.jpg' },
```

## Mitarbeiten

**Ohne Programmierkenntnisse (direkt auf GitHub):**
1. Datei auf GitHub öffnen, z. B. `js/inhalte.js`.
2. Auf das Stift-Symbol („Edit this file“) klicken und ändern.
3. Unten „Commit changes“ → am besten „Create a new branch … and start a pull request“ wählen, kurz beschreiben, was geändert wurde.
4. Jemand aus dem Team schaut drüber und übernimmt die Änderung.

**Lokal:**
```sh
git clone https://github.com/Benjifirst/PauseAI-Website.git
cd PauseAI-Website
git checkout -b mein-aenderungsname
# ändern, ansehen (siehe unten), dann:
git add .
git commit -m "Kurz beschreiben, was sich ändert"
git push -u origin mein-aenderungsname
```
Danach auf GitHub einen Pull Request öffnen.

Bitte keine privaten Daten (Telefonnummern, Privatadressen, Passwörter) ins Repository stellen. Fotos vorher verkleinern (ca. 1600 px breit) und die Metadaten entfernen, denn Handyfotos enthalten meist den GPS-Standort.

## Lokal ansehen

`index.html` doppelklicken, oder einen kleinen Server starten:

```sh
python -m http.server 8765
```

und http://127.0.0.1:8765 öffnen.

## Lizenzen

Die Schriften unter `fonts/` stehen unter der SIL Open Font License 1.1.
