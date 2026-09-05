'use client';

export default function Bracket({ matches = [], compact = false }) {
  if (!matches.length) return null;

  const byRound = {};
  for (const m of matches) {
    const key = m.round_label || `R${m.round}`;
    if (!byRound[key]) byRound[key] = [];
    byRound[key].push(m);
  }
  for (const key of Object.keys(byRound)) {
    byRound[key].sort((a, b) => (a.pos || 0) - (b.pos || 0));
  }

  const rounds = ['R32', 'R16', 'QF', 'SF', 'F'].filter(r => byRound[r]);

  return (
    <div className="bracket-scroll">
      <div className="bracket-row">
        {rounds.map(round => (
          <div key={round} className="bracket-round">
            <div className="bracket-round-title">{round}</div>
            {byRound[round].map(m => (
              <div key={m.id} className="match-card">
                <div className="room">Room {m.room_code}</div>
                <div className={`player ${m.winner_player_id === m.player_a_player_id ? 'winner' : ''}`}>
                  <span>{m.player_a_tag || 'TBD'}</span>
                  {m.a_scored != null && <span className="score">{m.a_scored} - {m.a_conceded}</span>}
                </div>
                <div className="vs">vs</div>
                <div className={`player ${m.winner_player_id === m.player_b_player_id ? 'winner' : ''}`}>
                  <span>{m.player_b_tag || 'TBD'}</span>
                  {m.b_scored != null && <span className="score">{m.b_scored} - {m.b_conceded}</span>}
                </div>
                <span className={`status status-${m.status}`}>{m.status}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}