/* ============================================================================
 * TIEFE.JS, das Auftauchen beim Scrollen. Angelegt 23.08.2026.
 * ============================================================================
 *
 * LOESCHBAR. Und mehr als das: die Seite ist so gebaut, dass sie den Ausfall
 * dieser Datei gar nicht bemerkt. Das Versteck (Klasse js-tiefe am <html>)
 * setzt AUSSCHLIESSLICH dieses Skript, und zwar erst, nachdem es sicher ist,
 * dass es auch wieder aufdecken kann. Ohne Skript: alles sofort sichtbar.
 *
 * TECHNIK: ein einziger IntersectionObserver. Kein scroll-Ereignis, kein
 * Nachmessen bei jedem Bildlauf, keine Schleife. Der Browser meldet einmal,
 * wenn ein Element in den sichtbaren Bereich kommt; danach wird es aus der
 * Beobachtung entlassen und bleibt stehen. Einmal aufgetaucht heisst
 * aufgetaucht, nichts blinkt beim Zurueckscrollen.
 *
 * KEIN DATENZUGRIFF, wie ueberall auf dieser Seite: kein Supabase, keine
 * Bridge, kein Fund.
 */

(function () {
  'use strict';

  /* Ohne Beobachter kein Versteck. Alte Browser bekommen die stehende Seite. */
  if (!('IntersectionObserver' in window)) return;

  /* Wer Ruhe will, bekommt sie ganz: Stufe 1 und Systemeinstellung lassen das
   * Versteck gar nicht erst entstehen. Das ist billiger als verstecken und
   * sofort wieder aufdecken. */
  var ruhe = false;
  try { ruhe = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  if (document.documentElement.getAttribute('data-anim') === '1' || ruhe) return;

  document.documentElement.classList.add('js-tiefe');

  function start() {
    var teile = document.querySelectorAll('.steigt');
    if (!teile.length) return;

    var beobachter = new IntersectionObserver(function (eintraege) {
      for (var i = 0; i < eintraege.length; i++) {
        if (eintraege[i].isIntersecting) {
          eintraege[i].target.classList.add('da');
          beobachter.unobserve(eintraege[i].target);
        }
      }
    }, {
      /* Ein Stueck vor der Unterkante ausloesen, damit die Bewegung fertig
       * ist, wenn das Auge ankommt, nicht erst dann beginnt. */
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    for (var i = 0; i < teile.length; i++) beobachter.observe(teile[i]);

    /* Wache: sollte ein Element nach 2,5 s immer noch versteckt sein, obwohl
     * die Seite laengst steht (Rechenfehler, verdeckter Container, was auch
     * immer), wird aufgedeckt. Dieselbe Lehre wie beim Sperr-Overlay des
     * Panels: lieber eine Bewegung verlieren als einen Text. */
    setTimeout(function () {
      var haengen = document.querySelectorAll('.steigt:not(.da)');
      for (var i = 0; i < haengen.length; i++) {
        var r = haengen[i].getBoundingClientRect();
        if (r.top < (window.innerHeight || 0) && r.bottom > 0) {
          haengen[i].classList.add('da');
        }
      }
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
