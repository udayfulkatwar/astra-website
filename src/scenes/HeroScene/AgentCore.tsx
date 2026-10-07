import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { store } from '../../lib/store'
import { mulberry32, type TierConfig } from '../../lib/three'
import { GATE_COUNT, frame, gateLabelEls, shared } from './sceneState'
import {
  coreFragment,
  coreVertex,
  haloFragment,
  haloVertex,
  plateFragment,
  plateVertex,
  ringFragment,
  ringVertex,
  tickFragment,
  tickVertex,
} from './shaders/core'

const Z = new THREE.Vector3(0, 0, 1)
const Y = new THREE.Vector3(0, 1, 0)
const X = new THREE.Vector3(1, 0, 0)

function tickGeometry() {
  const n = 120
  const pos: number[] = []
  const major: number[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const m = i % 10 === 0 ? 1 : 0
    const l = m ? 0.07 : 0.028
    const c = Math.cos(a), s = Math.sin(a)
    pos.push(c * 1.012, s * 1.012, 0, c * (1.012 + l), s * (1.012 + l), 0)
    major.push(m, m)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aMajor', new THREE.Float32BufferAttribute(major, 1))
  return g
}

const smooth = (v: number) => {
  const t = Math.min(1, Math.max(0, v))
  return t * t * (3 - 2 * t)
}

/**
 * Nine engraved rings around an ember core — one ring per validation gate.
 * Gyroscope at rest, a tunnel of gates for the signals, a locked cage for the decision.
 */
export function AgentCore({ config }: { config: TierConfig }) {
  const rings = useRef<(THREE.Group | null)[]>([])
  const core = useRef<THREE.Mesh>(null)
  const haloE = useRef<THREE.Mesh>(null)
  const haloL = useRef<THREE.Mesh>(null)
  const plate = useRef<THREE.Mesh>(null)

  const params = useMemo(() => {
    const r = mulberry32(17)
    return Array.from({ length: GATE_COUNT }, (_, i) => ({
      radius: 0.95 + i * 0.13,
      tilt: [r() * Math.PI, r() * Math.PI, r() * Math.PI] as const,
      spin: [(r() - 0.5) * 0.5, (r() - 0.5) * 0.6, (r() - 0.5) * 0.3] as const,
      flashRate: 0.7 + r() * 1.6,
      flashPhase: r() * 10,
    }))
  }, [])

  const torus = useMemo(() => new THREE.TorusGeometry(1, 0.0048, 6, config.ringSegments), [config.ringSegments])
  const ticks = useMemo(tickGeometry, [])
  const ringMats = useMemo(
    () =>
      params.map(
        (_, i) =>
          new THREE.ShaderMaterial({
            vertexShader: ringVertex,
            fragmentShader: ringFragment,
            transparent: true,
            depthWrite: false,
            uniforms: {
              uTime: shared.uTime,
              uLock: { value: 0 },
              uGates: shared.uGates,
              uBone: shared.uBone,
              uEmber: shared.uEmber,
              uPhase: { value: i / GATE_COUNT },
              uSpeed: { value: 0.05 + (i % 3) * 0.025 },
              uFlash: { value: 0 },
            },
          }),
      ),
    [params],
  )
  const tickMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: tickVertex,
        fragmentShader: tickFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uBone: shared.uBone, uEmber: shared.uEmber, uLock: { value: 0 }, uOpacity: { value: 1 } },
      }),
    [],
  )
  const coreMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: { uTime: shared.uTime, uLock: shared.uLock, uEmber: shared.uEmber, uLilac: shared.uLilac, uBone: shared.uBone },
      }),
    [],
  )
  const haloMats = useMemo(
    () =>
      [
        { color: shared.uEmber, falloff: 9 },
        { color: shared.uLilac, falloff: 4 },
      ].map(
        (h) =>
          new THREE.ShaderMaterial({
            vertexShader: haloVertex,
            fragmentShader: haloFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: { uColor: h.color, uIntensity: { value: 1 }, uTime: shared.uTime, uFalloff: { value: h.falloff } },
          }),
      ),
    [],
  )
  const plateMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: plateVertex,
        fragmentShader: plateFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: shared.uTime, uOpacity: { value: 1 }, uBone: shared.uBone, uLilac: shared.uLilac },
      }),
    [],
  )

  useEffect(
    () => () => {
      torus.dispose()
      ticks.dispose()
      ringMats.forEach((m) => m.dispose())
      tickMat.dispose()
      coreMat.dispose()
      haloMats.forEach((m) => m.dispose())
      plateMat.dispose()
    },
    [torus, ticks, ringMats, tickMat, coreMat, haloMats, plateMat],
  )

  // scratch objects
  const s = useMemo(
    () => ({
      qCore: new THREE.Quaternion(),
      qGate: new THREE.Quaternion(),
      qLock: new THREE.Quaternion(),
      qAlign: new THREE.Quaternion(),
      qSpin: new THREE.Quaternion(),
      qCage: new THREE.Quaternion(),
      qTmp: new THREE.Quaternion(),
      e: new THREE.Euler(),
      pCore: new THREE.Vector3(),
      pGate: new THREE.Vector3(),
      pLock: new THREE.Vector3(),
      v: new THREE.Vector3(),
      lp: new THREE.Vector3(),
    }),
    [],
  )

  useFrame(({ camera, size }) => {
    const t = shared.uTime.value
    const S = shared.uCoreScale.value
    const C = shared.uCoreC.value
    const dir = shared.uTunnelDir.value
    const start = shared.uTunnelStart.value
    const gap = shared.uGap.value
    const tR = shared.uTunnelR.value
    const G = frame.gates
    const Lk = Math.max(frame.lock, frame.outro)
    const R = 1.45 * S

    s.qAlign.setFromUnitVectors(Z, dir)
    s.e.set(0.32 + Math.sin(t * 0.11) * 0.05, t * 0.07, 0.1)
    s.qCage.setFromEuler(s.e)

    for (let i = 0; i < GATE_COUNT; i++) {
      const g = rings.current[i]
      if (!g) continue
      const P = params[i]
      const gi = smooth(G * 1.45 - (i / (GATE_COUNT - 1)) * 0.45)
      const li = smooth(Lk * 1.45 - ((GATE_COUNT - 1 - i) / (GATE_COUNT - 1)) * 0.45)

      // 1 · gyroscope
      s.e.set(P.tilt[0] + t * P.spin[0], P.tilt[1] + t * P.spin[1], P.tilt[2] + t * P.spin[2])
      s.qCore.setFromEuler(s.e)
      s.pCore.copy(C)
      const scCore = P.radius * S

      // 2 · tunnel of gates
      s.qSpin.setFromAxisAngle(dir, t * 0.22 * (i % 2 ? 1 : -1) + i * 0.4)
      s.qGate.copy(s.qSpin).multiply(s.qAlign)
      s.pGate.copy(start).addScaledVector(dir, i * gap)
      const scGate = tR

      // 3 · locked armillary cage: six meridians, equator, two tropics
      let scLock = R
      s.pLock.copy(C)
      if (i < 6) {
        s.qTmp.setFromAxisAngle(Y, (i * Math.PI) / 6)
      } else {
        s.qTmp.setFromAxisAngle(X, Math.PI / 2)
        if (i > 6) {
          const yOff = (i === 7 ? 1 : -1) * R * 0.5
          scLock = R * 0.866
          s.v.set(0, yOff, 0).applyQuaternion(s.qCage)
          s.pLock.add(s.v)
        }
      }
      s.qLock.copy(s.qCage).multiply(s.qTmp)

      g.position.copy(s.pCore).lerp(s.pGate, gi).lerp(s.pLock, li)
      g.quaternion.copy(s.qCore).slerp(s.qGate, gi).slerp(s.qLock, li)
      g.scale.setScalar(THREE.MathUtils.lerp(THREE.MathUtils.lerp(scCore, scGate, gi), scLock, li))

      const m = ringMats[i]
      m.uniforms.uLock.value = li
      const pulse = Math.pow(Math.max(0, Math.sin(t * P.flashRate + P.flashPhase)), 30)
      m.uniforms.uFlash.value = store.reducedMotion ? 0 : pulse * gi * (1 - li)

      // gate label rides above its ring in the tunnel (plain DOM, projected here)
      const el = gateLabelEls[i]
      if (el) {
        const o = gi * (1 - li)
        if (o > 0.01) {
          // alternate above / below so neighbouring names never collide
          s.lp.copy(s.pGate).addScaledVector(Y, tR * (i % 2 ? -1.45 : 1.4)).project(camera)
          const x = (s.lp.x * 0.5 + 0.5) * size.width
          const y = (-s.lp.y * 0.5 + 0.5) * size.height
          // never sit on top of the copy column (desktop)
          const clear = frame.layout.portrait ? 1 : Math.min(1, Math.max(0, (x / size.width - 0.36) / 0.06))
          el.style.opacity = String(o * clear)
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${i % 2 ? '0%' : '-100%'})`
          el.style.visibility = 'visible'
        } else if (el.style.visibility !== 'hidden') {
          el.style.visibility = 'hidden'
        }
      }
    }
    tickMat.uniforms.uLock.value = Lk

    // core: rests at the centre, moves to the tunnel exit where approved orders arrive
    if (core.current) {
      s.v.copy(start).addScaledVector(dir, gap * 8 + 0.95)
      core.current.position.copy(C).lerp(s.v, G * (1 - Lk))
      const sc = THREE.MathUtils.lerp(0.34 * S, 0.17, G * (1 - Lk)) * (1 + Math.sin(t * 1.2) * 0.03)
      core.current.scale.setScalar(THREE.MathUtils.lerp(sc, 0.3 * S, Lk))
      core.current.rotation.y = t * 0.2
      for (const h of [haloE.current, haloL.current]) {
        if (!h) continue
        h.position.copy(core.current.position)
        h.quaternion.copy(camera.quaternion)
      }
      haloE.current?.scale.setScalar(core.current.scale.x * 7.5)
      haloL.current?.scale.setScalar(S * (5.4 + Lk * 1.2) * (1 - G * 0.7 * (1 - Lk)))
      haloMats[0].uniforms.uIntensity.value = 0.95
      haloMats[1].uniforms.uIntensity.value = (0.2 + Lk * 0.12) * (1 - G * (1 - Lk))
    }

    if (plate.current) {
      plate.current.position.set(C.x, C.y - 2.05 * S, C.z)
      plate.current.scale.setScalar(3.4 * S)
      plateMat.uniforms.uOpacity.value = (1 - G * (1 - Lk)) * (0.75 - frame.outro * 0.3)
      plate.current.visible = plateMat.uniforms.uOpacity.value > 0.01
    }
  })

  return (
    <group>
      {params.map((_, i) => (
        <group key={i} ref={(el) => { rings.current[i] = el }}>
          <mesh geometry={torus} material={ringMats[i]} frustumCulled={false} />
          <lineSegments geometry={ticks} material={tickMat} frustumCulled={false} />
        </group>
      ))}
      <mesh ref={core} material={coreMat}>
        <icosahedronGeometry args={[1, config.coreDetail]} />
      </mesh>
      <mesh ref={haloL} material={haloMats[1]} renderOrder={2}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={haloE} material={haloMats[0]} renderOrder={3}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh ref={plate} material={plateMat} rotation={[-Math.PI / 2 + 0.05, 0, 0]} renderOrder={-1}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </group>
  )
}
