import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { emit, on, store } from '../../lib/store'
import { PALETTE, TIERS } from '../../lib/three'
import { AgentCore } from './AgentCore'
import { SceneController } from './SceneController'
import { CAMERA_DISTANCE, CAMERA_FOV } from './sceneState'
import { GateLabels } from './GateLabels'
import { Dust, SignalFlow } from './SignalFlow'

/** Signals readiness once shaders are compiled and the first frame is on screen. */
function FirstFrame() {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        gl.compile(scene, camera)
        store.sceneReady = true
        emit('sceneReady')
      })
    })
    return () => cancelAnimationFrame(raf)
  }, [gl, scene, camera])
  return null
}

export default function HeroCanvas() {
  const config = TIERS[store.tier]
  const [dpr, setDpr] = useState(config.dpr[1])
  const [active, setActive] = useState(store.canvasActive)
  useEffect(() => on('canvasActive', () => setActive(store.canvasActive)), [])

  return (
    <>
    <GateLabels />
    <Canvas
      className="hero-canvas"
      data-paused={active ? undefined : ''}
      flat
      dpr={[config.dpr[0], dpr]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 80, position: [0, 0, CAMERA_DISTANCE] }}
      gl={{ antialias: !config.bloom, powerPreference: 'high-performance', alpha: false, stencil: false }}
      onCreated={({ gl, scene }) => {
        scene.background = new THREE.Color(PALETTE.void)
        scene.fog = new THREE.Fog(PALETTE.void, 9, 22)
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          emit('webglFailed')
        })
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(config.dpr[0], d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(config.dpr[1], d + 0.2))}
        onFallback={() => setDpr(config.dpr[0])}
      />
      <SceneController />
      <Dust count={config.dust} />
      <AgentCore config={config} />
      <SignalFlow count={config.streaks} />
      <FirstFrame />
      {config.bloom && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.2} intensity={1.05} radius={0.75} />
        </EffectComposer>
      )}
    </Canvas>
    </>
  )
}
