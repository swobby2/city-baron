import { useState } from 'react';

interface Props {
  onStart: (name: string, bots: number) => void;
  loading: boolean;
  error: string | null;
}

export default function MainMenu({ onStart, loading, error }: Props) {
  const [playerName, setPlayerName] = useState('Marcel');
  const [botCount, setBotCount] = useState(3);

  return (
    <div className="main-menu">
      <div className="menu-card">
        <div className="logo">
          <div className="logo-icon">🏙️</div>
          <h1>City Baron</h1>
          <p className="subtitle">Immobilien-Tycoon — Baue dein Imperium</p>
        </div>

        <div className="menu-form">
          <div className="form-group">
            <label>Dein Name</label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Spielername"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>Anzahl Gegner (Bots)</label>
            <div className="bot-selector">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`bot-btn ${botCount === n ? 'active' : ''}`}
                  onClick={() => setBotCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            className="start-btn"
            onClick={() => onStart(playerName, botCount)}
            disabled={loading || !playerName.trim()}
          >
            {loading ? '🎲 Erstelle Spiel...' : '🏙️ Spiel starten'}
          </button>

          {error && <div className="error-msg">{error}</div>}
        </div>

        <div className="menu-footer">
          <p>Ein Immobilien-Tycoon für den Browser</p>
          <p className="hint">Singleplayer • 20–45 Min. pro Spiel • Bots mit KI</p>
        </div>
      </div>
    </div>
  );
}