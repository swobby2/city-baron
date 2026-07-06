import { Player, GameState } from '../../types/game';

interface Props {
  player: Player;
  gameState: GameState;
  onBackToLobby?: () => void;
}

export default function ResourceBar({ player, gameState, onBackToLobby }: Props) {
  return (
    <div className="resource-bar">
      <div className="resource-left">
        <span className="game-title" style={{ cursor: 'pointer' }} onClick={onBackToLobby}>
          🏙️ City Baron
        </span>
        <span className="player-name">{player.name}</span>
      </div>
      <div className="resource-center">
        <div className="resource-item capital">
          <span className="r-label">💰 Kapital</span>
          <span className="r-value">{Math.round(player.capital).toLocaleString()} €</span>
        </div>
        <div className="resource-item">
          <span className="r-label">💳 Cashflow</span>
          <span className={`r-value ${player.cashflow >= 0 ? 'positive' : 'negative'}`}>
            {player.cashflow >= 0 ? '+' : ''}{Math.round(player.cashflow).toLocaleString()} €
          </span>
        </div>
        <div className="resource-item">
          <span className="r-label">📊 Marktanteil</span>
          <span className="r-value">{player.marketShare.toFixed(1)}%</span>
        </div>
        <div className="resource-item">
          <span className="r-label">⭐ Image</span>
          <span className="r-value">{player.image}/100</span>
        </div>
        <div className="resource-item">
          <span className="r-label">🎯 Einfluss</span>
          <span className="r-value">{player.influence}</span>
        </div>
      </div>
      <div className="resource-right">
        <span className="turn-display">Runde {gameState.turn}</span>
        {onBackToLobby && (
          <button className="lobby-back-btn" onClick={onBackToLobby} title="Zurück zur Lobby">
            🚪
          </button>
        )}
      </div>
    </div>
  );
}