import { useState, useEffect, CSSProperties } from 'react'

// ── Design tokens ────────────────────────────────────────────────────────────
const T = {
  void:       '#050505',
  paper:      '#f5f2eb',
  paperDim:   'rgba(245,242,235,0.28)',
  paperFaint: 'rgba(245,242,235,0.12)',
  amber:      '#ff7c2a',
  amberDim:   'rgba(255,124,42,0.18)',
  amberGlow:  'rgba(255,124,42,0.45)',
  cyan:       '#00dfaa',
  violet:     '#8b5cf6',
  mono:       "'Syne Mono', 'Courier New', monospace",
  serif:      "'Fraunces', Georgia, serif",
}

// ── Grain overlay (animated film noise) ─────────────────────────────────────
const grainSVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// ── Stagger helper ───────────────────────────────────────────────────────────
const stagger = (i: number, base = 0.1): CSSProperties => ({
  animationDelay: `${base + i * 0.11}s`,
})

// ─────────────────────────────────────────────────────────────────────────────
// GRAIN
// ─────────────────────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position: 'fixed',
      inset: '-50%',
      width: '200%',
      height: '200%',
      backgroundImage: grainSVG,
      backgroundRepeat: 'repeat',
      backgroundSize: '180px 180px',
      opacity: 0.042,
      pointerEvents: 'none',
      zIndex: 9998,
      animation: 'grain 0.4s steps(2) infinite',
    }} />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────
