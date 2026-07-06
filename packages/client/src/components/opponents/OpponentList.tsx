import { Player } from '../../types/game';

interface Props {
  players: Player[];
  currentPlayerId: string;
}

export default function OpponentList({ players, currentPlayerId }: Props) {
  const sorted = [...players].sort((a, b) => b.marketShare - a.marketShare);

  return (
    <div className="opponent-panel">
      <h3>👥 Gegner</h3>
      <div className="ranking-list">
        {sorted.map((p, idx) => {
          const isMe = p.id === currentPlayerId;
          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
          return (
            <div key={p.id} className={`rank-item ${isMe ? 'me' : ''} ${p.isBankrupt ? 'bankrupt' : ''}`}>
              <div className="rank-pos">{medal}</div>
              <div className="rank-info">
                <span className="rank-name">{isMe ? '👤 Du' : `🤖 ${p.name}`}</span>
                <span className="rank-type">{p.personality || 'Spieler'}</span>
              </div>
              <div className="rank-stats">
                <span className="rank-share">{p.marketShare.toFixed(1)}%</span>
                <span className="rank-capital">{Math.round(p.capital).toLocaleString()} €</span>
              </div>
              {p.isBankrupt && <div className="bankrupt-badge">BANKROTT</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}