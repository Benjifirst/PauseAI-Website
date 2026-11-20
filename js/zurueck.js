// „Zurück zur Startseite“ auf den Unterseiten:
// Kommt man von der eigenen Website, geht der Knopf einen Schritt zurück im Verlauf.
// Der Browser stellt dann die Stelle wieder her, an der man auf der Startseite war.
// Sonst (z. B. direkt über Google gekommen) führt der Link normal zur Startseite.
(function () {
  'use strict';
  var back = document.querySelector('a.back');
  if (!back) return;
  back.addEventListener('click', function (e) {
    var fromHere = false;
    try { fromHere = document.referrer && new URL(document.referrer).origin === location.origin; } catch (err) {}
    if (fromHere && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
})();
