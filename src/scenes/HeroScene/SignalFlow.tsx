import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '../../lib/three'
import { shared } from './sceneState'
import { dustFragment, dustVertex, streakFragment, streakVertex } from './shaders/core'

/** Thousands of short light streaks: one draw call, every position computed on the GPU. */
export function SignalFlow({ count }: { count: number }) {
  const ref = useRef<THREE.LineSegments>(null)
  const geo = useMemo(() => {
    const rnd = mulberry32(5)
    const seed = new Float32Array(count * 2 * 4)
    const end = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const s = [rnd(), rnd(), rnd(), rnd()]
      for (let v = 0; v < 2; v++) {
        seed.set(s, (i * 2 + v) * 4)
        end[i * 2 + v] = v
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 2 * 3), 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    g.setAttribute('aEnd', new THREE.BufferAttribute(end, 1))
    return g
  }, [count])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: streakVertex,
        fragmentShader: streakFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: shared.uTime,
          uSignals: shared.uSignals,
          uGates: shared.uGates,
          uLock: shared.uLock,
          uCoreC: shared.uCoreC,
          uCoreScale: shared.uCoreScale,
          uTunnelStart: shared.uTunnelStart,
          uTunnelDir: shared.uTunnelDir,
          uGap: shared.uGap,
          uTunnelR: shared.uTunnelR,
          uVis: shared.uVis,
          uBone: shared.uBone,
          uEmber: shared.uEmber,
          uLilac: shared.uLilac,
          uPass: shared.uPass,
        },
      }),
    [],
  )
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])
  return <lineSegments ref={ref} geometry={geo} material={mat} frustumCulled={false} />
}

/** Distant motes for depth, with a little pointer parallax. */
export function Dust({ count }: { count: number }) {
  const geo = useMemo(() => {
    const rnd = mulberry32(77)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * 22
      pos[i * 3 + 1] = (rnd() - 0.5) * 13
      pos[i * 3 + 2] = -rnd() * 12 + 1
      for (let c = 0; c < 4; c++) seed[i * 4 + c] = rnd()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    return g
  }, [count])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: shared.uTime, uPixelRatio: shared.uPixelRatio, uPointer: shared.uPointer, uBone: shared.uBone },
      }),
    [],
  )
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])
  return <points geometry={geo} material={mat} frustumCulled={false} />
}
