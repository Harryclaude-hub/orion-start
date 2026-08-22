/* ============================================================================
 * BUEHNE.JS, der Schalter fuer die Bewegungsstufe. Angelegt 22.08.2026.
 * ============================================================================
 *
 * LOESCHBAR. Faellt diese Datei weg, bleibt die Seite auf Stufe 2 stehen, weil
 * das im CSS die Voreinstellung ist. Es fehlt dann nur der Schalter, nie ein
 * Inhalt, nie eine Sperre, nie eine Zahl.
 *
 * KEIN DATENZUGRIFF. Diese Datei kennt weder Supabase noch die Bridge noch
 * einen Fund. Sie setzt ein Attribut am <html> und merkt sich eine Ziffer.
 *
 * WARUM ES DEN SCHALTER GIBT: Bewegung sieht auf einem starken Rechner gut aus
 * und macht ein schwaches Geraet zaeh. Wer das nicht will, soll es abschalten
 * koennen, ohne die Seite zu verlassen. Wer im Betriebssystem ohnehin
 * "Bewegung reduzieren" gesetzt hat, bekommt Ruhe, ohne etwas zu tun; dann
 * greift die Regel im CSS, und der Schalter sagt das auch.
 */

(function (welt) {
  'use strict';

  var SCHLUESSEL = 'orion-anim';
  var VOREINSTELLUNG = '2';
  var imSpeicher = null;

  function schreibe(wert) {
    try {
      localStorage.setItem(SCHLUESSEL, wert);
      if (localStorage.getItem(SCHLUESSEL) === wert) return true;
    } catch (e) { /* gesperrt, weiter */ }
    imSpeicher = wert;
    return false;
  }

  function lies() {
    try { var a = localStorage.getItem(SCHLUESSEL); if (a) return a; } catch (e) {}
    return imSpeicher || VOREINSTELLUNG;
  }

  function setze(stufe) {
    if (['1', '2', '3'].indexOf(stufe) < 0) stufe = VOREINSTELLUNG;
    document.documentElement.setAttribute('data-anim', stufe);
    return stufe;
  }

  /* Sofort setzen, noch bevor der Rest der Seite steht: sonst blitzt einmal
   * die falsche Stufe auf. Deshalb wird diese Datei im <head> geladen. */
  setze(lies());

  function ruheImSystem() {
    try { return welt.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  /* Der Schalter wird gebaut, wenn die Seite steht. Fehlt der Platzhalter,
   * passiert nichts weiter, die Stufe gilt trotzdem. */
  function bauen() {
    var kasten = document.getElementById('stufenschalter');
    if (!kasten) return;

    var namen = { '1': 'Ruhe', '2': 'Normal', '3': 'Voll' };
    var rat = {
      '1': 'alles steht still, die Bilder bleiben',
      '2': 'Planeten schweben, Radar dreht langsam',
      '3': 'zusaetzlich Puls, Flimmern, Rasterdrift'
    };

    var zeile = document.createElement('div');
    zeile.className = 'stufen';
    var kopf = document.createElement('span');
    kopf.textContent = 'Bewegung';
    zeile.appendChild(kopf);

    var knoepfe = {};
    ['1', '2', '3'].forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = s + ' ' + namen[s];
      b.title = rat[s];
      b.addEventListener('click', function () {
        var gesetzt = setze(s);
        var gespeichert = schreibe(gesetzt);
        for (var k in knoepfe) {
          knoepfe[k].setAttribute('aria-pressed', k === gesetzt ? 'true' : 'false');
        }
        hinweis.textContent = gespeichert
          ? rat[gesetzt]
          : rat[gesetzt] + ', gilt nur bis zum Neuladen, der Speicher ist gesperrt';
      });
      knoepfe[s] = b;
      zeile.appendChild(b);
    });

    var hinweis = document.createElement('span');
    hinweis.style.textTransform = 'none';
    hinweis.style.letterSpacing = '0';
    zeile.appendChild(hinweis);

    var jetzt = document.documentElement.getAttribute('data-anim') || VOREINSTELLUNG;
    knoepfe[jetzt].setAttribute('aria-pressed', 'true');
    ['1', '2', '3'].forEach(function (s) {
      if (s !== jetzt) knoepfe[s].setAttribute('aria-pressed', 'false');
    });
    hinweis.textContent = ruheImSystem()
      ? 'dein System sagt Bewegung reduzieren, deshalb steht alles still'
      : rat[jetzt];

    kasten.appendChild(zeile);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bauen);
  } else {
    bauen();
  }

  welt.Buehne = { setze: setze, lies: lies };

})(typeof globalThis !== 'undefined' ? globalThis : this);
