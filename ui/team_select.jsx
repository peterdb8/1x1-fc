// Team-Auswahl Screen — wähle zwischen Bayern, Liverpool und Real Madrid
function TeamSelect({ onSelectTeam }) {
  const teams = Object.values(window.TEAMS);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0A1E3F 0%, #1a365d 50%, #0A1E3F 100%)',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 40,
  };

  const titleStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 42,
    color: '#FFFFFF',
    margin: 0,
    letterSpacing: 2,
    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  };

  const subtitleStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    fontWeight: 500,
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    maxWidth: 900,
    width: '100%',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>WÄHLE DEINEN VEREIN</h1>
        <p style={subtitleStyle}>Starte eine neue Saison 2025/26</p>
      </div>

      <div style={gridStyle}>
        {teams.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            onSelect={() => onSelectTeam(team.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team, onSelect }) {
  const [hover, setHover] = React.useState(false);

  const cardStyle = {
    width: 260,
    background: hover
      ? `linear-gradient(145deg, ${team.colors.primary}22, ${team.colors.primary}44)`
      : 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 28,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: hover ? 'translateY(-8px) scale(1.02)' : 'translateY(0)',
    boxShadow: hover
      ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 3px ${team.colors.primary}`
      : '0 8px 24px rgba(0,0,0,0.2)',
    border: `2px solid ${hover ? team.colors.primary : 'rgba(255,255,255,0.1)'}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  };

  const badgeContainerStyle = {
    width: 120,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: hover ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))',
    transition: 'filter 0.3s ease',
  };

  const badgeImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  const initialsStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  };

  const nameStyle = {
    fontFamily: "'Archivo Black', sans-serif",
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  };

  const leagueStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  };

  const flagStyle = {
    fontSize: 20,
    marginBottom: 4,
  };

  const countryFlags = {
    de: '🇩🇪',
    en: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    es: '🇪🇸',
  };

  const getInitials = (name) => {
    // Spezielle Behandlung für bekannte Teams
    if (name.includes('Bayern')) return 'FCB';
    if (name.includes('Liverpool')) return 'LFC';
    if (name.includes('Real Madrid')) return 'RMA';
    return name.split(' ').map(w => w[0]).join('').slice(0, 3);
  };

  return (
    <div
      style={cardStyle}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={flagStyle}>{countryFlags[team.country]}</div>
      <div style={badgeContainerStyle}>
        {team.badge ? (
          <img src={team.badge} alt={team.shortName} style={badgeImgStyle} />
        ) : (
          <span style={initialsStyle}>{getInitials(team.name)}</span>
        )}
      </div>
      <div style={nameStyle}>{team.shortName}</div>
      <div style={leagueStyle}>
        {team.league} • {team.cup} • Champions League
      </div>
    </div>
  );
}

window.TeamSelect = TeamSelect;
