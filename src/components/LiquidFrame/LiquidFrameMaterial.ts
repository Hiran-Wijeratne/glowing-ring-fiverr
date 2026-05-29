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
