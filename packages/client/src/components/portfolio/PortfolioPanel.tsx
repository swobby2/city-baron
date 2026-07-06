import { Property, District } from '../../types/game';

interface Props {
  properties: Property[];
  districts: District[];
  onSell: (id: string) => void;
  onRenovate: (id: string) => void;
  onUpgrade: (id: string) => void;
}

export default function PortfolioPanel({ properties, districts, onSell, onRenovate, onUpgrade }: Props) {
  if (properties.length === 0) {
    return (
      <div className="portfolio-panel">
        <h3>📊 Mein Portfolio</h3>
        <div className="empty-state">
          <p>Du hast noch keine Immobilien.</p>
          <p>Kaufe Grundstücke auf der Karte!</p>
        </div>
      </div>
    );
  }

  const totalValue = properties.reduce((s, p) => s + p.marketValue, 0);
  const totalRent = properties.reduce((s, p) => s + p.rent, 0);
  const totalMaintenance = properties.reduce((s, p) => s + p.maintenance, 0);

  return (
    <div className="portfolio-panel">
      <h3>📊 Mein Portfolio</h3>

      <div className="portfolio-summary">
        <div className="summary-item">
          <span>Immobilien</span>
          <span className="value">{properties.length}</span>
        </div>
        <div className="summary-item">
          <span>Gesamtwert</span>
          <span className="value">{Math.round(totalValue).toLocaleString()} €</span>
        </div>
        <div className="summary-item">
          <span>Mieteinnahmen/Rd</span>
          <span className="value positive">{Math.round(totalRent).toLocaleString()} €</span>
        </div>
        <div className="summary-item">
          <span>Unterhalt/Rd</span>
          <span className="value negative">{Math.round(totalMaintenance).toLocaleString()} €</span>
        </div>
      </div>

      <div className="property-list-scroll">
        {properties.map(prop => {
          const district = districts.find(d => d.id === prop.districtId);
          return (
            <div key={prop.id} className="portfolio-item">
              <div className="item-header">
                <span className="item-type">{propertyIcon(prop.type)} {propertyLabel(prop.type)}</span>
                <span className="item-district">{district?.name || 'Unbekannt'}</span>
              </div>
              <div className="item-details">
                <div className="detail-bar">
                  <span>Zustand</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${prop.condition}%`, background: prop.condition > 70 ? '#00b894' : prop.condition > 40 ? '#fdcb6e' : '#e17055' }} />
                  </div>
                  <span>{prop.condition}%</span>
                </div>
                <div className="detail-bar">
                  <span>Auslastung</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${prop.occupancy}%`, background: '#74b9ff' }} />
                  </div>
                  <span>{prop.occupancy}%</span>
                </div>
                <div className="item-stats">
                  <span>💰 {Math.round(prop.marketValue).toLocaleString()} €</span>
                  <span>💵 {Math.round(prop.rent).toLocaleString()} €/Rd</span>
                  <span>⭐ Lv.{prop.upgradeLevel}</span>
                </div>
              </div>
              <div className="item-actions">
                <button className="small-btn" onClick={() => onRenovate(prop.id)} disabled={prop.condition >= 100}>
                  🔧 Sanieren
                </button>
                <button className="small-btn" onClick={() => onUpgrade(prop.id)} disabled={prop.upgradeLevel >= 5}>
                  ⬆️ Modernisieren
                </button>
                <button className="small-btn sell" onClick={() => onSell(prop.id)}>
                  💰 Verkaufen
                </button>
              </div>
            </div>
          );
        })}
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