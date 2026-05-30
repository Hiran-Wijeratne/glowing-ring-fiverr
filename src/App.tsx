import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { LiquidFrame } from './components/LiquidFrame'

// Lusion's shader: d = length(gl_FragCoord.xy / resolution) from bottom-left (0,0).
// aspect = vec2(1.0, H/W) compresses Y by 0.5625 at 16:9, so the warm zone
// travels ~85% UP the left edge but only ~40% across the bottom.
// Ellipse must be TALL (high %) and NARROW (low %) to match this shape.
const BG = `
  radial-gradient(ellipse 110% 160% at 0% 100%,
    #3d1e08 0%,
    #1e0e04 35%,
    #110804 62%,
    transparent 90%
  ),
  radial-gradient(ellipse 200% 65% at 100% 100%,
    #3d1a07 0%,
    #221005 40%,
    #140804 65%,
    transparent 90%
  ),
  #0f0804
`

export default function App() {
  return (
    // Outer container is the scroll area — taller than 100vh so the user can scroll
    <div style={{ minHeight: '250vh' }}>

      {/* Fixed canvas layer — stays in place as page scrolls */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: BG,
      }}>
        <Canvas
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,           // transparent so CSS gradient shows through
            powerPreference: 'high-performance',
            toneMapping: 3,
            toneMappingExposure: 1.0,
          }}
          camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0, 6] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* no <color> — canvas is transparent, CSS gradient is the background */}
          <Suspense fallback={null}>
            <LiquidFrame />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
