/* ============================================================================
 * NEIGUNG.JS, die Zeiger-Interaktion. Angelegt 23.08.2026. LOESCHBAR.
 * ============================================================================
 *
 * Uebernommen aus einer Referenzvorlage (Soda-Landingpage) und auf diese
 * Seite uebersetzt: dort neigt sich eine 3D-Dose zum Zeiger und die
 * schwebenden Fruechte wandern in verschiedenen Tiefen mit. Hier neigt sich
 * die Drahtkugel, und Planeten, Mond, Radar und Sterne wandern mit, jede
 * Ebene verschieden weit. Der Glaettungsfaktor 0.05 stammt aus der Vorlage,
 * er macht die Bewegung traege statt zappelig.
 *
 * KEIN DATENZUGRIFF. Diese Datei kennt weder Supabase noch Bridge noch Fund.
 *
 * DIE KOSTENREGEL, und zwar verschaerft:
 *  - Die Schleife laeuft NUR, solange sich etwas bewegt. Steht die Maus und
 *    ist die Glaettung angekommen, beendet sich die Schleife selbst. Kosten
 *    bei ruhender Maus: null.
 *  - Geschrieben wird ausschliesslich die translate-Eigenschaft (nicht
 *    transform). translate setzt sich mit den laufenden CSS-Animationen
 *    zusammen, statt sie zu ueberschreiben: das Schweben der Planeten und
 *    die Mondbahn laufen unveraendert weiter.
 *  - Auf Geraeten ohne feinen Zeiger (Handy, Tablet) startet das hier GAR
 *    NICHT: ohne Maus gibt es nichts, dem man folgen koennte.
 *  - Systemruhe (prefers-reduced-motion) startet ebenfalls nicht.
 *  - Stufe 1 (Ruhe) setzt alles zurueck und legt die Schleife still.
 */

(function (welt) {
  'use strict';

  var feinerZeiger, systemRuhe;
  try {
    feinerZeiger = welt.matchMedia('(pointer: fine)').matches;
    systemRuhe   = welt.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { return; }
  if (!feinerZeiger || systemRuhe) return;

  /* Was sich wie weit bewegt. Vorzeichen = Richtung: negative Werte laufen
   * der Maus entgegen (hinten), positive mit ihr (vorn). Die Zahlen sind
   * Pixel bei vollem Ausschlag (Maus am Rand). */
  var EBENEN = [
    { wahl: '.sterne',        fx: -10, fy:  -6 },
    { wahl: '.raster-buehne', fx:   8, fy:   5 },
    { wahl: '.planet-1',      fx: -26, fy: -18 },
    { wahl: '.planet-2',      fx:  18, fy:  12 },
    { wahl: '.planet-3',      fx: -38, fy: -26 },
    { wahl: '.mond',          fx: -30, fy: -20 },
    { wahl: '.radar',         fx:  22, fy:  14 },
    { wahl: '.orbit-1',       fx: -24, fy: -16 },
    { wahl: '.orbit-2',       fx: -20, fy: -13 }
  ];

  var NEIG_X = 22;   /* Grad rotateY bei vollem Ausschlag der Kugel */
  var NEIG_Y = 16;   /* Grad rotateX */
  var GLAETTUNG = 0.05;

  var teile = null;   /* [{el,fx,fy}] einmal gegriffen, nicht je Takt */
  var kugel = null;

  function greifen() {
    teile = [];
    EBENEN.forEach(function (e) {
      var el = document.querySelector(e.wahl);
      if (el) teile.push({ el: el, fx: e.fx, fy: e.fy });
    });
    kugel = document.querySelector('.held3d');
  }

  var ziel = { x: 0, y: 0 };
  var ist  = { x: 0, y: 0 };
  var laeuft = false;

  function stufeEins() {
    return document.documentElement.getAttribute('data-anim') === '1';
  }

  function zuruecksetzen() {
    if (!teile) return;
    teile.forEach(function (t) { t.el.style.translate = ''; });
    if (kugel) kugel.style.transform = '';
    ist.x = 0; ist.y = 0;
  }

  function anwenden() {
    teile.forEach(function (t) {
      t.el.style.translate = (ist.x * t.fx).toFixed(1) + 'px ' + (ist.y * t.fy).toFixed(1) + 'px';
    });
    if (kugel) {
      kugel.style.transform = 'translateY(-50%)'
        + ' rotateY(' + (ist.x * NEIG_X).toFixed(2) + 'deg)'
        + ' rotateX(' + (-ist.y * NEIG_Y).toFixed(2) + 'deg)';
    }
  }

  function takt() {
    if (stufeEins()) { zuruecksetzen(); laeuft = false; return; }

    ist.x += (ziel.x - ist.x) * GLAETTUNG;
    ist.y += (ziel.y - ist.y) * GLAETTUNG;
    anwenden();

    /* Angekommen und keine neue Bewegung: Schleife beenden. Die naechste
     * Mausbewegung startet sie wieder. So kostet Stillstand nichts. */
    if (Math.abs(ziel.x - ist.x) < 0.0006 && Math.abs(ziel.y - ist.y) < 0.0006) {
      ist.x = ziel.x; ist.y = ziel.y;
      anwenden();
      laeuft = false;
      return;
    }
    requestAnimationFrame(takt);
  }

  welt.addEventListener('mousemove', function (e) {
    ziel.x = (e.clientX / welt.innerWidth)  - 0.5;
    ziel.y = (e.clientY / welt.innerHeight) - 0.5;
    if (!laeuft) {
      if (!teile) greifen();
      laeuft = true;
      requestAnimationFrame(takt);
    }
  }, { passive: true });

})(typeof globalThis !== 'undefined' ? globalThis : this);
