import { GameState } from '../../types/game';
import ResourceBar from '../hud/ResourceBar';
import CityMap from '../map/CityMap';
import ActionPanel from '../actions/ActionPanel';
import PortfolioPanel from '../portfolio/PortfolioPanel';
import EventDisplay from '../events/EventDisplay';
import OpponentList from '../opponents/OpponentList';
import { useState } from 'react';

interface Props {
  gameState: GameState;
  playerId: string;
  onTurn: () => void;
  onAction: (action: string, body: any) => Promise<any>;
  onBackToLobby: () => void;
  loading: boolean;
}

type Tab = 'portfolio' | 'market' | 'bank' | 'opponents';

export default function GameLayout({ gameState, playerId, onTurn, onAction, loading }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return <div>Spieler nicht gefunden</div>;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBuy = async (propertyId: string) => {
    const result = await onAction('buy', { propertyId });
    if (result) showMessage(result.message);
  };

  const handleSell = async (propertyId: string) => {
    const result = await onAction('sell', { propertyId });
    if (result) showMessage(result.message);
  };

  const handleRenovate = async (propertyId: string) => {
    const result = await onAction('renovate', { propertyId });
    if (result) showMessage(result.message);
  };

  const handleUpgrade = async (propertyId: string) => {
    const result = await onAction('upgrade', { propertyId });
    if (result) showMessage(result.message);
  };

  const handleLoan = async (amount: number) => {
    const result = await onAction('loan', { amount });
    if (result) showMessage(result.message);
  };

  const myProperties = gameState.properties.filter(p => p.playerId === playerId);
  const myCapital = player.capital;

  const handleSelectDistrict = (id: string | null) => {
    setSelectedDistrict(id);
  };

  const handleSelectProperty = (id: string) => {
    setSelectedProperty(id);
    setActiveTab('market');
  };

  return (
    <div className="game-layout">
      {/* Top HUD */}
      <ResourceBar player={player} gameState={gameState} onBackToLobby={onBackToLobby} />

      {/* Message Toast */}
      {message && <div className="toast">{message}</div>}

      {/* Main Content */}
      <div className="game-content">
        {/* Left: City Map */}
        <div className="map-panel">
          <CityMap
            districts={gameState.districts}
            properties={gameState.properties}
            players={gameState.players}
            playerId={playerId}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={handleSelectDistrict}
            onSelectProperty={handleSelectProperty}
          />
        </div>

        {/* Right: Tabs */}
        <div className="sidebar-panel">
          <div className="tab-bar">
            <button className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>📊 Portfolio</button>
            <button className={`tab ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>🏪 Markt</button>
            <button className={`tab ${activeTab === 'bank' ? 'active' : ''}`} onClick={() => setActiveTab('bank')}>🏦 Bank</button>
            <button className={`tab ${activeTab === 'opponents' ? 'active' : ''}`} onClick={() => setActiveTab('opponents')}>👥 Gegner</button>
          </div>

          <div className="tab-content">
            {activeTab === 'portfolio' && (
              <PortfolioPanel
                properties={myProperties}
                districts={gameState.districts}
                onSell={handleSell}
                onRenovate={handleRenovate}
                onUpgrade={handleUpgrade}
              />
            )}

            {activeTab === 'market' && (
              <MarketPanel
                gameState={gameState}
                selectedDistrict={selectedDistrict}
                selectedProperty={selectedProperty}
                playerId={playerId}
                onBuy={handleBuy}
                onSelectDistrict={handleSelectDistrict}
              />
            )}

            {activeTab === 'bank' && (
              <BankPanel
                player={player}
                onLoan={handleLoan}
              />
            )}

            {activeTab === 'opponents' && (
              <OpponentList
                players={gameState.players}
                currentPlayerId={playerId}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Events + Turn */}
      <div className="bottom-bar">
        <div className="event-feed">
          <EventDisplay events={gameState.events} districts={gameState.districts} />
        </div>
        <div className="turn-controls">
          <span className="turn-label">Runde {gameState.turn}</span>
          <span className={`phase-badge phase-${gameState.marketPhase.toLowerCase()}`}>
            {marketPhaseLabel(gameState.marketPhase)}
          </span>
          <button
            className="turn-btn"
            onClick={onTurn}
            disabled={loading || gameState.state === 'FINISHED'}
          >
            {loading ? '⏳' : gameState.state === 'FINISHED' ? '🏁 Spiel Ende' : '▶ Nächste Runde'}
          </button>
        </div>
      </div>
    </div>
  );
}

function marketPhaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    BOOM: '📈 Boom',
    NORMAL: '📊 Stabil',
    RECESSION: '📉 Rezession',
    CRASH: '💥 Crash',
  };
  return labels[phase] || phase;
}

// ─── Inline Sub-Components ──────────────────────

function MarketPanel({ gameState, selectedDistrict, selectedProperty, playerId, onBuy, onSelectDistrict }: any) {
  const districts = selectedDistrict
    ? gameState.districts.filter((d: any) => d.id === selectedDistrict)
    : gameState.districts;

  return (
    <div className="market-panel">
      {!selectedDistrict && (
        <div className="district-list">
          {gameState.districts.map((d: any) => {
            const available = gameState.properties.filter(
              (p: any) => p.districtId === d.id && !p.playerId
            );
            return (
              <div key={d.id} className="district-card" onClick={() => onSelectDistrict(d.id)}>
                <div className="district-header">
                  <span className="district-name">{d.name}</span>
                  <span className="district-plots">{available.length} frei / {d.maxPlots}</span>
                </div>
                <div className="district-stats">
                  <span>📈 N{d.demand}</span>
                  <span>⭐ P{d.prestige}</span>
                  <span>🚨 K{d.crime}</span>
                  <span>🚇 V{d.traffic}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDistrict && (
        <div className="property-list">
          <button className="back-btn" onClick={() => onSelectDistrict(null)}>← Zurück</button>
          <h3>{gameState.districts.find((d: any) => d.id === selectedDistrict)?.name}</h3>
          {gameState.properties
            .filter((p: any) => p.districtId === selectedDistrict)
            .sort((a: any, b: any) => a.plotIndex - b.plotIndex)
            .map((p: any) => {
              const isOwn = p.playerId === playerId;
              const isFree = !p.playerId;
              return (
                <div key={p.id} className={`property-card ${isOwn ? 'owned' : ''} ${isFree ? 'free' : ''}`}>
                  <div className="prop-info">
                    <span className="prop-type">{propertyIcon(p.type)} {propertyLabel(p.type)}</span>
                    <span className="prop-value">{Math.round(p.marketValue).toLocaleString()} €</span>
                  </div>
                  <div className="prop-details">
                    <span>Zustand: {p.condition}%</span>
                    {p.rent > 0 && <span>Miete: {Math.round(p.rent)} €/Rd</span>}
                    {isFree && <span>Frei</span>}
                    {isOwn && <span>Dein</span>}
                    {p.playerId && !isOwn && (
                      <span>Besitzer: {gameState.players.find((pl: any) => pl.id === p.playerId)?.name}</span>
                    )}
                  </div>
                  {isFree && (
                    <button className="action-btn" onClick={() => onBuy(p.id)}>
                      Kaufen {Math.round(p.marketValue + p.marketValue * 0.035).toLocaleString()} €
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function BankPanel({ player, onLoan }: any) {
  const [loanAmount, setLoanAmount] = useState(10000);

  return (
    <div className="bank-panel">
      <h3>🏦 Bank</h3>
      <div className="bank-info">
        <div className="info-row">
          <span>Kapital</span>
          <span className="value">{Math.round(player.capital).toLocaleString()} €</span>
        </div>
        <div className="info-row">
          <span>Kreditlimit</span>
          <span className="value">{Math.round(player.creditLimit).toLocaleString()} €</span>
        </div>
        <div className="info-row">
          <span>Ausstehende Kredite</span>
          <span className="value">{Math.round(player.totalLoan).toLocaleString()} €</span>
        </div>
        <div className="info-row">
          <span>Cashflow/Runde</span>
          <span className={`value ${player.cashflow >= 0 ? 'positive' : 'negative'}`}>
            {Math.round(player.cashflow).toLocaleString()} €
          </span>
        </div>
        <div className="info-row">
          <span>Bonität</span>
          <span className="value">{Math.round(player.image)}/100</span>
        </div>
      </div>

      <div className="loan-section">
        <h4>Kredit aufnehmen</h4>
        <div className="loan-calc">
          <input
            type="range"
            min={1000}
            max={Math.min(100000, player.creditLimit - player.totalLoan)}
            step={1000}
            value={loanAmount}
            onChange={e => setLoanAmount(parseInt(e.target.value))}
          />
          <span className="loan-value">{loanAmount.toLocaleString()} €</span>
          <button
            className="action-btn"
            onClick={() => onLoan(loanAmount)}
            disabled={loanAmount < 1000 || loanAmount + player.totalLoan > player.creditLimit}
          >
            Kredit aufnehmen
          </button>
        </div>
      </div>
    </div>
  );
}

function propertyIcon(type: string): string {
  const icons: Record<string, string> = {
    APARTMENT: '🏢', MULTI_FAMILY_HOUSE: '🏘️', LUXURY_APARTMENT: '🏰',
    OFFICE: '🏢', HOTEL: '🏨', WAREHOUSE: '🏭',
    SHOPPING_CENTER: '🛍️', INDUSTRIAL: '🏗️', LAND: '🌲', RENOVATION_OBJECT: '🔨',
  };
  return icons[type] || '🏠';
}

function propertyLabel(type: string): string {
  const labels: Record<string, string> = {
    APARTMENT: 'Wohnung', MULTI_FAMILY_HOUSE: 'Mehrfamilienhaus',
    LUXURY_APARTMENT: 'Luxuswohnung', OFFICE: 'Büro', HOTEL: 'Hotel',
    WAREHOUSE: 'Lagerhalle', SHOPPING_CENTER: 'Einkaufszentrum',
    INDUSTRIAL: 'Industrie', LAND: 'Bauland', RENOVATION_OBJECT: 'Sanierungsobjekt',
  };
  return labels[type] || type;
}

// Need onSelectDistrict for the district list
function onSelectDistrict(id: string) {
  console.log('selected district', id);
}