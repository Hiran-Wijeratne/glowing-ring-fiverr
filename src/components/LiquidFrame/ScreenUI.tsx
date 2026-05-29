export function ScreenUI() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #030712 0%, #050c1a 40%, #060818 100%)',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#e0e8ff',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px 10px',
        borderBottom: '1px solid rgba(100,160,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 6px #ff5f5699' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 6px #ffbd2e99' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c840', boxShadow: '0 0 6px #27c84099' }} />
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(160,200,255,0.5)', fontWeight: 500, textTransform: 'uppercase' }}>
          LIQUID ENERGY SYSTEM
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['⌘', '⊞', '⊙'].map((icon, i) => (
            <span key={i} style={{ fontSize: 13, color: 'rgba(120,170,255,0.35)', cursor: 'pointer' }}>{icon}</span>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>

        {/* Left sidebar */}
        <div style={{
          borderRight: '1px solid rgba(100,160,255,0.07)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(100,150,255,0.4)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Navigation
          </div>
          {['Overview', 'Energy Flow', 'Plasma Grid', 'Quantum State', 'Analytics'].map((item, i) => (
            <div key={i} style={{
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: 12,
              color: i === 0 ? '#7dd3fc' : 'rgba(160,200,255,0.4)',
              background: i === 0 ? 'rgba(56,189,248,0.08)' : 'transparent',
              border: i === 0 ? '1px solid rgba(56,189,248,0.15)' : '1px solid transparent',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}>
              {item}
            </div>
          ))}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Plasma',    val: 87, color: '#22d3ee' },
              { label: 'Kinetic',   val: 64, color: '#818cf8' },
              { label: 'Resonance', val: 91, color: '#a78bfa' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(160,200,255,0.5)', marginBottom: 4 }}>
                  <span>{stat.label}</span>
                  <span style={{ color: stat.color }}>{stat.val}%</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stat.val}%`, borderRadius: 2, background: `linear-gradient(90deg, ${stat.color}99, ${stat.color})`, boxShadow: `0 0 8px ${stat.color}66` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main view */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>

          {/* Header stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { label: 'Energy Output', value: '4.82 TW',   delta: '+2.3%', color: '#22d3ee' },
              { label: 'Field Density', value: '99.1%',     delta: '+0.8%', color: '#818cf8' },
              { label: 'Core Temp',     value: '12,400 K',  delta: '-1.2%', color: '#f472b6' },
              { label: 'Flux Index',    value: '0.9847',    delta: '+0.05',  color: '#34d399' },
            ].map((card, i) => (
              <div key={i} style={{
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${card.color}22`,
              }}>
                <div style={{ fontSize: 9, color: 'rgba(160,200,255,0.4)', letterSpacing: '0.15em', marginBottom: 6, textTransform: 'uppercase' }}>{card.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: card.color, letterSpacing: '-0.01em', lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontSize: 10, color: card.delta.startsWith('+') ? '#34d399' : '#f87171', marginTop: 4 }}>{card.delta}</div>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div style={{
            flex: 1,
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.018)',
            border: '1px solid rgba(100,160,255,0.08)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: 11, color: 'rgba(160,200,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Plasma Flow Waveform</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['1H', '6H', '24H', '7D'].map((t, i) => (
                  <span key={i} style={{
                    fontSize: 9, padding: '3px 8px', borderRadius: 5,
                    background: i === 2 ? 'rgba(56,189,248,0.15)' : 'transparent',
                    color: i === 2 ? '#7dd3fc' : 'rgba(120,180,255,0.3)',
                    border: i === 2 ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    letterSpacing: '0.08em',
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <svg viewBox="0 0 400 80" style={{ width: '100%', flex: 1 }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#22d3ee" stopOpacity="0.6" />
                  <stop offset="40%"  stopColor="#818cf8" stopOpacity="0.8" />
                  <stop offset="75%"  stopColor="#a78bfa" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0"  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {[20, 40, 60].map(y => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(100,150,255,0.06)" strokeWidth="0.5"/>
              ))}
              <path d="M0,55 C20,50 35,35 60,38 C85,41 100,28 130,25 C160,22 175,40 200,38 C225,36 245,20 270,22 C295,24 315,42 340,38 C365,34 380,48 400,45 L400,80 L0,80 Z" fill="url(#fillGrad)"/>
              <path d="M0,55 C20,50 35,35 60,38 C85,41 100,28 130,25 C160,22 175,40 200,38 C225,36 245,20 270,22 C295,24 315,42 340,38 C365,34 380,48 400,45" fill="none" stroke="url(#waveGrad)" strokeWidth="2" filter="url(#glow)"/>
              <path d="M0,62 C30,58 50,48 80,50 C110,52 120,38 150,42 C180,46 200,55 230,50 C260,45 280,32 310,35 C340,38 360,52 400,55" fill="none" stroke="rgba(167,139,250,0.35)" strokeWidth="1" strokeDasharray="4 3"/>
              {([[60,38],[130,25],[200,38],[270,22],[340,38]] as [number,number][]).map(([cx,cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#22d3ee" fillOpacity="0.9" style={{ filter: 'drop-shadow(0 0 4px #22d3ee)' }}/>
              ))}
            </svg>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexShrink: 0 }}>
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(100,160,255,0.07)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(160,200,255,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>Event Stream</div>
              {[
                { time: '12:42:07', msg: 'Plasma surge detected at node 7', color: '#f472b6' },
                { time: '12:41:55', msg: 'Field coherence stabilized',       color: '#34d399' },
                { time: '12:41:30', msg: 'Quantum flux nominal',             color: '#94a3b8' },
              ].map((ev, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 9, color: 'rgba(100,150,255,0.35)', flexShrink: 0, marginTop: 1 }}>{ev.time}</span>
                  <span style={{ fontSize: 10, color: ev.color, opacity: 0.8 }}>{ev.msg}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(100,160,255,0.07)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(160,200,255,0.4)', marginBottom: 10, textTransform: 'uppercase' }}>Node Matrix</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '5px' }}>
                {Array.from({ length: 24 }, (_, i) => {
                  const state = i % 7 === 3 ? 'warn' : i % 11 === 0 ? 'err' : 'ok'
                  return (
                    <div key={i} style={{
                      width: '100%', aspectRatio: '1', borderRadius: '3px',
                      background: state === 'ok' ? 'rgba(34,211,238,0.25)' : state === 'warn' ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)',
                      boxShadow: state === 'ok' ? '0 0 5px rgba(34,211,238,0.3)' : state === 'warn' ? '0 0 5px rgba(251,191,36,0.3)' : '0 0 5px rgba(248,113,113,0.3)',
                    }}/>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
