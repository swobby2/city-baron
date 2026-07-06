# Immobilien-Tycoon — Game Design Document

> **Arbeitstitel:** *City Baron*
> **Inspiration:** OpenFront (Designprinzipien), Monopoly (Setting-Grundidee)
> **Genre:** Wirtschafts-Strategie-Browsergame (Rundenlos, Echtzeit mit Pausen-Möglichkeit)
> **Spieler:** 1 (Singleplayer mit Bots) → später Multiplayer (2–6)
> **Rundendauer:** 20–45 Minuten
> **Plattform:** Browser (React + Node.js)

---

## 1. KERN-IDEE

Der Spieler baut einen Immobilienkonzern in einer dynamischen Stadt auf. Ziel ist die Marktbeherrschung (80 % Marktanteil) oder der Bankrott aller Gegner. Die Stadt besteht aus Bezirken mit eigenen Eigenschaften, die sich dynamisch entwickeln.

**Design-Philosophie:** Schnelle Entscheidungen, permanentes Wachstum, Expansion, Wettbewerb, Risiko, wirtschaftlicher Snowball-Effekt, Comeback-Möglichkeiten, hoher Wiederspielwert, leicht zu lernen / schwer zu meistern.

---

## 2. SPIELZUSTAND & GEWINNBEDINGUNGEN

### Siegbedingungen (eine reicht):
1. **Marktbeherrschung** — 80 % des gesamten Immobilienmarktwerts kontrollieren
2. **Monopolstellung** — 60 % aller Grundstücke in 3 Bezirken besitzen
3. **Konkurs der Konkurrenz** — Alle anderen Spieler/Bots sind bankrott

### Niederlage:
- Eigenes Vermögen fällt unter 0 und Kreditlimit ist ausgeschöpft → Zwangsversteigerung aller Besitztümer

---

## 3. SPIELWELT: DIE STADT

### Bezirke (12–18 Stück pro Spiel)

Jeder Bezirk hat diese Attribute:

| Attribut | Bereich | Beschreibung |
|----------|---------|-------------|
| **Nachfrage** | 0–100 | Wie begehrt sind Immobilien hier |
| **Prestige** | 0–100 | Sozialer Status des Bezirks |
| **Kriminalität** | 0–100 | Sicherheitslage |
| **Verkehr** | 0–100 | Verkehrsanbindung |
| **Wachstum** | -5 bis +5 | Bevölkerungsentwicklung pro Runde |
| **Mietniveau** | 1–10 | Durchschnittliche Miete/qm |
| **Grundstückspreis** | dynamisch | Marktpreis pro Grundstück |
| **Fläche** | 8–20 | Anzahl verfügbarer Grundstücke |

### Dynamik:
- Bezirke verändern sich durch Spieleraktionen, Events und Marktzyklen
- Investitionen in einem Bezirk steigern Prestige, senken Kriminalität, erhöhen Nachfrage
- Gentrifizierung: Aufgewertete Bezirke verdrienen einkommensschwache Mieter → geringere Auslastung bei günstigen Wohnungen

---

## 4. RESSOURCEN

| Ressource | Beschreibung |
|-----------|-------------|
| **Kapital** | Bargeld, frei verfügbar |
| **Cashflow** | Einnahmen - Ausgaben pro Runde |
| **Bonität** | 0–100, bestimmt Kreditlimit und Zinsen |
| **Einfluss** | 0–100, ermöglicht Lobbyismus und Sonderaktionen |
| **Image** | 0–100, beeinflusst Mieterzufriedenheit und Preise |
| **Marktanteil** | 0–100 %, Anteil am Gesamtmarkt |
| **Liquidität** | Verfügbares Kapital + Kreditreserve |
| **Kreditlimit** | Maximaler Kreditrahmen (abhängig von Bonität + Vermögen) |

---

## 5. IMMOBILIENTYPEN

| Typ | Kosten | Miete | Unterhalt | Risiko | Besonderheit |
|-----|--------|-------|-----------|--------|-------------|
| **Wohnung** | Niedrig | Niedrig | Niedrig | Gering | Stabile Nachfrage |
| **Mehrfamilienhaus** | Mittel | Mittel | Mittel | Gering | Skalierbar |
| **Luxuswohnung** | Hoch | Sehr hoch | Hoch | Mittel | Prestige-abhängig |
| **Büro** | Hoch | Hoch | Mittel | Mittel | Gewerbezyklen |
| **Hotel** | Sehr hoch | Variabel | Hoch | Hoch | Tourismus-abhängig |
| **Lagerhalle** | Niedrig | Niedrig | Niedrig | Gering | Stabile Mieteinnahmen |
| **Einkaufszentrum** | Extrem hoch | Sehr hoch | Sehr hoch | Hoch | Synergie-Bonus in Zentren |
| **Industrie** | Mittel | Mittel | Sehr hoch | Hoch | Hohe Kriminalität |
| **Bauland** | Variabel | 0 | 0 | Gering | Spekulationsobjekt |
| **Sanierungsobjekt** | Günstig | 0 | Hoch | Hoch | Große Wertsteigerung möglich |

