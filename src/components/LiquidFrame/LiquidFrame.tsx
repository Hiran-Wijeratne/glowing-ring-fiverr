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

// Cap per-frame delta so shader-compilation stalls don't skip pulse animation.
const MAX_DELTA = 1 / 60

function RainbowRing() {
  const matRef = useRef<LiquidFrameMaterialImpl>(null)
  const { viewport, size } = useThree()

  // Raw scroll-driven amount (0 = invisible, 1 = fully visible).
  // Replaces the old time-based tRef ramp — glow is now purely scroll-triggered.
  const scrollAmountRef    = useRef(0)
  // mirrors scrollManager.scrollBarCenter (0 at top, tracks scroll progress)
  const scrollBarCenterRef = useRef(0)
  // pulse wave timer 0→1 over ~2 s
  const pulseRef           = useRef(0)
  // mirrors AppleEfx.wasActive
  const wasActiveRef       = useRef(false)

  useEffect(() => {
    scrollAmountRef.current  = 0
    pulseRef.current         = 0
    wasActiveRef.current     = false

    const onScroll = () => {
      const progress  = window.scrollY / window.innerHeight   // viewport-heights scrolled
      const maxScroll = document.body.scrollHeight - window.innerHeight

      // ── Scroll-in / scroll-out — stretched to feel like the original's long section
      // Fade IN:  0.5 → 1.0 viewport-heights scrolled
      // Full:     1.0 → 4.0 (glow stays for 3 full viewport heights of scrolling)
      // Fade OUT: 4.0 → 5.0
      const fadeIn  = Math.max(0, Math.min(1, (progress - 0.5) / 0.5))
      const fadeOut = Math.max(0, Math.min(1, (progress - 4.0) / 1.0))
      scrollAmountRef.current = fadeIn * (1 - fadeOut)

      // scrollBarCenter: 0 at top (no scrollbar on mobile → stays 0)
      scrollBarCenterRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(({ clock, viewport: vp }, rawDelta) => {
    if (!matRef.current) return

    const W = size.width, H = size.height
    const aspect = vp.width / vp.height

    const padding = Math.min(50, Math.min(W, H) * 0.1)
    const bw      = padding / H
    const radius  = (padding + 55) / H

    const i   = Math.min(H / W, 1.0) / Math.sqrt(W * W + H * H) * Math.max(W, H)
    const cvX = (W / H) * i
    const cvY = i

    matRef.current.uTime        = clock.getElapsedTime()
    matRef.current.uAspect      = aspect
    matRef.current.uBorderWidth = bw
    matRef.current.uRadius      = radius
    matRef.current.uCoverAspect = new THREE.Vector2(cvX, cvY)

    const dt = Math.min(rawDelta, MAX_DELTA)

    // uAmount = ease.sineIn(scrollAmount) — exact same structure as original:
    //   u_amount = ease.sineIn(this.amount)  where this.amount is scroll-driven
    const uAmount = sineIn(scrollAmountRef.current)

    // ── AppleEfx needsRender() — reset pulse whenever ring re-enters view ───
    const isActive = uAmount > 0 || pulseRef.current < 1
    if (isActive && !wasActiveRef.current) {
      pulseRef.current = 0
    }
    wasActiveRef.current = isActive

    if (isActive) {
      pulseRef.current = Math.min(pulseRef.current + dt * 0.5, 1)
    }

    // u_pulseCenter: (1.001, 1 - scrollBarCenter) — exact original formula
    matRef.current.uPulseCenter = new THREE.Vector2(1.001, 1.0 - scrollBarCenterRef.current)
    matRef.current.uAmount      = uAmount
    matRef.current.uPulse       = pulseRef.current
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
