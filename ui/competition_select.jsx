// Wettbewerb-Auswahl Screen — wähle zwischen Liga, Pokal und Champions League
function CompetitionSelect({ teamId, onSelectCompetition, onBack }) {
  const team = window.TEAMS[teamId];
  const availableCompetitions = window.TEAM_COMPETITIONS[teamId] || [];

  const containerStyle = {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${team.colors.primary}15 0%, #0A1E3F 50%, ${team.colors.secondary}15 100%)`,
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const backButtonStyle = {
    position: 'absolute',
    top: 20,
    left: 20,
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: '10px 20px',
    color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 20,
  };

  const teamBadgeStyle = {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
  };

  const badgeImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  const initialsContainerStyle = {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: `linear-gradient(145deg, ${team.colors.primary}, ${team.colors.secondary})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: `0 8px 24px ${team.colors.primary}44`,
  };

  const initialsStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 24,
    color: '#FFFFFF',
    letterSpacing: 1,
  };

  const teamNameStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 28,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: 1,
  };

  const subtitleStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  };

  const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 500,
    width: '100%',
    marginTop: 24,
  };

  const getInitials = (name) => {
    if (name.includes('Bayern')) return 'FCB';
    if (name.includes('Liverpool')) return 'LFC';
    if (name.includes('Real Madrid')) return 'RMA';
    return name.split(' ').map(w => w[0]).join('').slice(0, 3);
  };

  const getCompetitionData = (compId) => {
    const comp = window.COMPETITIONS[compId];
    let matchCount = 0;
    let description = '';

    // Ermittle Anzahl der Spiele
    switch(compId) {
      case 'cl':
        matchCount = 13;
        description = 'Ligaphase + K.o.-Runde bis zum Finale in Budapest';
        break;
      case 'bundesliga':
        matchCount = 34;
        description = '34 Spieltage um die Meisterschaft';
        break;
      case 'premierleague':
        matchCount = 38;
        description = '38 Spieltage um den Titel';
        break;
      case 'laliga':
        matchCount = 38;
        description = '38 Spieltage um La Liga';
        break;
      case 'dfbpokal':
        matchCount = 6;
        description = 'Vom Erstrunden-Los bis zum Finale in Berlin';
        break;
      case 'facup':
        matchCount = 6;
        description = 'Von der 3. Runde bis zum Finale in Wembley';
        break;
      case 'copadelrey':
        matchCount = 5;
        description = 'Vom Einstieg bis zum Finale in Sevilla';
        break;
    }

    return { ...comp, matchCount, description };
  };

  return (
    <div style={containerStyle}>
      <button style={backButtonStyle} onClick={onBack}>
        ← Zurück
      </button>

      <div style={headerStyle}>
        <div style={teamBadgeStyle}>
          {team.badge ? (
            <img src={team.badge} alt={team.shortName} style={badgeImgStyle} />
          ) : (
            <div style={initialsContainerStyle}>
              <span style={initialsStyle}>{getInitials(team.name)}</span>
            </div>
          )}
        </div>
        <h1 style={teamNameStyle}>{team.shortName}</h1>
        <p style={subtitleStyle}>Wähle einen Wettbewerb</p>
      </div>

      <div style={gridStyle}>
        {availableCompetitions.map(compId => {
          const compData = getCompetitionData(compId);
          return (
            <CompetitionCard
              key={compId}
              competition={compData}
              teamColors={team.colors}
              onSelect={() => onSelectCompetition(compId)}
            />
          );
        })}
      </div>
    </div>
  );
}

function CompetitionCard({ competition, teamColors, onSelect }) {
  const [hover, setHover] = React.useState(false);

  const isInternational = competition.type === 'international';
  const isCup = competition.type === 'cup';

  const cardStyle = {
    background: hover
      ? `linear-gradient(135deg, ${teamColors.primary}33, rgba(255,255,255,0.15))`
      : 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '20px 24px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    transform: hover ? 'translateX(8px)' : 'translateX(0)',
    boxShadow: hover
      ? `0 12px 32px rgba(0,0,0,0.3), 0 0 0 2px ${teamColors.primary}`
      : '0 4px 16px rgba(0,0,0,0.2)',
    border: `2px solid ${hover ? teamColors.primary : 'rgba(255,255,255,0.1)'}`,
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  };

  const iconContainerStyle = {
    width: 60,
    height: 60,
    borderRadius: 14,
    background: isInternational
      ? 'linear-gradient(145deg, #FFD700, #FFA500)'
      : isCup
      ? 'linear-gradient(145deg, #C0C0C0, #A0A0A0)'
      : `linear-gradient(145deg, ${teamColors.primary}, ${teamColors.secondary})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
  };

  const nameStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 18,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: 0.5,
  };

  const descStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  };

  const matchCountStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: teamColors.primary,
    fontWeight: 700,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const arrowStyle = {
    fontSize: 24,
    color: hover ? teamColors.primary : 'rgba(255,255,255,0.3)',
    transition: 'color 0.25s ease',
  };

  return (
    <div
      style={cardStyle}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={iconContainerStyle}>
        {competition.icon}
      </div>
      <div style={contentStyle}>
        <div style={nameStyle}>{competition.name}</div>
        <div style={descStyle}>{competition.description}</div>
        <div style={matchCountStyle}>{competition.matchCount} Spiele</div>
      </div>
      <div style={arrowStyle}>→</div>
    </div>
  );
}

window.CompetitionSelect = CompetitionSelect;
