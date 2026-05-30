import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import type { ThreeElement } from '@react-three/fiber'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

const LiquidFrameMaterial = shaderMaterial(
  {
    uTime:        0,
    uIntensity:   1.0,
    uAspect:      16 / 9,
    uBorderWidth: 0.046,
    uRadius:      0.044,
    uCoverAspect: new THREE.Vector2(0.872, 0.491),
    uAmount:      0,                            // ring intensity + wave amplitude
    uPulse:       0,                            // wave travel 0→1
    uPulseCenter: new THREE.Vector2(1.001, 1.0) // wave origin (right edge, top at rest)
  },
  vertexShader,
  fragmentShader,
)

extend({ LiquidFrameMaterial })

export type LiquidFrameMaterialImpl = InstanceType<typeof LiquidFrameMaterial>

declare module '@react-three/fiber' {
  interface ThreeElements {
    liquidFrameMaterial: ThreeElement<typeof LiquidFrameMaterial>
  }
}

export { LiquidFrameMaterial }
