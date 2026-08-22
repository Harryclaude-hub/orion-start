/* ============================================================================
 * TOR.JS, die Zugangssperre der Frontpage. Angelegt 22.08.2026.
 * ============================================================================
 *
 * WAS DAS IST, UND WAS ES NICHT IST. Bitte einmal lesen, bevor jemand darauf
 * baut:
 *
 * Diese Sperre laeuft im BROWSER. Sie haelt Leute davon ab, ohne Code
 * weiterzuklicken. Sie haelt niemanden davon ab, der die Seite mit F12 oeffnet
 * und sich die Zieladresse herausholt. Das ist keine Schwaeche der Umsetzung,
 * das ist die Bauart: alles, was der Browser weiss, kann der Besucher wissen.
 *
 * Deshalb liegt hier nur der ABDRUCK (SHA-256) der Codes, nicht der Code
 * selbst. Und deshalb bleibt die eigentliche Sperre der Programme dort, wo
 * sie hingehoert: das Panel hat sein eigenes Kennwort, unabhaengig von dieser
 * Datei.
 *
 * ECHTE SPERRE, wenn Geld dafuer verlangt wird (heute NICHT gebaut, nur der
 * Platz dafuer): der Code wird nicht mehr hier verglichen, sondern von einem
 * Server bestaetigt, der Laufzeit, Geraetezahl und Sperrung kennt. Die einzige
 * Stelle, die dafuer getauscht werden muss, ist die Funktion pruefeCode()
 * weiter unten. Alles andere bleibt.
 *
 * FEHLERKLASSEN, die im Panel schon Blut gekostet haben und hier von Anfang an
 * vermieden sind:
 *   1) Overlay wurde versteckt statt entfernt, die Seite schluckte jeden Klick.
 *      Hier gibt es kein Overlay, sondern eine eigene Seite.
 *   2) Zugang lag nur im sessionStorage. Bei gesperrtem Speicher landete das
 *      "ok" im Arbeitsspeicher, das folgende reload() loeschte es,
 *      Endlosschleife. Hier: localStorage zuerst, nachlesen ob es ankam, und
 *      bei gesperrtem Speicher ehrlich sagen, dass der Zugang nur bis zum
 *      Neuladen gilt.
 */

(function (welt) {
  'use strict';

  var SCHLUESSEL = 'orion-front-zugang';
  var imSpeicher = null;

  /* -------------------------------------------------------------- die Codes --
   * Nur Abdruecke. Wer diese Datei liest, kennt die Codes nicht.
   * Der Abdruck von ARBRADAR2026 steht hier, damit der Weg heute schon
   * funktioniert, ohne dass das Wort im oeffentlichen Verzeichnis steht.
   */
  var CODES = [
    { abdruck: '8e47f677fabf75efdcf55f72f33f282618079d77b3ec76180ffc53b91ec3c4d7',
      name: 'Vollzugang',
      darf: ['panel', 'protection'] },
    { abdruck: '1f5f2cbeb00b6f7c6a2dac3e75101c07ff999902774890c6f0179205b5f8c470',
      name: 'Probezugang',
      darf: ['protection'] }
  ];

  /* Wohin ein freigeschalteter Zugang fuehrt. Eine einzige Stelle, damit die
   * Adressen nicht in drei Dateien auseinanderlaufen. */
  var ZIELE = {
    panel:      'https://harryclaude-hub.github.io/orion-panel-pro/index.html',
    protection: 'https://harryclaude-hub.github.io/orion-protection-panel/'
  };

  /* ------------------------------------------------------------- Speicher -- */

  function schreibe(wert) {
    try {
      localStorage.setItem(SCHLUESSEL, wert);
      if (localStorage.getItem(SCHLUESSEL) === wert) return 'local';
    } catch (e) { /* gesperrt, weiter */ }
    try {
      sessionStorage.setItem(SCHLUESSEL, wert);
      if (sessionStorage.getItem(SCHLUESSEL) === wert) return 'session';
    } catch (e) { /* gesperrt, weiter */ }
    imSpeicher = wert;
    return 'arbeitsspeicher';
  }

  function lies() {
    try { var a = localStorage.getItem(SCHLUESSEL); if (a) return a; } catch (e) {}
    try { var b = sessionStorage.getItem(SCHLUESSEL); if (b) return b; } catch (e) {}
    return imSpeicher;
  }

  function zustand() {
    var roh = lies();
    if (!roh) return null;
    try { return JSON.parse(roh); } catch (e) { return null; }
  }

  function vergessen() {
    try { localStorage.removeItem(SCHLUESSEL); } catch (e) {}
    try { sessionStorage.removeItem(SCHLUESSEL); } catch (e) {}
    imSpeicher = null;
  }

  /* --------------------------------------------------------------- Abdruck -- */

  function abdruck(wort) {
    var daten = new TextEncoder().encode(wort);
    return crypto.subtle.digest('SHA-256', daten).then(function (puffer) {
      return Array.prototype.map.call(new Uint8Array(puffer), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }

  /* ---------------------------------------------------------- die Pruefung --
   * DIESE Funktion ist die Tauschstelle. Heute rechnet sie den Abdruck im
   * Browser. Spaeter fragt sie einen Server und gibt dasselbe Ergebnis
   * zurueck: entweder einen Eintrag mit name und darf, oder null.
   */
  function pruefeCode(eingabe) {
    var wort = String(eingabe || '').trim().toUpperCase();
    if (!wort) return Promise.resolve(null);
    return abdruck(wort).then(function (h) {
      for (var i = 0; i < CODES.length; i++) {
        if (CODES[i].abdruck === h) return CODES[i];
      }
      return null;
    });
  }

  /* -------------------------------------------------------------- Oberflaeche */

  function start(feldId, knopfId, meldungId, beiErfolg) {
    var feld    = document.getElementById(feldId);
    var knopf   = document.getElementById(knopfId);
    var meldung = document.getElementById(meldungId);

    function sag(text, art) {
      meldung.textContent = text;
      meldung.className = 'meldung' + (art ? ' ' + art : '');
    }

    function versuch() {
      if (!feld.value.trim()) { sag('Bitte den Code eingeben.', 'fehler'); return; }
      sag('Wird geprueft ...');
      pruefeCode(feld.value).then(function (treffer) {
        if (!treffer) {
          sag('Dieser Code gilt nicht.', 'fehler');
          feld.value = '';
          return;
        }
        var wo = schreibe(JSON.stringify({
          name: treffer.name,
          darf: treffer.darf,
          seit: new Date().toISOString()
        }));
        if (wo === 'arbeitsspeicher') {
          sag('Zugang erteilt. Der Speicher ist gesperrt, der Zugang gilt nur bis zum Neuladen.', 'gut');
        } else {
          sag('Zugang erteilt: ' + treffer.name + '.', 'gut');
        }
        beiErfolg(treffer);
      }).catch(function () {
        /* Kein crypto.subtle gibt es nur bei unverschluesselten Verbindungen.
         * Ehrlich sagen statt still durchlassen. */
        sag('Pruefung nicht moeglich. Bitte die Seite ueber https aufrufen.', 'fehler');
      });
    }

    knopf.addEventListener('click', versuch);
    feld.addEventListener('keydown', function (e) { if (e.key === 'Enter') versuch(); });
    feld.focus();
  }

  welt.Tor = {
    start: start,
    zustand: zustand,
    vergessen: vergessen,
    pruefeCode: pruefeCode,
    ZIELE: ZIELE
  };

})(typeof globalThis !== 'undefined' ? globalThis : this);
