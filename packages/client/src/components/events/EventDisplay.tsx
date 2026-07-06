import { GameEvent, District } from '../../types/game';

interface Props {
  events: GameEvent[];
  districts: District[];
}

export default function EventDisplay({ events, districts }: Props) {
  if (events.length === 0) {
    return <div className="event-display"><span className="no-events">Keine aktuellen Events</span></div>;
  }

  return (
    <div className="event-display">
      {events.filter(e => e.remaining > 0).map(event => {
        const district = districts.find(d => d.id === event.targetDistrictId);
        return (
          <div key={event.id} className="event-item">
            <span className="event-name">{event.name}</span>
            {district && <span className="event-location">in {district.name}</span>}
            <span className="event-remaining">{event.remaining} Rd.</span>
          </div>
        );
      })}
    </div>
  );
}