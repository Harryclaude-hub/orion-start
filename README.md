# orion-start, die Frontpage vor den beiden Programmen

Angelegt am 22.08.2026. Eigenes Projekt, eigener Ordner, eigenes Repo.
**Die beiden Programme wurden dafuer nicht angefasst**, keine Zeile, keine Datei.

## Was hier liegt

```
index.html            die Frontpage: beide Programme, echte Bildschirmfotos, Knoepfe
preise.html           Preistafel, Bestellablauf und Pflichtenliste, KEINE Kasse
zugang.html           Code-Eingabe, schaltet die Knoepfe zu den Programmen frei
recht/impressum.html  Pflichtangaben, Luecken rot markiert
recht/datenschutz.html
recht/agb.html
recht/widerruf.html   Belehrung plus Muster-Formular
recht/risiko.html     kein Gluecksspiel, keine Anlageberatung, was schiefgehen kann
recht/cookies.html    es gibt keine Cookies, nur lokaler Speicher
support.html          Leitstelle: Wege, was in eine Meldung gehoert, Sperrungen
faq.html              15 haeufige Fragen, auch die unbequemen Antworten
css/front.css         DESIGN-SCHICHT 1, loeschbar. Ohne sie bleibt alles lesbar.
technik.html          Maschinenraum: 12 Klappen, wie die Programme arbeiten
werdegang.html        der Weg seit 09.08. als Zeitstrahl, mit den Fehlern drin
css/buehne.css        DESIGN-SCHICHT 2, loeschbar: Sterne, Raster, Planeten, Radar
css/tiefe.css         DESIGN-SCHICHT 3, loeschbar: Scroll-Auftauchen, 3D-Klappen
js/buehne.js          Schalter fuer die Bewegungsstufe. Ohne ihn bleibt Stufe 2.
js/tiefe.js           das Auftauchen beim Scrollen; faellt es aus, steht alles da
js/tor.js             LOGIK der Sperre. Eine Tauschstelle fuer den Serverbetrieb.
schrift/              Rajdhani und Share Tech Mono, selbst gehostet
bilder/               Bildschirmfotos vom 22.08.2026, aus dem laufenden Betrieb
```

## Die Schichten, getrennt gehalten

* **Design 1**: `css/front.css`. Wer die Datei loescht, hat nackte, aber
  vollstaendig lesbare Seiten. Kein Text, kein Link und keine Sperre haengt
  daran.
* **Design 2**: `css/buehne.css` plus der Block `<div class="buehne">` in den
  Seiten. Sternenfeld, Taktikraster, drei Gasriesen mit Orbits, drehender
  Radarkegel, HUD-Eckwinkel. Bewegt werden ausschliesslich `transform` und
  `opacity`, kein WebGL, kein Bild, keine Schleife, Taktzeiten 46 bis 120 s.
  Drei Stufen ueber `data-anim` am `<html>`: 1 Ruhe, 2 Normal (Voreinstellung),
  3 Voll. Wer im System Bewegung reduziert hat, bekommt Ruhe ohne Klick.
  Auf schmalen Geraeten fallen Radar und zwei Koerper von selbst weg.
* **Design 3**: `css/tiefe.css` + `js/tiefe.js`. Abschnitte tauchen beim
  Scrollen auf (ein IntersectionObserver, kein scroll-Ereignis), die Klappen
  im Maschinenraum falten sich in 3D auf (rotateX um die Oberkante), die
  Karten des Kartenraums stehen leicht gekippt im Raum. HARTE REGEL dieser
  Schicht: das Versteck haengt an der Klasse js-tiefe, die NUR das Skript
  setzt, und zwar erst wenn es aufdecken kann. Ohne JavaScript steht alles
  sofort da; eine Wache deckt nach 2,5 s alles auf, was haengen bleibt
  (dieselbe Lehre wie beim Sperr-Overlay des Panels). Die Klappen sind
  <details>/<summary> und oeffnen ganz ohne Skript. Die Fortschrittsleiste
  und der Tiefenzug der Planeten laufen ueber die Scroll-Zeitachse
  (animation-timeline: scroll()), nur auf Stufe 3 und nur wo der Browser sie
  kennt. Stufe 1 und prefers-reduced-motion stellen auch diese Schicht still.
