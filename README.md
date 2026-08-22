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
css/front.css         DESIGN-SCHICHT, loeschbar. Ohne sie bleibt alles lesbar.
js/tor.js             LOGIK der Sperre. Eine Tauschstelle fuer den Serverbetrieb.
schrift/              Rajdhani und Share Tech Mono, selbst gehostet
bilder/               Bildschirmfotos vom 22.08.2026, aus dem laufenden Betrieb
```

## Die Schichten, getrennt gehalten

* **Design**: `css/front.css`. Wer die Datei loescht, hat nackte, aber
  vollstaendig lesbare Seiten. Kein Text, kein Link und keine Sperre haengt
  daran. Keine Animation ausser Hover.
* **Logik**: `js/tor.js`. Nur die Sperre, sonst nichts. Keine Datenabfrage,
  kein Supabase, keine Bridge.
* **Inhalt**: die HTML-Dateien selbst.

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

## Veroeffentlichen

Noch nicht geschehen. Vorgesehen ist ein eigenes Repo und spaeter eine eigene
Domain. Solange nichts gepusht ist, aendert diese Seite an den beiden laufenden
Programmen nichts.