function Nav({ visible }: { visible: boolean }) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const links = ['SYSTEM', 'RESEARCH', 'DOCS']

  return (
    <nav
      className={visible ? 'anim-fade-in' : ''}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px 36px',
        pointerEvents: 'auto',
        animationDelay: '0.05s',
      }}
    >
      {/* Logotype */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: T.amber,
          animation: 'pulseDot 2.8s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: T.mono,
          fontSize: 12,
          letterSpacing: '0.25em',
          color: T.paper,
          userSelect: 'none',
        }}>EDGE</span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {links.map(link => (
          <button
            key={link}
            onMouseEnter={() => setHoveredLink(link)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: T.mono, fontSize: 11,
              letterSpacing: '0.2em',
              color: hoveredLink === link ? T.paper : T.paperDim,
              transition: 'color 0.25s',
              padding: 0,
              position: 'relative',
            }}
          >
            {link}
            <span style={{
              position: 'absolute', bottom: -3, left: 0,
              width: '100%', height: 1,
              background: T.paper,
              transformOrigin: 'left',
              transform: hoveredLink === link ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </button>
        ))}

        {/* CTA nav pill */}
        <AccessButton small />
      </div>
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCESS BUTTON  (used in nav + hero)
// ─────────────────────────────────────────────────────────────────────────────
function AccessButton({ small = false }: { small?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        pointerEvents: 'auto',
        background: hovered ? T.amber : T.amberDim,
        border: `1px solid ${hovered ? T.amber : 'rgba(255,124,42,0.35)'}`,
        borderRadius: 2,
        padding: small ? '5px 14px' : '9px 24px',
        fontFamily: T.mono,
        fontSize: small ? 10 : 11,
        letterSpacing: '0.2em',
        color: hovered ? T.void : T.amber,
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? `0 0 24px ${T.amberGlow}` : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      ACCESS
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────────────────────────────────────
function Badge({ visible }: { visible: boolean }) {
  return (
    <div
      className={visible ? 'anim-fade-up' : ''}
      style={{ ...stagger(0), display: 'flex', justifyContent: 'center' }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 14px',
        border: `1px solid rgba(255,124,42,0.3)`,
        borderRadius: 2,
        background: 'rgba(255,124,42,0.07)',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.amber, flexShrink: 0, animation: 'pulseDot 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.22em', color: T.amber }}>
          LIVE SIGNAL  ·  v1.0.3
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADLINE
// ─────────────────────────────────────────────────────────────────────────────
function Headline({ visible }: { visible: boolean }) {
  const fadeUp = visible ? 'anim-fade-up' : ''
  return (
    <div style={{ textAlign: 'center', lineHeight: 0.88, letterSpacing: '-0.01em' }}>
      {/* line 1 */}
      <div className={fadeUp} style={{ ...stagger(1), display: 'block' }}>
        <span style={{
          fontFamily: T.serif,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(52px, 11vw, 170px)',
          color: T.paper,
          display: 'block',
        }}>
          Beyond
        </span>
      </div>

      {/* line 2 — dimmed, slightly offset */}
      <div className={fadeUp} style={{ ...stagger(2), display: 'block', marginTop: '0.04em' }}>
        <span style={{
          fontFamily: T.serif,
          fontStyle: 'normal',
          fontWeight: 200,
          fontSize: 'clamp(28px, 5.2vw, 80px)',
          color: T.paperDim,
          letterSpacing: '0.08em',
          paddingLeft: '6vw',
          display: 'block',
        }}>
          the threshold
        </span>
      </div>

      {/* line 3 — amber, dominant */}
      <div className={fadeUp} style={{ ...stagger(3), display: 'block', marginTop: '0.02em' }}>
        <span style={{
          fontFamily: T.serif,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 'clamp(46px, 9.5vw, 148px)',
          background: `linear-gradient(95deg, ${T.amber} 0%, #ffb347 55%, ${T.cyan} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'block',
        }}>
          of perception.
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBTEXT + HERO CTA
// ─────────────────────────────────────────────────────────────────────────────
function SubCTA({ visible }: { visible: boolean }) {
  const [hovered, setHovered] = useState(false)
  const fadeUp = visible ? 'anim-fade-up' : ''
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <p
        className={fadeUp}
        style={{
          ...stagger(4),
          fontFamily: T.mono,
          fontSize: 'clamp(10px, 1.1vw, 14px)',
          letterSpacing: '0.12em',
          color: T.paperDim,
          textAlign: 'center',
          maxWidth: 420,
          lineHeight: 1.7,
        }}
      >
        A neural inference system engineered<br />
        for the periphery of perception.
      </p>

      <div className={fadeUp} style={{ ...stagger(5), pointerEvents: 'auto' }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{
            fontFamily: T.mono,
            fontSize: 11,
            letterSpacing: '0.25em',
            color: hovered ? T.paper : T.paperDim,
            transition: 'color 0.3s',
          }}>
            ENTER THE SYSTEM
          </span>
          {/* Arrow + growing line */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'block',
              height: 1,
              width: hovered ? 48 : 20,
              background: hovered ? T.paper : T.paperDim,
              transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s',
            }} />
            <span style={{
              fontFamily: T.mono,
              fontSize: 11,
              color: hovered ? T.paper : T.paperDim,
              transform: hovered ? 'translateX(4px)' : 'translateX(0)',
              display: 'inline-block',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.3s',
            }}>
              →
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────────────────────────────────────
const featureData = [
  { num: '01', title: 'SPATIAL FIELD',    body: 'Multi-dimensional signal processing across the observation boundary.' },
  { num: '02', title: 'EDGE NATIVE',      body: 'Zero-latency inference architecture built for peripheral deployment.' },
  { num: '03', title: 'COHERENCE ENGINE', body: 'Adaptive field dynamics that self-calibrate to ambient noise floors.' },
]

function Features({ visible }: { visible: boolean }) {
  return (
    <div
      className={visible ? 'anim-fade-up' : ''}
      style={{
        ...stagger(7, 0.6),
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0',
        width: '100%',
        maxWidth: 860,
        margin: '0 auto',
      }}
    >
      {featureData.map((f, i) => (
        <div
          key={f.num}
          style={{
            padding: '18px 24px 14px',
            borderTop: `1px solid ${i === 1 ? 'rgba(255,124,42,0.25)' : 'rgba(245,242,235,0.1)'}`,
            borderLeft: i > 0 ? '1px solid rgba(245,242,235,0.07)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{
              fontFamily: T.mono, fontSize: 9,
              letterSpacing: '0.2em',
              color: i === 1 ? T.amber : T.paperDim,
            }}>{f.num}</span>
            <span style={{
              fontFamily: T.mono, fontSize: 10,
              letterSpacing: '0.18em',
              color: i === 1 ? T.paper : T.paperDim,
            }}>{f.title}</span>
          </div>
          <p style={{
            fontFamily: T.serif,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(245,242,235,0.38)',
            lineHeight: 1.65,
            letterSpacing: '0.01em',
          }}>
            {f.body}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKER
// ─────────────────────────────────────────────────────────────────────────────
const tickerItems = [
  'SIGNAL COHERENCE', '◈', '0.3ms LATENCY', '◈',
  'EDGE-NATIVE INFERENCE', '◈', '256-DIM EMBEDDING', '◈',
  'BOUNDARY AWARE', '◈', 'ADAPTIVE FIELD DYNAMICS', '◈',
  'SUB-THRESHOLD PROCESSING', '◈', 'PERIPHERAL TOPOLOGY', '◈',
]
const tickerStr = tickerItems.join('  ·  ')

function Ticker({ visible }: { visible: boolean }) {
  return (
    <div
      className={visible ? 'anim-fade-in' : ''}
      style={{
        animationDelay: '1.2s',
        overflow: 'hidden',
        width: '100%',
        borderTop: '1px solid rgba(245,242,235,0.06)',
        borderBottom: '1px solid rgba(245,242,235,0.06)',
        padding: '9px 0',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        display: 'inline-flex', whiteSpace: 'nowrap',
        animation: 'ticker 28s linear infinite',
      }}>
        {[0, 1].map(k => (
          <span key={k} style={{
            fontFamily: T.mono,
            fontSize: 9,
            letterSpacing: '0.22em',
            color: T.paperFaint,
            paddingRight: '4vw',
          }}>
            {tickerStr}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM BAR
// ─────────────────────────────────────────────────────────────────────────────
function BottomBar({ visible }: { visible: boolean }) {
  return (
    <div
      className={visible ? 'anim-fade-in' : ''}
      style={{
        animationDelay: '1.1s',
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 36px',
        pointerEvents: 'none',
      }}
    >
      {/* Left — signal status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.amber, display: 'block', animation: 'pulseDot 3s ease-in-out infinite' }} />
        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.2em', color: T.paperDim }}>
          SIGNAL OPTIMAL
        </span>
      </div>

      {/* Center — thin bar */}
      <div style={{ flex: 1, maxWidth: 180, height: 1, background: 'rgba(245,242,235,0.08)', margin: '0 32px' }} />

      {/* Right — coordinates + version */}
      <div style={{ display: 'flex', gap: 20 }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,242,235,0.18)' }}>
          38.897°N  77.036°W
        </span>
        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,242,235,0.12)' }}>
          EST. MMXXV
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export function HeroOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Grain />
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Nav visible={visible} />

        {/* Hero body */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(18px, 2.5vh, 32px)',
          padding: '80px 40px 0',
        }}>
          <Badge visible={visible} />
          <Headline visible={visible} />
          <SubCTA visible={visible} />
          <Features visible={visible} />
        </div>

        {/* Bottom section */}
        <div style={{ flexShrink: 0 }}>
          <Ticker visible={visible} />
          <BottomBar visible={visible} />
        </div>
      </div>
    </>
  )
}
