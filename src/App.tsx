import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { LiquidFrame } from './components/LiquidFrame'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', overflow: 'hidden' }}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: 3,
          toneMappingExposure: 1.0,
        }}
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0, 6] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <color attach="background" args={['#050505']} />
        <Suspense fallback={null}>
          <LiquidFrame />
        </Suspense>
      </Canvas>
    </div>
  )
}