### Immobilien-Attribute:
- **Kaufpreis** — aktueller Marktpreis
- **Marktwert** — tatsächlicher Wert (kann von Kaufpreis abweichen)
- **Unterhalt** — laufende Kosten pro Runde
- **Miete** — aktuelle Mieteinnahmen
- **Auslastung** — 0–100 %, wie gut vermietet
- **Zustand** — 0–100 %, verschlechtert sich über Zeit
- **Prestige** — 0–100, beeinflusst Mietpreise

---

## 6. SPIELMECHANIKEN

### Aktionen pro Runde:
1. **Kaufen** — Grundstück/Immobilie erwerben (Verhandlung/Bieterschlacht)
2. **Bauen** — Neues Gebäude auf eigenem Grundstück errichten
3. **Sanieren** — Zustand verbessern
4. **Modernisieren** — Prestige/Ausstattung verbessern
5. **Vermieten** — Mieter finden (abhängig von Nachfrage)
6. **Verkaufen** — Immobilie veräußern
7. **Kredit aufnehmen/tilgen** — Bankgeschäfte
8. **Portfolio optimieren** — Mischung anpassen

### Synergie-System (Quartiersbonus):
| Grundstücke im Bezirk | Bonus |
|----------------------|-------|
| 5 | +10 % Einnahmen |
| 10 | Hausverwaltung (automatische Vermietung, -10 % Leerstand) |
| 20 | Quartiersbonus (alle Immobilien +20 % Prestige) |
| 50 | Großprojekt (spezielles Bezirks-Gebäude errichtbar) |
| 100 | Skyline-Projekt (Wahrzeichen, +30 % Einnahmen im gesamten Bezirk) |

---

## 7. WIRTSCHAFTSSYSTEM

### Dynamische Preise:
- Grundstückspreise basieren auf: Lage, Nachfrage, Prestige, Kriminalität, Verkehr
- Preis-Formel: `Basispreis × (1 + (Nachfrage − Kriminalität) / 100) × (Prestige / 50) × (1 + (Verkehr − 50) / 100)`

### Marktzyklen:
| Phase | Dauer | Effekt |
|-------|-------|--------|
| **Boom** | 3–7 Runden | +30 % Preise, +40 % Nachfrage, günstige Kredite |
| **Stabil** | 5–15 Runden | Normale Werte |
| **Rezession** | 4–10 Runden | −25 % Preise, −30 % Nachfrage, hohe Leerstände |
| **Crash** | 1–3 Runden | −50 % Preise, Zwangsversteigerungen, Bankenpleiten |

### Steuern & Gebühren:
- Grundsteuer: 2 % des Immobilienwerts pro Runde
- Gewerbesteuer: 15 % der Mieteinnahmen
- Grunderwerbsteuer: 3,5 % beim Kauf

### Inflation:
- +1–3 % pro Runde auf alle Preise
- Mieten steigen langsamer (+0,5–1,5 %)

---

## 8. BANK- & KREDITSYSTEM

| Bonität | Kreditlimit (als % des Vermögens) | Zinssatz |
|---------|-----------------------------------|----------|
| 0–20 | 10 % | 18 % |
| 21–40 | 25 % | 12 % |
| 41–60 | 50 % | 8 % |
| 61–80 | 80 % | 5 % |
| 81–100 | 100 % | 3 % |

- **Refinanzierung:** Bestehende Kredite zu besseren Konditionen umschulden
- **Liquiditätsprobleme:** Bei negativem Cashflow > 3 Runden → Mahnung → Zwangsversteigerung
- **Notverkauf:** Spieler kann Immobilien unter Marktwert sofort verkaufen (50–70 %)
- **Zwangsversteigerung:** Die günstigste Immobilie wird versteigert (Startpreis 60 % Marktwert)

---

## 9. WIRTSCHAFTLICHE KAMPFMECHANIKEN

| Mechanik | Beschreibung | Kosten |
|----------|-------------|-------|
| **Feindliche Übernahme** | Aktien eines Gegners aufkaufen | Sehr hoch |
| **Preisdumping** | Mieten senken, um Mieter abzuwerben | Einnahmeverlust |
| **Mieter abwerben** | Bonus anbieten für Umzug | Mittel |
| **Grundstücke aufkaufen** | Gezielt strategische Grundstücke ersteigern | Hoch |
| **Bieterschlacht** | Preis hochtreiben, um Gegner zu schwächen | Risiko |
| **Lobbyismus** | Politik beeinflussen (neue U-Bahn, Steuern) | Einfluss |
| **Gerichtsverfahren** | Gegner verklagen (Bauverzögerung) | Mittel + Einfluss |
| **Imagekampagne** | Eigenes Image verbessern / Gegner-Image senken | Mittel |
| **Luxussanierung** | Extrem aufwerten → Gentrifizierung im Bezirk | Sehr hoch |
| **Quartiersentwicklung** | Komplettes Viertel kaufen und entwickeln | Extrem hoch |
| **Marktmanipulation** | Gerüchte streuen, Kurse beeinflussen | Einfluss |
| **Zwangsversteigerung triggern** | Gegner gezielt in Liquiditätsprobleme treiben | Strategisch |

