import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import './LiquidFrameMaterial'
import type { LiquidFrameMaterialImpl } from './LiquidFrameMaterial'

function RainbowRing() {
  const matRef = useRef<LiquidFrameMaterialImpl>(null)
  const { viewport, size } = useThree()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const W = size.width, H = size.height
    const aspect = viewport.width / viewport.height

    // Raised cap from 50→80px for a thicker ring body
    const padding = Math.min(80, Math.min(W, H) * 0.1)
    const bw      = padding / H

    // radius must exceed bw so inner edge stays rounded:
    // inner_corner_radius = radius - bw → target ~55px inner radius
    const radius = (padding + 55) / H

    // Lusion's exact coverAspect formula (from AppleEfx.render)
    const i      = Math.min(H / W, 1.0) / Math.sqrt(W * W + H * H) * Math.max(W, H)
    const cvX    = (W / H) * i
    const cvY    = i

    matRef.current.uTime        = clock.getElapsedTime()
    matRef.current.uAspect      = aspect
    matRef.current.uBorderWidth = bw
    matRef.current.uRadius      = radius
    matRef.current.uCoverAspect = new THREE.Vector2(cvX, cvY)
  })

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <liquidFrameMaterial
        ref={matRef}
        uAspect={viewport.width / viewport.height}
        uBorderWidth={80 / 1080}
        uRadius={135 / 1080}
        uIntensity={1.0}
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
          luminanceSmoothing={0.9}
          intensity={3.5}
          mipmapBlur={true}
          radius={0.9}
          levels={9}
          blendFunction={BlendFunction.ADD}
        />
      </EffectComposer>
    </>
  )
}
