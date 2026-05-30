import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import './LiquidFrameMaterial'
import type { LiquidFrameMaterialImpl } from './LiquidFrameMaterial'

// Matches AppleEfx: ease.sineIn(amount) = 1 - cos(t * PI/2)
function sineIn(t: number): number {
  return 1 - Math.cos(t * Math.PI / 2)
}

// Linear remap with clamp, matching Lusion's math.fit
function fit(x: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + (outMax - outMin) * Math.max(0, Math.min(1, (x - inMin) / (inMax - inMin)))
}

// Cap per-frame delta so shader-compilation stalls don't skip the animation.
const MAX_DELTA = 1 / 60

function RainbowRing() {
  const matRef = useRef<LiquidFrameMaterialImpl>(null)
  const { viewport, size } = useThree()

  // t: intro timer (drives uAmount ramp on first load)
  const tRef         = useRef(0)
  // pulse: wave travel timer, 0→1 over ~2 s
  const pulseRef     = useRef(0)
  // scroll-out ratio (1 = fully visible, 0 = scrolled away)
  const scrollRatioRef    = useRef(1)
  // mirrors scrollManager.scrollBarCenter: fraction of page scrolled (0 at top)
  const scrollBarCenterRef = useRef(0)
  // mirrors AppleEfx.wasActive — tracks whether ring was active last frame
  const wasActiveRef = useRef(false)

  useEffect(() => {
    tRef.current      = 0
    pulseRef.current  = 0
    wasActiveRef.current = false   // ensures pulse fires on first load too

    const onScroll = () => {
      const progress = window.scrollY / window.innerHeight
      scrollRatioRef.current = Math.max(0, 1 - progress / 0.5)
      // Approximate scrollManager.scrollBarCenter: scroll position as a
      // fraction of the scrollable range (stays near 0 on mobile — no scrollbar)
      const maxScroll = document.body.scrollHeight - window.innerHeight
      scrollBarCenterRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock, viewport: vp }, rawDelta) => {
    if (!matRef.current) return

    const W = size.width, H = size.height
    const aspect = vp.width / vp.height

    // Lusion's exact padding formula
    const padding = Math.min(50, Math.min(W, H) * 0.1)
    const bw      = padding / H
    const radius  = (padding + 55) / H

    // Lusion's exact coverAspect formula
    const i   = Math.min(H / W, 1.0) / Math.sqrt(W * W + H * H) * Math.max(W, H)
    const cvX = (W / H) * i
    const cvY = i

    matRef.current.uTime        = clock.getElapsedTime()
    matRef.current.uAspect      = aspect
    matRef.current.uBorderWidth = bw
    matRef.current.uRadius      = radius
    matRef.current.uCoverAspect = new THREE.Vector2(cvX, cvY)

    // ── AppleEfx animation ────────────────────────────────────────────────
    const dt = Math.min(rawDelta, MAX_DELTA)

    // t drives the ring's amount (visibility ramp)
    tRef.current = Math.min(tRef.current + dt, 3)
    const t = tRef.current

    // uAmount = ease.sineIn(amount) where amount ramps 0→1 over 0.5 s
    const rawAmount = fit(t, 0, 0.5, 0, 1)
    const uAmount   = sineIn(rawAmount) * scrollRatioRef.current

    // ── Exact AppleEfx needsRender() logic ───────────────────────────────
    // Original:
    //   let e = this.amount > 0 || this.pulse < 1
    //   if (e && !this.wasActive) this.pulse = 0   ← reset on re-activation
    //   this.wasActive = e
    // This makes the pulse replay every time the ring comes back into view.
    const isActive = uAmount > 0 || pulseRef.current < 1
    if (isActive && !wasActiveRef.current) {
      pulseRef.current = 0   // re-entering view → restart the wave from scratch
    }
    wasActiveRef.current = isActive

    // uPulse increments at deltaTime * 0.5 (2 s total), matching AppleEfx render()
    if (isActive) {
      pulseRef.current = Math.min(pulseRef.current + dt * 0.5, 1)
    }

    // u_pulseCenter = (1.001, 1 - scrollBarCenter) — exact original formula.
    // On mobile there is no scrollbar so scrollBarCenter stays 0 → y = 1.0 (top-right).
    // On desktop at rest it's also near 1.0.  We were hardcoding 0.5 which was wrong.
    matRef.current.uPulseCenter = new THREE.Vector2(1.001, 1.0 - scrollBarCenterRef.current)
    matRef.current.uAmount = uAmount
    matRef.current.uPulse  = pulseRef.current
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <liquidFrameMaterial
        ref={matRef}
        uAspect={viewport.width / viewport.height}
        uBorderWidth={50 / 1080}
        uRadius={105 / 1080}
        uIntensity={1.0}
        uAmount={0}
        uPulse={0}
        uPulseCenter={new THREE.Vector2(1.001, 1.0)}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function LiquidFrame() {
  return (
    <>
      <RainbowRing />
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.01}
          luminanceSmoothing={0.95}
          intensity={5.0}
          mipmapBlur={true}
          radius={0.97}
          levels={9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  )
}
