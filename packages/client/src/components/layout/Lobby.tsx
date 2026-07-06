import { useState, useEffect } from 'react';

interface Room {
  id: string;
  name: string;
  players: number;
  playerList: { name: string; type: string; marketShare: number }[];
  turn: number;
  phase: string;
  state: string;
  createdAt: string;
}

interface Props {
  playerName: string;
  onNameChange: (name: string) => void;
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (bots: number) => void;
  loading: boolean;
  error: string | null;
}

export default function Lobby({ playerName, onNameChange, onJoinRoom, onCreateRoom, loading, error }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [botCount, setBotCount] = useState(3);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/lobby');
      const data = await res.json();
      if (data.rooms) setRooms(data.rooms);
    } catch {}
  };

  const activeRooms = rooms.filter(r => r.state === 'RUNNING');
  const finishedRooms = rooms.filter(r => r.state === 'FINISHED');

  return (
    <div className="lobby">
      <div className="lobby-inner">
        {/* Header */}
        <div className="lobby-header">
          <div className="lobby-logo">
            <span className="lobby-icon">🏙️</span>
            <h1>City Baron</h1>
            <p className="lobby-subtitle">Immobilien-Tycoon — Baue dein Imperium</p>
          </div>
        </div>

        <div className="lobby-content">
          {/* Left: Player Setup */}
          <div className="lobby-setup">
            <div className="setup-card">
              <h3>👤 Dein Name</h3>
              <input
                type="text"
                value={playerName}
                onChange={e => onNameChange(e.target.value)}
                placeholder="Spielername"
                maxLength={20}
              />
            </div>

            <div className="setup-card">
              <h3>🤖 Gegner (Bots)</h3>
              <div className="bot-selector lobby-bots">
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
              className="create-btn"
              onClick={() => onCreateRoom(botCount)}
              disabled={loading || !playerName.trim()}
            >
              {loading ? '🎲 Erstelle...' : '🚀 Neues Spiel starten'}
            </button>

            {error && <div className="error-msg">{error}</div>}
          </div>

          {/* Right: Room List */}
          <div className="lobby-rooms">
            <h3>🕹️ Aktive Räume ({activeRooms.length})</h3>

            {activeRooms.length === 0 && (
              <div className="no-rooms">
                <p>Keine aktiven Spiele.</p>
                <p className="hint">Erstelle ein neues Spiel oder warte auf andere Spieler!</p>
              </div>
            )}

            <div className="room-list">
              {/* 3 featured rooms that always exist visually */}
              {[
                { id: 'new-1', num: 1, name: 'Raum 1', color: '#00b894' },
                { id: 'new-2', num: 2, name: 'Raum 2', color: '#e2b714' },
                { id: 'new-3', num: 3, name: 'Raum 3', color: '#e17055' },
              ].map(featured => {
                const occupied = activeRooms.find(r => r.name.includes(`Raum ${featured.num}`) || r.name.includes(featured.name));
                return (
                  <div key={featured.id} className="room-card" style={{ borderLeftColor: featured.color }}>
                    <div className="room-header">
                      <span className="room-name" style={{ color: featured.color }}>🎮 {featured.name}</span>
                      <span className="room-status">
                        {occupied ? `Runde ${occupied.turn}` : '🟢 Bereit'}
                      </span>
                    </div>
                    <div className="room-players">
                      {occupied ? (
                        occupied.playerList.map((p, i) => (
                          <span key={i} className={`room-player ${p.type === 'HUMAN' ? 'human' : 'bot'}`}>
                            {p.type === 'HUMAN' ? '👤' : '🤖'} {p.name}
                          </span>
                        ))
                      ) : (
                        <span className="room-empty">Leer — noch kein Spiel</span>
                      )}
                    </div>
                    <div className="room-footer">
                      <span className="room-info">
                        {occupied ? `${occupied.players} Spieler · ${occupied.phase}` : `${botCount} Bots`}
                      </span>
                      <button
                        className="join-btn"
                        onClick={() => occupied ? onJoinRoom(occupied.id) : onCreateRoom(botCount)}
                        disabled={loading}
                      >
                        {occupied ? '🔁 Beitreten' : '🚀 Starten'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {finishedRooms.length > 0 && (
              <div className="finished-section">
                <h4>📜 Abgeschlossen</h4>
                {finishedRooms.slice(0, 5).map(r => (
                  <div key={r.id} className="finished-room">
                    <span>{r.name}</span>
                    <span>{r.turn} Runden · {r.players} Spieler</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lobby-footer">
          <p>Singleplayer mit KI-Bots • 20–45 Min. pro Spiel • Multiplayer in Entwicklung</p>
        </div>
      </div>
    </div>
  );
}