---

## 10. EVENTS

| Event | Auswirkung | Häufigkeit |
|-------|-----------|------------|
| **Boom** | Alle Preise +30 % | Selten |
| **Crash** | Alle Preise −50 %, Zwangsversteigerungen | Selten |
| **Neue U-Bahn** | Ein Bezirk +40 Verkehr, +20 Prestige, +30 % Preise | Sehr selten |
| **Bahnhof** | Ein Bezirk +30 Verkehr, +10 Prestige, +20 % Preise | Sehr selten |
| **Flughafen** | Zufälliger Bezirk +50 Verkehr, +30 Prestige | Extrem selten |
| **Großkonzern zieht zu** | Ein Bezirk +30 Nachfrage, +20 Prestige | Selten |
| **Förderungen** | Baukosten −30 % für 2 Runden | Gelegentlich |
| **Steueränderungen** | +/−10 % auf alle Steuern | Gelegentlich |
| **Wohnungsnot** | +50 % Mieteinnahmen, +40 % Nachfrage für 3 Runden | Gelegentlich |
| **Skandal** | Ein Spieler verliert −20 Image | Selten |
| **Korruption** | Ein Spieler verliert −20 Einfluss | Selten |
| **Feuer** | Immobilie verliert −80 % Zustand | Selten |
| **Hochwasser** | Betroffener Bezirk: −30 Prestige, −20 Nachfrage | Selten |
| **Naturkatastrophe** | Mehrere Immobilien schwer beschädigt | Extrem selten |
| **Kriminalitätsanstieg** | Bezirk +20 Kriminalität, −20 Prestige | Gelegentlich |

---

## 11. BOT-KI

### Bot-Persönlichkeiten:
1. **Aggressiver Investor** — kauft schnell, hohe Verschuldung, viele Bieterschlachten
2. **Spekulant** — kauft Bauland und Sanierungsobjekte, verkauft mit Gewinn
3. **Defensiver Vermieter** — solides Portfolio, wenig Risiko, gleichmäßiges Wachstum
4. **Luxusentwickler** — fokussiert auf Luxusimmobilien und Prestige-Bezirke
5. **Schnäppchenjäger** — kauft nur bei Unterbewertung, wartet auf Zwangsversteigerungen
6. **Risiko-Investor** — hohe Verschuldung, spekuliert auf Booms

**Kein Cheating:** Bots haben dieselben Regeln, Ressourcen und Limits wie der Spieler. Sie treffen Entscheidungen basierend auf ihrer Persönlichkeit + aktueller Marktlage.

---

## 12. COMEBACK-MECHANIKEN

1. **Zwangsversteigerungs-Schnäppchen** — Bankrotte Spieler sehen alle Gebote und können das beste Schnäppchen machen
2. **Investor-Notfall-Kredit** — Einmal pro Spiel: 10.000 € zu hohen Zinsen (15 %)
3. **Einzige Immobilie behalten** — Bei Zwangsversteigerung bleibt eine Wohnung verschont
4. **Gläubigerschutz** — 2 Runden Schonfrist nach Unterschreiten von 0 €
5. **Catch-up-Bonus** — Spieler unter 10 % Marktanteil erhalten +20 % Mieteinnahmen

---

## 13. BALANCING-PRINZIPIEN

- Keine dominante Strategie: Aggressiv, defensiv, spekulativ und langfristig müssen alle gewinnen können
- Große Spieler sind nicht unaufhaltbar: Höhere Unterhaltskosten, schwerere Verwaltung, Angriffsziele
- Der Markt bestraft Überexpansion: Zu viele Kredite → Liquiditätsrisiko
- Comeback-Mechaniken verhindern vorzeitiges Aufgeben
- Jede Entscheidung sollte ein Risiko-Ertrags-Verhältnis haben

---

## 14. SPIELABLAUF (Typische Runde)

1. **Rundenbeginn** — Mieteinnahmen, Unterhaltskosten, Zinszahlungen werden automatisch verbucht
2. **Status-Update** — Marktbericht mit Preisänderungen, neuen Events
3. **Events** — Zufallsereignisse werden angezeigt
4. **Spieleraktionen** — Spieler kauft, baut, saniert, vermietet, handelt
5. **Bot-Aktionen** — Bots führen ihre Züge aus (gleichzeitig)
6. **Rundenende** — Markt berechnet neue Preise, Nachfrage, etc.
7. **Nächste Runde** — Wiederholen

---