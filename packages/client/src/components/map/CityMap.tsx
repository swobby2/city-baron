import { District, Property, Player } from '../../types/game';
import { useState } from 'react';

interface Props {
  districts: District[];
  properties: Property[];
  players: Player[];
  playerId: string;
  selectedDistrict: string | null;
  onSelectDistrict: (id: string | null) => void;
  onSelectProperty: (id: string) => void;
}

export default function CityMap({
  districts,
  properties,
  players,
  playerId,
  selectedDistrict,
  onSelectDistrict,
  onSelectProperty,
}: Props) {
  const [heatmapMode, setHeatmapMode] = useState<'demand' | 'prestige' | 'crime' | 'none'>('none');

  const getHeatmapColor = (district: District, mode: string): string => {
    if (mode === 'none') return '';
    const value = mode === 'demand' ? district.demand
      : mode === 'prestige' ? district.prestige
      : district.crime;
    const isReversed = mode === 'crime';
    const normalized = value / 100;
    const intensity = isReversed ? 1 - normalized : normalized;

    if (intensity > 0.7) return `rgba(0, 184, 148, ${intensity * 0.3})`; // green
    if (intensity > 0.4) return `rgba(253, 203, 110, ${intensity * 0.3})`; // yellow
    return `rgba(225, 112, 85, ${(1 - intensity) * 0.3})`; // red
  };

  const getDistrictOwnership = (districtId: string): string => {
    const districtProps = properties.filter(p => p.districtId === districtId && p.playerId);
    const playerCounts = new Map<string, number>();
    for (const p of districtProps) {
      playerCounts.set(p.playerId!, (playerCounts.get(p.playerId!) || 0) + 1);
    }
    const maxCount = Math.max(...playerCounts.values(), 0);
    const topPlayer = [...playerCounts.entries()].find(([_, c]) => c === maxCount)?.[0];
    if (!topPlayer) return 'neutral';
    return topPlayer === playerId ? 'mine' : 'enemy';
  };

  return (
    <div className="city-map">
      <div className="map-header">
        <h3>🗺️ Stadtkarte</h3>
        <div className="heatmap-controls">
          <button
            className={`hm-btn ${heatmapMode === 'none' ? 'active' : ''}`}
            onClick={() => setHeatmapMode('none')}
          >
            Normal
          </button>
          <button
            className={`hm-btn ${heatmapMode === 'demand' ? 'active' : ''}`}
            onClick={() => setHeatmapMode('demand')}
          >
            Nachfrage
          </button>
          <button
            className={`hm-btn ${heatmapMode === 'prestige' ? 'active' : ''}`}
            onClick={() => setHeatmapMode('prestige')}
          >
            Prestige
          </button>
          <button
            className={`hm-btn ${heatmapMode === 'crime' ? 'active' : ''}`}
            onClick={() => setHeatmapMode('crime')}
          >
            Kriminalität
          </button>
        </div>
      </div>

      <div className="map-grid">
        {districts.map(district => {
          const districtProps = properties.filter(p => p.districtId === district.id);
          const owned = districtProps.filter(p => p.playerId === playerId).length;
          const total = district.maxPlots;
          const heatColor = getHeatmapColor(district, heatmapMode);
          const ownership = getDistrictOwnership(district.id);

          return (
            <div
              key={district.id}
              className={`district-block ${ownership} ${selectedDistrict === district.id ? 'selected' : ''}`}
              style={{ background: heatColor || undefined }}
              onClick={() => onSelectDistrict(district.id)}
            >
              <div className="district-title">{district.name}</div>
              <div className="district-grid">
                {districtProps.slice(0, 12).map(prop => {
                  const isOwn = prop.playerId === playerId;
                  const isEnemy = prop.playerId && prop.playerId !== playerId;
                  const isFree = !prop.playerId;
                  let bg = '#2a2a4a';
                  if (isOwn) bg = '#e2b714';
                  if (isEnemy) bg = '#e17055';
                  if (isFree) bg = '#2a2a4a';

                  const typeColors: Record<string, string> = {
                    LAND: '#3a3a5a',
                    WAREHOUSE: '#4a4a3a',
                    RENOVATION_OBJECT: '#5a3a3a',
                  };

                  return (
                    <div
                      key={prop.id}
                      className={`plot ${isOwn ? 'own' : isEnemy ? 'enemy' : 'free'}`}
                      style={{
                        background: isFree ? (typeColors[prop.type] || '#2a2a4a') : bg,
                        opacity: isFree ? 0.6 : 1,
                      }}
                      title={`${prop.type} - ${Math.round(prop.marketValue).toLocaleString()} €`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFree) onSelectProperty(prop.id);
                      }}
                    />
                  );
                })}
                {districtProps.length < 12 && Array.from({ length: 12 - districtProps.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="plot empty" />
                ))}
              </div>
              <div className="district-footer">
                <span className="plot-count">{owned}/{total} Besitz</span>
                <span className="district-price">{Math.round(district.baseLandPrice).toLocaleString()} €/Plot</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}