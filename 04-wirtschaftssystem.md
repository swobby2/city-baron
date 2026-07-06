# Wirtschaftssystem — City Baron

---

## 1. GRUNDLEGENDE FORMELN

### 1.1 Grundstückspreis (pro Plot)
```
Grundpreis = District.baseLandPrice × (1 + (Demand − Crime) / 100) × (Prestige / 50) × (1 + (Traffic − 50) / 100) × MarktPhaseMultiplikator
```

**Marktphasen-Multiplikator:**
| Phase | Multiplikator |
|-------|--------------|
| Boom | 1.3 |
| Normal | 1.0 |
| Rezession | 0.75 |
| Crash | 0.5 |

### 1.2 Marktwert einer Immobilie
```
Marktwert = Grundpreis × TypMultiplikator × (Condition / 100) × (1 + 0.02 × UpgradeLevel) × BezirksSynergieBonus
```

**Typ-Multiplikatoren:**
| Typ | Multiplikator |
|-----|--------------|
| Wohnung | 0.8–1.2 |
| Mehrfamilienhaus | 1.0–1.5 |
| Luxuswohnung | 1.5–3.0 |
| Büro | 1.2–2.0 |
| Hotel | 1.5–3.5 |
| Lagerhalle | 0.5–0.8 |
| Einkaufszentrum | 3.0–5.0 |
| Industrie | 0.8–1.5 |
| Bauland | 0.3–1.0 |
| Sanierungsobjekt | 0.3–0.6 |

### 1.3 Mieteinnahmen (pro Runde)
```
Miete = Marktwert × Mietrendite × (Occupancy / 100) × (1 + BonusMultiplikator)
```

**Mietrenditen (Basis, annualisiert):**
| Typ | Rendite |
|-----|---------|
| Wohnung | 5 % |
| Mehrfamilienhaus | 5.5 % |
| Luxuswohnung | 3 % |
| Büro | 6 % |
| Hotel | 7 % (volatil) |
| Lagerhalle | 8 % |
| Einkaufszentrum | 4 % |
| Industrie | 7 % |
| Bauland | 0 % |
| Sanierungsobjekt | 2 % |

**Pro Runde:** Jahresrendite / 10 (10 Runden = 1 Jahr)

### 1.4 Unterhaltskosten (pro Runde)
```
Unterhalt = Kaufpreis × Unterhaltssatz × (1 + 0.5 × (1 − Condition / 100))
```

**Unterhaltssätze:**
| Typ | Satz (pro Runde) |
|-----|-----------------|
| Wohnung | 0.15 % |
| Mehrfamilienhaus | 0.20 % |
| Luxuswohnung | 0.30 % |
| Büro | 0.25 % |
| Hotel | 0.40 % |
| Lagerhalle | 0.10 % |
| Einkaufszentrum | 0.35 % |
| Industrie | 0.30 % |
| Bauland | 0.02 % |
| Sanierungsobjekt | 0.50 % |

### 1.5 Cashflow (pro Runde)
```
Cashflow = Mieteinnahmen − Unterhalt − Zinszahlungen − Steuern
```

---

## 2. WERTENTWICKLUNG

### 2.1 Zustands-Verschlechterung
```
Condition -= Rundenabnutzung × (1 − Wartungsfaktor / 100)
```

- Basis-Abnutzung pro Runde: 0.5–2 % je nach Typ
- Abnutzung ist höher bei schlechten Bezirken (+20 % bei Kriminalität > 70)
- Durch Sanierung kann Condition verbessert werden

### 2.2 Sanierungskosten
```
Sanierungskosten = Marktwert × 0.1 × (zu verbessernde Prozentpunkte / 100)
```

- Maximal: Condition von X % auf 100 % bringen
- Dauer: 1 Runde

### 2.3 Modernisierungskosten
```
Modernisierungskosten = Marktwert × 0.15 × (UpgradeLevel + 1)
```

- Erhöht UpgradeLevel um 1
- Erhöht Prestige um 5–10
- Steigert Miete um 5–10 %

---

## 3. BONITÄT & KREDITE

### 3.1 Bonitätsberechnung
```
Bonität = min(100, max(0,
    (Vermögen / Durchschnittsvermögen) × 30 +
    Image × 0.2 +
    Cashflow-Bonus (max 20) +
    Portfolio-Diversifikation (max 20)
))
```

### 3.2 Kreditlimit
```
Kreditlimit = max(50000, Gesamtvermögen × (Bonität × KreditLimitFaktor))
```

### 3.3 Kreditkonditionen
| Bonität | Zinssatz (pro Runde) | Limit-Faktor |
|---------|---------------------|-------------|
| 0–20 | 1.5 % (18 % p.a.) | 0.10 |
| 21–40 | 1.0 % (12 % p.a.) | 0.25 |
| 41–60 | 0.67 % (8 % p.a.) | 0.50 |
| 61–80 | 0.42 % (5 % p.a.) | 0.80 |
| 81–100 | 0.25 % (3 % p.a.) | 1.00 |

---

## 4. STEUERN

| Steuer | Satz | Basis |
|--------|------|-------|
| Grundsteuer | 0.2 % | Marktwert aller Immobilien (pro Runde) |
| Gewerbesteuer | 1.5 % | Mieteinnahmen (pro Runde) |
| Grunderwerbsteuer | 3.5 % | Kaufpreis (einmalig) |

---

## 5. BEZIRKS-SYNERGIEN (Quartiersbonus)

| Grundstücke | Bonus | Effekt |
|------------|-------|--------|
| 5 | Einkommensbonus | +10 % Mieteinnahmen im Bezirk |
| 10 | Hausverwaltung | Automatische Vermietung, −10 % Leerstand |
| 20 | Quartiersbonus | +20 Prestige für alle eigenen Immobilien |
| 50 | Großprojekt | Spezial-Gebäude errichtbar (Bezirks-wahrzeichen) |
| 100 | Skyline-Projekt | +30 % Einnahmen im gesamten Bezirk |

---

## 6. INFLATION

- Pro Runde: +0.2–0.3 % Inflation auf alle Preise
- Mieten steigen nur um 50 % der Inflationsrate
- Der Effekt ist kumulativ über das gesamte Spiel

---

## 7. MIETZYKLUS & NACHFRAGE

Jede Runde wird die Auslastung (Occupancy) neu berechnet:

```
Occupancy = max(0, min(100,
    60 + (Demand / 2) − (Miete / Marktmiete × 30) − (Crime / 5) + (Prestige / 5)
))
```

- Ist Miete zu hoch → sinkt Auslastung
- Ist Kriminalität hoch → sinkt Auslastung
- Ist Prestige hoch → steigt Auslastung
- Mindestens 10 % Leerstand in jedem Fall (Fluktuation)

---

## 8. SPIELER-WACHSTUMSKURVE

| Phase | Marktanteil | Charakteristik |
|-------|-------------|---------------|
| **Early Game** | 0–10 % | Leichter Einstieg, günstige Grundstücke, viele Chancen |
| **Mid Game** | 10–40 % | Spürbare Konkurrenz, erste Bieterschlachten |
| **Late Game** | 40–70 % | Harte Kämpfe um verbleibende Grundstücke |
| **End Game** | 70–100 % | Monopol-Kampf, extreme Gegner-Reaktionen |