# UI-Konzept — City Baron

---

## 1. LAYOUT-STRUKTUR

```
┌──────────────────────────────────────────────────────────┐
│   [Logo]  [Ressourcen-Leiste]               [Menü] [Sound] │
│           Kapital | Cashflow | Einfluss | Image          │
├────────────────────┬─────────────────────────────────────┤
│                    │                                     │
│   ┌──────────────┐│   ┌─────────────────────────────┐   │
│   │   STADTKARTE  ││   │     PORTFOLIO / AKTIONEN    │   │
│   │               ││   │                             │   │
│   │   Zoombare    ││   │  ▪ Meine Immobilien         │   │
│   │   Bezirks-    ││   │  ▪ Marktübersicht           │   │
│   │   Übersicht   ││   │  ▪ Bank                     │   │
│   │               ││   │  ▪ Gegner                   │   │
│   │               ││   │                             │   │
│   │               ││   │  ┌──────────────────────┐   │   │
│   │               ││   │  │ AKTIONS-BUTTONS      │   │   │
│   │               ││   │  │ [Kaufen] [Bauen]     │   │   │
│   │               ││   │  │ [Sanieren] [Verkauf] │   │   │
│   │               ││   │  └──────────────────────┘   │   │
│   └──────────────┘│   └─────────────────────────────┘   │
│                    │                                     │
├────────────────────┴─────────────────────────────────────┤
│   [Event-Log]  [Runden-Zähler]  [Runde beenden]         │
└──────────────────────────────────────────────────────────┘
```

---

## 2. FARBSCHEMA

| Element | Farbe | Hex |
|---------|-------|-----|
| Hintergrund | Dunkelgrau | #1a1a2e |
| Kartenhintergrund | Hellgrau | #16213e |
| Primär (Aktionen) | Gold | #e2b714 |
| Sekundär (Info) | Blau | #0f3460 |
| Erfolg (Einnahmen) | Grün | #00b894 |
| Gefahr (Verlust) | Rot | #e17055 |
| Neutral | Weiß | #dfe6e9 |
| Besitz (eigene) | Gold | rgba(226, 183, 20, 0.3) |
| Besitz (Gegner) | Rot/Blau | pro Spieler |

---

## 3. KARTENANSICHT

### Bezirks-Darstellung
- Jeder Bezirk als farbiges Polygon auf der Stadtkarte
- Farbe zeigt aktuelle Nachfrage (Heatmap)
- Eigene Grundstücke golden markiert
- Gegner-Grundstücke in deren Farbe

### Interaktion
- **Klicken** auf Bezirk → Detailansicht öffnen
- **Scrollen** → Zoom
- **Ziehen** → Karte verschieben
- **Hover** über Grundstück → Tooltip mit Info

### Heatmap-Overlays (umschaltbar):
- Nachfrage
- Prestige
- Gewinn
- Kriminalität
- Marktwerte
- Cashflow-Renderite

---

## 4. RESSOURCEN-LEISTE (HUD)

```
┌─────────────────────────────────────────────────────┐
│ 💰 245.000 €  │  💳 +3.200 €/Rd  │  ⭐ 45/100 Bon. │
│  📊 12.5% MA  │  🏦 50.000 Limit │  📰 68/100 Img. │
└─────────────────────────────────────────────────────┘
```

- Links: Kapital (wichtigste Zahl, größte Schrift)
- Balken zeigen Prozente farbig an (grün > 50 %, gelb 20–50 %, rot < 20 %)
- Bei negativem Cashflow: roter Blink-Effekt

---

## 5. AKTIONS-PANEL

### Kaufen-Dialog
```
┌─────────────────────────────────┐
│  Bezirk auswählen ▼             │
│  Verfügbare Grundstücke:         │
│  ┌───┬────────────┬──────┬────┐ │
│  │ # │ Typ        │ Preis│ A  │ │
│  ├───┼────────────┼──────┼────┤ │
│  │ 1 │ Bauland    │ 12k  │ [K]│ │
│  │ 2 │ Wohnung    │ 28k  │ [K]│ │
│  │ 3 │ Sanierung  │ 8k   │ [K]│ │
│  └───┴────────────┴──────┴────┘ │
│  [Bieterschlacht starten]        │
└─────────────────────────────────┘
```

### Bauen-Dialog
```
┌─────────────────────────────────┐
│  Eigenes Grundstück #3 wählen   │
│  ┌─ Verfügbare Gebäude ──────┐  │
│  │ ● Wohnung        25.000 € │  │
│  │ ○ Mehrfamilienh. 60.000 € │  │
│  │ ○ Büro          80.000 €  │  │
│  │ ○ Hotel         150.000 € │  │
│  └───────────────────────────┘  │
│  Geschätzte Miete: 1.200 €/Rd   │
│  [Bauen]                         │
└─────────────────────────────────┘
```

---

## 6. EVENT-BENACHRICHTIGUNG

```
╔══════════════════════════════════╗
║  🚇 NEUE U-BAHN IN MITTE        ║
║  Der Bezirk Mitte erhält eine    ║
║  neue U-Bahn-Station!            ║
║  +30 Verkehr, +15 Prestige      ║
║  Grundstückspreise steigen!     ║
╚══════════════════════════════════╝
```

- Events erscheinen als modales Overlay
- Nach 3 Sekunden automatisch ausblendbar
- Können im Event-Log nachgesehen werden

---

## 7. GEGNER-ÜBERSICHT

```
┌─────────────────────────────────┐
│  Rang │ Name        │ MA% │ €   │
│  1 🥇 │ Aggro-Invest│ 28% │ 320k│
│  2 🥈 │ DU          │ 18% │ 210k│
│  3 🥉 │ Luxus-Lisa  │ 15% │ 180k│
│  4    │ Spekulant S.│ 12% │ 150k│
└─────────────────────────────────┘
```

- Fester Tab im rechten Panel
- Zeigt: Rang, Name, Marktanteil, Vermögen
- Klick auf Gegner → Detaillierte Analyse (Portfolio-Schätzung)

---

## 8. MODERNE UI-PRINZIPIEN

- **Skeuomorphismus im Minimalismus:** Immobilien-Icons, Stadtkarte als Stilisierung
- **Mikro-Animationen:** Beim Kauf/Verkauf, Cashflow-Änderungen (fließende Zahlen)
- **Data-Vis:** Balken, Tortendiagramme für Portfolio-Verteilung
- **Responsive:** Desktop-first, aber Tablet-kompatibel
- **Tooltip-Overlay:** Überall Hover-Infos
- **Shortcuts:** Tastatur für Aktionen (1-9 für schnelle Aktionen)

---

## 9. SPEZIALANSICHTEN

### 9.1 Bank-Interface
- Kredit aufnehmen / tilgen
- Bonitätsanzeige (Balken)
- Zinsentwicklung (Chart)
- Refinanzierungs-Option

### 9.2 Quartiers-Übersicht
- Alle eigenen Immobilien in einem Bezirk
- Synergie-Bonus-Anzeige
- Nächster Meilenstein (5/10/20/50/100 Grundstücke)

### 9.3 Marktbericht (pro Runde)
- Preisänderungen Zusammenfassung
- Top-Gewinner/Verlierer Bezirke
- Event-Historie
- Eigene Performance