# Bot-KI — City Baron

---

## 1. PERSÖNLICHKEITEN

Jeder Bot hat eine Persönlichkeit, die alle Entscheidungen gewichtet.

### Aggressiver Investor
- **Ziel:** Schnellstmögliche Expansion
- **Gewichtung:** Kaufen (40 %), Verkaufen (5 %), Kredite (25 %), Sanieren (10 %), Modernisieren (5 %), Bieten (15 %)
- **Risikobereitschaft:** Hoch (nutzt 70–90 % des Kreditlimits)
- **Portfolio:** Gemischt, Fokus auf Wachstums-Bezirke
- **Reaktion auf Gegner:** Greift oft mit Bieterschlachten an

### Spekulant
- **Ziel:** Maximale Kapitalrendite durch Handel
- **Gewichtung:** Kaufen (30 %), Verkaufen (35 %), Kredite (10 %), Sanieren (10 %), Modernisieren (5 %), Bieten (10 %)
- **Risikobereitschaft:** Mittel (nutzt 40–60 % des Kreditlimits)
- **Portfolio:** Bauland, Sanierungsobjekte, niedrig bewertete Immobilien
- **Reaktion auf Gegner:** Zielt auf unterbewertete Objekte

### Defensiver Vermieter
- **Ziel:** Stabiler Cashflow, geringes Risiko
- **Gewichtung:** Kaufen (25 %), Verkaufen (5 %), Kredite (10 %), Sanieren (25 %), Modernisieren (20 %), Bieten (5 %)
- **Risikobereitschaft:** Niedrig (nutzt 10–30 % des Kreditlimits)
- **Portfolio:** Wohnungen, Mehrfamilienhäuser, solide Bezirke
- **Reaktion auf Gegner:** Verteidigt, selten Angriff

### Luxusentwickler
- **Ziel:** Hochpreisige Premium-Immobilien
- **Gewichtung:** Kaufen (30 %), Verkaufen (5 %), Kredite (15 %), Sanieren (15 %), Modernisieren (25 %), Bieten (10 %)
- **Risikobereitschaft:** Mittel-Hoch (nutzt 50–70 %)
- **Portfolio:** Luxuswohnungen, Hotels, Einkaufszentren
- **Reaktion auf Gegner:** Greift Prestige-Bezirke aggressiv

### Schnäppchenjäger
- **Ziel:** Immobilien unter Marktwert erwerben
- **Gewichtung:** Kaufen (35 %), Verkaufen (15 %), Kredite (10 %), Sanieren (15 %), Modernisieren (5 %), Bieten (20 %)
- **Risikobereitschaft:** Mittel (nutzt 30–60 %)
- **Portfolio:** Alles, was unterbewertet ist
- **Reaktion auf Gegner:** Wartet auf Zwangsversteigerungen

### Risiko-Investor
- **Ziel:** Massive Hebelwirkung durch Kredite
- **Gewichtung:** Kaufen (35 %), Verkaufen (10 %), Kredite (35 %), Sanieren (5 %), Modernisieren (5 %), Bieten (10 %)
- **Risikobereitschaft:** Extrem (nutzt 90–100 % des Kreditlimits)
- **Portfolio:** Spekulative Objekte (Bauland, Sanierung)
- **Reaktion auf Gegner:** Geht volles Risiko, alles oder nichts

---

## 2. ENTSCHEIDUNGSALGORITHMUS

```
Pro Runde für jeden Bot:

1. Status erfassen (Kapital, Verschuldung, Portfolio, Marktlage)
2. Persönlichkeitsgewichtete Ziele setzen
3. Bewertung aller verfügbaren Aktionen:
   a. Für jede mögliche Aktion: Nutzen berechnen
   b. Kosten + Risiko abziehen
   c. Persönlichkeitsgewicht anwenden
4. Aktion mit höchstem Score ausführen
5. Bei Gleichstand: Zufällig wählen (Glaubwürdigkeit)
```

### Bewertungsfunktion
```
Score(Aktion) = (Ertragserwartung × Persönlichkeitsfaktor) − (Risiko × Risikoaversion) + (StrategischerWert × 0.5) + Rauschen
```

- **Rauschen:** -10 % bis +10 % (macht Bots menschlicher)
- **Fehlerrate nach Schwierigkeit:** Leicht 20 %, Normal 5 %, Schwer 0 %

---

## 3. KEIN CHEATING

- Bots starten mit demselben Kapital wie der Spieler
- Bots haben dieselben Kreditlimits und Zinsen
- Bots zahlen dieselben Steuern und Gebühren
- Bots verlieren bei falschen Entscheidungen echtes Geld
- Bots können bankrott gehen und aus dem Spiel ausscheiden
- Bots sehen nur öffentliche Informationen (keine versteckten Spieler-Daten)
- Einzige "Bevorzugung": Bots können ihre Aktionen gleichzeitig ausführen (nicht nacheinander)

---

## 4. BOT-VERHALTEN IN SPEZIALSITUATIONEN

| Situation | Verhalten |
|-----------|-----------|
| **Liquiditätsengpass** | Immobilie verkaufen oder Kredit aufnehmen (abhängig von Persönlichkeit) |
| **Boom-Phase** | Aggressivere Bots kaufen mehr, defensive halten |
| **Crash** | Schnäppchenjäger kaufen ein, andere verkaufen |
| **Bedrohung durch Gegner** | Abwehrmaßnahmen (Imagekampagne, Gericht) |
| **Hohe Bonität** | Mehr Kredit aufnehmen für Expansion |
| **Niedrige Bonität** | Kredite tilgen, Cashflow verbessern |
| **Fast gewonnen** | Aggressiv aufs Monopol gehen |