* **Logik**: `js/tor.js`. Nur die Sperre, sonst nichts. Keine Datenabfrage,
  kein Supabase, keine Bridge.
* **Inhalt**: die HTML-Dateien selbst.

## Die Zeichen

Drei Stueck, eine Familie: der fuenfzackige Stern im Fadenkreuz gehoert dem
Panel Pro, das Delta im Taktik-Rahmen dem Protection Panel, und die drei
Guertelsterne des Orion dem Dach darueber. Das eigene Zeichen ist bewusst
VIERZACKIG, damit es den Stern des Panels nicht nachaefft. Ueberall, wo ein Weg
zu einem der Programme fuehrt, steht sein Zeichen daneben.

## Die Bilder

Aufgenommen am 22.08.2026 mit Edge im Kopflos-Betrieb, direkt aus den laufenden
Programmen, nicht nachgezeichnet und nicht geschoent. Das Panel lief dafuer
lokal mit ueberbrueckter Sperre; die Kopie wurde danach geloescht, an
`orion-panel-pro` wurde nichts geaendert.

Neue Bilder ziehen: Seite in einem Rahmen mit fester Hoehe laden, Ausschnitt
ueber `top:-Ypx` waehlen, dann `msedge --headless=new --screenshot`.

## Die Sperre, ehrlich beschrieben

`js/tor.js` prueft den Code **im Browser** gegen einen SHA-256-Abdruck. Das
haelt Neugierige auf, nicht den, der F12 druckt. Deshalb:

* im Repo steht nur der Abdruck, nie der Code,
* die eigentliche Sperre bleibt im Panel selbst (eigenes Kennwort),
* fuer den bezahlten Betrieb wird **nur** die Funktion `pruefeCode()` getauscht,
  sie fragt dann einen Server, der Laufzeit, Geraetezahl und Sperrung kennt.
  Alles andere bleibt stehen.

Codes, die heute gelten: **Vollzugang** (Panel und Protection) und
**Probezugang** (nur Protection). Neue Codes: Abdruck rechnen und in die Liste
`CODES` eintragen.

```bash
python -c "import hashlib;print(hashlib.sha256('NEUERCODE'.encode()).hexdigest())"
```

## Was noch fehlt, bevor Geld verlangt wird

1. **Impressum ausfuellen.** Name, Anschrift, Rechtsform, Register, UID. Ein
   unvollstaendiges Impressum ist abmahnbar.
2. **Preise festlegen** und die Umsatzsteuerlage klaeren (Kleinunternehmer oder
   nicht).
3. **Zahlungsdienstleister** waehlen, Vertrag zur Auftragsverarbeitung
   abschliessen, in der Datenschutzerklaerung eintragen.
4. **Konten und Serversperre** bauen, siehe Tauschstelle oben.
5. **AGB, Widerruf, Datenschutz** einmal anwaltlich pruefen lassen. Die Texte
   hier sind ein sauberer Rahmen, keine Rechtsberatung.
6. Erst danach duerfen die Bestellknoepfe funktionieren.

Alle offenen Stellen sind in den Seiten rot markiert (`class="luecke"`).
Suchbefehl:

```bash
grep -rn "luecke" --include=*.html .
```

## Veroeffentlicht

Live: <https://harryclaude-hub.github.io/orion-start/>
Repo: Harryclaude-hub/orion-start, **oeffentlich**, seit 22.08.2026.

Oeffentlich muss es sein, weil GitHub Pages beim Free-Konto nur oeffentliche
Repos ausliefert. **Erreichbar ist nicht dasselbe wie auffindbar**: `robots.txt`
sperrt alle Suchmaschinen aus, und jede Seite traegt zusaetzlich
`<meta name="robots" content="noindex, nofollow">`. Wer den Link hat, kommt
rein. Wer sucht, findet nichts.

Was daraus folgt und niemand vergessen darf: alles in diesem Repo ist lesbar.
Deshalb steht hier kein Code im Klartext, kein Schluessel und kein Kennwort.
